window.onload = function () {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Objeto_Legendario;
            const selector = document.getElementById('selector-tesoro-0');


            // Añadir opciones al selector
            tesoros.forEach(tesoro => {
                // Crear una opción para el primer selector
                let option1 = document.createElement('option');
                option1.value = tesoro;
                option1.text = tesoro.replace('.png', '').replace('_', ' '); // Opcionalmente formatear el texto
                selector.appendChild(option1);

            });
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));
}

// Selección desde el desplegable
function cambiarImagenSeleccionada() {
  const selector = document.getElementById('selector-tesoro-0');
  const imagen = document.getElementById('imagen-tesoro');
  const tesoroSeleccionado = selector.value;
  imagen.src = `img/Objeto_Legendario/${tesoroSeleccionado}`;

  // Audio opcional
  let urlaudio = `${tesoroSeleccionado}`.replace(".png", ".mp3");
  const audio = new Audio(`img/Objeto_Legendario/${urlaudio}`);
  if (localStorage.getItem('sonido') === "on") {
    audio.play().catch(()=>{});
  }

  // Render del bloque con select + botón
  renderLegendarioDetalle(tesoroSeleccionado);
}

// Revelado aleatorio
function cargarTesoroLegendario() {
  fetch('json/Listado_Cartas.json')
    .then(r => r.json())
    .then(data => {
      const tesoros = data.Objeto_Legendario;
      const randomIndex = Math.floor(Math.random() * tesoros.length);
      const tesoroAleatorio = tesoros[randomIndex];

      const imagen = document.getElementById('imagen-tesoro');
      imagen.src = `img/Objeto_Legendario/${tesoroAleatorio}`;

      const selector = document.getElementById('selector-tesoro-0');
      selector.value = tesoroAleatorio;

      document.getElementById('single-treasure-container').style.display = 'flex';

      let urlaudio = `${tesoroAleatorio}`.replace(".png", ".mp3");
      const audio = new Audio(`img/Objeto_Legendario/${urlaudio}`);
      if (localStorage.getItem('sonido') === "on") {
        audio.play().catch(()=>{});
      }

      // Render del bloque con select + botón
      renderLegendarioDetalle(tesoroAleatorio);
    });
}



// Función para barajar y poner la imagen de trasera del tesoro
function barajarTesoros() {
    document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera legendarios.png';
}

