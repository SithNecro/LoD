// Obtener personaje por slot
window.getPersonajeBySlot = async function (slot) {
  const personajeId = await new Promise((resolve, reject) => {
    const tx = db.transaction("slots", "readonly");
    const st = tx.objectStore("slots");
    const req = st.get(slot);
    req.onsuccess = e => resolve(e.target.result?.personajeId ?? null);
    req.onerror = () => reject(req.error);
  });
  if (!personajeId) return null;

  return await new Promise((resolve, reject) => {
    const tx = db.transaction("personajes", "readonly");
    const st = tx.objectStore("personajes");
    const req = st.get(personajeId);
    req.onsuccess = e => resolve(e.target.result || null);
    req.onerror = () => reject(req.error);
  });
};

// Guardar personaje
window.savePersonaje = function (p) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("personajes", "readwrite");
    const st = tx.objectStore("personajes");
    const req = st.put(p);
    req.onsuccess = () => { if (typeof mostrarPersonajes === 'function') mostrarPersonajes(); resolve(); };
    req.onerror = () => reject(req.error);
  });
};

// Editor de Inventario
window.openInventarioEditor = async function (slot) {
  if (!window.Swal) { alert("Falta SweetAlert2 (Swal). Inclúyelo para usar el editor de inventario."); return; }
  if (!window.tippy) { console.warn("tippy.js no encontrado. Los tooltips no se activarán."); }

  const personaje = await window.getPersonajeBySlot(slot);
  if (!personaje) { alert("No hay personaje cargado en este slot."); return; }
  if (!personaje.inventario) personaje.inventario = { objetos: [], armaduras: [], armas: [] };

  const modalHeight = Math.min(window.innerHeight - 20, 800);

  const html = `
  <div id="invRoot" style="max-height:${modalHeight - 90}px;">
    <div class="d-flex align-items-center justify-content-between mb-2" style="position:sticky;top:0;z-index:5;padding:6px 0;background:var(--bs-body-bg,#fff);">
      <div><strong>Inventario de:</strong> ${personaje.nombre}</div>
      <button id="invCloseX" class="btn btn-sm btn-outline-danger" title="Cerrar">✖</button>
    </div>

    <div class="border rounded p-2 mb-3 hero-card">
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-3">
          <label class="form-label">Tipo</label>
          <select id="invTipo" class="form-select">
            <option value="">--Selecciona Tipo de Objeto--</option>
            <option value="obj">Objeto</option>
            <option value="arm">Armadura</option>
            <option value="arma">Arma</option>
          </select>
        </div>

        <!-- Grupo Objeto -->
        <div id="grpObj" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-12 col-md-3">
              <label class="form-label" data-tippy-content="Nombre del objeto">Nombre Objeto</label>
              <input id="objNombre" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Lugar</label>
              <select id="objLugar" class="form-select">
                <option value=""></option>
                <option value="Mochila">Mochila</option>
                <option value="Atajo 1">Atajo 1</option>
                <option value="Atajo 2">Atajo 2</option>
                <option value="Atajo 3">Atajo 3</option>
                <option value="Atajo 4">Atajo 4</option>
                <option value="Atajo 5">Atajo 5</option>
                <option value="Atajo 6">Atajo 6</option>
              </select>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Cantidad</label>
              <input id="objCantidad" class="form-control" type="number" min="0" value="1">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="objPeso" class="form-control" type="number" step="0.01" min="0">
            </div>
            <div class="col-12 col-md-3">
              <label class="form-label">Uso</label>
              <input id="objUso" class="form-control" type="text" placeholder="Para qué sirve">
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">Durabilidad</label>
              <input id="objDurabilidad" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">Valor</label>
              <input id="objValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-3">
              <button id="objAdd" class="btn btn-success w-100">Añadir Objeto</button>
            </div>
          </div>
        </div>

        <!-- Grupo Armadura -->
        <div id="grpArm" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-6 col-md-2">
              <label class="form-label">Equipado</label>
              <div class="form-check form-switch">
                <input id="armEquipado" class="form-check-input" type="checkbox">
              </div>
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">Armadura</label>
              <input id="armNombre" class="form-control" type="text">
            </div>
            <div class="col-12 col-md-7">
              <label class="form-label">Cobertura</label>
              <div class="d-flex gap-2">
                <select id="armCobSel" class="form-select">
                  <option value="Cabeza">Cabeza</option>
                  <option value="Torso">Torso</option>
                  <option value="Brazo Izq.">Brazo Izq.</option>
                  <option value="Brazo Der.">Brazo Der.</option>
                  <option value="Pierna Izq.">Pierna Izq.</option>
                  <option value="Pierna Der.">Pierna Der.</option>
                </select>
                <button id="armCobAdd" class="btn btn-outline-secondary" type="button">+</button>
                <button id="armCobDel" class="btn btn-outline-secondary" type="button">-</button>
                <div id="armCobList" class="form-control" style="background:#1e1e1e;"></div>
              </div>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Defensa</label>
              <input id="armDefensa" class="form-control" type="number" step="1" value="0">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <input id="armDurabilidad" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-5">
              <label class="form-label">Especial</label>
              <input id="armEspecial" class="form-control" type="text" placeholder="Propiedades especiales">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="armPeso" class="form-control" type="number" step="0.01" min="0">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Valor</label>
              <input id="armValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-3">
              <button id="armAdd" class="btn btn-success w-100">Añadir Armadura</button>
            </div>
          </div>
        </div>

        <!-- Grupo Arma -->
        <div id="grpArma" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-6 col-md-2">
              <label class="form-label">Equipado</label>
              <div class="form-check form-switch">
                <input id="armaEquipado" class="form-check-input" type="checkbox">
              </div>
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">Arma</label>
              <input id="armaNombre" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Mano</label>
              <select id="armaMano" class="form-select">
                <option>Izquierda</option>
                <option>Derecha</option>
                <option>Dos Manos</option>
              </select>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Daño</label>
              <input id="armaDanio" class="form-control" type="text" placeholder="ej: 1d6+2">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <input id="armaDurabilidad" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Especial</label>
              <input id="armaEspecial" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="armaPeso" class="form-control" type="number" step="0.01" min="0">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Valor</label>
              <input id="armaValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-3">
              <button id="armaAdd" class="btn btn-success w-100">Añadir Arma</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Listas -->
      <div class="col-12 col-lg-12">
        <div class="row">
          <div class="col-12 col-xl-4">
            <h6>🧰 Objetos</h6>
            <table class="table table-sm table-dark table-striped" id="tblObjetos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Lugar</th>
                  <th>Cant.</th>
                  <th>Peso</th>
                  <th>Durab.</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="listObjetos"></tbody>
            </table>
          </div>

          <div class="col-12 col-xl-4">
            <h6>🛡️ Armaduras</h6>
            <table class="table table-sm table-dark table-striped" id="tblArmaduras">
              <thead>
                <tr>
                  <th>Equip.</th>
                  <th>Armadura</th>
                  <th>Cobertura</th>
                  <th>Def.</th>
                  <th>Durab.</th>
                  <th>Peso</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="listArmaduras"></tbody>
            </table>
          </div>

          <div class="col-12 col-xl-4">
            <h6>⚔️ Armas</h6>
            <table class="table table-sm table-dark table-striped" id="tblArmas">
              <thead>
                <tr>
                  <th>Equip.</th>
                  <th>Arma</th>
                  <th>Mano</th>
                  <th>Daño</th>
                  <th>Durab.</th>
                  <th>Peso</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="listArmas"></tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>`;

  await Swal.fire({
    html,
    width: Math.min(1200, window.innerWidth - 10),
    padding: "8px",
    background: "#0f1215",
    color: "#e5e7eb",
    showConfirmButton: false,
    showCloseButton: false,
    customClass: { popup: 'sai-popup', actions: 'sai-actions', confirmButton: 'sai-confirm', cancelButton: 'sai-cancel' }
  });

  // Helpers
  const $ = (id) => document.getElementById(id);
  const n = (id) => document.getElementById(id);

  const elTipo = $('invTipo');
  const grpObj = $('grpObj');
  const grpArm = $('grpArm');
  const grpArma = $('grpArma');

  const hideAllGroups = () => {
    grpObj.style.display = 'none';
    grpArm.style.display = 'none';
    grpArma.style.display = 'none';
    // limpiar OBJ
    if (n('objNombre')) n('objNombre').value = '';
    if (n('objLugar')) n('objLugar').value = '';
    if (n('objCantidad')) n('objCantidad').value = '1';
    if (n('objPeso')) n('objPeso').value = '';
    if (n('objUso')) n('objUso').value = '';
    if (n('objDurabilidad')) n('objDurabilidad').value = '0';
    if (n('objValor')) n('objValor').value = '0';
    // limpiar ARMADURA
    if (n('armEquipado')) n('armEquipado').checked = false;
    if (n('armNombre')) n('armNombre').value = '';
    if (n('armCobList')) n('armCobList').textContent = '';
    if (n('armDefensa')) n('armDefensa').value = '0';
    if (n('armDurabilidad')) n('armDurabilidad').value = '0';
    if (n('armEspecial')) n('armEspecial').value = '';
    if (n('armPeso')) n('armPeso').value = '';
    if (n('armValor')) n('armValor').value = '0';
    // limpiar ARMA
    if (n('armaEquipado')) n('armaEquipado').checked = false;
    if (n('armaNombre')) n('armaNombre').value = '';
    if (n('armaMano')) n('armaMano').value = 'Izquierda';
    if (n('armaDanio')) n('armaDanio').value = '';
    if (n('armaDurabilidad')) n('armaDurabilidad').value = '0';
    if (n('armaEspecial')) n('armaEspecial').value = '';
    if (n('armaPeso')) n('armaPeso').value = '';
    if (n('armaValor')) n('armaValor').value = '0';
  };

  // Cerrar
  const btnCloseX = document.getElementById('invCloseX');
  if (btnCloseX) btnCloseX.addEventListener('click', () => Swal.close());

  // Tipo -> grupos
  elTipo?.addEventListener('change', () => {
    hideAllGroups();
    const v = elTipo.value;
    if (v === 'obj') grpObj.style.display = '';
    else if (v === 'arm') grpArm.style.display = '';
    else if (v === 'arma') grpArma.style.display = '';
  });

  // Cobertura (armadura)
  const cobSel = document.getElementById('armCobSel');
  const cobList = document.getElementById('armCobList');
  document.getElementById('armCobAdd')?.addEventListener('click', () => {
    const current = (cobList.textContent || '').split(',').map(s => s.trim()).filter(Boolean);
    const val = cobSel.value;
    if (val && !current.includes(val)) current.push(val);
    cobList.textContent = current.join(', ');
  });
  document.getElementById('armCobDel')?.addEventListener('click', () => {
    const current = (cobList.textContent || '').split(',').map(s => s.trim()).filter(Boolean);
    const val = cobSel.value;
    const idx = current.indexOf(val);
    if (idx >= 0) current.splice(idx, 1);
    cobList.textContent = current.join(', ');
  });

  // ===== Edición inline =====
  const onInput = async (ev) => {
    const t = ev.target;
    const row = t.closest('[data-itemid]'); if (!row) return;
    const id = Number(row.dataset.itemid);

    const updateItem = (arr, fields) => {
      const idx = arr.findIndex(x => x.id === id);
      if (idx < 0) return false;
      const f = t.name; if (!fields.includes(f)) return false;
      let v = t.type === 'number' ? (t.step && t.step !== "1" ? parseFloat(t.value || '0') : parseInt(t.value || '0', 10)) : t.value;
      if (t.tagName === 'SELECT' && t.multiple) v = Array.from(t.selectedOptions).map(o => o.value);
      arr[idx][f] = v; return true;
    };

    if (updateItem(personaje.inventario.objetos, ['nombre','lugar','cantidad','peso','durabilidad','uso','valor'])
      || updateItem(personaje.inventario.armaduras, ['equipado','armadura','defensa','especial','durabilidad','peso','valor'])
      || updateItem(personaje.inventario.armas, ['equipado','arma','mano','danio','durabilidad','especial','peso','valor'])) {
      await window.savePersonaje(personaje);
      window.renderInventarioLists(personaje);
    }
  };

  const onChange = async (ev) => {
    const t = ev.target;
    if (t.name !== 'equipado') return;
    const row = t.closest('[data-itemid]'); if (!row) return;
    const id = Number(row.dataset.itemid);

    // Armaduras: toggle
    let item = personaje.inventario.armaduras.find(x => x.id === id);
    if (item) {
      item.equipado = t.checked;
      await window.savePersonaje(personaje);
      return;
    }

    // Armas: exclusión por mano
    item = personaje.inventario.armas.find(x => x.id === id);
    if (!item) return;

    if (!t.checked) {
      item.equipado = false;
      await window.savePersonaje(personaje);
      return;
    }

    const mano = (item.mano || '').trim();
    if (mano === 'Izquierda') {
      personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Izquierda' || a.mano === 'Dos Manos')) a.equipado = false; });
    } else if (mano === 'Derecha') {
      personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Derecha' || a.mano === 'Dos Manos')) a.equipado = false; });
    } else { // Dos Manos
      personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado) a.equipado = false; });
    }
    item.equipado = true;
    await window.savePersonaje(personaje);
  };

  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);

  // Pintar listas del editor
  window.renderInventarioLists(personaje);
};

