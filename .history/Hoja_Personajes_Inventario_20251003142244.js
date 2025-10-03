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
window.openInventarioEditor = async function (slot) {
    if (!window.Swal) { alert("Falta SweetAlert2 (Swal). Inclúyelo para usar el editor de inventario."); return; }
    if (!window.tippy) { console.warn("tippy.js no encontrado. Los tooltips no se activarán."); }

    const personaje = await window.getPersonajeBySlot(slot);
    if (!personaje) { alert("No hay personaje cargado en este slot."); return; }
    if (!personaje.inventario) personaje.inventario = { objetos: [], armaduras: [], armas: [] };

    const modalWidth = Math.min(window.innerWidth - 20, 1000);
    const modalHeight = Math.min(window.innerHeight - 20, 800);

    const html = /* … (mantén el mismo contenido HTML del modal que te pasé) … */ `
      <div id="invRoot" style="max-height:${modalHeight - 90}px; overflow:auto;">
        <!-- (contenido tal cual te lo pasé) -->
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div><strong>Inventario de:</strong> ${personaje.nombre}</div>
          <button id="invCloseX" class="btn btn-sm btn-outline-danger" title="Cerrar">✖</button>
        </div>
        <!-- … resto exactamente igual … -->
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

    await Swal.fire({
        title: 'Editor de Inventario',
        html,
        width: modalWidth,
        didOpen: () => {
            if (window.tippy) tippy('[data-tippy-content]', { theme: 'light', delay: [300, 0] });

            const root = document.getElementById('invRoot');
            const tipo = document.getElementById('invTipo');

            const updateGroups = () => {
                const v = tipo.value;
                document.getElementById('grpObj').style.display = (v === 'obj') ? '' : 'none';
                document.getElementById('grpArm').style.display = (v === 'arm') ? '' : 'none';
                document.getElementById('grpArma').style.display = (v === 'arma') ? '' : 'none';
            };
            tipo.addEventListener('change', updateGroups);
            updateGroups();

            document.getElementById('invCloseX').addEventListener('click', async () => {
                const res = await Swal.fire({
                    icon: 'question',
                    title: '¿Cerrar editor?',
                    text: '¿Deseas guardar antes de salir?',
                    showCancelButton: true,
                    confirmButtonText: 'Guardar y cerrar',
                    cancelButtonText: 'Cerrar sin guardar'
                });
                if (res.isConfirmed) await window.savePersonaje(personaje);
                Swal.close();
            });

            document.getElementById('btnAddObj').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    nombre: document.getElementById('objNombre').value.trim(),
                    lugar: document.getElementById('objLugar').value.trim(),
                    cantidad: parseInt(document.getElementById('objCantidad').value || '0', 10),
                    peso: parseFloat(document.getElementById('objPeso').value || '0'),
                    durabilidad: parseInt(document.getElementById('objDur').value || '0', 10),
                    uso: document.getElementById('objUso').value.trim()
                };
                if (!item.nombre) { Swal.fire('Falta nombre', 'Indica el nombre del objeto', 'warning'); return; }
                personaje.inventario.objetos.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            document.getElementById('btnAddArm').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    armadura: document.getElementById('armNombre').value.trim(),
                    cobertura: Array.from(document.getElementById('armCobertura').selectedOptions).map(o => o.value),
                    defensa: parseInt(document.getElementById('armDef').value || '0', 10),
                    especial: document.getElementById('armEsp').value.trim(),
                    durabilidad: parseInt(document.getElementById('armDur').value || '0', 10),
                    peso: parseFloat(document.getElementById('armPeso').value || '0'),
                    equipado: false
                };
                if (!item.armadura) { Swal.fire('Falta armadura', 'Indica el nombre de la armadura', 'warning'); return; }
                personaje.inventario.armaduras.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            document.getElementById('btnAddArma').addEventListener('click', async () => {
                const item = {
                    id: Date.now(),
                    arma: document.getElementById('armaNombre').value.trim(),
                    mano: document.getElementById('armaMano').value,
                    danio: document.getElementById('armaDmg').value.trim(),
                    durabilidad: parseInt(document.getElementById('armaDur').value || '0', 10),
                    especial: document.getElementById('armaEsp').value.trim(),
                    peso: parseFloat(document.getElementById('armaPeso').value || '0'),
                    equipado: false
                };
                if (!item.arma) { Swal.fire('Falta arma', 'Indica el nombre del arma', 'warning'); return; }
                personaje.inventario.armas.push(item);
                await window.savePersonaje(personaje);
                window.renderInventarioLists(personaje);
            });

            // Edición inline / check equipado / eliminar / traspasar
            const onInput = async (ev) => {
                const t = ev.target;
                const row = t.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);

                const updateItem = (arr, fields) => {
                    const idx = arr.findIndex(x => x.id === id);
                    if (idx < 0) return false;
                    const f = t.name; if (!fields.includes(f)) return false;
                    let v = t.type === 'number' ? (t.step && t.step !== "1" ? parseFloat(t.value) : parseInt(t.value || '0', 10)) : t.value;
                    if (t.tagName === 'SELECT' && t.multiple) v = Array.from(t.selectedOptions).map(o => o.value);
                    arr[idx][f] = v; return true;
                };

                if (updateItem(personaje.inventario.objetos, ['nombre', 'lugar', 'cantidad', 'peso', 'durabilidad', 'uso']) ||
                    updateItem(personaje.inventario.armaduras, ['armadura', 'defensa', 'especial', 'durabilidad', 'peso', 'cobertura']) ||
                    updateItem(personaje.inventario.armas, ['arma', 'mano', 'danio', 'durabilidad', 'especial', 'peso'])) {
                    await window.savePersonaje(personaje);
                }
            };

            const onChange = async (ev) => {
                const t = ev.target;
                if (t.name !== 'equipado') return;
                const row = t.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);

                let item = personaje.inventario.armaduras.find(x => x.id === id);
                if (item) { item.equipado = t.checked; await window.savePersonaje(personaje); return; }
                item = personaje.inventario.armas.find(x => x.id === id);
                if (item) { item.equipado = t.checked; await window.savePersonaje(personaje); return; }
            };

            const onClick = async (ev) => {
                const btn = ev.target.closest('[data-action]'); if (!btn) return;
                const row = btn.closest('[data-itemid]'); if (!row) return;
                const id = Number(row.dataset.itemid);
                const action = btn.dataset.action;

                const delFrom = (arr) => {
                    const i = arr.findIndex(x => x.id === id);
                    if (i >= 0) { arr.splice(i, 1); return true; }
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

            const root = document.getElementById('invRoot');
            root.addEventListener('input', onInput);
            root.addEventListener('change', onChange);
            root.addEventListener('click', onClick);

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
