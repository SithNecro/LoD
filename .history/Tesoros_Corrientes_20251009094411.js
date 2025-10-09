window.onload = function () {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Tesoros_Corrientes;
            const selector = document.getElementById('selector-tesoro-0');
            const selector2 = document.getElementById('selector-tesoro-1');
            const selector3 = document.getElementById('selector-tesoro-2');

            // Añadir opciones al selector
            tesoros.forEach(tesoro => {
                // Crear una opción para el primer selector
                let option1 = document.createElement('option');
                option1.value = tesoro;
                option1.text = tesoro.replace('.png', '').replace('_', ' '); // Opcionalmente formatear el texto
                selector.appendChild(option1);

                // Crear una opción para el segundo selector
                let option2 = document.createElement('option');
                option2.value = tesoro;
                option2.text = tesoro.replace('.png', '').replace('_', ' ');
                selector2.appendChild(option2);

                // Crear una opción para el tercer selector
                let option3 = document.createElement('option');
                option3.value = tesoro;
                option3.text = tesoro.replace('.png', '').replace('_', ' ');
                selector3.appendChild(option3);
            });
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));
}

// Función para cambiar la imagen cuando se selecciona un tesoro en el desplegable
function cambiarImagenSeleccionada() {
    const selector = document.getElementById('selector-tesoro-0');
    const imagen = document.getElementById('imagen-tesoro');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoros_Corrientes/${tesoroSeleccionado}`;
    //Limpiamos el Botín Encontrado
    const detalle2 = document.getElementById('enemigos-lista');
    detalle2.innerHTML = ``; // limpiar
    cargarStatsObjeto(tesoroSeleccionado);
    const nombreAudio = tesoroSeleccionado.replace(/\.png$/i, '.mp3');
    const audio = new Audio(`img/Tesoros_Corrientes/${nombreAudio}`);

    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
    }
    const btn_coger_tesoro = document.getElementById('btn_coger_tesoro');
    btn_coger_tesoro.style.visibility = "visible";
}

// Función para cargar una imagen aleatoria
// Función auxiliar para tirar dados tipo "1d10", "2d6-1", etc.
// Función auxiliar para tirar dados tipo "1d10", "2d6+1", "1d4-1" (ignora multiplicadores como "*3")
function tirarDado(expresion) {
  if (!expresion) return null;

  // Ignoramos cualquier multiplicador al final (p.ej. "1d6*3" -> "1d6")
  const core = String(expresion).split('*')[0].trim();

  // Soporta +N o -N opcional, con espacios
  const m = core.match(/^\s*(\d+)\s*d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i);
  if (!m) return null;

  const veces = parseInt(m[1], 10);
  const caras = parseInt(m[2], 10);
  let mod = 0;
  if (m[3]) mod = parseInt(m[3].replace(/\s+/g, ''), 10); // +1 o -1

  let total = 0;
  for (let i = 0; i < veces; i++) {
    total += Math.floor(Math.random() * caras) + 1;
  }
  return total + mod;
}


// Función para cargar una imagen aleatoria y mostrar sus datos
function cargarTesoroCorriente() {
    fetch('json/Listado_Cartas.json')
        .then(r => r.json())
        .then(data => {
            const tesoros = data.Tesoros_Corrientes;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Tesoros_Corrientes/${tesoroAleatorio}`;

            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-0');
            selector.value = tesoroAleatorio;

            // Mostrar contenedor adecuado
            document.getElementById('two-treasures-container').style.display = 'none';
            document.getElementById('single-treasure-container').style.display = 'flex';

            //Limpiamos el Botín Encontrado
            const detalle2 = document.getElementById('enemigos-lista');
            detalle2.innerHTML = ``; // limpiar
            cargarStatsObjeto(tesoroAleatorio);
            //Reproduccion audio
            const nombreAudio = tesoroAleatorio.replace(/\.png$/i, '.mp3');
            const audio = new Audio(`img/Tesoros_Corrientes//${nombreAudio}`);
            let ComprobarMute = localStorage.getItem('sonido')
            if (ComprobarMute == "on") {
                audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
            }
            const btn_coger_tesoro = document.getElementById('btn_coger_tesoro');
            btn_coger_tesoro.style.visibility = "visible";
        });
}

