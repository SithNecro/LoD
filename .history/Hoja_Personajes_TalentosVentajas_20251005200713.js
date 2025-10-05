/* ============================================================
 * Hoja_Personajes_TalentosVentajas.js
 * (Append-only, no cambios a popup/HTML/CSS existentes)
 * ============================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => (s==null ? '' : String(s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])));

  let _tvCache = null;
  async function cargarTVJSON() {
    if (_tvCache) return _tvCache;
    const resp = await fetch('json/Personajes_talentos_ventajas.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('No se pudo cargar Personajes_talentos_ventajas.json');
    const data = await resp.json();
    _tvCache = data;
    return data;
  }

  function ensureTV(personaje) {
    if (!personaje.talentosVentajas) personaje.talentosVentajas = { talentos: [], ventajas: [] };
    if (!Array.isArray(personaje.talentosVentajas.talentos)) personaje.talentosVentajas.talentos = [];
    if (!Array.isArray(personaje.talentosVentajas.ventajas)) personaje.talentosVentajas.ventajas = [];
  }

  function tieneAprendido(personaje, tipoGrupo, tipo, nombre) {
    ensureTV(personaje);
    const arr = tipoGrupo === 'Talento' ? personaje.talentosVentajas.talentos : personaje.talentosVentajas.ventajas;
    return arr.some(x => (x?.nombre||'').toLowerCase() === (nombre||'').toLowerCase() && (x?.tipo||'') === tipo);
  }
  function aprender(personaje, tipoGrupo, tipo, nombre, efecto) {
    ensureTV(personaje);
    const arr = tipoGrupo === 'Talento' ? personaje.talentosVentajas.talentos : personaje.talentosVentajas.ventajas;
    if (!tieneAprendido(personaje, tipoGrupo, tipo, nombre)) {
      arr.push({ tipo, nombre, efecto });
    }
  }
  function olvidar(personaje, tipoGrupo, tipo, nombre) {
    ensureTV(personaje);
    const arr = tipoGrupo === 'Talento' ? personaje.talentosVentajas.talentos : personaje.talentosVentajas.ventajas;
    const idx = arr.findIndex(x => (x?.nombre||'').toLowerCase() === (nombre||'').toLowerCase() && (x?.tipo||'') === tipo);
    if (idx >= 0) arr.splice(idx, 1);
  }

  function obtenerTipos(data, grupo) {
    const pref = grupo === 'Talento' ? 'Talentos' : 'Ventajas';
    return Object.keys(data).filter(k => k.startsWith(pref)).sort((a,b) => a.localeCompare(b, 'es', {sensitivity:'base'}));
  }

  window.renderTalentosVentajasPreview = async function(slot) {
    try {
      const cont = document.getElementById(`talentos-slot${slot}`);
      if (!cont) return;

      const parent = cont.parentElement;
      if (parent && !parent.querySelector('.tv-add-btn')) {
        const row = document.createElement('div');
        row.className = 'd-flex align-items-center justify-content-between mb-2';
        row.innerHTML = `
          <button type="button" class="btn btn-sm btn-primary tv-add-btn" data-slot="${slot}">Añadir Habilidad</button>
        `;
        parent.insertBefore(row, cont);
      }

      const pj = await window.getPersonajeBySlot(slot);
      if (!pj) { cont.innerHTML = '<em>Sin datos de héroe</em>'; return; }
      ensureTV(pj);

      const seccion = (titulo, items) => `
        <h6 class="mt-2 mb-1">${titulo}</h6>
        ${items.length === 0 ? '<div class="TextosTalentos">— Ninguno —</div>' : items.map(it => `
          <div class="border rounded p-2 mb-2">
            <div class="TextosTalentos"><strong>${esc(it.tipo)}: ${esc(it.nombre)}</strong></div>
            <div class="TextosTalentos">${it.efecto || ''}</div>
          </div>
        `).join('')}
      `;

      const html = seccion('🧠 Talentos', pj.talentosVentajas.talentos)
                + seccion('🏅 Ventajas', pj.talentosVentajas.ventajas);

      cont.innerHTML = html;
    } catch (err) {
      console.error('renderTalentosVentajasPreview error', err);
    }
  };

  window.openTalentosVentajasPopup = async function(slot) {
    if (!window.Swal) { alert('Falta SweetAlert2'); return; }

    const data = await cargarTVJSON();
    const pj = await window.getPersonajeBySlot(slot);
    if (!pj) { alert('No hay personaje en este slot'); return; }
    ensureTV(pj);

    const html = `
      <div id="tvRoot" class="hero-card p-2" style="max-height:${Math.min(window.innerHeight-80, 700)}px;overflow:auto;">
        <div class="row g-2 mb-2">
          <div class="col-12 col-md-3">
            <label class="form-label">Categoría</label>
            <select id="tvGrupo" class="form-select">
              <option value="">— Selecciona —</option>
              <option value="Talento">Talento</option>
              <option value="Ventaja">Ventaja</option>
            </select>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Tipo</label>
            <select id="tvTipo" class="form-select" disabled>
              <option value="">— Selecciona un tipo —</option>
            </select>
          </div>
          <div class="col-12 col-md-3 d-flex align-items-end justify-content-end">
            <button id="tvClose" class="btn btn-sm btn-outline-danger">Cerrar</button>
          </div>
        </div>

        <div id="tvTabla" class="table-responsive"></div>
      </div>
    `;

    await Swal.fire({
      width: Math.min(1100, window.innerWidth - 40),
      html,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: { popup: 'sai-popup', title: 'sai-title', htmlContainer: 'sai-body' },
      didOpen: () => {
        const elGrupo = $('#tvGrupo');
        const elTipo  = $('#tvTipo');
        const tabla   = $('#tvTabla');
        $('#tvClose').addEventListener('click', () => Swal.close());

        function pintarTipos() {
          const grupo = elGrupo.value;
          const tipos = grupo ? obtenerTipos(data, grupo) : [];
          elTipo.innerHTML = `<option value="">— Selecciona un tipo —</option>`
            + tipos.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
          elTipo.disabled = tipos.length === 0;
          tabla.innerHTML = '';
        }

        function renderTabla() {
          const grupo = elGrupo.value;
          const tipo  = elTipo.value;
          if (!grupo || !tipo) { tabla.innerHTML = ''; return; }

          const listado = (data[tipo] || []).slice().sort((a,b) => (a.Nombre||'').localeCompare(b.Nombre||'', 'es', {sensitivity:'base'}));

          const rows = listado.map(item => {
            const aprendido = tieneAprendido(pj, grupo, tipo, item.Nombre);
            const btn = aprendido
              ? `<button class="btn btn-sm btn-warning tv-olvidar" data-nombre="${esc(item.Nombre)}">Olvidar</button>`
              : `<button class="btn btn-sm btn-success tv-aprender" data-nombre="${esc(item.Nombre)}" data-efecto="${esc(item.Efecto||'')}">Aprender</button>`;
            return `
              <tr>
                <td style="min-width:220px;"><strong>${esc(item.Nombre)}</strong></td>
                <td class="small">${item.Efecto || ''}</td>
                <td style="width:120px" class="text-center">${btn}</td>
              </tr>`;
          }).join('');

          tabla.innerHTML = `
            <table class="table table-sm table-dark table-striped align-middle">
              <thead>
                <tr><th>Nombre</th><th>Efecto</th><th class="text-center">Acción</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>`;
        }

        elGrupo.addEventListener('change', pintarTipos);
        elTipo .addEventListener('change', renderTabla);

        tabla.addEventListener('click', async (ev) => {
          const btnA = ev.target.closest('.tv-aprender');
          const btnO = ev.target.closest('.tv-olvidar');
          const grupo = elGrupo.value;
          const tipo  = elTipo.value;
          if (!grupo || !tipo) return;

          if (btnA) {
            const nombre = btnA.dataset.nombre;
            const efecto = btnA.dataset.efecto || '';
            aprender(pj, grupo, tipo, nombre, efecto);
            await window.savePersonaje(pj);
            renderTabla();
            window.renderTalentosVentajasPreview(slot);
          } else if (btnO) {
            const nombre = btnO.dataset.nombre;
            olvidar(pj, grupo, tipo, nombre);
            await window.savePersonaje(pj);
            renderTabla();
            window.renderTalentosVentajasPreview(slot);
          }
        });
      }
    });
  };

  // ⭐ Hook al voltear a Talentos
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.flip-to');
    if (!btn || btn.dataset.section !== 'talentos') return;
    const card = btn.closest('.flip-card');
    if (!card) return;
    const slot = parseInt(card.id.replace('slot',''), 10);
    if (!Number.isInteger(slot)) return;
    setTimeout(() => window.renderTalentosVentajasPreview(slot), 0);
  });

  // Delegación: Añadir Habilidad
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tv-add-btn');
    if (!btn) return;
    const slot = Number(btn.dataset.slot);
    if (!Number.isInteger(slot)) return;
    e.preventDefault();
    window.openTalentosVentajasPopup(slot);
  });

})();
