// ✅ NUEVA: obtener el personaje asignado a un slot (lee store "slots" -> personajeId -> "personajes")
// ✅ GLOBAL: obtener el personaje asignado a un slot
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

// ✅ NUEVA: persistir cambios de un personaje
// ✅ GLOBAL: persistir cambios de un personaje
window.savePersonaje = function (p) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("personajes", "readwrite");
    const st = tx.objectStore("personajes");
    const req = st.put(p);
    req.onsuccess = () => { if (typeof mostrarPersonajes === 'function') mostrarPersonajes(); resolve(); };
    req.onerror = () => reject(req.error);
  });
};


// ✅ NUEVA: abrir editor Inventario con SweetAlert2 + tippy tooltips
// ✅ GLOBAL: abrir el editor (usa SweetAlert2 + Tippy)
//    *idéntica a la que tenías*, solo cambia la cabecera para quedar en window.*
// ✅ Reemplaza íntegramente tu openInventarioEditor por esta versión (sin redeclaraciones)
window.openInventarioEditor = async function (slot) {
  if (!window.Swal) { alert("Falta SweetAlert2 (Swal). Inclúyelo para usar el editor de inventario."); return; }
  if (!window.tippy) { console.warn("tippy.js no encontrado. Los tooltips no se activarán."); }

  const personaje = await window.getPersonajeBySlot(slot);
  if (!personaje) { alert("No hay personaje cargado en este slot."); return; }
  if (!personaje.inventario) personaje.inventario = { objetos: [], armaduras: [], armas: [] };

  const modalHeight = Math.min(window.innerHeight - 20, 800);

  const html = `
      <div id="invRoot" style="max-height:${modalHeight - 90}px;">
        <div class="d-flex align-items-center justify-content-between mb-2" style="position:sticky;top:0;z-index:5;background:var(--bs-body-bg,#fff);padding:6px 0;">
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
                <div class="col-6 col-md-1">
                  <label class="form-label">Cant.</label>
                  <input id="objCantidad" class="form-control" type="number" min="0" value="0">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Peso</label>
                  <input id="objPeso" class="form-control" type="number" min="0" step="0.1" value="0">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Durabilidad</label>
                  <select id="objDurabilidad" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-12 col-md-2">
                  <label class="form-label">Uso</label>
                  <input id="objUso" class="form-control" type="text">
                </div>
                <div class="col-12 col-md-2">
                  <button id="btnAddObj" class="btn btn-primary w-100">Añadir</button>
                </div>
              </div>
            </div>

            <!-- Grupo Armadura -->
            <div id="grpArm" class="col-12" style="display:none;">
              <div class="row g-2">
                <div class="col-6 col-md-2 d-flex align-items-center">
                  <div class="form-check mt-4">
                    <input class="form-check-input" type="checkbox" id="armEquipado">
                    <label class="form-check-label" for="armEquipado">Equipado</label>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label">Armadura</label>
                  <input id="armNombre" class="form-control" type="text">
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label">Cobertura</label>
                  <div class="d-flex gap-2 flex-wrap">
                    <select id="armCobSel" class="form-select">
                      <option value="Cabeza">Cabeza</option>
                      <option value="Cara">Cara</option>
                      <option value="Cuello">Cuello</option>
                      <option value="Hombros">Hombros</option>
                      <option value="Brazos">Brazos</option>
                      <option value="Manos">Manos</option>
                      <option value="Cuerpo">Cuerpo</option>
                      <option value="Cadera">Cadera</option>
                      <option value="Piernas">Piernas</option>
                      <option value="Pies">Pies</option>
                    </select>
                    <button id="armCobAdd" class="btn btn-outline-secondary">Añadir</button>
                    <button id="armCobClear" class="btn btn-outline-warning">Limpiar</button>
                  </div>
                  <p id="armCobList" class="mt-2 mb-0 small text-muted"></p>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Defensa</label>
                  <select id="armDefensa" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Durabilidad</label>
                  <select id="armDurabilidad" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label">Especial</label>
                  <input id="armEspecial" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Peso</label>
                  <input id="armPeso" class="form-control" type="number" min="0" step="0.1">
                </div>
                <div class="col-12 col-md-2">
                  <button id="btnAddArmadura" class="btn btn-primary w-100">Añadir</button>
                </div>
              </div>
            </div>

            <!-- Grupo Arma -->
            <div id="grpArma" class="col-12" style="display:none;">
              <div class="row g-2">
                <div class="col-6 col-md-2 d-flex align-items-center">
                  <div class="form-check mt-4">
                    <input class="form-check-input" type="checkbox" id="armaEquipado">
                    <label class="form-check-label" for="armaEquipado">Equipado</label>
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label">Arma</label>
                  <input id="armaNombre" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Mano</label>
                  <select id="armaMano" class="form-select">
                    <option value="Izquierda">Izquierda</option>
                    <option value="Derecha">Derecha</option>
                    <option value="Ambas">Ambas</option>
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
                <div class="col-12 col-md-2">
                  <button id="btnAddArma" class="btn btn-primary w-100">Añadir</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Listados -->
          <div id="invLists">
            <h6 class="mt-3">Objetos</h6>
            <div id="listObjetos" class="table-responsive"></div>
            <h6 class="mt-3">Armaduras</h6>
            <div id="listArmaduras" class="table-responsive"></div>
            <h6 class="mt-3">Armas</h6>
            <div id="listArmas" class="table-responsive"></div>
          </div>
        </div>
      </div>`;

  await Swal.fire({
    width: Math.min(1100, window.innerWidth - 40),
    html,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    customClass: { popup: 'sai-popup', title: 'sai-title', htmlContainer: 'sai-body' }
  });

  // Tooltips
  if (window.tippy) tippy('[data-tippy-content]', { theme: 'light-border' });

  // Render inicial de listas ordenadas alfabéticamente
  window.renderInventarioLists(personaje);

  // --- helpers de reset/visibilidad ---
  const elTipo = document.getElementById('invTipo');
  const elGrpObj = document.getElementById('grpObj');
  const elGrpArm = document.getElementById('grpArm');
  const elGrpArma = document.getElementById('grpArma');

  const resetTipo = () => {
    elTipo.value = '';
    elGrpObj.style.display = 'none';
    elGrpArm.style.display = 'none';
    elGrpArma.style.display = 'none';
    // limpiar campos de los 3 grupos
    ['objNombre','objLugar','objCantidad','objPeso','objDurabilidad','objUso'].forEach(id => { const el = document.getElementById(id); if (el) el.value = (el.tagName === 'SELECT' ? '' : ''); });
    ['armEquipado','armNombre','armCobSel','armDefensa','armDurabilidad','armEspecial','armPeso'].forEach(id => { const el = document.getElementById(id); if (!el) return; if (el.type === 'checkbox') el.checked = false; else el.value = (el.tagName === 'SELECT' ? '' : ''); });
    const cob = document.getElementById('armCobList'); if (cob) cob.textContent = '';
    ['armaEquipado','armaNombre','armaMano','armaDanio','armaDurabilidad','armaEspecial','armaPeso'].forEach(id => { const el = document.getElementById(id); if (!el) return; if (el.type === 'checkbox') el.checked = false; else el.value = (el.tagName === 'SELECT' ? '' : ''); });
  };

  const updateGroups = () => {
    const v = elTipo.value;
    elGrpObj.style.display = (v === 'obj') ? '' : 'none';
    elGrpArm.style.display = (v === 'arm') ? '' : 'none';
    elGrpArma.style.display = (v === 'arma') ? '' : 'none';
  };

  // Añadir Objeto
  document.getElementById('btnAddObj').addEventListener('click', async () => {
    const o = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nombre: document.getElementById('objNombre').value.trim(),
      lugar: document.getElementById('objLugar').value,
      cantidad: parseInt(document.getElementById('objCantidad').value || '0', 10),
      peso: parseFloat(document.getElementById('objPeso').value || '0'),
      durabilidad: parseInt(document.getElementById('objDurabilidad').value || '0', 10),
      uso: document.getElementById('objUso').value.trim()
    };
    personaje.inventario.objetos.push(o);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetTipo();
  });

  // Cobertura Armadura
  const cobList = [];
  const updateCobList = () => {
    const p = document.getElementById('armCobList');
    if (p) p.textContent = cobList.join(', ');
  };
  const addCob = () => {
    const sel = document.getElementById('armCobSel').value;
    if (sel && !cobList.includes(sel)) cobList.push(sel);
    updateCobList();
  };
  const clearCob = () => { cobList.length = 0; updateCobList(); };

  // Añadir Armadura
  document.getElementById('btnAddArmadura').addEventListener('click', async () => {
    const a = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      equipado: document.getElementById('armEquipado').checked,
      armadura: document.getElementById('armNombre').value.trim(),
      cobertura: cobList.slice(),
      defensa: parseInt(document.getElementById('armDefensa').value || '0', 10),
      especial: document.getElementById('armEspecial').value.trim(),
      durabilidad: parseInt(document.getElementById('armDurabilidad').value || '0', 10),
      peso: parseFloat(document.getElementById('armPeso').value || '0')
    };
    personaje.inventario.armaduras.push(a);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetTipo();
    clearCob();
  });

  // Añadir Arma
  document.getElementById('btnAddArma').addEventListener('click', async () => {
    const w = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      equipado: document.getElementById('armaEquipado').checked,
      arma: document.getElementById('armaNombre').value.trim(),
      mano: document.getElementById('armaMano').value,
      danio: document.getElementById('armaDanio').value.trim(),
      durabilidad: parseInt(document.getElementById('armaDurabilidad').value || '0', 10),
      especial: document.getElementById('armaEspecial').value.trim(),
      peso: parseFloat(document.getElementById('armaPeso').value || '0')
    };
    personaje.inventario.armas.push(w);
    await window.savePersonaje(personaje);
    window.renderInventarioLists(personaje);
    resetTipo();
  });

  // Ediciones en línea de las tablas (auto-guardado)
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
      || updateItem(personaje.inventario.armaduras, ['equipado','armadura','cobertura','defensa','especial','durabilidad','peso'])
      || updateItem(personaje.inventario.armas, ['equipado','arma','mano','danio','durabilidad','especial','peso'])) {
      await window.savePersonaje(personaje);
      window.renderInventarioLists(personaje);
    }
  };

  document.getElementById('invLists').addEventListener('input', onInput);
  document.getElementById('invLists').addEventListener('change', onInput);

  // Botones Cobertura
  document.addEventListener('click', (ev) => {
    if (ev.target && ev.target.id === 'armCobAdd') { addCob(); }
    if (ev.target && ev.target.id === 'armCobClear') { clearCob(); }
  });

  elTipo.addEventListener('change', updateGroups);
  // Inicio: placeholder seleccionado y grupos ocultos
  resetTipo();

  // Cerrar sin confirmación (todo se guarda automáticamente en cada cambio)
  document.getElementById('invCloseX').addEventListener('click', () => { Swal.close(); });
};