// Función para cargar la habilidad de buscatesoros, mostrando dos tesoros
function habilidadBuscatesoros() {
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Tesoros_Corrientes; // Cargar la lista de tesoros desde el JSON

            // Seleccionar dos tesoros aleatorios
            let tesoro1 = tesoros[Math.floor(Math.random() * tesoros.length)];
            let tesoro2;


            // Asegurar que los dos tesoros no sean iguales
            do {
                tesoro2 = tesoros[Math.floor(Math.random() * tesoros.length)];
            } while (tesoro1 === tesoro2);

            // Cambia la imagen de ambos tesoros
            document.getElementById('imagen-tesoro-1').src = `img/Tesoros_Corrientes/${tesoro1}`;
            document.getElementById('imagen-tesoro-2').src = `img/Tesoros_Corrientes/${tesoro2}`;
            //Selecciona en los desplegables los objetos
            const selector1 = document.getElementById('selector-tesoro-1');
            selector1.value = tesoro1;
            const selector2 = document.getElementById('selector-tesoro-2');
            selector2.value = tesoro2;


            // Muestra los dos tesoros y sus selectores
            document.getElementById('two-treasures-container').style.display = 'flex';
            document.getElementById('single-treasure-container').style.display = 'none';

            //Limpiamos el Botín Encontrado
            const detalle2 = document.getElementById('enemigos-lista');
            detalle2.innerHTML = ``; // limpiar
            cargarStatsObjeto(tesoro1);
            cargarStatsObjeto(tesoro2);
            reproducirAudiosSecuencial([
                tesoro1.replace(/\.png$/i, '.mp3'),
                "y_tambien.mp3",
                tesoro2.replace(/\.png$/i, '.mp3')

            ]);
            const btn_coger_tesoro = document.getElementById('btn_coger_tesoro');
            btn_coger_tesoro.style.visibility = "visible";
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));
}
function reproducirAudiosSecuencial(audios) {
    let i = 0;
    const basePath = "img/Tesoros_Corrientes/";

    function playNext() {
        if (i >= audios.length) return;
        const audio = new Audio(basePath + audios[i]);
        i++;
        let ComprobarMute = localStorage.getItem('sonido')
        if (ComprobarMute == "on") {
            audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
        }
        audio.addEventListener("ended", playNext);
    }

    playNext();
}

// Funciones para cambiar la imagen seleccionada en los selectores individuales
function cambiarImagenSeleccionadaTesoro1() {
    const selector = document.getElementById('selector-tesoro-1');
    const imagen = document.getElementById('imagen-tesoro-1');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoros_Corrientes/${tesoroSeleccionado}`; // Ajusta la ruta


    cargarStatsObjeto(tesoroSeleccionado);
}

function cambiarImagenSeleccionadaTesoro2() {
    const selector = document.getElementById('selector-tesoro-2');
    const imagen = document.getElementById('imagen-tesoro-2');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoros_Corrientes/${tesoroSeleccionado}`; // Ajusta la ruta
    cargarStatsObjeto(tesoroSeleccionado);
}



// Función para barajar y poner la imagen de trasera del tesoro
function barajarTesoros() {
    document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera tesoro corriente.png';
    document.getElementById('imagen-tesoro-1').src = 'img/traseras/Trasera tesoro corriente.png';
    document.getElementById('imagen-tesoro-2').src = 'img/traseras/Trasera tesoro corriente.png';
    document.getElementById('selector-tesoro-0').value = 0;
    document.getElementById('selector-tesoro-1').value = 0;
    document.getElementById('selector-tesoro-2').value = 0;
    const detalle2 = document.getElementById('enemigos-lista');
    detalle2.innerHTML = ``; // limpiar
    const btn_coger_tesoro = document.getElementById('btn_coger_tesoro');
    btn_coger_tesoro.style.visibility = "hidden";
}
// Función para bajar la moral
function BajarMoral(valor) {
    const iframe = document.getElementById('iframeMenu');
    iframe.contentWindow.postMessage({ tipo: 'cambiarMoral', valor }, '*');

    // --- AUDIO ---
    const nombreAudio = "pa_la_saca.mp3";
    const audio = new Audio(`img/Tesoros_Corrientes/${nombreAudio}`);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
    }

}

