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
// Hoja_Personajes_Inventario.js
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
                <option value="">--Lugar--</option>
                <option value="Mochila">Mochila</option>
                <option value="Atajo 1">Atajo 1</option>
                <option value="Atajo 2">Atajo 2</option>
                <option value="Atajo 3">Atajo 3</option>
                <option value="Atajo 4">Atajo 4</option>
                <option value="Atajo 5">Atajo 5</option>
                <option value="Atajo 6">Atajo 6</option>
                <option value="Atajo 7">Atajo 7</option>
              </select>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Cant.</label>
              <input id="objCant" class="form-control" type="number" min="0" step="1" value="1">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="objPeso" class="form-control" type="number" min="0" step="0.1" value="0">
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">Uso (tooltip)</label>
              <input id="objUso" class="form-control" type="text" placeholder="Texto para tooltip">
            </div>
            <div class="col-12 col-md-12 text-end">
              <button class="btn btn-sm btn-primary" id="btnAddObj">Añadir Objeto</button>
            </div>
          </div>
        </div>

        <!-- Grupo Armadura -->
        <div id="grpArm" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label class="form-label">Armadura</label>
              <input id="armNombre" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Defensa</label>
              <input id="armDef" class="form-control" type="number" min="0" step="1" value="0">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <select id="armDur" class="form-select">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Especial (tooltip)</label>
              <input id="armEsp" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="armPeso" class="form-control" type="number" min="0" step="0.1" value="0">
            </div>
            <div class="col-12 col-md-10">
              <label class="form-label">Cobertura</label>
              <select multiple id="armCobertura" class="form-select">
                ${["Cabeza","Torso","Brazos","Manos","Piernas","Pies"].map(z=>`<option>${z}</option>`).join('')}
              </select>
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-sm btn-primary" id="btnAddArmadura">Añadir Armadura</button>
            </div>
          </div>
        </div>

        <!-- Grupo Arma -->
        <div id="grpArma" class="col-12" style="display:none;">
          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label class="form-label">Arma</label>
              <input id="armaNombre" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Mano</label>
              <select id="armaMano" class="form-select">
                ${["Izquierda","Derecha","Ambas"].map(m=>`<option>${m}</option>`).join('')}
              </select>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Daño</label>
              <input id="armaDanio" class="form-control" type="text" placeholder="ej. 1d6+2">
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Durabilidad</label>
              <select id="armaDur" class="form-select">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div class="col-6 col-md-2">
              <label class="form-label">Peso</label>
              <input id="armaPeso" class="form-control" type="number" min="0" step="0.1" value="0">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Especial (tooltip)</label>
              <input id="armaEsp" class="form-control" type="text">
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-sm btn-primary" id="btnAddArma">Añadir Arma</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Listados -->
    <div id="listObjetos" class="mb-3"></div>
    <div id="listArmaduras" class="mb-3"></div>
    <div id="listArmas" class="mb-1"></div>

    <div class="text-end">
      <button class="btn btn-secondary" id="invCerrar">Cerrar</button>
    </div>
  </div>`;

  const swal = await Swal.fire({
    title: 'Editor de Inventario',
    html,
    width: Math.min(900, window.innerWidth - 20),
    padding: '0.5rem',
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didRender: () => { if (window.tippy) tippy('[data-tippy-content]', { theme: 'light-border' }); }
  });

  // Cierres
  const root = document.getElementById('invRoot');
  root.querySelector('#invCloseX').onclick = () => Swal.close();
  root.querySelector('#invCerrar').onclick = () => Swal.close();

  // Mostrar grupos
  const selTipo = root.querySelector('#invTipo');
  const grpObj = root.querySelector('#grpObj');
  const grpArm = root.querySelector('#grpArm');
  const grpArma = root.querySelector('#grpArma');
  selTipo.onchange = () => {
    const v = selTipo.value;
    grpObj.style.display = v==='obj' ? '' : 'none';
    grpArm.style.display = v==='arm' ? '' : 'none';
    grpArma.style.display = v==='arma'? '' : 'none';
  };

  // Render inicial
  window.renderInventarioLists(personaje);

  // Añadir OBJETO
  root.querySelector('#btnAddObj').onclick = async () => {
    const o = {
      id: Date.now(),
      nombre: root.querySelector('#objNombre').value.trim(),
      lugar: root.querySelector('#objLugar').value || 'Mochila',
      cantidad: parseInt(root.querySelector('#objCant').value || '1', 10),
      peso: parseFloat(root.querySelector('#objPeso').value || '0'),
      durabilidad: 0,
      uso: root.querySelector('#objUso').value.trim()
    };
    if (!o.nombre) return alert('Nombre requerido');
    personaje.inventario.objetos.push(o);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
  };

  // Añadir ARMADURA
  root.querySelector('#btnAddArmadura').onclick = async () => {
    const a = {
      id: Date.now(),
      equipado: false,
      armadura: root.querySelector('#armNombre').value.trim(),
      cobertura: Array.from(root.querySelector('#armCobertura').selectedOptions).map(o=>o.value),
      defensa: parseInt(root.querySelector('#armDef').value || '0', 10),
      especial: root.querySelector('#armEsp').value.trim(),
      durabilidad: parseInt(root.querySelector('#armDur').value || '0', 10),
      peso: parseFloat(root.querySelector('#armPeso').value || '0')
    };
    if (!a.armadura) return alert('Nombre requerido');
    personaje.inventario.armaduras.push(a);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
  };

  // Añadir ARMA
  root.querySelector('#btnAddArma').onclick = async () => {
    const w = {
      id: Date.now(),
      equipado: false,
      arma: root.querySelector('#armaNombre').value.trim(),
      mano: root.querySelector('#armaMano').value,
      danio: root.querySelector('#armaDanio').value.trim(),
      durabilidad: parseInt(root.querySelector('#armaDur').value || '0', 10),
      especial: root.querySelector('#armaEsp').value.trim(),
      peso: parseFloat(root.querySelector('#armaPeso').value || '0')
    };
    if (!w.arma) return alert('Nombre requerido');
    personaje.inventario.armas.push(w);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
  };

  // Delegaciones
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
            if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
          }
          return;
        }

        if (action === 'traspasar') {
          let tipo = null;
          const contId = (btn.closest('#listObjetos') && 'obj') 
                      || (btn.closest('#listArmaduras') && 'arm') 
                      || (btn.closest('#listArmas') && 'arma');
          tipo = contId;
          if (!tipo) return;
          if (window.traspasarInventarioItem) {
            await window.traspasarInventarioItem(slot, tipo, id);
            // tras guardar, refrescamos editor y preview
            window.renderInventarioLists(personaje);
            if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
          }
        }
      }

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

        if (updateItem(personaje.inventario.objetos, ['nombre','lugar','cantidad','peso','durabilidad','uso'])
          || updateItem(personaje.inventario.armaduras, ['equipado','armadura','defensa','especial','durabilidad','peso'])
          || updateItem(personaje.inventario.armas, ['equipado','arma','mano','danio','durabilidad','especial','peso'])) {
          await window.savePersonaje(personaje);
          window.renderInventarioLists(personaje);
          if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
        }
      }

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
          if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
          return;
        }

        // Armas: exclusión por mano
        item = personaje.inventario.armas.find(x => x.id === id);
        if (!item) return;

        if (!t.checked) {
          item.equipado = false;
          await window.savePersonaje(personaje);
          if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
          return;
        }

        const mano = (item.mano || '').trim();
        if (mano === 'Izquierda') {
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && (a.mano === 'Izquierda' || a.mano === 'Ambas')) a.equipado = false; });
        } else if (mano === 'Derecha') {
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && (a.mano === 'Derecha' || a.mano === 'Ambas')) a.equipado = false; });
        } else if (mano === 'Ambas') {
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado) a.equipado = false; });
        }
        item.equipado = true;

        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
        if (window.renderInventarioPreview) window.renderInventarioPreview(slot);
      }

  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('change', onChange);

  if (window.tippy) tippy('[data-tippy-content]', { theme: 'light-border' });
};

// Render de listas
window.renderInventarioLists = function (personaje) {
  const mkOpts = (n, sel) => Array.from({ length: n }, (_, i) => `<option value="${i}" ${i == sel ? 'selected' : ''}>${i}</option>`).join('');

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
          <th  style="width:80px;">Cant.</th>
          <th>Peso</th>
          <th>Durabilidad</th>
          <th>Uso</th>
          <th style="width:90px;">Valor</th>
          <th style="width:80px;"></th>
          <th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${objetosOrden.map(o => `
          <tr data-itemid="${o.id}">
            <td><input class="form-control form-control-sm" name="nombre" value="${o.nombre || ''}"></td>
            <td>
  <select class="form-select form-select-sm" name="lugar">
    ${['','Mochila','Atajo 1','Atajo 2','Atajo 3','Atajo 4','Atajo 5','Atajo 6','Atajo 7']
      .map(l => `<option value="${l}" ${o.lugar===l?'selected':''}>${l || '--Lugar--'}</option>`)
      .join('')}
  </select>