// ========== PREVIEW EN SLOT (debajo del botón "Abrir Inventario") ==========
window.renderInventarioPreview = async function(slot) {
  try {
    const container = document.getElementById(`mochila-slot${slot}`);
    if (!container) return;
    const p = await window.getPersonajeBySlot(slot);
    if (!p || !p.inventario) { container.innerHTML = '<em>Sin inventario</em>'; return; }

    const objs = Array.isArray(p.inventario.objetos) ? p.inventario.objetos : [];
    const arms = Array.isArray(p.inventario.armaduras) ? p.inventario.armaduras : [];
    const armas = Array.isArray(p.inventario.armas) ? p.inventario.armas : [];

    const esc = (s) => (s==null ? '' : String(s).replace(/[&<>"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m])));

    const tblObjs = `
      <h6 class="mt-2 mb-1">🧰 Objetos</h6>
      <table class="table table-sm table-dark table-striped">
        <thead><tr>
          <th>Nombre</th><th>Cant.</th><th>Peso</th><th></th>
        </tr></thead>
        <tbody>
          ${objs.map(o => `
            <tr data-itemid="${o.id||''}" data-cat="obj">
              <td><span class="tippy-obj" data-tippy-content="${esc(o.uso||'')}">${esc(o.nombre||'')}</span></td>
              <td>${esc(o.cantidad ?? 0)}</td>
              <td>${esc(o.peso ?? '')}</td>
              <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="obj" data-id="${o.id||''}" data-slot="${slot}">Traspasar</button></td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    const tblArmad = `
      <h6 class="mt-2 mb-1">🛡️ Armaduras</h6>
      <table class="table table-sm table-dark table-striped">
        <thead><tr>
          <th>Equip.</th><th>Armadura</th><th>Cobertura</th><th>Def.</th><th>Durab.</th><th>Peso</th><th></th>
        </tr></thead>
        <tbody>
          ${arms.map(a => `
            <tr data-itemid="${a.id||''}" data-cat="arm">
              <td><input type="checkbox" disabled ${a.equipado ? 'checked' : ''}></td>
              <td><span class="tippy-arm" data-tippy-content="${esc(a.especial||'')}">${esc(a.armadura||'')}</span></td>
              <td>${esc(Array.isArray(a.cobertura)? a.cobertura.join(', '): (a.cobertura||''))}</td>
              <td>${esc(a.defensa ?? '')}</td>
              <td>${esc(a.durabilidad ?? '')}</td>
              <td>${esc(a.peso ?? '')}</td>
              <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="arm" data-id="${a.id||''}" data-slot="${slot}">Traspasar</button></td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    const tblArmas = `
      <h6 class="mt-2 mb-1">⚔️ Armas</h6>
      <table class="table table-sm table-dark table-striped">
        <thead><tr>
          <th>Equip.</th><th>Arma</th><th>Mano</th><th>Daño</th><th>Valor</th><th></th>
        </tr></thead>
        <tbody>
          ${armas.map(w => `
            <tr data-itemid="${w.id||''}" data-cat="arma">
              <td><input type="checkbox" disabled ${w.equipado ? 'checked' : ''}></td>
              <td><span class="tippy-arma" data-tippy-content="${esc(w.especial||'')}">${esc(w.arma||'')}</span></td>
              <td>${esc(w.mano || '')}</td>
              <td>${esc(w.danio || '')}</td>
              <td>${esc(w.valor ?? 0)}</td>
              <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="arma" data-id="${w.id||''}" data-slot="${slot}">Traspasar</button></td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    container.innerHTML = tblObjs + tblArmad + tblArmas;

    // activar tooltips si está tippy
    if (window.tippy) {
      tippy(container.querySelectorAll('.tippy-obj,.tippy-arm,.tippy-arma'), { allowHTML:true, theme:'light-border' });
    }
  } catch (err) {
    console.error('renderInventarioPreview error', err);
  }
};

// Delegación: botón "Traspasar" en el preview del slot
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('.slot-traspasar');
  if (!btn) return;
  ev.preventDefault();

  const cat = btn.dataset.cat;
  const id = Number(btn.dataset.id);
  const slot = Number(btn.dataset.slot);
  const src = await window.getPersonajeBySlot(slot);
  if (!src || !src.inventario) return;

  // recoge slots disponibles como destinos
  const asignaciones = await new Promise((resolve, reject) => {
    const tx = db.transaction("slots","readonly");
    const st = tx.objectStore("slots");
    const req = st.getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror = () => resolve([]);
  });

  // construir opciones
  const opts = {};
  for (const a of asignaciones) {
    if (a.slot === slot) continue;
    const p = await new Promise((resolve) => {
      const tx = db.transaction("personajes","readonly");
      const st = tx.objectStore("personajes");
      const req = st.get(a.personajeId);
      req.onsuccess = e => resolve(e.target.result || null);
      req.onerror = () => resolve(null);
    });
    if (p) opts[a.slot] = `${a.slot}: ${p.nombre || 'Sin nombre'}`;
  }
  if (Object.keys(opts).length === 0) { alert('No hay otro slot con personaje para traspasar.'); return; }

  let destino = null;
  if (window.Swal?.fire) {
    const { value } = await Swal.fire({
      title: 'Traspasar a…',
      input: 'select',
      inputOptions: opts,
      inputPlaceholder: 'Selecciona slot destino',
      showCancelButton: true,
      confirmButtonText: 'Traspasar',
      customClass: { popup: 'sai-popup', actions: 'sai-actions', confirmButton: 'sai-confirm', cancelButton: 'sai-cancel' }
    });
    destino = value ? Number(value) : null;
  } else {
    const val = prompt('¿A qué slot traspasar? (' + Object.keys(opts).join(', ') + ')');
    destino = val ? Number(val) : null;
  }
  if (!destino || !opts[destino]) return;

  const dst = await window.getPersonajeBySlot(destino);
  if (!dst) { alert('Destino no válido'); return; }
  if (!dst.inventario) dst.inventario = { objetos: [], armaduras: [], armas: [] };

  const move = (arrSrc, arrDst) => {
    const i = arrSrc.findIndex(x => x.id === id);
    if (i < 0) return false;
    arrDst.push(arrSrc[i]);
    arrSrc.splice(i,1);
    return true;
  };

  let ok = false;
  if (cat === 'obj') ok = move(src.inventario.objetos, dst.inventario.objetos);
  else if (cat === 'arm') ok = move(src.inventario.armaduras, dst.inventario.armaduras);
  else if (cat === 'arma') ok = move(src.inventario.armas, dst.inventario.armas);

  if (!ok) { alert('No se encontró el elemento.'); return; }

  await window.savePersonaje(src);
  await window.savePersonaje(dst);

  // refrescar previews de ambos slots
  if (typeof window.renderInventarioPreview === 'function') {
    window.renderInventarioPreview(slot);
    window.renderInventarioPreview(destino);
  }
});

// Hook: cuando se pulsa el botón "🎒" que muestra la sección mochila, pintamos el preview
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.flip-to');
  if (!btn || btn.dataset.section !== 'mochila') return;
  const card = btn.closest('.flip-card');
  if (!card) return;
  const slot = parseInt(card.id.replace('slot',''), 10);
  if (Number.isInteger(slot)) {
    // pequeño retraso para asegurar que el contenedor existe/está visible
    setTimeout(() => window.renderInventarioPreview(slot), 0);
  }
});
