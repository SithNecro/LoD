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
    <div class="d-flex align-items-center justify-content-between mb-2" style="position:sticky;top:0;z-index:5;padding:6px 0;">
      <div><strong>Inventario de:</strong> ${personaje.nombre} (${personaje.profesion})</div>
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
        <div id="grpObj" class="col-12" style="display:none; border:3px solid #666; border-radius:8px; padding:10px;">

          <div class="row g-2">
            <div class="col-12 col-md-5">
              <label class="form-label" data-tippy-content="Nombre del objeto">🏷️ Nombre</label>
              <input id="objNombre" class="form-control" type="text">
            </div>
            <div class="col-12 col-md-2">
              <label class="form-label">💼 Lugar</label>
              <select id="objLugar" class="form-select">
                <option value=""></option>
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
              <label class="form-label">🧮 Cant.</label>
              <input id="objCantidad" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">⚖️ Peso</label>
              <input id="objPeso" class="form-control" type="number" step="0.1" min="0" value="0">
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">⚒️ Dur.</label>
              <select id="objDurabilidad" class="form-select">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">💰 Valor</label>
              <input id="objValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-5">
              <label class="form-label">📜 Uso</label>
              <input id="objUso" class="form-control" type="text">
            </div>
            
              <div class="col-12 col-md-12">
             <button type="button" id="btnAddObj" class="btn btn-success btn-add-objeto">➕ Añadir Objeto Al Inventario</button>
            </div>
          </div>
        </div>

        <!-- Grupo Armadura -->
                <div id="grpArm" class="col-12" style="display:none; border:3px solid #666; border-radius:8px; padding:10px;">

          <div class="row g-2">
            <div class="col-12 col-md-4">
              <label class="form-label">👕 Nombre</label>
              <input id="armNombre" class="form-control" type="text">
            </div>
    
            <div class="col-6 col-md-1">
              <label class="form-label">🛡️ Def.</label>
              <input id="armDefensa" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">⚒️ Dur.</label>
              <select id="armDurabilidad" class="form-select">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
          
            <div class="col-6 col-md-1">
              <label class="form-label">⚖️ Peso</label>
              <input id="armPeso" class="form-control" type="number" step="0.1" min="0">
            </div>
         
            <div class="col-6 col-md-1">
              <label class="form-label">💰 Valor</label>
              <input id="armValor" class="form-control" type="number" min="0" value="0">
            </div>
              <div class="col-12 col-md-4">
              <label class="form-label">✨ Espec.</label>
              <input id="armEspecial" class="form-control" type="text">
            </div>
                    <!-- Cobertura (multi-select) -->
<div class="col-12 col-md-2">
  <label class="form-label">🥾 Cob.</label>
  <select id="armCobSel" class="form-select" multiple size="8">
    <option value="Cabeza">Cabeza</option>
    <option value="Pecho">Pecho</option>
    <option value="Abdomen">Abdomen</option>
    <option value="Hombros">Hombros</option>
    <option value="Brazos">Brazos</option>
    <option value="Manos">Manos</option>
    <option value="Piernas">Piernas</option>
    <option value="Pies">Pies</option>
  </select>
  <small id="armCobList" class="d-block mt-1"></small>