// ✅ NUEVA: renderizado de tablas de Objetos / Armaduras / Armas con edición inline
// ✅ GLOBAL: renderizado de tablas del inventario
// ✅ GLOBAL: renderizado de tablas del inventario (orden alfabético al pintar)
window.renderInventarioLists = function (personaje) {
  const mkOpts = (n, sel) => Array.from({ length: n }, (_, i) => `<option value="${i}" ${i == sel ? 'selected' : ''}>${i}</option>`).join('');

  // --- helpers de ordenación sin mutar el inventario original ---
  const byStr = (get) => (a, b) => {
    const A = (get(a) || '').toString().trim().toLowerCase();
    const B = (get(b) || '').toString().trim().toLowerCase();
    if (A && B) return A.localeCompare(B, 'es', { sensitivity: 'base' });
    if (!A && B) return 1;   // vacíos al final
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
            <td><button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button></td>
            <td><button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

  // Armaduras (Cobertura como <p> con lista unida por comas)
  const armHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Especial</th><th>Durabilidad</th><th>Peso</th><th style="width:80px;"></th><th style="width:80px;"></th>
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
          <th>Arma</th><th>Mano</th><th>Daño</th><th>Durabilidad</th><th>Especial</th><th>Peso</th><th style="width:80px;"></th><th style="width:80px;"></th>
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