// Cargar stats y pintar detalles
function cargarStatsObjeto(tesoroSeleccionado) {
    fetch('json/stats_tesoros_corrientes.json')
        .then(r2 => r2.json())
        .then(stats => {
            const detalle2 = document.getElementById('enemigos-lista');
            //detalle2.innerHTML = ``; // limpiar
            const item = document.createElement('div');
            item.className = 'enemigo-item';
            //item.innerHTML = `<div>hola</div><div>hola</div><div>hola</div>`;
            let cantidadobjetosenlatirada = null; //Inicializar la variable para productos de cantidad variable

            const tesoro = stats.Tesoros_Corrientes.find(t => t.nombre === tesoroSeleccionado);
            if (!tesoro) {
                let html = '<div>No se encontró información de este tesoro.</div>';
                item.innerHTML = html;
                detalle2.appendChild(item);
                return;
            }

            // Nombre (sin .png)
            let html = `<div><p><strong>Botín:</strong> ${tesoro.nombre.replace(/\.png$/i, '')}</p></div>`;
            // Rotura
            if(tesoro.categoria)
            {
                const categoria =tesoro.categoria;
                html += `<div><p><strong>Categoria:</strong> ${categoria}</p></div>`;
            }
              if(tesoro.durabilidad)
            {
                const durabilidad =tesoro.durabilidad;
                html += `<div><p><strong>Durabilidad:</strong> ${durabilidad}</p></div>`;
            }
           
            if (tesoro.rotura) {
                const roturaRand = tirarDado(tesoro.rotura);
                //html += `<div><p><strong>Rotura del objeto:</strong> ${tesoro.rotura} (Resultado: ${roturaRand})</p></div>`;
                html += `<div><p><strong>Rotura del objeto:</strong> ${roturaRand}</p></div>`;

            }
   if(tesoro.Unidades)
            {
          

                  let ValorUnidades = tesoro.Unidades;

                // ¿es una tirada de dados tipo "3d100" o "3d100+40"?
                const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
                const match = regex.exec(tesoro.Unidades);

                if (match) {
                    const num = parseInt(match[1], 10);    // número de dados
                    const caras = parseInt(match[2], 10);  // caras
                    const mod = match[3] ? parseInt(match[3], 10) : 0; // modificador opcional

                    let total = 0;
                    let tiradas = [];
                    for (let i = 0; i < num; i++) {
                        const t = Math.floor(Math.random() * caras) + 1;
                        total += t;
                        tiradas.push(t);
                    }

                    const resultadoFinal = total + mod;
                    cantidadobjetosenlatirada = resultadoFinal;

                    ValorUnidades = `${tesoro.Unidades} → [${tiradas.join(", ")}] ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = <b style="color: yellow;"> ${resultadoFinal}</b>`;
                }

                html += `<div><p><strong>Unidades:</strong> ${ValorUnidades}</p></div>`;
            }
            // Valor
            if (tesoro.valor) {
                let valorTexto = tesoro.valor;

                // ¿es una tirada de dados tipo "3d100" o "3d100+40"?
                const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
                const match = regex.exec(tesoro.valor);

                if (match) {
                    const num = parseInt(match[1], 10);    // número de dados
                    const caras = parseInt(match[2], 10);  // caras
                    const mod = match[3] ? parseInt(match[3], 10) : 0; // modificador opcional

                    let total = 0;
                    let tiradas = [];
                    for (let i = 0; i < num; i++) {
                        const t = Math.floor(Math.random() * caras) + 1;
                        total += t;
                        tiradas.push(t);
                    }

                    const resultadoFinal = total + mod;
                    cantidadobjetosenlatirada = resultadoFinal;

                    valorTexto = `${tesoro.valor} → [${tiradas.join(", ")}] ${mod !== 0 ? (mod > 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`) : ""} = <b style="color: yellow;"> ${resultadoFinal}</b>`;
                }

                html += `<div><p><strong>Cantidad:</strong> ${valorTexto}</p></div>`;
            }

            // Selección y tabla
            if (tesoro.seleccion) {
                let dadoExpr = tesoro.seleccion;
                let repeticiones = 1;

                // detectar multiplicador, ej: 1d10*3
                const match = tesoro.seleccion.match(/^(.+?)\*(\d+)$/);
                if (match) {
                    dadoExpr = match[1];                // "1d10"
                    repeticiones = parseInt(cantidadobjetosenlatirada);  // 3
                }

                const resultados = [];

                for (let i = 0; i < repeticiones; i++) {
                    resultados.push(tirarDado(dadoExpr));
                }

                // Mostrar resultados de la selección
                if (dadoExpr !== "1d1") {
                    html += `<div><p><strong style="color: green;">Selección:</strong> ${tesoro.seleccion} (resultado: ${resultados.join(", ")})</p></div>`;
                }

                // Procesar cada resultado
                for (const selRand of resultados) {
                    const itemTabla = tesoro.tabla.find(e => e.tirada === selRand);
                    if (!itemTabla) continue;

                    html += '<div style="margin-left:1em">';
                    const leyendaTexto = itemTabla.Leyenda || null;

                    for (const [k, v] of Object.entries(itemTabla)) {
                        if (v !== null) {
                            if (k === "Unidades"){
                                 html += `<div><p><strong style="color: green;">${k}:</strong> 
                            <span class="efecto" data-tippy-content="<b>Unidades:</b><br>${k.Unidades}">${v}</span>
                        </p></div>`;
                            }
                            if (k === "tirada" || k === "Leyenda") continue;
                            if (k === "Efecto" && leyendaTexto) {
                                html += `<div><p><strong style="color: green;">${k}:</strong> 
                            <span class="efecto" data-tippy-content="<b>Leyenda de efectos:</b><br>${leyendaTexto}">${v}</span>
                        </p></div>`;
                            } else {
                                html += `<div><p><strong style="color: green;">${k}:</strong> ${v}</p></div>`;
                            }
                        }
                    }
                    html += '</div>';
                }
            }

            item.innerHTML = html;
            detalle2.appendChild(item);

            // Inicializar Tippy para todos los tooltips creados
            tippy('.efecto', {
                allowHTML: true,
                maxWidth: 400,
                theme: 'light-border',
                animation: 'scale'
            });
        });
    // tras insertar/enumerar los <div class="enemigo-item"> ... </div>
    if (typeof window.enhanceEnemyItems === 'function') window.enhanceEnemyItems();
}



// --- Utilidades de parseo DOM en enemigo-item ---
(function () {
    const getTextAfterStrong = (root, strongLabel) => {
        const el = [...root.querySelectorAll('p > strong')].find(s => s.textContent.trim().replace(':', '') === strongLabel);
        if (!el) return '';
        const p = el.parentElement;
        return (p ? p.textContent.replace(el.textContent, '').trim() : '').replace(/^[:\s]+/, '').trim();
    };
    const getGreenValue = (root, label) => {
        const el = [...root.querySelectorAll('p > strong[style]')].find(s => s.textContent.trim().replace(':', '') === label);
        if (!el) return '';
        const p = el.parentElement;
        return (p ? p.textContent.replace(el.textContent, '').trim() : '').replace(/^[:\s]+/, '').trim();
    };
    const parseIntSafe = (s, def = 0) => { const n = parseInt(String(s).replace(/[^\d-]/g, ''), 10); return isNaN(n) ? def : n; };
    const parseFloatSafe = (s, def = 0) => { const n = parseFloat(String(s).replace(/[^\d\.\-]/g, '')); return isNaN(n) ? def : n; };

    // expone helper
    window.__tc_helpers = { getTextAfterStrong, getGreenValue, parseIntSafe, parseFloatSafe };
})();


// --- Normaliza enemigo-item a {categoria,item} listo para inventario ---
// --- Normaliza enemigo-item a {categoria,item} listo para inventario ---
// --- Normaliza enemigo-item a {categoria,item} listo para inventario ---
window.tc_parseEnemyItem = function (itemEl) {
  const { getTextAfterStrong, getGreenValue, parseIntSafe, parseFloatSafe } = window.__tc_helpers;

  // 1) Campos del enemigo-item
  const botinRaw     = getTextAfterStrong(itemEl, 'Botín');             // p.ej. "Antorchas (3).png" (no usamos (3) como cantidad)
  const roturaTxt    = getTextAfterStrong(itemEl, 'Rotura del objeto'); // p.ej. "1"
  const categoriaTxt = getTextAfterStrong(itemEl, 'Categoria');         // "objeto" | "arma" | "armadura"
  const durabTxt     = getTextAfterStrong(itemEl, 'Durabilidad');       // número (armas/armaduras)
  const unidadesTxt  = getTextAfterStrong(itemEl, 'Unidades');          // NUEVO: número de unidades (solo objetos)
  const cantidadTxt  = getTextAfterStrong(itemEl, 'Cantidad');          // fallback si aún no hay "Unidades"

  // Zona “verde”
  const tipoTxt     = getGreenValue(itemEl, 'Tipo');
  const cobDefTxt   = getGreenValue(itemEl, 'Cobertura / Defensa');
  const pesoClsTxt  = getGreenValue(itemEl, 'Peso / Rango') || getGreenValue(itemEl, 'Peso / Clase');
  const valorTxt    = getGreenValue(itemEl, 'Valor');
  const danioTxt    = getGreenValue(itemEl, 'Daño');

  // Efecto/Leyenda (sin recortar)
  let efectoTxt = '';
  const efectoP = [...itemEl.querySelectorAll('p > strong[style]')].find(s => s.textContent.trim().startsWith('Efecto'));
  if (efectoP && efectoP.parentElement) {
    const cont = efectoP.parentElement;
    const tip = cont.querySelector('.efecto[data-tippy-content]');
    if (tip) {
      const html = tip.getAttribute('data-tippy-content') || '';
      const tmp = document.createElement('div'); tmp.innerHTML = html;
      efectoTxt = tmp.textContent.trim();
    } else {
      efectoTxt = cont.textContent.replace(efectoP.textContent,'').trim().replace(/^[:\s]+/,'').trim();
    }
  }

  // 2) Derivados
  // Nombre limpio (NO usamos "(x)" como cantidad)
  const nombreBase = botinRaw
    .replace(/\.png$/i, '')
    .replace(/\s*\(\d+\)\s*$/,'')
    .trim();

  // Cantidad: PRIORIDAD Unidades -> luego "Cantidad:" (último número) -> 1
  let cantidad = 1;
  if (unidadesTxt) {
    cantidad = parseIntSafe(unidadesTxt, 1);
  } else if (cantidadTxt) {
    const mLast = String(cantidadTxt).match(/(\d+)(?!.*\d)/);
    if (mLast) cantidad = parseIntSafe(mLast[1], 1);
  }

  const rotura      = parseIntSafe(roturaTxt, 0);
  const durabilidad = parseIntSafe(durabTxt, 0); // objetos = 0 por diseño

  // Peso / Clase (o Rango)
  let peso = 0, clase = '';
  if (pesoClsTxt) {
    const [pL, pR] = pesoClsTxt.split('/').map(s => s.trim());
    if (pL) peso = parseFloatSafe(pL, 0);
    if (pR) clase = pR; // C1..C7 o rango numérico
  }
  const valor = parseIntSafe(valorTxt, 0);

  // Cobertura / Defensa
  let cobertura = [];
  let defensa = 6; // defecto
  if (cobDefTxt) {
    const [cob, def] = cobDefTxt.split('/').map(s => s.trim());
    if (cob) cobertura = cob.split(',').map(s => s.trim()).filter(Boolean);
    if (def) defensa = parseIntSafe(def, defensa);
  }

  const nombreTipo = (tipoTxt || '').trim();

  // 3) Categoría
  let categoria = (categoriaTxt || '').toLowerCase();
  if (!categoria) {
    if (cobertura.length || defensa) categoria = 'armadura';
    else if (danioTxt)               categoria = 'arma';
    else                             categoria = 'objeto';
  }

  // 4) Construcción por categoría
  if (categoria === 'objeto') {
    return {
      categoria,
      item: {
        id: Date.now(),
        nombre: nombreBase,     // sin .png y sin "(x)"
        cantidad: cantidad,     // ← viene de "Unidades" o "Cantidad:"
        peso: peso || 0,
        uso: efectoTxt || '',
        valor: valor || 0,      // unitario
        durabilidad: 0,
        lugar: 'Mochila'
      }
    };
  }

  if (categoria === 'armadura') {
    const dura = durabilidad || 6;
    return {
      categoria,
      item: {
        id: Date.now(),
        equipado: false,
        armadura: nombreTipo || nombreBase,
        cobertura,
        defensa,
        especial: efectoTxt || '',
        durabilidad: dura,
        rotura: Math.min(rotura, dura),
        clase,
        peso: peso || 0,
        valor: valor || 0
      }
    };
  }

  // arma
  const duraA = durabilidad || 8;
  return {
    categoria: 'arma',
    item: {
      id: Date.now(),
      equipado: false,
      arma: nombreTipo || nombreBase,
      mano: 'Derecha',
      danio: (danioTxt || '').trim(),
      especial: efectoTxt || '',
      durabilidad: duraA,
      rotura: Math.min(rotura, duraA),
      clase,
      peso: peso || 0,
      valor: valor || 0
    }
  };
};

// === Acceso directo a IndexedDB: PersonajesDB ===
(function setupTcIDB(){
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('PersonajesDB');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('No se pudo abrir PersonajesDB'));
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
      req.onerror = () => { reject(req.error); db.close(); };
    });
  }

  async function getSlotRecordBySlot(slot) {
    const slots = await getAllSlots();
    return slots.find(s => (s && (s.slot === slot || s.slot === Number(slot))));
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
      req.onerror = () => { reject(req.error); db.close(); };
    });
  }

  async function getPersonajeBySlotDirect(slot) {
    const rec = await getSlotRecordBySlot(Number(slot));
    if (!rec || !rec.personajeId) return null;
    const pj = await getPersonajeById(rec.personajeId);
    return pj;
  }

  async function savePersonajeDirect(pj) {
    const db = await openDB();
    const storeName = hasStore(db,'personajes') ? 'personajes' : (hasStore(db,'heroes') ? 'heroes' : null);
    if (!storeName) { db.close(); throw new Error('No existe store "personajes" en la base de datos'); }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const st = tx.objectStore(storeName);
      let req;
      try {
        req = st.put(pj);
      } catch(e) {
        try { req = st.put(pj, pj && (pj.id || pj.personajeId)); }
        catch(e2) { db.close(); reject(e2); return; }
      }
      req.onsuccess = () => { resolve(true); db.close(); };
      req.onerror = () => { reject(req.error); db.close(); };
    });
  }

  // Exponer helpers
  window.__tc_idb = {
    openDB, getAllSlots, getSlotRecordBySlot, getPersonajeById, getPersonajeBySlotDirect, savePersonajeDirect, hasStore
  };
})();

// --- Añadir ítem al inventario del héroe seleccionado (acceso directo a IndexedDB) ---
window.tc_addItemToHero = async function (slot, categoria, item) {
  const pj = await window.__tc_idb.getPersonajeBySlotDirect(Number(slot));
  if (!pj) throw new Error('No se pudo cargar el héroe destino');
  if (!pj.inventario) pj.inventario = { objetos: [], armaduras: [], armas: [] };

  const key = categoria === 'objeto' ? 'objetos' : (categoria === 'armadura' ? 'armaduras' : 'armas');
  const arr = pj.inventario[key] || (pj.inventario[key] = []);

  // evitar colisión de id
  if (arr.some(x => x.id === item.id)) {
    let newId = Date.now();
    while (arr.some(x => x.id === newId)) newId++;
    item.id = newId;
  }

  // Unificar cantidades en OBJETOS si ya existe mismo nombre y peso/valor/uso iguales
  if (key === 'objetos') {
    const same = arr.find(x =>
      (x.nombre || '') === item.nombre &&
      (x.peso ?? 0) === (item.peso ?? 0) &&
      (x.valor ?? 0) === (item.valor ?? 0) &&
      (x.uso || '') === (item.uso || '')
    );
    if (same) {
      same.cantidad = (parseInt(same.cantidad || 0, 10) + parseInt(item.cantidad || 0, 10));
      await window.__tc_idb.savePersonajeDirect(pj);
      return pj;
    }
  }

  arr.push(item);
  await window.__tc_idb.savePersonajeDirect(pj);
  return pj;
};


// --- Mejora cada enemigo-item con Select de Héroe + Botón "Coger" ---
// --- Inserta Select de héroe + botón "Coger para Héroe" en cada .enemigo-item ---
window.enhanceEnemyItems = function (root=document) {
  const items = root.querySelectorAll('.enemigo-item');
  if (!items.length) return;

  // Cargamos héroes una sola vez por pasada
  (async () => {
    const heroes = await window.tc_loadHeroesDestino();

    items.forEach(itemEl => {
      if (itemEl.dataset.tcEnhanced) return; // ya está mejorado
      itemEl.dataset.tcEnhanced = '1';

      const ctrls = document.createElement('div');
      ctrls.className = 'tc-controls';
      ctrls.style.cssText = 'margin-top:8px; display:flex; align-items:center; gap:6px;';

      if (!heroes.length) {
        // Sin héroes disponibles: mostramos aviso en lugar de controles
        ctrls.innerHTML = `<div class="text-warning" style="font-size:.9rem;">No hay héroes disponibles en slots.</div>`;
        itemEl.appendChild(ctrls);
        return;
      }

      const selHtml = `
        <select class="form-select form-select-sm tc-hero-sel" title="Héroe destino" style="width:auto;display:inline-block;margin-right:6px;">
          ${heroes.map(h => `<option value="${h.slot}">Slot ${h.slot} — ${h.nombre}</option>`).join('')}
        </select>
      `;
      ctrls.innerHTML = `${selHtml}<button type="button" class="btn btn-sm btn-success tc-btn-coger">Coger para Héroe</button>`;
      itemEl.appendChild(ctrls);

      const btn = ctrls.querySelector('.tc-btn-coger');
      btn.addEventListener('click', async (ev) => {
        const sel = ctrls.querySelector('.tc-hero-sel');
        const slot = Number(sel && sel.value || 0);
        if (!slot) { Swal.fire('Selecciona un héroe','Debes elegir un destino','info'); return; }

        try {
          const parsed = window.tc_parseEnemyItem(itemEl);
          const pj = await window.tc_addItemToHero(slot, parsed.categoria, parsed.item);

          // Feedback + reemplazo de controles
          const msg = document.createElement('div');
          msg.className = 'text-success';
          msg.style.marginTop = '4px';
          msg.textContent = `Objeto añadido al inventario de ${pj?.nombre || ('Héroe ' + slot)}`;
          ctrls.replaceWith(msg);

          // refrescar slots si está abierto en otra pestaña
          if (window.refreshAllSlots) window.refreshAllSlots();
          if (typeof window.BajarMoral === 'function') window.BajarMoral(1);

        } catch (err) {
          console.error(err);
          Swal.fire('Error', String(err && err.message || err), 'error');
        }
      });
    });
  })();
};

// --- Héroes disponibles (slots con personaje) ---
// Acceso directo a IndexedDB (PersonajesDB), sin depender de otros scripts
window.tc_loadHeroesDestino = async function () {
  try {
    const slots = await window.__tc_idb.getAllSlots();
    const withHero = (slots || []).filter(a => a && a.personajeId);
    const opciones = [];
    for (const a of withHero) {
      let nombre = '';
      try {
        const pj = await window.__tc_idb.getPersonajeById(a.personajeId);
        nombre = pj && (pj.nombre || pj.name) || '';
      } catch(_) {}
      opciones.push({ slot: a.slot, nombre: nombre || ('Héroe ' + a.slot) });
    }
    opciones.sort((A,B)=>A.slot-B.slot);
    return opciones;
  } catch (e) {
    console.error('tc_loadHeroesDestino error:', e);
    return [];
  }
};

// --- Observa el DOM y mejora nuevos .enemigo-item al vuelo ---
(function bootEnhancerObserver() {
  const runEnhance = () => { try { window.enhanceEnemyItems(document); } catch(_) {} };

  // Primera pasada por si ya hay items en DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhance, { once: true });
  } else {
    runEnhance();
  }

  // Observa el body por nuevos .enemigo-item (tesoros aleatorios, select, buscatesoros, etc.)
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (!m.addedNodes) continue;
      for (const n of m.addedNodes) {
        if (!(n instanceof HTMLElement)) continue;
        if (n.matches && n.matches('.enemigo-item')) { runEnhance(); return; }
        if (n.querySelector && n.querySelector('.enemigo-item')) { runEnhance(); return; }
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
