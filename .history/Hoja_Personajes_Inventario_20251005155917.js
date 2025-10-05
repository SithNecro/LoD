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
            <div class="col-12 col-md-2">
              <button id="btnAddObj" class="btn btn-primary w-100">Añadir</button>
            </div>
          </div>
        </div>

        <!-- Grupo Armadura -->
        <div id="grpArm" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-12 col-md-3">
              <label class="form-label">Armadura</label>
              <input id="armNombre" class="form-control" type="text">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Cobertura</label>
              <div class="d-flex gap-2">
                <select id="armCobSel" class="form-select">
                  <option value="Cabeza">Cabeza</option>
                  <option value="Abdomen">Abdomen</option>
                  <option value="Pecho">Pecho</option>
                  <option value="Hombros">Hombros</option>
                  <option value="Brazos">Brazos</option>
                  <option value="Manos">Manos</option>
                  <option value="Piernas">Piernas</option>
                  <option value="Pies">Pies</option>
                </select>
                <button type="button" id="armCobAdd" class="btn btn-outline-secondary">+</button>
                <button type="button" id="armCobDel" class="btn btn-outline-secondary">-</button>
                <div id="armCobList" class="form-control" style="background:#1e1e1e;"></div>
              </div>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Defensa</label>
              <input id="armDefensa" class="form-control" type="number" step="1" value="0">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <select id="armDurabilidad" class="form-select">
                ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div class="col-12 col-md-3">
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
            <div class="col-12 col-md-2">
              <button id="btnAddArmadura" class="btn btn-primary w-100">Añadir</button>
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
              <input id="armaDanio" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <select id="armaDurabilidad" class="form-select">
                ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div class="col-12 col-md-3">
              <label class="form-label">Especial</label>
              <input id="armaEspecial" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="armaPeso" class="form-control" type="number" min="0" step="0.1">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Valor</label>
              <input id="armaValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-2">
              <button id="btnAddArma" class="btn btn-primary w-100">Añadir</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Listados -->
      <div id="invLists">
        <div class="row">
          <div class="col-12 col-xl-4">
            <h6>🧰 Objetos</h6>
            <table class="table table-sm table-dark table-striped">
              <thead>
                <tr>
                  
                  <th>Nombre</th>
                  <th>Lugar</th>
                  <th>Cant.</th>
                  <th>Peso</th>
                  <th>Durab.</th>
                  <th>Valor</th>
                  <th>Uso</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="listObjetos"></tbody>
            </table>
          </div>

          <div class="col-12 col-xl-4">
            <h6>🛡️ Armaduras</h6>
            <table class="table table-sm table-dark table-striped">
              <thead>
                <tr>
                  <th style="width:120px;">Equipado</th>
                  <th>Armadura</th>
                  <th>Cobertura</th>
                  <th>Defensa</th>
                  <th>Durab.</th>
                  <th>Peso</th>
                  <th>Valor</th>
                  <th>Especial</th>
                  <th style="width:80px;"></th>
                  <th style="width:80px;"></th>
                </tr>
              </thead>
              <tbody id="listArmaduras"></tbody>
            </table>
          </div>

          <div class="col-12 col-xl-4">
            <h6>⚔️ Armas</h6>
            <table class="table table-sm table-dark table-striped">
              <thead>
                <tr>
                  <th style="width:120px;">Equipado</th>
                  <th>Arma</th>
                  <th>Mano</th>
                  <th>Daño</th>
                  <th>Durab.</th>
                  <th>Especial</th>
                  <th>Peso</th>
                  <th style="width:90px;">Valor</th>
                  <th style="width:80px;"></th>
                  <th style="width:80px;"></th>
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

  // ===== Inputs inline =====
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
      || updateItem(personaje.inventario.armaduras, ['equipado','armadura','defensa','durabilidad','especial','peso','valor'])
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

  const onClick = async (ev) => {
    const btn = ev.target.closest('[data-action]'); if (!btn) return;
    const row = btn.closest('[data-itemid]'); if (!row) return;
    const id = Number(row.dataset.itemid);
    const action = btn.dataset.action;

    const delFrom = (arr) => {
      const i = arr.findIndex(x => x.id === id);
      if (i >= 0) { const [it] = arr.splice(i, 1); return it; }
      return null;
    };

    if (action === 'eliminar') {
      const delObj = delFrom(personaje.inventario.objetos);
      const delArm = delFrom(personaje.inventario.armaduras);
      const delArma = delFrom(personaje.inventario.armas);
      if (delObj || delArm || delArma) {
        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
      }
      return;
    }

    if (action === 'traspasar') {
      // 1) Obtener destinos válidos
      const asigs = await new Promise((resolve, reject) => {
        const tx = db.transaction('slots', 'readonly');
        const st = tx.objectStore('slots');
        const req = st.getAll();
        req.onsuccess = e => resolve(e.target.result || []);
        req.onerror = () => resolve([]);
      });

      const opciones = {};
      for (const a of asigs) {
        try {
          if (!a || a.slot == null) continue;
          if (a.slot === slot) continue;
          const pj = await window.getPersonajeBySlot(a.slot);
        if (pj) opciones[a.slot] = `${a.slot}: ${pj.nombre || 'Sin nombre'}`;
        } catch (_) {}
      }
      if (Object.keys(opciones).length === 0) { alert('No hay otro slot con personaje.'); return; }

      let destino = null;
      if (window.Swal?.fire) {
        const { value } = await Swal.fire({
          title: 'Traspasar a…',
          input: 'select',
          inputOptions: opciones,
          inputPlaceholder: 'Selecciona slot destino',
          showCancelButton: true,
          confirmButtonText: 'Traspasar',
          customClass: { popup: 'sai-popup', actions: 'sai-actions', confirmButton: 'sai-confirm', cancelButton: 'sai-cancel' }
        });
        destino = value ? Number(value) : null;
      } else {
        const val = prompt('¿A qué slot traspasar? (' + Object.keys(opciones).join(', ') + ')');
        destino = val ? Number(val) : null;
      }
      if (!destino || !opciones[destino]) return;

      const dst = await window.getPersonajeBySlot(destino);
      if (!dst) { alert('Destino inválido'); return; }
      if (!dst.inventario) dst.inventario = { objetos: [], armaduras: [], armas: [] };

      const move = (arrSrc, arrDst) => {
        const i = arrSrc.findIndex(x => x.id === id);
        if (i < 0) return false;
        arrDst.push(arrSrc[i]);
        arrSrc.splice(i, 1);
        return true;
      };

      let ok = false;
      ok = ok || move(personaje.inventario.objetos,   dst.inventario.objetos);
      ok = ok || move(personaje.inventario.armaduras, dst.inventario.armaduras);
      ok = ok || move(personaje.inventario.armas,     dst.inventario.armas);

      if (ok) {
        await window.savePersonaje(personaje);
        await window.savePersonaje(dst);
        window.renderInventarioLists(personaje);
      }
    }
  };

  // Listeners solo dentro del modal
  const root = document.getElementById('invRoot');
  root.addEventListener('input', onInput);
  root.addEventListener('change', onChange);
  root.addEventListener('click', onClick);

  // ===== Añadir =====
  const btnObj = document.getElementById('btnAddObj');
  if (btnObj) btnObj.addEventListener('click', async () => {
    const nombre = (document.getElementById('objNombre')?.value || '').trim();
    if (!nombre) { Swal.fire('Falta nombre', 'Indica el nombre del objeto', 'warning'); return; }
    const item = {
      id: Date.now(),
      nombre,
      lugar: document.getElementById('objLugar')?.value || '',
      cantidad: parseInt(document.getElementById('objCantidad')?.value || '0', 10),
      peso: parseFloat(document.getElementById('objPeso')?.value || '0'),
      durabilidad: parseInt(document.getElementById('objDurabilidad')?.value || '0', 10),
      uso: document.getElementById('objUso')?.value || '',
      valor: parseInt(document.getElementById('objValor')?.value || '0', 10)
    };
    personaje.inventario.objetos.push(item);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetAfterAdd();
  });

  const btnArm = document.getElementById('btnAddArmadura');
  if (btnArm) btnArm.addEventListener('click', async () => {
    const nombre = (document.getElementById('armNombre')?.value || '').trim();
    if (!nombre) { Swal.fire('Falta nombre', 'Indica el nombre de la armadura', 'warning'); return; }
    const coberturaStr = (document.getElementById('armCobList')?.textContent || '').trim();
    const item = {
      id: Date.now(),
      equipado: false,
      armadura: nombre,
      cobertura: coberturaStr ? coberturaStr.split(',').map(s=>s.trim()).filter(Boolean) : [],
      defensa: parseInt(document.getElementById('armDefensa')?.value || '0', 10),
      durabilidad: parseInt(document.getElementById('armDurabilidad')?.value || '0', 10),
      especial: document.getElementById('armEspecial')?.value || '',
      peso: parseFloat(document.getElementById('armPeso')?.value || '0'),
      valor: parseInt(document.getElementById('armValor')?.value || '0', 10)
    };
    personaje.inventario.armaduras.push(item);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetAfterAdd();
  });

  const btnArma = document.getElementById('btnAddArma');
  if (btnArma) btnArma.addEventListener('click', async () => {
    const nombre = (document.getElementById('armaNombre')?.value || '').trim();
    if (!nombre) { Swal.fire('Falta nombre', 'Indica el nombre del arma', 'warning'); return; }
    const it = {
      id: Date.now(),
      equipado: !!document.getElementById('armaEquipado')?.checked,
      arma: nombre,
      mano: document.getElementById('armaMano')?.value || '',
      danio: document.getElementById('armaDanio')?.value || '',
      durabilidad: parseInt(document.getElementById('armaDurabilidad')?.value || '0', 10),
      especial: document.getElementById('armaEspecial')?.value || '',
      peso: parseFloat(document.getElementById('armaPeso')?.value || '0'),
      valor: parseInt(document.getElementById('armaValor')?.value || '0', 10)
    };
    // exclusividad al equipar
    if (it.equipado) {
      if (it.mano === 'Izquierda') {
        personaje.inventario.armas.forEach(a => { if (a.equipado && (a.mano === 'Izquierda' || a.mano === 'Dos Manos')) a.equipado = false; });
      } else if (it.mano === 'Derecha') {
        personaje.inventario.armas.forEach(a => { if (a.equipado && (a.mano === 'Derecha' || a.mano === 'Dos Manos')) a.equipado = false; });
      } else { // Dos Manos
        personaje.inventario.armas.forEach(a => { if (a.equipado) a.equipado = false; });
      }
    }
    personaje.inventario.armas.push(it);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetAfterAdd();
  });

  function resetAfterAdd() {
    const tipo = document.getElementById('invTipo');
    if (tipo) tipo.value = '';
    const g = ['grpObj','grpArm','grpArma'].map(id => document.getElementById(id));
    g.forEach(el => { if (el) el.style.display = 'none'; });
    // limpia inputs visibles
    document.querySelectorAll('#invRoot input.form-control').forEach(inp => { inp.value = ''; if (inp.type === 'checkbox') inp.checked = false; });
    document.getElementById('objCantidad') && (document.getElementById('objCantidad').value = '1');
    document.getElementById('armCobList') && (document.getElementById('armCobList').textContent = '');
    document.getElementById('armaMano') && (document.getElementById('armaMano').value = 'Izquierda');
  }

  // Pintar listas del editor
  window.renderInventarioLists(personaje);
};

