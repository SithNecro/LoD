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

    const modalWidth = Math.min(window.innerWidth - 20, 1000);
    const modalHeight = Math.min(window.innerHeight - 20, 800);

    const html = `
      <div id="invRoot" style="max-height:${modalHeight - 90}px; overflow:auto;">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div><strong>Inventario de:</strong> ${personaje.nombre}</div>
          <button id="invCloseX" class="btn btn-sm btn-outline-danger" title="Cerrar">✖</button>
        </div>

        <div class="border rounded p-2 mb-3 bg-light">
          <div class="row g-2 align-items-end">
            <div class="col-12 col-md-3">
              <label class="form-label">Tipo</label>
              <select id="invTipo" class="form-select">
                <option value="obj">Objeto</option>
                <option value="arm">Armadura</option>
                <option value="arma">Arma</option>
              </select>
            </div>

            <!-- Grupo Objeto -->
            <div id="grpObj" class="col-12">
              <div class="row g-2">
                <div class="col-12 col-md-3">
                  <label class="form-label" data-tippy-content="Nombre del objeto">Nombre Objeto</label>
                  <input id="objNombre" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Lugar</label>
                  <input id="objLugar" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Cantidad</label>
                  <input id="objCantidad" class="form-control" type="number" min="0" value="1">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label" data-tippy-content="Peso unitario">Peso</label>
                  <input id="objPeso" class="form-control" type="number" min="0" step="0.1">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Durabilidad</label>
                  <select id="objDur" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-12 col-md-3">
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
                <div class="col-12 col-md-3">
                  <label class="form-label">Armadura</label>
                  <input id="armNombre" class="form-control" type="text">
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" data-tippy-content="Puedes seleccionar varias">Cobertura</label>
                  <select id="armCobertura" class="form-select" multiple>
                    <option value="Cabeza">Cabeza</option>
                    <option value="Cuerpo">Cuerpo</option>
                    <option value="Brazos">Brazos</option>
                    <option value="Piernas">Piernas</option>
                    <option value="Escudo">Escudo</option>
                  </select>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Defensa</label>
                  <select id="armDef" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label">Especial</label>
                  <input id="armEsp" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Durabilidad</label>
                  <select id="armDur" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Peso</label>
                  <input id="armPeso" class="form-control" type="number" min="0" step="0.1">
                </div>
                <div class="col-12 col-md-2">
                  <button id="btnAddArm" class="btn btn-primary w-100">Añadir</button>
                </div>
              </div>
            </div>

            <!-- Grupo Arma -->
            <div id="grpArma" class="col-12" style="display:none;">
              <div class="row g-2">
                <div class="col-12 col-md-3">
                  <label class="form-label">Arma</label>
                  <input id="armaNombre" class="form-control" type="text">
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label">Mano</label>
                  <select id="armaMano" class="form-select">
                    <option value="Izquierda">Mano izquierda</option>
                    <option value="Derecha">Mano derecha</option>
                    <option value="Ambas">Ambas manos</option>
                  </select>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Daño</label>
                  <input id="armaDmg" class="form-control" type="text" placeholder="ej. 1d6+2">
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Durabilidad</label>
                  <select id="armaDur" class="form-select">
                    ${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}
                  </select>
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label">Especial</label>
                  <input id="armaEsp" class="form-control" type="text">
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
    `;

    Swal.fire({
  title: 'Inventario',
  html: `<div class="sai-body">
           ${tuHTMLDelInventario}   <!-- aquí va el markup actual del editor -->
        </div>`,
  showCancelButton: true,
  confirmButtonText: 'Guardar',
  cancelButtonText: 'Cancelar',
  focusConfirm: false,
  backdrop: true,
  // 👇 mapeamos cada parte del popup a nuestras clases "sai-*"
  customClass: {
    popup: 'sai-popup',
    title: 'sai-title',
    htmlContainer: 'sai-html',
    actions: 'sai-actions',
    confirmButton: 'sai-confirm',
    cancelButton: 'sai-cancel'
  },
  didOpen: (popupEl) => {
    // Foco en el primer input del editor
    const first = popupEl.querySelector('.sai-body input, .sai-body select, .sai-body textarea');
    if (first) first.focus();
  }
});

            // Añadir OBJETO
            document.getElementById('btnAddObj').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    nombre: document.getElementById('objNombre').value.trim(),
                    lugar: document.getElementById('objLugar').value.trim(),
                    cantidad: parseInt(document.getElementById('objCantidad').value || '0',10),
                    peso: parseFloat(document.getElementById('objPeso').value || '0'),
                    durabilidad: parseInt(document.getElementById('objDur').value || '0',10),
                    uso: document.getElementById('objUso').value.trim()
                };
                if (!item.nombre) { Swal.fire('Falta nombre','Indica el nombre del objeto','warning'); return; }
                personaje.inventario.objetos.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            // Añadir ARMADURA
            document.getElementById('btnAddArm').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    armadura: document.getElementById('armNombre').value.trim(),
                    cobertura: Array.from(document.getElementById('armCobertura').selectedOptions).map(o=>o.value),
                    defensa: parseInt(document.getElementById('armDef').value || '0',10),
                    especial: document.getElementById('armEsp').value.trim(),
                    durabilidad: parseInt(document.getElementById('armDur').value || '0',10),
                    peso: parseFloat(document.getElementById('armPeso').value || '0'),
                    equipado: false
                };
                if (!item.armadura) { Swal.fire('Falta armadura','Indica el nombre de la armadura','warning'); return; }
                personaje.inventario.armaduras.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            // Añadir ARMA
            document.getElementById('btnAddArma').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    arma: document.getElementById('armaNombre').value.trim(),
                    mano: document.getElementById('armaMano').value,
                    danio: document.getElementById('armaDmg').value.trim(),
                    durabilidad: parseInt(document.getElementById('armaDur').value || '0',10),
                    especial: document.getElementById('armaEsp').value.trim(),
                    peso: parseFloat(document.getElementById('armaPeso').value || '0'),
                    equipado: false
                };
                if (!item.arma) { Swal.fire('Falta arma','Indica el nombre del arma','warning'); return; }
                personaje.inventario.armas.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            // Edición inline
            const onInput = async (ev) => {
                const t = ev.target;
                const row = t.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);

                const updateItem = (arr, fields) => {
                    const idx = arr.findIndex(x=>x.id===id);
                    if (idx<0) return false;
                    const f = t.name; if (!fields.includes(f)) return false;
                    let v = t.type === 'number' ? (t.step && t.step!=="1" ? parseFloat(t.value) : parseInt(t.value||'0',10)) : t.value;
                    if (t.tagName === 'SELECT' && t.multiple) v = Array.from(t.selectedOptions).map(o=>o.value);
                    arr[idx][f] = v; return true;
                };

                if (updateItem(personaje.inventario.objetos, ['nombre','lugar','cantidad','peso','durabilidad','uso']) ||
                    updateItem(personaje.inventario.armaduras, ['armadura','defensa','especial','durabilidad','peso','cobertura']) ||
                    updateItem(personaje.inventario.armas, ['arma','mano','danio','durabilidad','especial','peso'])) {
                    await window.savePersonaje(personaje);
                }
            };

            // Check equipado
            const onChange = async (ev) => {
                const t = ev.target;
                if (t.name !== 'equipado') return;
                const row = t.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);

                let item = personaje.inventario.armaduras.find(x=>x.id===id);
                if (item) { item.equipado = t.checked; await window.savePersonaje(personaje); return; }
                item = personaje.inventario.armas.find(x=>x.id===id);
                if (item) { item.equipado = t.checked; await window.savePersonaje(personaje); return; }
            };

            // Eliminar / Traspasar
            const onClick = async (ev) => {
                const btn = ev.target.closest('[data-action]'); if (!btn) return;
                const row = btn.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);
                const action = btn.dataset.action;

                const delFrom = (arr) => {
                    const i = arr.findIndex(x=>x.id===id);
                    if (i>=0) { arr.splice(i,1); return true; }
                    return false;
                };

                if (action === 'eliminar') {
                    if (delFrom(personaje.inventario.objetos) || delFrom(personaje.inventario.armaduras) || delFrom(personaje.inventario.armas)) {
                        await window.savePersonaje(personaje);
                        window.renderInventarioLists(personaje);
                    }
                } else if (action === 'traspasar') {
                    Swal.fire('Pendiente', 'La función "Traspasar" se implementará más adelante.', 'info');
                }
            };

            // ⛳️ Conectamos handlers una sola vez sobre el root
            elRoot.addEventListener('input', onInput);
            elRoot.addEventListener('change', onChange);
            elRoot.addEventListener('click', onClick);

            // Pintar listas iniciales
            window.renderInventarioLists(personaje);
        },
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: true
    });
};