/* =================== IndexedDB (PersonajesDB) helpers =================== */
/* =================== IndexedDB (PersonajesDB) helpers =================== */
(function setupLegendIDB(){
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('PersonajesDB');
      req.onsuccess = () => resolve(req.result);
      req.onerror  = () => reject(req.error || new Error('No se pudo abrir PersonajesDB'));
    });
  }
  function hasStore(db, name) {
    try { return db.objectStoreNames && db.objectStoreNames.contains(name); } catch(_) { return false; }
  }
  async function getAllSlots() {
    const db = await openDB();
    if (!hasStore(db, 'slots')) { db.close(); return []; }
    return new Promise((resolve, reject) => {
      const tx = db.transaction('slots', 'readonly');
      const st = tx.objectStore('slots');
      const req = st.getAll();
      req.onsuccess = e => { resolve(e.target.result || []); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }
  async function getPersonajeById(personajeId) {
    const db = await openDB();
    const storeName = hasStore(db,'personajes') ? 'personajes' : (hasStore(db,'heroes') ? 'heroes' : null);
    if (!storeName) { db.close(); return null; }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const st = tx.objectStore(storeName);
      let req;
      try { req = st.get(personajeId); } catch(e) { db.close(); resolve(null); return; }
      req.onsuccess = e => { resolve(e.target.result || null); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }
  async function getPersonajeBySlotDirect(slot) {
    const slots = await getAllSlots();
    const rec = (slots || []).find(s => s && (s.slot === slot || s.slot === Number(slot)));
    if (!rec || !rec.personajeId) return null;
    return await getPersonajeById(rec.personajeId);
  }
  async function savePersonajeDirect(pj) {
    const db = await openDB();
    const storeName = hasStore(db,'personajes') ? 'personajes' : (hasStore(db,'heroes') ? 'heroes' : null);
    if (!storeName) { db.close(); throw new Error('No existe store "personajes" en la base de datos'); }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const st = tx.objectStore(storeName);
      let req;
      try { req = st.put(pj); }
      catch(e) {
        try { req = st.put(pj, pj && (pj.id || pj.personajeId)); }
        catch(e2) { db.close(); reject(e2); return; }
      }
      req.onsuccess = () => { resolve(true); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }

  // Héroes disponibles en slots
  async function loadHeroesDestino() {
    const slots = await getAllSlots();
    const withHero = (slots || []).filter(a => a && a.personajeId);
    const opciones = [];
    for (const a of withHero) {
      let nombre = '';
      try {
        const pj = await getPersonajeById(a.personajeId);
        nombre = pj && (pj.nombre || pj.name) || '';
      } catch(_) {}
      opciones.push({ slot: a.slot, nombre: nombre || ('Héroe ' + a.slot) });
    }
    opciones.sort((A,B)=>A.slot-B.slot);
    return opciones;
  }

  // Guardar OBJETO (unifica cantidad si mismo nombre/uso/peso/valor)
  async function addObjetoToHero(slot, objeto) {
    const pj = await getPersonajeBySlotDirect(Number(slot));
    if (!pj) throw new Error('No se pudo cargar el héroe destino');
    if (!pj.inventario) pj.inventario = { objetos: [], armaduras: [], armas: [] };
    const arr = pj.inventario.objetos || (pj.inventario.objetos = []);

    const same = arr.find(x =>
      (x.nombre || '') === objeto.nombre &&
      (x.uso || '')    === (objeto.uso || '') &&
      (x.peso ?? 0)    === (objeto.peso ?? 0) &&
      (x.valor ?? 0)   === (objeto.valor ?? 0)
    );
    if (same) {
      same.cantidad = (parseInt(same.cantidad || 0, 10) + parseInt(objeto.cantidad || 0, 10));
    } else {
      let id = objeto.id || Date.now();
      while (arr.some(x => x.id === id)) id++;
      objeto.id = id;
      arr.push(objeto);
    }
    await savePersonajeDirect(pj);
    return pj;
  }

  // Exponer helpers
  window.__legend_idb = { loadHeroesDestino, addObjetoToHero };
})();

/* =============== Render detalle y controles ================== */
/* =================== IndexedDB (PersonajesDB) helpers =================== */
(function setupLegendIDB(){
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('PersonajesDB');
      req.onsuccess = () => resolve(req.result);
      req.onerror  = () => reject(req.error || new Error('No se pudo abrir PersonajesDB'));
    });
  }
  function hasStore(db, name) {
    try { return db.objectStoreNames && db.objectStoreNames.contains(name); } catch(_) { return false; }
  }
  async function getAllSlots() {
    const db = await openDB();
    if (!hasStore(db, 'slots')) { db.close(); return []; }
    return new Promise((resolve, reject) => {
      const tx = db.transaction('slots', 'readonly');
      const st = tx.objectStore('slots');
      const req = st.getAll();
      req.onsuccess = e => { resolve(e.target.result || []); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }
  async function getPersonajeById(personajeId) {
    const db = await openDB();
    const storeName = hasStore(db,'personajes') ? 'personajes' : (hasStore(db,'heroes') ? 'heroes' : null);
    if (!storeName) { db.close(); return null; }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const st = tx.objectStore(storeName);
      let req;
      try { req = st.get(personajeId); } catch(e) { db.close(); resolve(null); return; }
      req.onsuccess = e => { resolve(e.target.result || null); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }
  async function getPersonajeBySlotDirect(slot) {
    const slots = await getAllSlots();
    const rec = (slots || []).find(s => s && (s.slot === slot || s.slot === Number(slot)));
    if (!rec || !rec.personajeId) return null;
    return await getPersonajeById(rec.personajeId);
  }
  async function savePersonajeDirect(pj) {
    const db = await openDB();
    const storeName = hasStore(db,'personajes') ? 'personajes' : (hasStore(db,'heroes') ? 'heroes' : null);
    if (!storeName) { db.close(); throw new Error('No existe store "personajes" en la base de datos'); }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const st = tx.objectStore(storeName);
      let req;
      try { req = st.put(pj); }
      catch(e) {
        try { req = st.put(pj, pj && (pj.id || pj.personajeId)); }
        catch(e2) { db.close(); reject(e2); return; }
      }
      req.onsuccess = () => { resolve(true); db.close(); };
      req.onerror  = () => { reject(req.error); db.close(); };
    });
  }

  // Héroes disponibles en slots
  async function loadHeroesDestino() {
    const slots = await getAllSlots();
    const withHero = (slots || []).filter(a => a && a.personajeId);
    const opciones = [];
    for (const a of withHero) {
      let nombre = '';
      try {
        const pj = await getPersonajeById(a.personajeId);
        nombre = pj && (pj.nombre || pj.name) || '';
      } catch(_) {}
      opciones.push({ slot: a.slot, nombre: nombre || ('Héroe ' + a.slot) });
    }
    opciones.sort((A,B)=>A.slot-B.slot);
    return opciones;
  }

  // Guardar OBJETO (unifica cantidad si mismo nombre/uso/peso/valor)
  async function addObjetoToHero(slot, objeto) {
    const pj = await getPersonajeBySlotDirect(Number(slot));
    if (!pj) throw new Error('No se pudo cargar el héroe destino');
    if (!pj.inventario) pj.inventario = { objetos: [], armaduras: [], armas: [] };
    const arr = pj.inventario.objetos || (pj.inventario.objetos = []);

    const same = arr.find(x =>
      (x.nombre || '') === objeto.nombre &&
      (x.uso || '')    === (objeto.uso || '') &&
      (x.peso ?? 0)    === (objeto.peso ?? 0) &&
      (x.valor ?? 0)   === (objeto.valor ?? 0)
    );
    if (same) {
      same.cantidad = (parseInt(same.cantidad || 0, 10) + parseInt(objeto.cantidad || 0, 10));
    } else {
      let id = objeto.id || Date.now();
      while (arr.some(x => x.id === id)) id++;
      objeto.id = id;
      arr.push(objeto);
    }
    await savePersonajeDirect(pj);
    return pj;
  }

  // Exponer helpers
  window.__legend_idb = { loadHeroesDestino, addObjetoToHero };
})();

/* =============== Render detalle y controles ================== */
async function renderLegendarioDetalle(filenamePng) {
  const detalle = document.getElementById('enemigos-lista');
  if (!detalle) return;
  detalle.innerHTML = '';

  // 1) Efecto desde tu JSON de legendarios
  let efecto = '';
  try {
    const resp = await fetch('json/stats_tesoros_legendarios.json');
    const data = await resp.json();
    const found = (data.Tesoros_Legendarios || []).find(x => x.nombre === filenamePng);
    efecto = found ? (found.Efecto || '') : '';
  } catch (e) {
    console.error('No se pudo cargar stats_tesoros_legendarios.json', e);
  }

  const nombreLimpio = String(filenamePng).replace(/\.png$/i,'').trim();

  // 2) Bloque del item
  const item = document.createElement('div');
  item.className = 'enemigo-item';
  item.innerHTML = `
    <div><p><strong>Botín:</strong> ${nombreLimpio}</p></div>
    <div><p><strong>Categoria:</strong> objeto</p></div>
    <div><p><strong>Efecto:</strong> ${efecto}</p></div>
  `;

  // 3) Select de héroes + botón
  const heroes = await window.__legend_idb.loadHeroesDestino().catch(() => []);
  const ctrls = document.createElement('div');
  ctrls.style.cssText = 'margin-top:8px; display:flex; align-items:center; gap:6px;';

  if (heroes.length === 0) {
    ctrls.innerHTML = `<div class="text-warning" style="font-size:.9rem;">No hay héroes disponibles en slots.</div>`;
  } else {
    const sel = document.createElement('select');
    sel.className = 'form-select form-select-sm';
    sel.style.cssText = 'width:auto;display:inline-block;margin-right:6px;  background-repeat:no-repeat; background-position:right 10px center; background-size:20px; padding-right:35px; appearance:none;';
    for (const h of heroes) {
      const opt = document.createElement('option');
      opt.value = h.slot;
      opt.textContent = `Slot ${h.slot} — ${h.nombre}`;
      sel.appendChild(opt);
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-success';
    btn.textContent = 'Coger para Héroe';

    btn.addEventListener('click', async () => {
      const slot = Number(sel.value || 0);
      if (!slot) return;

      try {
        const obj = {
          id: Date.now(),
          nombre: nombreLimpio, // nombre del legendario (sin .png)
          cantidad: 1,
          peso: 0,
          uso: efecto || '',     // guardamos el Efecto como "uso"
          valor: 0,
          durabilidad: 0,
          lugar: 'Mochila'
        };
        const pj = await window.__legend_idb.addObjetoToHero(slot, obj);

        const msg = document.createElement('div');
        msg.className = 'text-success';
        msg.style.marginTop = '4px';
        msg.textContent = `Objeto añadido al inventario de ${pj?.nombre || ('Héroe ' + slot)}`;
        ctrls.replaceWith(msg);

        if (window.refreshAllSlots) window.refreshAllSlots();
      } catch (err) {
        console.error(err);
        alert('Error guardando el objeto: ' + (err && err.message || err));
      }
    });

    ctrls.appendChild(sel);
    ctrls.appendChild(btn);
  }

  item.appendChild(ctrls);
  detalle.appendChild(item);
}