// ===== Render de tablas dentro del MODAL =====
window.renderInventarioLists = function (personaje) {
  const mkOpts = (n, sel) => Array.from({ length: n + 1 }, (_, i) => `<option value="${i}" ${i == sel ? 'selected' : ''}>${i}</option>`).join('');

  const byStr = (get) => (a, b) => {
    const A = (get(a) || '').toString().trim().toLowerCase();
    const B = (get(b) || '').toString().trim().toLowerCase();
    if (A && B) return A.localeCompare(B, 'es', { sensitivity: 'base' });
    if (!A && B) return 1;
    if (A && !B) return -1;
    return 0;
  };

  const objetosOrden = Array.isArray(personaje.inventario?.objetos)
    ? personaje.inventario.objetos.slice().sort(byStr(o => o.nombre))
    : [];

  const armadurasOrden = Array.isArray(personaje.inventario?.armaduras)
    ? personaje.inventario.armaduras.slice().sort(byStr(a => a.armadura))
    : [];

  const armasOrden = Array.isArray(personaje.inventario?.armas)
    ? personaje.inventario.armas.slice().sort(byStr(w => w.arma))
    : [];

  // Objetos
  const objHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          
          <th>Nombre</th>
          <th>Lugar</th>
          <th>Cant.</th>
          <th>Peso</th>
          <th>Durabilidad</th>
          <th>Valor</th>
          <th>Uso</th>
          <th></th>
          <th></th>
        </tr></thead>
        <tbody>
        ${objetosOrden.map(o => `
          <tr data-itemid="${o.id}">
            <td><input class="form-control form-control-sm" name="nombre" value="${o.nombre || ''}"></td>
            <td>
              <select class="form-select form-select-sm" name="lugar">
                ${['','Mochila','Atajo 1','Atajo 2','Atajo 3','Atajo 4','Atajo 5','Atajo 6','Atajo 7'].map(l => `<option value="${l}" ${o.lugar===l?'selected':''}>${l || '--Lugar--'}</option>`).join('')}
              </select>
            </td>
            <td><input class="form-control form-control-sm" name="cantidad" type="number" min="0" value="${o.cantidad ?? 0}"></td>
            <td><input class="form-control form-control-sm" name="peso" type="number" step="0.1" min="0" value="${o.peso ?? 0}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="valor" type="number" min="0" value="${o.valor ?? 0}"></td>
            <td><input class="form-control form-control-sm" name="uso" value="${o.uso || ''}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  // Armaduras
  const armHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Armadura</th>
          <th>Cobertura</th>
          <th>Defensa</th>
          <th>Durabilidad</th>
          <th>Peso</th>
          <th>Valor</th>
          <th>Especial</th>
          <th style="width:80px;"></th>
          <th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${armadurasOrden.map(a => `
          <tr data-itemid="${a.id}">
            <td><input type="checkbox" name="equipado" ${a.equipado ? 'checked':''}></td>
            <td><input class="form-control form-control-sm" name="armadura" value="${a.armadura || ''}"></td>
            <td><input class="form-control form-control-sm" name="cobertura" value="${Array.isArray(a.cobertura)? a.cobertura.join(', '):(a.cobertura||'')}"></td>
            <td><input class="form-control form-control-sm" name="defensa" type="number" min="0" value="${a.defensa ?? 0}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, a.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${a.peso ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="valor" value="${a.valor ?? 0}"></td>
            <td><input class="form-control form-control-sm" name="especial" value="${a.especial || ''}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  // Armas
  const armasHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Arma</th><th>Mano</th><th>Daño</th><th>Durabilidad</th><th>Especial</th><th>Peso</th><th style="width:90px;">Valor</th><th style="width:80px;"></th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${armasOrden.map(w => `
          <tr data-itemid="${w.id}">
            <td><input type="checkbox" name="equipado" ${w.equipado ? 'checked':''}></td>
            <td><input class="form-control form-control-sm" name="arma" value="${w.arma || ''}"></td>
            <td>
              <select class="form-select form-select-sm" name="mano">
                ${['Izquierda', 'Derecha', 'Ambas'].map(m => `<option value="${m}" ${w.mano === m ? 'selected' : ''}>${m}</option>`).join('')}
              </select>
            </td>
            <td><input class="form-control form-control-sm" name="danio" value="${w.danio || ''}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, w.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="especial" value="${w.especial || ''}"></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${w.peso ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="valor" value="${w.valor ?? 0}"></td>
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('listObjetos', objHtml);
  set('listArmaduras', armHtml);
  set('listArmas', armasHtml);
};

// === Hooks mínimos para botón "Abrir Inventario" y preview en mochila (añadidos) ===
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.inv-edit-btn');
  if (!btn) return;
  const slot = parseInt(btn.dataset.slot, 10);
  if (Number.isInteger(slot)) {
    e.preventDefault();
    if (typeof window.openInventarioEditor === 'function') {
      window.openInventarioEditor(slot);
    }
  }
});

// Render del preview al entrar en la sección "mochila"
document.addEventListener('click', (e) => {
  const flipBtn = e.target.closest('.flip-to');
  if (!flipBtn || flipBtn.dataset.section !== 'mochila') return;
  const card = flipBtn.closest('.flip-card');
  if (!card) return;
  const slot = parseInt(card.id.replace('slot',''), 10);
  if (!Number.isInteger(slot)) return;
  setTimeout(() => { if (typeof window.renderInventarioPreview === 'function') window.renderInventarioPreview(slot); }, 0);
});

// Preview debajo del botón "Abrir Inventario"
window.renderInventarioPreview = async function(slot) {
  try {
    const container = document.getElementById(`mochila-slot${slot}`);
    if (!container) return;
    const p = await window.getPersonajeBySlot(slot);
    if (!p || !p.inventario) { container.innerHTML = '<em>Sin inventario</em>'; return; }

    const esc = (s) => (s==null ? '' : String(s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])));
    const objs  = Array.isArray(p.inventario.objetos)   ? p.inventario.objetos   : [];
    const arms  = Array.isArray(p.inventario.armaduras) ? p.inventario.armaduras : [];
    const armas = Array.isArray(p.inventario.armas)     ? p.inventario.armas     : [];

    const tblObjs = `
      <h6 class="mt-2 mb-1">🧰 Objetos</h6>
      <table class="table table-sm table-dark table-striped">
        <thead><tr><th>Nombre</th><th>Cant.</th><th>Peso</th><th></th></tr></thead>
        <tbody>
          ${objs.map(o => `
            <tr data-itemid="${o.id||''}">
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
        <thead><tr><th>Equip.</th><th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Durab.</th><th>Peso</th><th></th></tr></thead>
        <tbody>
          ${arms.map(a => `
            <tr data-itemid="${a.id||''}">
              <td><input type="checkbox" disabled ${a.equipado ? 'checked' : ''}></td>
              <td><span class="tippy-arm" data-tippy-content="${esc(a.especial||'')}">${esc(a.armadura||'')}</span></td>
              <td>${esc(Array.isArray(a.cobertura)? a.cobertura.join(', ') : (a.cobertura||''))}</td>
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
        <thead><tr><th>Equip.</th><th>Arma</th><th>Mano</th><th>Daño</th><th>Valor</th><th></th></tr></thead>
        <tbody>
          ${armas.map(w => `
            <tr data-itemid="${w.id||''}">
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

    if (window.tippy) {
      tippy(container.querySelectorAll('.tippy-obj,.tippy-arm,.tippy-arma'), { allowHTML:true, theme:'light-border' });
    }
  } catch (err) {
    console.error('renderInventarioPreview error', err);
  }
};

// Delegación: botón "Traspasar" en el preview
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('.slot-traspasar');
  if (!btn) return;
  ev.preventDefault();

  const cat  = btn.dataset.cat;
  const id   = Number(btn.dataset.id);
  const slot = Number(btn.dataset.slot);

  const src = await window.getPersonajeBySlot(slot);
  if (!src || !src.inventario) return;

  // candidatos destino
  const asignaciones = await new Promise((resolve) => {
    const tx = db.transaction('slots','readonly');
    const st = tx.objectStore('slots');
    const req = st.getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror = () => resolve([]);
  });
  const opts = {};
  for (const a of asignaciones) {
    if (a.slot === slot) continue;
    const p = await window.getPersonajeBySlot(a.slot);
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
      confirmButtonText: 'Traspasar'
    });
    destino = value ? Number(value) : null;
  } else {
    const val = prompt('¿A qué slot traspasar? (' + Object.keys(opts).join(', ') + ')');
    destino = val ? Number(val) : null;
  }
  if (!destino || !opts[destino]) return;

  const dst = await window.getPersonajeBySlot(destino);
  if (!dst) { alert('Destino inválido'); return; }
  if (!dst.inventario) dst.inventario = { objetos: [], armaduras: [], armas: [] };

  const move = (arrSrc, arrDst) => {
    const i = arrSrc.findIndex(x => x.id === id);
    if (i < 0) return false;
    arrDst.push(arrSrc[i]);
    arrSrc.splice(i, 1);
    return true;
  };

  let ok = false;
  if (cat === 'obj') ok = move(src.inventario.objetos, dst.inventario.objetos);
  else if (cat === 'arm') ok = move(src.inventario.armaduras, dst.inventario.armaduras);
  else if (cat === 'arma') ok = move(src.inventario.armas, dst.inventario.armas);

  if (!ok) { alert('No se encontró el elemento.'); return; }

  await window.savePersonaje(src);
  await window.savePersonaje(dst);

  if (typeof window.renderInventarioPreview === 'function') {
    window.renderInventarioPreview(slot);
    window.renderInventarioPreview(destino);
  }
});
