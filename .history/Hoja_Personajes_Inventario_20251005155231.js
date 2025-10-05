// ===================== INVENTARIO (MANTENIENDO API) =====================
// Objetivo: restaurar botón "Abrir Inventario" (error renderInventarioLists),
// añadir preview bajo el botón y mantener nombres públicos:
//   - window.getPersonajeBySlot(slot)
//   - window.savePersonaje(p)
//   - window.openInventarioEditor(slot)
//   - window.renderInventarioLists(personaje)   (PARA EL MODAL)
//   - window.renderInventarioPreview(slot)      (PARA EL SLOT)
// No tocamos nada fuera de este archivo. Estilo y dependencias intactas.

// -------- Utils comunes --------
(function () {
  "use strict";

  const $id = (id) => document.getElementById(id);

  // Escapar HTML simple
  const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])));

  // ID sencillo
  const newId = () => Date.now() + Math.floor(Math.random() * 100000);

  // ------- IndexedDB helpers esperados por el resto del código -------
  // (Se asume que existe window.db inicializado en otro módulo)

  // Obtener personaje por slot
  window.getPersonajeBySlot = async function (slot) {
    const personajeId = await new Promise((resolve, reject) => {
      const tx = db.transaction("slots", "readonly");
      const st = tx.objectStore("slots");
      const req = st.get(slot);
      req.onsuccess = (e) => resolve(e.target.result?.personajeId ?? null);
      req.onerror   = () => reject(req.error);
    });
    if (!personajeId) return null;

    return await new Promise((resolve, reject) => {
      const tx = db.transaction("personajes", "readonly");
      const st = tx.objectStore("personajes");
      const req = st.get(personajeId);
      req.onsuccess = (e) => resolve(e.target.result || null);
      req.onerror   = () => reject(req.error);
    });
  };

  // Guardar personaje
  window.savePersonaje = function (p) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction("personajes", "readwrite");
      const st = tx.objectStore("personajes");
      const req = st.put(p);
      req.onsuccess = () => { if (typeof window.mostrarPersonajes === "function") window.mostrarPersonajes(); resolve(); };
      req.onerror   = () => reject(req.error);
    });
  };

  // ================== EDITOR (MODAL) ==================
  window.openInventarioEditor = async function (slot) {
    try {
      if (!window.Swal) { alert("Falta SweetAlert2 (Swal)."); return; }
      const personaje = await window.getPersonajeBySlot(slot);
      if (!personaje) { alert("No hay personaje en este slot."); return; }
      if (!personaje.inventario) personaje.inventario = { objetos: [], armaduras: [], armas: [] };

      const modalHeight = Math.min(window.innerHeight - 20, 800);
      const html = `
        <div id="invRoot" style="max-height:${modalHeight - 90}px; overflow:auto;">
          <div class="d-flex align-items-center justify-content-between mb-2" style="position:sticky;top:0;z-index:5;padding:6px 0;background:var(--bs-body-bg,#0f1215);">
            <div><strong>Inventario de:</strong> ${esc(personaje.nombre || ('Héroe '+slot))}</div>
            <button id="invCloseX" class="btn btn-sm btn-outline-danger" title="Cerrar">✖</button>
          </div>

          <div class="border rounded p-2 mb-3 hero-card">
            <div class="row g-2 align-items-end">
              <div class="col-12 col-md-3">
                <label class="form-label">Tipo</label>
                <select id="invTipo" class="form-select">
                  <option value="">--Selecciona Tipo--</option>
                  <option value="obj">Objeto</option>
                  <option value="arm">Armadura</option>
                  <option value="arma">Arma</option>
                </select>
              </div>

              <!-- ===== OBJETO ===== -->
              <div id="grpObj" class="col-12" style="display:none;">
                <div class="row g-2">
                  <div class="col-12 col-md-3">
                    <label class="form-label">Nombre</label>
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

              <!-- ===== ARMADURA ===== -->
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
                      <button id="armCobDel" class="btn btn-outline-secondary" type="button">−</button>
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

              <!-- ===== ARMA ===== -->
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

          <!-- Listas del editor -->
          <div class="row">
            <div class="col-12 col-xl-4">
              <h6>🧰 Objetos</h6>
              <table class="table table-sm table-dark table-striped">
                <thead>
                  <tr><th>Nombre</th><th>Lugar</th><th>Cant.</th><th>Peso</th><th>Durab.</th><th>Valor</th><th></th><th></th></tr>
                </thead>
                <tbody id="listObjetos"></tbody>
              </table>
            </div>
            <div class="col-12 col-xl-4">
              <h6>🛡️ Armaduras</h6>
              <table class="table table-sm table-dark table-striped">
                <thead>
                  <tr><th>Equip.</th><th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Durab.</th><th>Peso</th><th>Valor</th><th></th><th></th></tr>
                </thead>
                <tbody id="listArmaduras"></tbody>
              </table>
            </div>
            <div class="col-12 col-xl-4">
              <h6>⚔️ Armas</h6>
              <table class="table table-sm table-dark table-striped">
                <thead>
                  <tr><th>Equip.</th><th>Arma</th><th>Mano</th><th>Daño</th><th>Durab.</th><th>Peso</th><th>Valor</th><th></th><th></th></tr>
                </thead>
                <tbody id="listArmas"></tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      await Swal.fire({
        html,
        width: Math.min(1200, window.innerWidth - 10),
        padding: "8px",
        background: "#0f1215",
        color: "#e5e7eb",
        showConfirmButton: false,
        showCloseButton: false,
        customClass: { popup: 'sai-popup' }
      });

      // Cierre
      const closeBtn = $id('invCloseX');
      if (closeBtn) closeBtn.addEventListener('click', () => Swal.close());

      // Mostrar grupos por tipo
      const tipoSel = $id('invTipo');
      const grpObj  = $id('grpObj');
      const grpArm  = $id('grpArm');
      const grpArma = $id('grpArma');
      const hideAll = () => { grpObj.style.display='none'; grpArm.style.display='none'; grpArma.style.display='none'; };
      tipoSel?.addEventListener('change', () => {
        hideAll();
        if (tipoSel.value === 'obj') grpObj.style.display = '';
        else if (tipoSel.value === 'arm') grpArm.style.display = '';
        else if (tipoSel.value === 'arma') grpArma.style.display = '';
      });

      // Coberturas armadura
      const cobSel = $id('armCobSel');
      const cobListDiv = $id('armCobList');
      $id('armCobAdd')?.addEventListener('click', () => {
        const cur = (cobListDiv.textContent || '').split(',').map(s=>s.trim()).filter(Boolean);
        const v = cobSel.value;
        if (v && !cur.includes(v)) cur.push(v);
        cobListDiv.textContent = cur.join(', ');
      });
      $id('armCobDel')?.addEventListener('click', () => {
        const cur = (cobListDiv.textContent || '').split(',').map(s=>s.trim()).filter(Boolean);
        const v = cobSel.value;
        const idx = cur.indexOf(v);
        if (idx >= 0) cur.splice(idx, 1);
        cobListDiv.textContent = cur.join(', ');
      });

      // Añadir objeto
      $id('objAdd')?.addEventListener('click', async () => {
        const it = {
          id: newId(),
          nombre: $id('objNombre').value || '',
          lugar: $id('objLugar').value || '',
          cantidad: parseInt($id('objCantidad').value || '0', 10),
          peso: parseFloat($id('objPeso').value || '0'),
          uso: $id('objUso').value || '',
          durabilidad: parseInt($id('objDurabilidad').value || '0', 10),
          valor: parseInt($id('objValor').value || '0', 10)
        };
        personaje.inventario.objetos.push(it);
        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
        window.renderInventarioPreview(slot);
      });

      // Añadir armadura
      $id('armAdd')?.addEventListener('click', async () => {
        const coberturaStr = ($id('armCobList').textContent || '').trim();
        const it = {
          id: newId(),
          equipado: !!$id('armEquipado').checked,
          armadura: $id('armNombre').value || '',
          cobertura: coberturaStr ? coberturaStr.split(',').map(s=>s.trim()).filter(Boolean) : [],
          defensa: parseInt($id('armDefensa').value || '0', 10),
          durabilidad: parseInt($id('armDurabilidad').value || '0', 10),
          especial: $id('armEspecial').value || '',
          peso: parseFloat($id('armPeso').value || '0'),
          valor: parseInt($id('armValor').value || '0', 10)
        };
        personaje.inventario.armaduras.push(it);
        await window.savePersonaje(personaje);
        window.renderInventarioLists(personaje);
        window.renderInventarioPreview(slot);
      });

      // Añadir arma
      $id('armaAdd')?.addEventListener('click', async () => {
        const it = {
          id: newId(),
          equipado: !!$id('armaEquipado').checked,
          arma: $id('armaNombre').value || '',
          mano: $id('armaMano').value || '',
          danio: $id('armaDanio').value || '',
          durabilidad: parseInt($id('armaDurabilidad').value || '0', 10),
          especial: $id('armaEspecial').value || '',
          peso: parseFloat($id('armaPeso').value || '0'),
          valor: parseInt($id('armaValor').value || '0', 10)
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
        window.renderInventarioPreview(slot);
      });

      // Delegación: editar/eliminar/traspasar/equipar dentro del modal
      document.addEventListener('input', async (ev) => {
        const row = ev.target.closest('[data-itemid]');
        if (!row) return;
        const id = Number(row.dataset.itemid);
        const name = ev.target.name;

        const update = (arr, fields) => {
          const idx = arr.findIndex(x => x.id === id);
          if (idx < 0) return false;
          let v = ev.target.type === 'number' ? (ev.target.step && ev.target.step !== "1" ? parseFloat(ev.target.value || '0') : parseInt(ev.target.value || '0', 10)) : ev.target.value;
          if (!fields.includes(name)) return false;
          arr[idx][name] = v;
          return true;
        };

        if (update(personaje.inventario.objetos, ['nombre','lugar','cantidad','peso','durabilidad','uso','valor'])
          || update(personaje.inventario.armaduras, ['armadura','defensa','durabilidad','especial','peso','valor'])
          || update(personaje.inventario.armas, ['arma','mano','danio','durabilidad','especial','peso','valor'])) {
          await window.savePersonaje(personaje);
        }
      });

      document.addEventListener('change', async (ev) => {
        const row = ev.target.closest('[data-itemid]');
        if (!row) return;
        const id = Number(row.dataset.itemid);
        if (ev.target.name !== 'equipado') return;

        // Armaduras
        let item = personaje.inventario.armaduras.find(x => x.id === id);
        if (item) {
          item.equipado = ev.target.checked;
          await window.savePersonaje(personaje);
          window.renderInventarioPreview(slot);
          return;
        }
        // Armas
        item = personaje.inventario.armas.find(x => x.id === id);
        if (item) {
          if (!ev.target.checked) {
            item.equipado = false;
          } else {
            if (item.mano === 'Izquierda') {
              personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Izquierda' || a.mano === 'Dos Manos')) a.equipado = false; });
            } else if (item.mano === 'Derecha') {
              personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado && (a.mano === 'Derecha' || a.mano === 'Dos Manos')) a.equipado = false; });
            } else {
              personaje.inventario.armas.forEach(a => { if (a.id !== item.id && a.equipado) a.equipado = false; });
            }
            item.equipado = true;
          }
          await window.savePersonaje(personaje);
          window.renderInventarioLists(personaje);
          window.renderInventarioPreview(slot);
        }
      });

      document.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('[data-action]');
        if (!btn) return;
        const row = btn.closest('[data-itemid]');
        if (!row) return;
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
            window.renderInventarioPreview(slot);
          }
          return;
        }

        if (action === 'traspasar') {
          // Construir lista de slots destino
          const asigs = await new Promise((resolve) => {
            const tx = db.transaction('slots','readonly');
            const st = tx.objectStore('slots');
            const req = st.getAll();
            req.onsuccess = e => resolve(e.target.result || []);
            req.onerror = () => resolve([]);
          });
          const opciones = {};
          for (const a of asigs) {
            if (a.slot === slot) continue;
            try {
              const p = await window.getPersonajeBySlot(a.slot);
              if (p) opciones[a.slot] = `${a.slot}: ${p.nombre || 'Sin nombre'}`;
            } catch(_) {}
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
            arrSrc.splice(i,1);
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
            window.renderInventarioPreview(slot);
            window.renderInventarioPreview(destino);
          }
        }
      });

      // Primer render
      window.renderInventarioLists(personaje);

      // Tooltips en modal (tippy opcional)
      setTimeout(() => {
        if (window.tippy) {
          tippy('#listObjetos [data-tip], #listArmaduras [data-tip], #listArmas [data-tip]', { allowHTML: true, theme: 'light-border' });
        }
      }, 0);
    } catch (err) {
      console.error('openInventarioEditor error:', err);
      alert('Error abriendo inventario: ' + (err?.message || err));
    }
  };

  // ====== Render de tablas dentro del MODAL ======
  window.renderInventarioLists = function (personaje) {
    try {
      const mkOpts = (n, sel) => {
        let out = '';
        for (let i = 0; i <= n; i++) {
          out += `<option value="${i}" ${i === sel ? 'selected' : ''}>${i}</option>`;
        }
        return out;
      };

      // Orden ligero por nombre
      const byStr = (get) => (a,b) => {
        const A = (get(a)||'').toString().trim().toLowerCase();
        const B = (get(b)||'').toString().trim().toLowerCase();
        return A.localeCompare(B, 'es', { sensitivity: 'base' });
      };

      const objetosOrden = [...(personaje.inventario.objetos || [])].sort(byStr(x=>x.nombre));
      const armadurasOrd = [...(personaje.inventario.armaduras || [])].sort(byStr(x=>x.armadura));
      const armasOrd     = [...(personaje.inventario.armas || [])].sort(byStr(x=>x.arma));

      const objHtml = objetosOrden.map(o => `
        <tr data-itemid="${o.id}">
          <td><input class="form-control form-control-sm" name="nombre" value="${esc(o.nombre || '')}"></td>
          <td>
            <select class="form-select form-select-sm" name="lugar">
              ${['','Mochila','Atajo 1','Atajo 2','Atajo 3','Atajo 4','Atajo 5','Atajo 6','Atajo 7'].map(l => `<option value="${l}" ${o.lugar===l?'selected':''}>${l || '--Lugar--'}</option>`).join('')}
            </select>
          </td>
          <td><input class="form-control form-control-sm" name="cantidad" type="number" min="0" value="${o.cantidad ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="peso" type="number" step="0.1" min="0" value="${o.peso ?? 0}"></td>
          <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, o.durabilidad ?? 0)}</select></td>
          <td><input class="form-control form-control-sm" name="valor" type="number" min="0" value="${o.valor ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="uso" value="${esc(o.uso || '')}" data-tip="${esc(o.uso || '')}"></td>
          <td>
            <button class="btn btn-sm btn-danger"   data-action="eliminar">🗑️</button>
            <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
          </td>
        </tr>
      `).join('');

      const armHtml = armadurasOrd.map(a => `
        <tr data-itemid="${a.id}">
          <td><input type="checkbox" name="equipado" ${a.equipado ? 'checked':''}></td>
          <td><input class="form-control form-control-sm" name="armadura" value="${esc(a.armadura || '')}" data-tip="${esc(a.especial || '')}"></td>
          <td><input class="form-control form-control-sm" name="cobertura" value="${esc(Array.isArray(a.cobertura)? a.cobertura.join(', '): (a.cobertura||''))}"></td>
          <td><input class="form-control form-control-sm" name="defensa" type="number" min="0" value="${a.defensa ?? 0}"></td>
          <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, a.durabilidad ?? 0)}</select></td>
          <td><input class="form-control form-control-sm" name="peso" type="number" step="0.1" min="0" value="${a.peso ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="valor" type="number" min="0" value="${a.valor ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="especial" value="${esc(a.especial || '')}"></td>
          <td>
            <button class="btn btn-sm btn-danger"   data-action="eliminar">🗑️</button>
            <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
          </td>
        </tr>
      `).join('');

      const armasHtml = armasOrd.map(w => `
        <tr data-itemid="${w.id}">
          <td><input type="checkbox" name="equipado" ${w.equipado ? 'checked':''}></td>
          <td><input class="form-control form-control-sm" name="arma" value="${esc(w.arma || '')}" data-tip="${esc(w.especial || '')}"></td>
          <td>
            <select class="form-select form-select-sm" name="mano">
              ${['Izquierda','Derecha','Dos Manos'].map(m => `<option value="${m}" ${w.mano===m?'selected':''}>${m}</option>`).join('')}
            </select>
          </td>
          <td><input class="form-control form-control-sm" name="danio" value="${esc(w.danio || '')}"></td>
          <td><select class="form-select form-select-sm" name="durabilidad">${mkOpts(11, w.durabilidad ?? 0)}</select></td>
          <td><input class="form-control form-control-sm" name="peso" type="number" step="0.1" min="0" value="${w.peso ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="valor" type="number" min="0" value="${w.valor ?? 0}"></td>
          <td><input class="form-control form-control-sm" name="especial" value="${esc(w.especial || '')}"></td>
          <td>
            <button class="btn btn-sm btn-danger"   data-action="eliminar">🗑️</button>
            <button class="btn btn-sm btn-secondary" data-action="traspasar">⇄</button>
          </td>
        </tr>
      `).join('');

      const setHTML = (id, html) => { const el = $id(id); if (el) el.innerHTML = html; };
      setHTML('listObjetos', objHtml);
      setHTML('listArmaduras', armHtml);
      setHTML('listArmas', armasHtml);
    } catch (err) {
      console.error('renderInventarioLists error:', err);
    }
  };

  // ====== PREVIEW EN SLOT (debajo del botón "Abrir Inventario") ======
  window.renderInventarioPreview = async function (slot) {
    try {
      const container = $id(`mochila-slot${slot}`);
      if (!container) return;
      const p = await window.getPersonajeBySlot(slot);
      if (!p || !p.inventario) { container.innerHTML = '<em>Sin inventario</em>'; return; }

      const objs  = Array.isArray(p.inventario.objetos)   ? p.inventario.objetos : [];
      const arms  = Array.isArray(p.inventario.armaduras) ? p.inventario.armaduras : [];
      const armas = Array.isArray(p.inventario.armas)     ? p.inventario.armas : [];

      const tblObjs = `
        <h6 class="mt-2 mb-1">🧰 Objetos</h6>
        <table class="table table-sm table-dark table-striped">
          <thead><tr><th>Nombre</th><th>Cant.</th><th>Peso</th><th></th></tr></thead>
          <tbody>
            ${objs.map(o => `
              <tr data-itemid="${o.id}">
                <td><span class="t-obj" data-tippy-content="${esc(o.uso||'')}">${esc(o.nombre||'')}</span></td>
                <td>${esc(o.cantidad ?? 0)}</td>
                <td>${esc(o.peso ?? '')}</td>
                <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="obj" data-id="${o.id||''}" data-slot="${slot}">Traspasar</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

      const tblArmad = `
        <h6 class="mt-2 mb-1">🛡️ Armaduras</h6>
        <table class="table table-sm table-dark table-striped">
          <thead><tr><th>Equip.</th><th>Armadura</th><th>Cobertura</th><th>Defensa</th><th>Durab.</th><th>Peso</th><th></th></tr></thead>
          <tbody>
            ${arms.map(a => `
              <tr data-itemid="${a.id}">
                <td><input type="checkbox" disabled ${a.equipado ? 'checked' : ''}></td>
                <td><span class="t-arm" data-tippy-content="${esc(a.especial||'')}">${esc(a.armadura||'')}</span></td>
                <td>${esc(Array.isArray(a.cobertura)? a.cobertura.join(', '):(a.cobertura||''))}</td>
                <td>${esc(a.defensa ?? '')}</td>
                <td>${esc(a.durabilidad ?? '')}</td>
                <td>${esc(a.peso ?? '')}</td>
                <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="arm" data-id="${a.id||''}" data-slot="${slot}">Traspasar</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

      const tblArmas = `
        <h6 class="mt-2 mb-1">⚔️ Armas</h6>
        <table class="table table-sm table-dark table-striped">
          <thead><tr><th>Equip.</th><th>Arma</th><th>Mano</th><th>Daño</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            ${armas.map(w => `
              <tr data-itemid="${w.id}">
                <td><input type="checkbox" disabled ${w.equipado ? 'checked' : ''}></td>
                <td><span class="t-arma" data-tippy-content="${esc(w.especial||'')}">${esc(w.arma||'')}</span></td>
                <td>${esc(w.mano || '')}</td>
                <td>${esc(w.danio || '')}</td>
                <td>${esc(w.valor ?? 0)}</td>
                <td class="text-end"><button class="btn btn-sm btn-outline-warning slot-traspasar" data-cat="arma" data-id="${w.id||''}" data-slot="${slot}">Traspasar</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

      container.innerHTML = tblObjs + tblArmad + tblArmas;

      if (window.tippy) {
        tippy(container.querySelectorAll('.t-obj,.t-arm,.t-arma'), { allowHTML:true, theme:'light-border' });
      }
    } catch (err) {
      console.error('renderInventarioPreview error:', err);
    }
  };

  // Delegación: botón "Traspasar" en el preview del slot
  document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.slot-traspasar');
    if (!btn) return;
    ev.preventDefault();

    const cat  = btn.dataset.cat;
    const id   = Number(btn.dataset.id);
    const slot = Number(btn.dataset.slot);

    const src = await window.getPersonajeBySlot(slot);
    if (!src || !src.inventario) return;

    // Destinos
    const asign = await new Promise((resolve) => {
      const tx = db.transaction('slots','readonly');
      const st = tx.objectStore('slots');
      const req = st.getAll();
      req.onsuccess = e => resolve(e.target.result || []);
      req.onerror = () => resolve([]);
    });

    const opts = {};
    for (const a of asign) {
      if (a.slot === slot) continue;
      const p = await window.getPersonajeBySlot(a.slot);
      if (p) opts[a.slot] = `${a.slot}: ${p.nombre || 'Sin nombre'}`;
    }
    if (Object.keys(opts).length === 0) { alert('No hay otro slot con personaje.'); return; }

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

    window.renderInventarioPreview(slot);
    window.renderInventarioPreview(destino);
  });

  // Hook: abrir modal desde botón "Abrir Inventario"
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.inv-edit-btn');
    if (!b) return;
    const slot = parseInt(b.dataset.slot, 10);
    if (Number.isInteger(slot)) {
      e.preventDefault();
      window.openInventarioEditor(slot);
    }
  });

  // Hook: al entrar en sección "mochila" (botón 🎒) pintar el preview
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.flip-to');
    if (!btn || btn.dataset.section !== 'mochila') return;
    const card = btn.closest('.flip-card');
    if (!card) return;
    const slot = parseInt(card.id.replace('slot',''), 10);
    if (!Number.isInteger(slot)) return;
    setTimeout(() => window.renderInventarioPreview(slot), 0);
  });

})(); // IIFE