// ✅ NUEVA: renderizado de tablas de Objetos / Armaduras / Armas con edición inline
// ✅ GLOBAL: renderizado de tablas del inventario
window.renderInventarioLists = function (personaje) {
    const mkOpts = (n, sel) => Array.from({ length: n }, (_, i) => `<option value="${i}" ${i == sel ? 'selected' : ''}>${i}</option>`).join('');

    const objHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:80px;"></th>
          <th>Nombre</th><th>Lugar</th><th>Cantidad</th><th>Peso</th><th>Durabilidad</th><th>Uso</th>
        </tr></thead>
        <tbody>
        ${personaje.inventario.objetos.map(o => `
          <tr data-itemid="${o.id}">
            <td>
              <button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button>
              <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
            </td>
            <td><input class="form-control form-control-sm" name="nombre" value="${o.nombre || ''}"></td>
            <td><input class="form-control form-control-sm" name="lugar" value="${o.lugar || ''}"></td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="cantidad" value="${o.cantidad ?? 0}"></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${o.peso ?? 0}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="uso" value="${o.uso || ''}"></td>
          </tr>`).join('')}
        </tbody>
      </table>`;

    const armHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Especial</th><th>Durabilidad</th><th>Peso</th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${personaje.inventario.armaduras.map(a => `
          <tr data-itemid="${a.id}">
            <td><input type="checkbox" name="equipado" ${a.equipado ? 'checked' : ''}></td>
            <td><input class="form-control form-control-sm" name="armadura" value="${a.armadura || ''}"></td>
            <td>
              <select class="form-select form-select-sm" name="cobertura" multiple>
                ${['Cabeza', 'Cuerpo', 'Brazos', 'Piernas', 'Escudo'].map(c => `<option value="${c}" ${Array.isArray(a.cobertura) && a.cobertura.includes(c) ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </td>
            <td><select class="form-select form-select-sm" name="defensa">${mkOpts(11, a.defensa ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" name="especial" value="${a.especial || ''}"></td>
            <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, a.durabilidad ?? 0)}</select></td>
            <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${a.peso ?? 0}"></td>
            <td>
              <button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button>
              <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;

    const armasHtml = `
      <table class="table table-sm align-middle">
        <thead><tr>
          <th style="width:120px;">Equipado</th>
          <th>Arma</th><th>Mano</th><th>Daño</th><th>Durabilidad</th><th>Especial</th><th>Peso</th><th style="width:80px;"></th>
        </tr></thead>
        <tbody>
        ${personaje.inventario.armas.map(w => `
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
            <td>
              <button class="btn btn-sm btn-danger" data-action="eliminar">🗑️</button>
              <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;

    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    set('listObjetos', objHtml);
    set('listArmaduras', armHtml);
    set('listArmas', armasHtml);
};