</div>
            <div class="col-12 col-md-12">
             <button type="button" id="btnAddArmadura" class="btn btn-success btn-add-armadura">➕ Añadir Armadura Al Inventario</button>
            </div>
          </div>
        </div>

        <!-- Grupo Arma -->
                        <div id="grpArma" class="col-12" style="display:none; border:3px solid #666; border-radius:8px; padding:10px;">

          <div class="row g-2">
            <div class="col-12 col-md-5">
              <label class="form-label">⚔️ Nombre</label>
              <input id="armaNombre" class="form-control" type="text">
            </div>
            <div class="col-12 col-md-2">
              <label class="form-label">✋🤚 Mano</label>
              <select id="armaMano" class="form-select">
                <option value="Izquierda">Izquierda</option>
                <option value="Derecha">Derecha</option>
                <option value="Ambas">Ambas</option>
              </select>
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">💥 DAÑ</label>
              <input id="armaDanio" class="form-control" type="text">
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">⚒️ Dur.</label>
              <select id="armaDurabilidad" class="form-select">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
               <div class="col-6 col-md-1">
              <label class="form-label">⚖️ Peso</label>
              <input id="armaPeso" class="form-control" type="number" min="0" step="0.1">
            </div>
            <div class="col-6 col-md-1">
              <label class="form-label">💰 Valor</label>
              <input id="armaValor" class="form-control" type="number" min="0" value="0">
            </div>
            <div class="col-12 col-md-5">
              <label class="form-label">✨ Espec.</label>
              <input id="armaEspecial" class="form-control" type="text">
            </div>
         
            
              <div class="col-12 col-md-12">
             <button type="button" id="btnAddArma" class="btn btn-success btn-add-arma">➕ Añadir Arma Al Inventario</button>
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
    customClass: { popup: 'sai-popup', title: 'sai-title', htmlContainer: 'sai-body' },
    didOpen: () => {
      if (window.tippy) tippy('[data-tippy-content]', { theme: 'light-border' });

      // Render inicial
      window.renderInventarioLists(personaje);

      // --- helpers UI ---
      const elTipo = document.getElementById('invTipo');
      const grpObj = document.getElementById('grpObj');
      const grpArm = document.getElementById('grpArm');
      const grpArma = document.getElementById('grpArma');

      const hideAllGroups = () => {
        grpObj.style.display = 'none';
        grpArm.style.display = 'none';
        grpArma.style.display = 'none';
      };
      const resetAfterAdd = () => {
        // placeholder en Tipo y ocultar grupos
        elTipo.value = '';
        hideAllGroups();
        // limpiar OBJETO
        const n = id => document.getElementById(id);
        if (n('objNombre')) n('objNombre').value = '';
        if (n('objLugar')) n('objLugar').value = '';
        if (n('objCantidad')) n('objCantidad').value = '0';
        if (n('objPeso')) n('objPeso').value = '0';
        if (n('objDurabilidad')) n('objDurabilidad').value = '0';
        if (n('objUso')) n('objUso').value = '';
        if (n('objValor')) n('objValor').value = '0';
        // limpiar ARMADURA
        if (n('armEquipado')) n('armEquipado').checked = false;
        if (n('armNombre')) n('armNombre').value = '';
        if (n('armCobSel')) n('armCobSel').value = 'Cabeza';
        const cob = n('armCobList'); if (cob) cob.textContent = '';
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
      // === Multi-select Cobertura: clic único por opción (sin Ctrl/Alt) ===
      const cobSel = document.getElementById('armCobSel');
      const cobList = document.getElementById('armCobList');

      function actualizarCobListDesdeSelect() {
        if (!cobSel || !cobList) return;
        const seleccionadas = Array.from(cobSel.selectedOptions).map(o => o.value);
        cobList.textContent = seleccionadas.join(', ');
      }

      cobSel?.addEventListener('change', actualizarCobListDesdeSelect);

      // 🔽 truco: permitir marcar/desmarcar con un clic normal
      cobSel?.addEventListener('mousedown', (e) => {
        const opt = e.target;
        if (opt && opt.tagName === 'OPTION') {
          e.preventDefault();                    // evita el comportamiento nativo
          opt.selected = !opt.selected;          // toggle manual
          cobSel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, false);

      // pinto el <small> al cargar
      actualizarCobListDesdeSelect();

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

        if (updateItem(personaje.inventario.objetos, ['nombre', 'lugar', 'cantidad', 'peso', 'durabilidad', 'uso', 'valor'])
          || updateItem(personaje.inventario.armaduras, ['equipado', 'armadura', 'defensa', 'especial', 'durabilidad', 'peso', 'valor'])
          || updateItem(personaje.inventario.armas, ['equipado', 'arma', 'mano', 'danio', 'durabilidad', 'especial', 'peso', 'valor'])) {
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
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Izquierda' || a.mano === 'Ambas')) a.equipado = false; });
        } else if (mano === 'Derecha') {
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Derecha' || a.mano === 'Ambas')) a.equipado = false; });
        } else if (mano === 'Ambas') {
          personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado) a.equipado = false; });
        }
        item.equipado = true;

        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
      };

      // ===== Eliminar / Traspasar =====
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
          // Confirmación inline: no cierra el popup de inventario
          const prev = document.getElementById('invConfirmOverlay');
          if (prev) prev.remove();

          const overlay = document.createElement('div');
          overlay.id = 'invConfirmOverlay';
          overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:10000;';

          overlay.innerHTML = `
    <div class="hero-card"
         style="background:#1e1e1e; color:#fff; border:1px solid rgba(255,255,255,.1);
                border-radius:10px; padding:16px; width:min(420px,92vw);
                box-shadow:0 10px 30px rgba(0,0,0,.6);">
      <h5 class="mb-2">¿Deseas eliminar este objeto?</h5>
      <div class="text-warning mb-3">Esta acción es permanente.</div>
      <div class="d-flex justify-content-end" style="gap:8px;">
        <button id="invConfirmCancel" class="btn btn-sm btn-secondary">Cancelar</button>
        <button id="invConfirmOk" class="btn btn-sm btn-danger">Eliminar</button>
      </div>
    </div>
  `;

          document.body.appendChild(overlay);

          const closeOverlay = () => {
            try { overlay.remove(); } catch (_) { }
          };

          overlay.querySelector('#invConfirmCancel').addEventListener('click', closeOverlay);
          overlay.querySelector('#invConfirmOk').addEventListener('click', async () => {
            const delObj = delFrom(personaje.inventario.objetos);
            const delArm = delFrom(personaje.inventario.armaduras);
            const delArma = delFrom(personaje.inventario.armas);

            if (delObj || delArm || delArma) {
              await window.savePersonaje(personaje);
              window.renderInventarioLists(personaje);
            }
            closeOverlay();
          });

          return;
        }


        if (action === 'traspasar') {
          // 1) Obtener destinos válidos
          const asigs = await new Promise((resolve, reject) => {
            const tx = db.transaction('slots', 'readonly');
            const st = tx.objectStore('slots');
            const req = st.getAll();
            req.onsuccess = e => {
              const all = e.target.result || [];
              resolve(all.filter(a => a && a.personajeId && a.slot !== slot));
            };
            req.onerror = () => reject(req.error);
          });

          const destinos = [];
          for (const a of asigs) {
            try {
              const p = await window.getPersonajeBySlot(a.slot);
              if (p) destinos.push({ slot: a.slot, nombre: p.nombre || ('Héroe ' + a.slot) });
            } catch (_) { }
          }

          if (!destinos.length) {
            Swal.fire('Sin destinos', 'No hay otros héroes disponibles para recibir el objeto.', 'info');
            return;
          }

          const inputOptions = {};
          destinos.forEach(d => { inputOptions[d.slot] = `Slot ${d.slot} — ${d.nombre}`; });

          const { isConfirmed, value: destSlot } = await Swal.fire({
            title: 'Traspasar a...',
            input: 'select',
            inputOptions,
            inputPlaceholder: 'Selecciona héroe destino',
            showCancelButton: true,
            confirmButtonText: 'Traspasar',
          });
          if (!isConfirmed) return;

          // 2) Quitar del origen y detectar categoría
          let categoria = 'objetos';
          let moved = delFrom(personaje.inventario.objetos);
          if (!moved) { categoria = 'armaduras'; moved = delFrom(personaje.inventario.armaduras); }
          if (!moved) { categoria = 'armas'; moved = delFrom(personaje.inventario.armas); }
          if (!moved) { Swal.fire('Error', 'No se encontró el ítem a traspasar.', 'error'); return; }

          // Armaduras/Armas: llegan como no equipadas
          if (categoria !== 'objetos') moved.equipado = false;

          // 3) Añadir en destino (id se conserva salvo colisión)
          const destPersonaje = await window.getPersonajeBySlot(Number(destSlot));
          if (!destPersonaje) { Swal.fire('Error', 'No se pudo cargar el héroe destino.', 'error'); return; }
          if (!destPersonaje.inventario) destPersonaje.inventario = { objetos: [], armaduras: [], armas: [] };
          const destArr = destPersonaje.inventario[categoria] || (destPersonaje.inventario[categoria] = []);

          if (destArr.some(x => x.id === moved.id)) {
            let newId = Date.now();
            while (destArr.some(x => x.id === newId)) newId++;
            moved.id = newId;
          }

          destArr.push(moved);

          await window.savePersonaje(personaje);
          await window.savePersonaje(destPersonaje);
          window.renderInventarioLists(personaje);
          Swal.fire('Hecho', 'Ítem traspasado correctamente.', 'success');
          return;
        }
      };


      // Listeners
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
        const armadura = (document.getElementById('armNombre')?.value || '').trim();
        if (!armadura) { Swal.fire('Falta armadura', 'Indica el nombre de la armadura', 'warning'); return; }
        const cobTxt = (document.getElementById('armCobList')?.textContent || '').trim();
        const cobertura = cobTxt ? cobTxt.split(',').map(s => s.trim()).filter(Boolean)
          : [document.getElementById('armCobSel')?.value || ''].filter(Boolean);
        const item = {
          id: Date.now(),
          armadura,
          cobertura,
          defensa: parseInt(document.getElementById('armDefensa')?.value || '0', 10),
          especial: document.getElementById('armEspecial')?.value || '',
          durabilidad: parseInt(document.getElementById('armDurabilidad')?.value || '0', 10),
          peso: parseFloat(document.getElementById('armPeso')?.value || '0'),
          equipado: !!document.getElementById('armEquipado')?.checked,
          valor: parseInt(document.getElementById('armValor')?.value || '0', 10)
        };
        personaje.inventario.armaduras.push(item);
        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
        resetAfterAdd();
      });

      const btnArma = document.getElementById('btnAddArma');
      if (btnArma) btnArma.addEventListener('click', async () => {
        const arma = (document.getElementById('armaNombre')?.value || '').trim();
        if (!arma) { Swal.fire('Falta arma', 'Indica el nombre del arma', 'warning'); return; }
        const item = {
          id: Date.now(),
          arma,
          mano: document.getElementById('armaMano')?.value || 'Izquierda',
          danio: document.getElementById('armaDanio')?.value || '',
          durabilidad: parseInt(document.getElementById('armaDurabilidad')?.value || '0', 10),
          especial: document.getElementById('armaEspecial')?.value || '',
          peso: parseFloat(document.getElementById('armaPeso')?.value || '0'),
          equipado: !!document.getElementById('armaEquipado')?.checked,
          valor: parseInt(document.getElementById('armaValor')?.value || '0', 10)
        };
        personaje.inventario.armas.push(item);
        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
        resetAfterAdd();
      });

      // Enfocar algo usable
      const first = document.querySelector('#invRoot input, #invRoot select, #invRoot textarea');
      if (first) first.focus();
    }
  });
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
          
          <th>🏷️ Objeto</th>
          <th>💼 Lugar</th>
          <th style="width:100px;">🧮 Cant.</th>
          <th>📜 Uso</th>
                    <th style="width:100px;">⚒️ Dur.</th>
           <th style="width:100px;">⚖️ Peso</th>
          <th style="width:100px;">💰 Valor</th>
          <th style="width:60px;"></th>
          <th style="width:60px;"></th>
        </tr></thead>
        <tbody>
        ${objetosOrden.map(o => `
          <tr data-itemid="${o.id}">
            <td><input class="form-control form-control-sm" name="nombre"  title="${o.uso}" value="${o.nombre || ''}"></td>
            <td>
  <select class="form-select form-select-sm" name="lugar">
    ${['', 'Mochila', 'Atajo 1', 'Atajo 2', 'Atajo 3', 'Atajo 4', 'Atajo 5', 'Atajo 6', 'Atajo 7']
      .map(l => `<option value="${l}" ${o.lugar === l ? 'selected' : ''}>${l || '--Lugar--'}</option>`)
      .join('')}
  </select>
</td>
            <td><input class="form-control form-control-sm" type="number" min="0" name="cantidad" value="${o.cantidad ?? 0}"></td>
            <td><input class="form-control form-control-sm" name="uso" value="${o.uso || ''}"></td>
                        <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>

                        <td><input class="form-control form-control-sm" type="number" step="0.1" min="0" name="peso" value="${o.peso ?? 0}"></td>

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
          <th style="width:80px;">⚙️ EQ.</th>
          <th>👕 Armadura</th>
          <th>🥾 Cob.</th>
          <th style="width:100px;">🛡️ Def.</th>
          <th>✨ Espec.</th>
          <th style="width:100px;">⚒️ Dur.</th>
          <th style="width:100px;">⚖️ Peso</th>
          <th style="width:100px;">💰 Valor</th>
          <th style="width:60px;"></th><th style="width:60px;"></th>
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
          <th style="width:80px;">⚙️ EQ.</th>
          <th>⚔️ Arma</th>
          <th>✋🤚 Mano</th>
          <th style="width:100px;">💥 DAÑ</th>
        
          <th>Especial</th>
            <th style="width:100px;">⚒️ Dur.</th>
          <th style="width:100px;">⚖️ Peso</th>
          <th style="width:100px;">💰 Valor</th>
         
          <th style="width:60px;"></th><th style="width:60px;"></th>
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
            <td><input class="form-control form-control-sm" name="especial" value="${w.especial || ''}"></td>
                        <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, w.durabilidad ?? 0)}</select></td>

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
/* ============================================================
 *  PREVIEW DE INVENTARIO EN LA SECCIÓN "MOCHILA" (APPEND-ONLY)
 *  - No modifica el popup ni sus funciones.
 *  - Pinta tablas debajo del botón "Abrir Inventario".
 *  - Reutiliza misma mecánica de "Traspasar" entre slots.
 * ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => (s == null ? '' : String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])));

  // ---------- Render del PREVIEW debajo del botón ----------
  window.renderInventarioPreview = async function (slot) {
    try {
      const container = document.getElementById(`mochila-slot${slot}`);
      if (!container) return;

      const pj = await window.getPersonajeBySlot(slot);
      if (!pj || !pj.inventario) {
        container.innerHTML = '<em>Sin inventario</em>';
        return;
      }

      const objetos = Array.isArray(pj.inventario.objetos) ? pj.inventario.objetos : [];
      const armaduras = Array.isArray(pj.inventario.armaduras) ? pj.inventario.armaduras : [];
      const armas = Array.isArray(pj.inventario.armas) ? pj.inventario.armas : [];

      // OBJETOS: Nombre (tooltip Uso), Cantidad, Peso, Traspasar
      const tblObjs = `
        <h6 class="mt-2 mb-1">🧰 Objetos</h6>
        <table class="table table-sm table-dark table-striped">
          <thead>
            <tr><th>Nombre</th><th>Cant.</th><th>Peso</th><th></th></tr>
          </thead>
          <tbody>
            ${objetos.map(o => `
              <tr data-itemid="${o.id || ''}" data-cat="obj">
                <td><span class="tip-obj" data-tippy-content="${esc(o.uso || '')}">${esc(o.nombre || '')}</span></td>
                <td>${esc(o.cantidad ?? 0)}</td>
                <td>${esc(o.peso ?? '')}</td>
               <td class="text-center">
                  <button class="btn btn-sm btn-outline-warning slot-traspasar"
                          data-cat="obj" data-id="${o.id || ''}" data-slot="${slot}">
                    ⇄
                  </button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;

      // ARMADURAS: Equipado, Armadura (tooltip Especial), Cobertura, Defensa, Durabilidad, Traspasar, Peso
      const tblArmad = `
        <h6 class="mt-2 mb-1">🛡️ Armaduras</h6>
        <table class="table table-sm table-dark table-striped">
          <thead>
            <tr><th>Equip.</th><th>Armadura</th><th>Cob.</th><th>Def.</th><th>Durab.</th><th>Peso</th><th>Trasp.</th></tr>
          </thead>
          <tbody>
            ${armaduras.map(a => `
              <tr data-itemid="${a.id || ''}" data-cat="arm">
                <td><input type="checkbox" disabled ${a.equipado ? 'checked' : ''}></td>
                <td><span class="tip-arm" data-tippy-content="${esc(a.especial || '')}">${esc(a.armadura || '')}</span></td>
                <td>${esc(Array.isArray(a.cobertura) ? a.cobertura.join(', ') : (a.cobertura || ''))}</td>
                <td>${esc(a.defensa ?? '')}</td>
                <td>${esc(a.durabilidad ?? '')}</td>
               
                <td>${esc(a.peso ?? '')}</td>
<td class="text-center">
                  <button class="btn btn-sm btn-outline-warning slot-traspasar"
                          data-cat="arm" data-id="${a.id || ''}" data-slot="${slot}">
                    ⇄
                  </button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;

      // ARMAS: Equipado, Arma (tooltip Especial), Mano, Daño, Trasp., Valor
      // (Usamos "Ambas" si así está guardado en tus datos)
      const tblArmas = `
        <h6 class="mt-2 mb-1">⚔️ Armas</h6>
        <table class="table table-sm table-dark table-striped">
          <thead>
            <tr><th>Equip.</th><th>Arma</th><th>Mano</th><th>Daño</th><th>Peso</th><th>Trasp.</th></tr>
          </thead>
          <tbody>
            ${armas.map(w => `
              <tr data-itemid="${w.id || ''}" data-cat="arma">
                <td><input type="checkbox" disabled ${w.equipado ? 'checked' : ''}></td>
                <td><span class="tip-arma" data-tippy-content="${esc(w.especial || '')}">${esc(w.arma || '')}</span></td>
                <td>${esc(w.mano || '')}</td>
                <td>${esc(w.danio || '')}</td>
               
                <td>${esc(w.peso ?? 0)}</td>
<td class="text-center">
                  <button class="btn btn-sm btn-outline-warning slot-traspasar"
                          data-cat="arma" data-id="${w.id || ''}" data-slot="${slot}">
                    ⇄
                  </button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;

      container.innerHTML = tblObjs + tblArmad + tblArmas;

      // Activa tooltips si Tippy está cargado en la página
      if (window.tippy) {
        tippy($$('.tip-obj, .tip-arm, .tip-arma', container), { allowHTML: true, theme: 'light-border' });
      }
    } catch (err) {
      console.error('renderInventarioPreview error', err);
    }
  };

  // ---------- Hook: al entrar en la sección "mochila" pinto el preview ----------
  // (El HTML ya llama a showBackSection; aquí escuchamos el click del botón frontal)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.flip-to');
    if (!btn || btn.dataset.section !== 'mochila') return;
    const card = btn.closest('.flip-card');
    if (!card) return;
    const slot = parseInt(card.id.replace('slot', ''), 10);
    if (!Number.isInteger(slot)) return;
    // Pequeño defer para asegurar que el contenedor está visible
    setTimeout(() => window.renderInventarioPreview(slot), 0);
  });

  // ---------- Delegación: botón "Traspasar" del preview ----------
  document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.slot-traspasar');
    if (!btn) return;
    ev.preventDefault();

    const cat = btn.dataset.cat;             // 'obj' | 'arm' | 'arma'
    const id = Number(btn.dataset.id);      // id del elemento
    const slot = Number(btn.dataset.slot);    // slot origen

    const src = await window.getPersonajeBySlot(slot);
    if (!src || !src.inventario) return;

    // Cargar posibles destinos (otros slots con personaje)
    const asignaciones = await new Promise((resolve) => {
      try {
        const tx = db.transaction('slots', 'readonly');
        const st = tx.objectStore('slots');
        const req = st.getAll();
        req.onsuccess = e => resolve(e.target.result || []);
        req.onerror = () => resolve([]);
      } catch (_) { resolve([]); }
    });

    const opciones = {};
    for (const a of asignaciones) {
      if (!a || a.slot === slot) continue;
      try {
        const p = await window.getPersonajeBySlot(a.slot);
        if (p) opciones[a.slot] = `${a.slot}: ${p.nombre || 'Sin nombre'}`;
      } catch (_) { }
    }
    if (Object.keys(opciones).length === 0) { alert('No hay otro slot con personaje para traspasar.'); return; }

    let destino = null;
    if (window.Swal?.fire) {
      const { value } = await Swal.fire({
        title: 'Traspasar a…',
        input: 'select',
        inputOptions: opciones,
        inputPlaceholder: 'Selecciona slot destino',
        showCancelButton: true,
        confirmButtonText: 'Traspasar'
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
    if (cat === 'obj') ok = move(src.inventario.objetos, dst.inventario.objetos);
    else if (cat === 'arm') ok = move(src.inventario.armaduras, dst.inventario.armaduras);
    else if (cat === 'arma') ok = move(src.inventario.armas, dst.inventario.armas);

    if (!ok) { alert('No se encontró el elemento.'); return; }

    await window.savePersonaje(src);
    await window.savePersonaje(dst);

    // Refresca preview de ambos slots
    if (typeof window.renderInventarioPreview === 'function') {
      window.renderInventarioPreview(slot);
      window.renderInventarioPreview(destino);
    }
  });

})(); // ← IIFE aislado (no contamina el popup)

/* ==== PATCH: Calcular y mostrar peso_actual del slot desde el inventario (append-only) ==== */
(function () {
  "use strict";

  // Si ya hay un renderInventarioPreview, lo envolvemos para no tocar su lógica.
  if (typeof window.renderInventarioPreview !== 'function') return;

  // Calcula el peso total del inventario de un personaje
  async function calcularPesoInventario(slot) {
    try {
      const pj = await window.getPersonajeBySlot(slot);
      if (!pj || !pj.inventario) return 0;

      const num = (v) => (isNaN(v) || v === null || v === undefined ? 0 : Number(v));

      const pObjs = (pj.inventario.objetos || []).reduce((acc, o) => {
        const cantidad = num(o?.cantidad) || 0;
        const pesoUnit = num(o?.peso);
        return acc + (cantidad * pesoUnit);
      }, 0);

      const pArmad = (pj.inventario.armaduras || []).reduce((acc, a) => acc + num(a?.peso), 0);
      const pArmas = (pj.inventario.armas || []).reduce((acc, w) => acc + num(w?.peso), 0);

      return pObjs + pArmad + pArmas;
    } catch (_) {
      return 0;
    }
  }

  const _renderInventarioPreview_original = window.renderInventarioPreview;
  window.renderInventarioPreview = async function (slot) {
    // 1) Render original del preview
    await _renderInventarioPreview_original(slot);

    // 2) Calcular y mostrar peso en el input del slot (campo "peso_actual{slot}")
    try {
      const total = await calcularPesoInventario(slot);
      const inputPesoActual = document.getElementById(`peso_actual${slot}`);
      if (inputPesoActual) {
        // Mostramos con máximo 2 decimales, sin cambiar nada más del slot
        const redondeado = Math.round(total * 100) / 100;
        inputPesoActual.value = redondeado;
      }
    } catch (err) {
      console.warn('No se pudo actualizar peso_actual del slot', err);
    }
  };

  // Extra: cuando se hace TRASPASAR en el preview, ya se relanza renderInventarioPreview(slot)
  // por el código existente, por lo que el peso del origen y del destino se actualizarán
  // automáticamente si sus inputs están presentes en el DOM.
})();