</td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="cantidad" value="${o.cantidad ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${o.peso ?? 0}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="uso" value="${o.uso || ''}"></td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="valor" value="${o.valor ?? 0}"></td>
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
          <th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Especial</th><th>Durabilidad</th><th>Peso</th><th style="width:90px;">Valor</th><th style="width:80px;"></th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${armadurasOrden.map(a => `
          <tr data-itemid="${a.id}">
            <td><input type="checkbox" name="equipado" ${a.equipado ? 'checked' : ''}></td>
            <td><input class="form-control form-control-sm" name="armadura" value="${a.armadura || ''}"></td>
            <td><p class="mb-0">${Array.isArray(a.cobertura) ? a.cobertura.join(', ') : ''}</p></td>
            <td><select class="form-select form-select-sm" name="defensa">${mkOpts(11, a.defensa ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="especial" value="${a.especial || ''}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, a.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${a.peso ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="valor" value="${a.valor ?? 0}"></td>
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
            <td><input type="checkbox" name="equipado" ${w.equipado ? 'checked' : ''}></td>
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
// ===== NUEVA: Preview simple en el slot (debajo del botón Abrir Inventario) =====
window.renderInventarioPreview = async function(slot) {
  try {
    const container = document.getElementById(`mochila-slot${slot}`);
    if (!container) return;
    const pj = await window.getPersonajeBySlot(slot);
    if (!pj || !pj.inventario) { container.innerHTML = '<div class="text-muted">Sin inventario</div>'; return; }
    const inv = pj.inventario;

    const safe = s => (s ?? '').toString().replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
    const joinArr = a => Array.isArray(a) ? a.join(', ') : (a || '');

    // Objetos: Nombre (tooltip Uso), Cantidad, Peso, Traspasar
    const objRows = (inv.objetos || []).map(o => `
      <tr data-itemid="${o.id}" data-tipo="obj">
        <td><span data-tippy-content="${safe(o.uso||'')}">${safe(o.nombre||'')}</span></td>
        <td class="text-end">${Number(o.cantidad ?? 0)}</td>
        <td class="text-end">${Number(o.peso ?? 0)}</td>
        <td class="text-center"><button class="btn btn-sm btn-secondary" data-action="traspasar" title="Traspasar">⇄</button></td>
      </tr>`).join('') || '<tr><td colspan="4" class="text-muted">—</td></tr>';

    // Armaduras: Equipado, Armadura (tooltip Especial), Cobertura, Defensa, Durabilidad, Traspasar, Peso
    const armRows = (inv.armaduras || []).map(a => `
      <tr data-itemid="${a.id}" data-tipo="arm">
        <td class="text-center"><input type="checkbox" disabled ${a.equipado ? 'checked':''}></td>
        <td><span data-tippy-content="${safe(a.especial||'')}">${safe(a.armadura||'')}</span></td>
        <td>${safe(joinArr(a.cobertura))}</td>
        <td class="text-end">${Number(a.defensa ?? 0)}</td>
        <td class="text-end">${Number(a.durabilidad ?? 0)}</td>
        <td class="text-center"><button class="btn btn-sm btn-secondary" data-action="traspasar" title="Traspasar">⇄</button></td>
        <td class="text-end">${Number(a.peso ?? 0)}</td>
      </tr>`).join('') || '<tr><td colspan="7" class="text-muted">—</td></tr>';

    // Armas: Equipado, Arma (tooltip Especial), Mano, Daño, Traspasar, Valor
    const armaRows = (inv.armas || []).map(w => `
      <tr data-itemid="${w.id}" data-tipo="arma">
        <td class="text-center"><input type="checkbox" disabled ${w.equipado ? 'checked':''}></td>
        <td><span data-tippy-content="${safe(w.especial||'')}">${safe(w.arma||'')}</span></td>
        <td>${safe(w.mano||'')}</td>
        <td class="text-end">${safe(w.danio||'')}</td>
        <td class="text-center"><button class="btn btn-sm btn-secondary" data-action="traspasar" title="Traspasar">⇄</button></td>
        <td class="text-end">${w.valor != null ? safe(w.valor) : ''}</td>
      </tr>`).join('') || '<tr><td colspan="6" class="text-muted">—</td></tr>';

    container.innerHTML = `
      <div class="inv-preview">
        <h6 class="mt-2 mb-1">Objetos</h6>
        <div class="table-responsive">
          <table class="table table-sm table-dark align-middle mb-2">
            <thead><tr><th>Nombre</th><th style="width:70px;">Cant.</th><th style="width:70px;">Peso</th><th style="width:60px;"></th></tr></thead>
            <tbody>${objRows}</tbody>
          </table>
        </div>

        <h6 class="mt-2 mb-1">Armaduras</h6>
        <div class="table-responsive">
          <table class="table table-sm table-dark align-middle mb-2">
            <thead><tr><th style="width:60px;">Eq.</th><th>Armadura</th><th>Cobertura</th><th style="width:70px;">Def</th><th style="width:90px;">Durab.</th><th style="width:60px;"></th><th style="width:70px;">Peso</th></tr></thead>
            <tbody>${armRows}</tbody>
          </table>
        </div>

        <h6 class="mt-2 mb-1">Armas</h6>
        <div class="table-responsive">
          <table class="table table-sm table-dark align-middle mb-2">
            <thead><tr><th style="width:60px;">Eq.</th><th>Arma</th><th>Mano</th><th style="width:80px;">Daño</th><th style="width:60px;"></th><th style="width:80px;">Valor</th></tr></thead>
            <tbody>${armaRows}</tbody>
          </table>
        </div>
      </div>
    `;

    // Delegar clicks de traspaso en el contenedor
    container.onclick = async (ev) => {
      const btn = ev.target.closest('[data-action="traspasar"]'); if (!btn) return;
      const row = btn.closest('[data-itemid]'); if (!row) return;
      const tipo = row.dataset.tipo;
      const id = Number(row.dataset.itemid);
      if (window.traspasarInventarioItem) {
        await window.traspasarInventarioItem(slot, tipo, id);
        // refrescar preview de origen y destino dentro de la función
      }
    };

    if (window.tippy) tippy('[data-tippy-content]', { theme: 'light-border' });

  } catch (e) {
    console.error('renderInventarioPreview error', e);
  }
};
// ===== NUEVA: Traspasar ítem entre slots/personajes =====
window.traspasarInventarioItem = async function(fromSlot, tipo, itemId) {
  const src = await window.getPersonajeBySlot(fromSlot);
  if (!src || !src.inventario) return;

  // Encuentra el item y lo saca del origen
  let item = null;
  if (tipo === 'obj') {
    const i = src.inventario.objetos.findIndex(o => o.id === itemId);
    if (i < 0) return;
    item = src.inventario.objetos.splice(i,1)[0];
  } else if (tipo === 'arm') {
    const i = src.inventario.armaduras.findIndex(a => a.id === itemId);
    if (i < 0) return;
    item = src.inventario.armaduras.splice(i,1)[0];
  } else if (tipo === 'arma') {
    const i = src.inventario.armas.findIndex(w => w.id === itemId);
    if (i < 0) return;
    item = src.inventario.armas.splice(i,1)[0];
  } else {
    return;
  }

  // Destinos posibles (otros slots con personaje)
  const asignaciones = await new Promise((resolve, reject) => {
    const tx = db.transaction('slots','readonly');
    const st = tx.objectStore('slots');
    const req = st.getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror = () => reject(req.error);
  });

  const destinos = [];
  for (const a of asignaciones) {
    if (a.slot === fromSlot) continue;
    const p = await new Promise((resolve,reject)=>{
      const tx = db.transaction('personajes','readonly');
      const st = tx.objectStore('personajes');
      const r = st.get(a.personajeId);
      r.onsuccess = e => resolve(e.target.result || null);
      r.onerror = () => reject(r.error);
    });
    if (p) destinos.push({slot:a.slot, id:p.id, nombre:p.nombre});
  }

  if (!destinos.length) {
    // No hay destinos -> devolver item al origen y avisar
    if (tipo === 'obj') src.inventario.objetos.push(item);
    if (tipo === 'arm') src.inventario.armaduras.push(item);
    if (tipo === 'arma') src.inventario.armas.push(item);
    await window.savePersonaje(src);
    if (window.renderInventarioPreview) window.renderInventarioPreview(fromSlot);
    alert('No hay otro héroe cargado para traspasar.');
    return;
  }

  // Diálogo para elegir destino
  const inputOptions = destinos.reduce((acc,d)=>{ acc[d.slot] = `${d.nombre} (Slot ${d.slot})`; return acc; }, {});
  let destSlot = null;
  if (window.Swal) {
    const { value } = await Swal.fire({
      title: 'Traspasar a…',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Elige destino',
      showCancelButton: true,
      confirmButtonText: 'Traspasar',
      cancelButtonText: 'Cancelar'
    });
    destSlot = Number(value);
  } else {
    const s = prompt('¿A qué slot traspasar? (' + destinos.map(d=>d.slot).join(', ') + ')');
    destSlot = Number(s);
  }
  if (!destSlot || !destinos.some(d=>d.slot===destSlot)) {
    // Cancelado o inválido -> devolver item al origen
    if (tipo === 'obj') src.inventario.objetos.push(item);
    if (tipo === 'arm') src.inventario.armaduras.push(item);
    if (tipo === 'arma') src.inventario.armas.push(item);
    await window.savePersonaje(src);
    if (window.renderInventarioPreview) window.renderInventarioPreview(fromSlot);
    return;
  }

  // Mover al destino
  const dest = await window.getPersonajeBySlot(destSlot);
  if (!dest) {
    if (tipo === 'obj') src.inventario.objetos.push(item);
    if (tipo === 'arm') src.inventario.armaduras.push(item);
    if (tipo === 'arma') src.inventario.armas.push(item);
    await window.savePersonaje(src);
    if (window.renderInventarioPreview) window.renderInventarioPreview(fromSlot);
    return;
  }
  if (!dest.inventario) dest.inventario = { objetos:[], armaduras:[], armas:[] };

  if (tipo === 'obj') dest.inventario.objetos.push(item);
  if (tipo === 'arm') dest.inventario.armaduras.push(item);
  if (tipo === 'arma') dest.inventario.armas.push(item);

  await window.savePersonaje(src);
  await window.savePersonaje(dest);

  // Refrescar previews de ambos
  if (window.renderInventarioPreview) {
    window.renderInventarioPreview(fromSlot);
    window.renderInventarioPreview(destSlot);
  }
};
