window.onload = function () {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Tesoro_Maravilloso;
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
    imagen.src = `img/Tesoro_MAravilloso/${tesoroSeleccionado}`;
    //Limpiamos el Botín Encontrado
    const detalle2 = document.getElementById('enemigos-lista');
    detalle2.innerHTML = ``; // limpiar
    cargarStatsObjeto(tesoroSeleccionado);
    const nombreAudio = tesoroSeleccionado.replace(/\.png$/i, '.mp3');
    const audio = new Audio(`img/Tesoro_MAravilloso/${nombreAudio}`);

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
function cargarTesoroSuperior() {
    fetch('json/Listado_Cartas.json')
        .then(r => r.json())
        .then(data => {
            const tesoros = data.Tesoro_Maravilloso;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Tesoro_Maravilloso/${tesoroAleatorio}`;

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
            const audio = new Audio(`img/Tesoro_Maravilloso//${nombreAudio}`);
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
            const tesoros = data.Tesoro_Maravilloso; // Cargar la lista de tesoros desde el JSON

            // Seleccionar dos tesoros aleatorios
            let tesoro1 = tesoros[Math.floor(Math.random() * tesoros.length)];
            let tesoro2;


            // Asegurar que los dos tesoros no sean iguales
            do {
                tesoro2 = tesoros[Math.floor(Math.random() * tesoros.length)];
            } while (tesoro1 === tesoro2);

            // Cambia la imagen de ambos tesoros
            document.getElementById('imagen-tesoro-1').src = `img/Tesoro_Maravilloso/${tesoro1}`;
            document.getElementById('imagen-tesoro-2').src = `img/Tesoro_Maravilloso/${tesoro2}`;
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
    const basePath = "img/Tesoro_Maravilloso/";

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
    imagen.src = `img/Tesoro_Maravilloso/${tesoroSeleccionado}`; // Ajusta la ruta


    cargarStatsObjeto(tesoroSeleccionado);
}

function cambiarImagenSeleccionadaTesoro2() {
    const selector = document.getElementById('selector-tesoro-2');
    const imagen = document.getElementById('imagen-tesoro-2');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoro_Maravilloso/${tesoroSeleccionado}`; // Ajusta la ruta
    cargarStatsObjeto(tesoroSeleccionado);
}



// Función para barajar y poner la imagen de trasera del tesoro
function barajarTesoros() {
    document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera tesoro maravilloso.png';
    document.getElementById('imagen-tesoro-1').src = 'img/traseras/Trasera tesoro maravilloso.png';
    document.getElementById('imagen-tesoro-2').src = 'img/traseras/Trasera tesoro maravilloso.png';
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
    const audio = new Audio(`img/Tesoro_Maravilloso/${nombreAudio}`);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
    }

}

// Cargar stats y pintar detalles
function cargarStatsObjeto(tesoroSeleccionado) {
    fetch('json/stats_Tesoros_Maravillosos.json')
        .then(r2 => r2.json())
        .then(stats => {
            const detalle2 = document.getElementById('enemigos-lista');
            //detalle2.innerHTML = ``; // limpiar
            const item = document.createElement('div');
            item.className = 'enemigo-item';
            //item.innerHTML = `<div>hola</div><div>hola</div><div>hola</div>`;
            let cantidadobjetosenlatirada = null; //Inicializar la variable para productos de cantidad variable

            const tesoro = stats.Tesoro_Maravilloso.find(t => t.nombre === tesoroSeleccionado);
            if (!tesoro) {
                let html = '<div>No se encontró información de este tesoro.</div>';
                item.innerHTML = html;
                detalle2.appendChild(item);
                return;
            }

            // Nombre (sin .png)
            let html = `<div><p><strong>Botín:</strong> ${tesoro.nombre.replace(/\.png$/i, '')}</p></div>`;
            // Rotura
            if (tesoro.categoria) {
                const categoria = tesoro.categoria;
                html += `<div><p><strong>Categoria:</strong> ${categoria}</p></div>`;
            }
            if (tesoro.durabilidad) {
                const durabilidad = tesoro.durabilidad;
                html += `<div><p><strong>Durabilidad:</strong> ${durabilidad}</p></div>`;
            }

            if (tesoro.rotura) {
                const roturaRand = tirarDado(tesoro.rotura);
                //html += `<div><p><strong>Rotura del objeto:</strong> ${tesoro.rotura} (Resultado: ${roturaRand})</p></div>`;
                html += `<div><p><strong>Rotura del objeto:</strong> ${roturaRand}</p></div>`;

            }
            if (tesoro.Unidades) {


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

                    ValorUnidades = `${resultadoFinal}`;
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
// --- Normaliza enemigo-item a {categoria,item} o {categoria,items:[]} listo para inventario ---
window.tc_parseEnemyItem = function (itemEl) {
    const { getTextAfterStrong, parseIntSafe, parseFloatSafe } = window.__tc_helpers;

    // 1) Campos genéricos
    const botinRaw = getTextAfterStrong(itemEl, 'Botín');             // "Pergaminos"...
    const roturaTxt = getTextAfterStrong(itemEl, 'Rotura del objeto'); // p.ej. "1"
    const categoriaTxt = getTextAfterStrong(itemEl, 'Categoria');         // "objeto" | "arma" | "armadura"
    const durabTxt = getTextAfterStrong(itemEl, 'Durabilidad');       // armas/armaduras
    const cantidadTxt = getTextAfterStrong(itemEl, 'Cantidad');          // fallback objetos (si no hay "Unidades")
    const UnidadesTxt = getTextAfterStrong(itemEl, 'Unidades');
    const seleccionTxt = (() => {
        // busca el bloque "Selección:" en verde y toma su texto completo de esa línea
        const el = [...itemEl.querySelectorAll('p > strong[style]')].find(s => s.textContent.trim().replace(':', '') === 'Selección');
        if (!el || !el.parentElement) return '';
        return el.parentElement.textContent.replace(el.textContent, '').trim().replace(/^[:\s]+/, '').trim();
    })();

    const nombreBase = botinRaw
        .replace(/\.png$/i, '')
        .replace(/\s*\(\d+\)\s*$/, '')
        .trim();

    const rotura = parseIntSafe(roturaTxt, 0);
    const durabilidad = parseIntSafe(durabTxt, 0); // objetos = 0

    // Peso/Clase global (si existiese en el item; en muchos objetos no aparece)
    const pesoClsTxtGlobal = (() => {
        const s = [...itemEl.querySelectorAll('p > strong[style]')].find(x => {
            const t = x.textContent.trim().replace(':', '');
            return t === 'Peso / Rango' || t === 'Peso / Clase';
        });
        if (!s || !s.parentElement) return '';
        return s.parentElement.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
    })();
    let pesoGlobal = 0, claseGlobal = '';
    if (pesoClsTxtGlobal) {
        const [pL, pR] = pesoClsTxtGlobal.split('/').map(s => s.trim());
        if (pL) pesoGlobal = parseFloatSafe(pL, 0);
        if (pR) claseGlobal = pR;
    }

    // Valor global (si existiese)
    const valorTxtGlobal = (() => {
        const s = [...itemEl.querySelectorAll('p > strong[style]')].find(x => x.textContent.trim().replace(':', '') === 'Valor');
        if (!s || !s.parentElement) return '';
        return s.parentElement.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
    })();
    const valorGlobal = parseIntSafe(valorTxtGlobal, 0);
  let nombreElegido = nombreBase;
        const tipoStrongNodes = [...itemEl.querySelectorAll('p > strong[style]')].filter(s => s.textContent.trim().replace(':', '') === 'Tipo');

        if (tipoStrongNodes.length === 1 && seleccionTxt) {
            const tipoP = tipoStrongNodes[0].parentElement;
            const tipoDiv = tipoP ? tipoP.parentElement : null;
            const tipoTexto = tipoDiv ? tipoP.textContent.replace(tipoStrongNodes[0].textContent, '').trim().replace(/^[:\s]+/, '').trim() : '';
            if (tipoTexto) nombreElegido = tipoTexto;
        }
    // 3) Categoría
    let categoria = (categoriaTxt || '').toLowerCase();
    if (!categoria) {
        // heurística de respaldo
        const hasCobDef = !![...itemEl.querySelectorAll('p > strong[style]')].find(x => x.textContent.trim().startsWith('Cobertura'));
        const hasDanio = !![...itemEl.querySelectorAll('p > strong[style]')].find(x => x.textContent.trim().replace(':', '') === 'Daño');
        if (hasCobDef) categoria = 'armadura';
        else if (hasDanio) categoria = 'arma';
        else categoria = 'objeto';
    }

    // ===== Caso ARMADURA / ARMA (igual que antes) =====
    if (categoria === 'armadura' || categoria === 'arma') {
        // Efecto/Leyenda (de un solo bloque)
        let efectoTxt = '';
        const efectoP = [...itemEl.querySelectorAll('p > strong[style]')]
            .find(s => s.textContent.trim().startsWith('Efecto'));
        if (efectoP && efectoP.parentElement) {
            const cont = efectoP.parentElement;
            const tip = cont.querySelector('.efecto[data-tippy-content]');
            if (tip) {
                const visible = tip.textContent.trim();
                const html = tip.getAttribute('data-tippy-content') || '';
                const tmp = document.createElement('div'); tmp.innerHTML = html;
                const tooltip = tmp.textContent.trim();
                efectoTxt = `${visible}<br>${tooltip}`;
            } else {
                efectoTxt = cont.textContent.replace(efectoP.textContent, '').trim().replace(/^[:\s]+/, '').trim();
            }
        }
      
        if (categoria === 'armadura') {
            // Cobertura / Defensa
            const cobDefTxt = (() => {
                const s = [...itemEl.querySelectorAll('p > strong[style]')].find(x => x.textContent.trim().replace(':', '') === 'Cobertura / Defensa');
                if (!s || !s.parentElement) return '';
                return s.parentElement.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
            })();
            let cobertura = [], defensa = 6;
            if (cobDefTxt) {
                const [cob, def] = cobDefTxt.split('/').map(s => s.trim());
                if (cob) cobertura = cob.split(',').map(s => s.trim()).filter(Boolean);
                if (def) defensa = parseIntSafe(def, defensa);
            }

            const dura = durabilidad || 6;
            return {
                categoria,
                item: {
                    id: Date.now(),
                    equipado: false,
                    armadura: nombreElegido,           // o 'Tipo' si existiera, pero en armaduras ya suele venir único
                    cobertura,
                    defensa,
                    especial: efectoTxt || '',
                    durabilidad: dura,
                    rotura: Math.min(rotura, dura),
                    clase: claseGlobal,
                    peso: pesoGlobal || 0,
                    valor: valorGlobal || 0
                }
            };
        } else {
            // arma
            const danioTxt = (() => {
                const s = [...itemEl.querySelectorAll('p > strong[style]')].find(x => x.textContent.trim().replace(':', '') === 'Daño');
                if (!s || !s.parentElement) return '';
                return s.parentElement.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
            })();
            const duraA = durabilidad || 8;
            return {
                categoria: 'arma',
                item: {
                    id: Date.now(),
                    equipado: false,
                    arma: nombreElegido, // si hay 'Tipo' único podrías usarlo, pero normalmente es un arma específica
                    mano: 'Derecha',
                    danio: (danioTxt || '').trim(),
                    especial: efectoTxt || '',
                    durabilidad: duraA,
                    rotura: Math.min(rotura, duraA),
                    clase: claseGlobal,
                    peso: pesoGlobal || 0,
                    valor: valorGlobal || 0
                }
            };
        }
    }

    // ===== Caso OBJETO =====
    // Puede haber 1 bloque (sin selección o selección 1d1) o MÚLTIPLES bloques "Tipo/VH/Valor/Efecto/Unidades"
    // Detectamos todos los "Tipo:" en verde y para cada uno recogemos sus datos siguientes hasta el siguiente "Tipo:".

    // Helper para leer texto visible + tooltip (si lo hay) de un DIV que contiene Efecto
    function readEfectoFromDiv(divNode) {
        if (!divNode) return '';
        const s = divNode.querySelector('p > strong[style]');
        if (!s || !s.textContent.trim().startsWith('Efecto')) return '';
        const cont = s.parentElement;
        const tip = cont.querySelector('.efecto[data-tippy-content]');
        if (tip) {
            const visible = tip.textContent.trim();
            const html = tip.getAttribute('data-tippy-content') || '';
            const tmp = document.createElement('div'); tmp.innerHTML = html;
            const tooltip = tmp.textContent.trim();
            return `${visible}<br>${tooltip}`;
        } else {
            return cont.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
        }
    }

    // Si no hay múltiples "Tipo:" (0 o 1), devolvemos un solo objeto como antes
    if (tipoStrongNodes.length <= 1) {
        // nombre: si existe bloque Selección (≠1d1), usar Tipo; si no, nombreBase
        let nombreElegido = nombreBase;
        if (tipoStrongNodes.length === 1 && seleccionTxt) {
            const tipoP = tipoStrongNodes[0].parentElement;
            const tipoDiv = tipoP ? tipoP.parentElement : null;
            const tipoTexto = tipoDiv ? tipoP.textContent.replace(tipoStrongNodes[0].textContent, '').trim().replace(/^[:\s]+/, '').trim() : '';
            if (tipoTexto) nombreElegido = tipoTexto;
        }

        // cantidad: Unidades si está en el bloque, si no, "Cantidad:" (último número), si no, 1
        let unidades = 0, efectoTxt = '';
        if (tipoStrongNodes.length === 1) {
            // buscamos desde ese div hacia delante hasta el siguiente Tipo (que no existe), cogemos Unidades/Efecto locales
            const startDiv = tipoStrongNodes[0].parentElement?.parentElement;
            let n = startDiv?.nextElementSibling;
            while (n) {
                const s = n.querySelector('p > strong[style]');
                if (!s) { n = n.nextElementSibling; continue; }
                const label = s.textContent.trim().replace(':', '');
                if (label === 'Tipo') break;
                if (label === 'Unidades') {
                    const txt = n.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
                    unidades = parseIntSafe(txt, 0);
                }
                if (label.startsWith('Efecto')) {
                    efectoTxt = readEfectoFromDiv(n);
                }
                n = n.nextElementSibling;
            }
        }
        if (!unidades) {
            if (cantidadTxt) {
                const mLast = String(cantidadTxt).match(/(\d+)(?!.*\d)/);
                if (mLast) unidades = parseIntSafe(mLast[1], 1);
            }
            if (!unidades) {
                if (UnidadesTxt) {
                    const mLast = String(UnidadesTxt).match(/(\d+)(?!.*\d)/);
                    if (mLast) unidades = parseIntSafe(mLast[1], 1);
                }
            } else { unidades = 1; }
        }

        return {
            categoria: 'objeto',
            item: {
                id: Date.now(),
                nombre: nombreElegido,
                cantidad: unidades,
                peso: pesoGlobal || 0,
                uso: efectoTxt || '',
                valor: valorGlobal || 0,
                durabilidad: 0,
                lugar: 'Mochila'
            }
        };
    }

    // === MÚLTIPLES TIPOS (p.ej. Pergaminos con "Selección: 1d54*3")
    const items = [];
    for (let i = 0; i < tipoStrongNodes.length; i++) {
        const sTipo = tipoStrongNodes[i];
        const tipoP = sTipo.parentElement;
        const tipoDiv = tipoP ? tipoP.parentElement : null;
        const nombreTipo = tipoDiv ? tipoP.textContent.replace(sTipo.textContent, '').trim().replace(/^[:\s]+/, '').trim() : nombreBase;

        // Recorremos hermanos siguientes hasta el siguiente "Tipo"
        let unidades = 1, efectoTxtLocal = '', valorLocal = valorGlobal, pesoLocal = pesoGlobal, claseLocal = '';

        let n = tipoDiv?.nextElementSibling;
        while (n) {
            const s = n.querySelector('p > strong[style]');
            if (!s) { n = n.nextElementSibling; continue; }
            const label = s.textContent.trim().replace(':', '');
            if (label === 'Tipo') break; // siguiente bloque

            if (label === 'Unidades') {
                const txt = n.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
                unidades = parseIntSafe(txt, 1);
            } else if (label === 'Valor') {
                const txt = n.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
                valorLocal = parseIntSafe(txt, valorLocal);
            } else if (label.startsWith('Efecto')) {
                efectoTxtLocal = readEfectoFromDiv(n);
            } else if (label === 'Peso / Rango' || label === 'Peso / Clase') {
                const txt = n.textContent.replace(s.textContent, '').trim().replace(/^[:\s]+/, '').trim();
                const [pL, pR] = txt.split('/').map(ss => ss.trim());
                if (pL) pesoLocal = parseFloatSafe(pL, pesoLocal);
                if (pR) claseLocal = pR;
            }
            n = n.nextElementSibling;
        }

        items.push({
            id: Date.now() + i,           // evitar colisión
            nombre: nombreTipo,
            cantidad: unidades,
            peso: pesoLocal || 0,
            uso: efectoTxtLocal || '',
            valor: valorLocal || 0,
            durabilidad: 0,
            lugar: 'Mochila'
        });
    }

    return { categoria: 'objeto', items };
};

// === Acceso directo a IndexedDB: PersonajesDB ===
(function setupTcIDB() {
    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('PersonajesDB');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || new Error('No se pudo abrir PersonajesDB'));
        });
    }

    function hasStore(db, name) {
        try { return db.objectStoreNames && db.objectStoreNames.contains(name); } catch (_) { return false; }
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
        const storeName = hasStore(db, 'personajes') ? 'personajes' : (hasStore(db, 'heroes') ? 'heroes' : null);
        if (!storeName) { db.close(); return null; }
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const st = tx.objectStore(storeName);
            let req;
            try { req = st.get(personajeId); } catch (e) { db.close(); resolve(null); return; }
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
        const storeName = hasStore(db, 'personajes') ? 'personajes' : (hasStore(db, 'heroes') ? 'heroes' : null);
        if (!storeName) { db.close(); throw new Error('No existe store "personajes" en la base de datos'); }
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const st = tx.objectStore(storeName);
            let req;
            try {
                req = st.put(pj);
            } catch (e) {
                try { req = st.put(pj, pj && (pj.id || pj.personajeId)); }
                catch (e2) { db.close(); reject(e2); return; }
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
// --- Inserta Select de héroe + botón "Coger para Héroe" en cada .enemigo-item ---
window.enhanceEnemyItems = function (root = document) {
    const items = root.querySelectorAll('.enemigo-item');
    if (!items.length) return;

    (async () => {
        const heroes = await window.tc_loadHeroesDestino();
        const hayHeroes = Array.isArray(heroes) && heroes.length > 0;

        // 🔹 Si hay héroes → ocultamos el botón global (solo los locales visibles)
        // 🔹 Si no hay héroes → mostramos el botón global y no insertamos botones individuales
        const btnGlobal = document.getElementById('btn_coger_tesoro');
        if (btnGlobal) btnGlobal.style.visibility = hayHeroes ? 'hidden' : 'visible';
        if (!hayHeroes) return; // no creamos botones en los ítems si no hay héroes

        items.forEach(itemEl => {
            if (itemEl.dataset.tcEnhanced) return;
            itemEl.dataset.tcEnhanced = '1';

            const ctrls = document.createElement('div');
            ctrls.className = 'tc-controls';
            ctrls.style.cssText = 'margin-top:8px; display:flex; align-items:center; gap:6px;';

            const selHtml = `
        <select class="form-select form-select-sm tc-hero-sel" title="Destino" style="width:auto;display:inline-block;margin-right:6px; background-image:url('img/interface/select_arrow.png'); background-repeat:no-repeat; background-position:right 10px center; background-size:20px; padding-right:35px; appearance:none;">
          ${heroes.map(h => `<option value="${h.slot}">Slot ${h.slot} — ${h.nombre}</option>`).join('')}
        </select>
      `;
            ctrls.innerHTML = `${selHtml}<button type="button" class="btn btn-sm btn-success btn-coger-inventario">Coger para Héroe</button>`;
            itemEl.appendChild(ctrls);

            const btn = ctrls.querySelector('.btn-coger-inventario');
          btn.addEventListener('click', async (ev) => {
  const sel = ctrls.querySelector('.tc-hero-sel');
  const slot = Number(sel && sel.value || 0);
  if (!slot) {
    Swal.fire('Selecciona un héroe','Debes elegir un destino','info');
    return;
  }

  try {
    const parsed = window.tc_parseEnemyItem(itemEl);
    const tesoroRec = await window.tm_getTesoroRecordByItemEl(itemEl);

    if (parsed.categoria === 'objeto' && Array.isArray(parsed.items) && parsed.items.length > 0) {
      let count = 0;
      for (const it of parsed.items) {
        await applyMagicalAffixIfAny(it, 'objeto',  tesoroRec, tirarDado);
        // 🔹 NUEVO UI: mostrar tirada/resultado de magia (si la hubo) en el item
        if (it._magia) tm_renderMagicInfoInItem(itemEl, it._magia);

        await window.tc_addItemToHero(slot, 'objeto', it);
        count++;
      }
      const msg = document.createElement('div');
      msg.className = 'text-success';
      msg.style.marginTop = '4px';
      msg.textContent = `${count} objeto(s) añadidos al inventario de ${(await window.__tc_idb.getPersonajeBySlotDirect(slot))?.nombre || ('Héroe ' + slot)}`;
      ctrls.replaceWith(msg);

    } else {
      if (parsed && parsed.item) {
        await applyMagicalAffixIfAny(parsed.item, parsed.categoria, tesoroRec, tirarDado);
        // 🔹 NUEVO UI: mostrar tirada/resultado de magia en el item
        if (parsed.item._magia) tm_renderMagicInfoInItem(itemEl, parsed.item._magia);
      }
      const pj = await window.tc_addItemToHero(slot, parsed.categoria, parsed.item);

      const msg = document.createElement('div');
      msg.className = 'text-success';
      msg.style.marginTop = '4px';
      msg.textContent = `Objeto añadido al inventario de ${pj?.nombre || ('Héroe ' + slot)}`;
      ctrls.replaceWith(msg);
    }

    if (window.refreshAllSlots) window.refreshAllSlots();
    if (typeof window.BajarMoral === 'function') window.BajarMoral(3);

  } catch (err) {
    console.error(err);
    Swal.fire('Error', String(err && err.message || err), 'error');
  }
});

        });
    })();
}

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
            } catch (_) { }
            opciones.push({ slot: a.slot, nombre: nombre || ('Héroe ' + a.slot) });
        }
        opciones.sort((A, B) => A.slot - B.slot);
        return opciones;
    } catch (e) {
        console.error('tc_loadHeroesDestino error:', e);
        return [];
    }
};

// --- Observa el DOM y mejora nuevos .enemigo-item al vuelo ---
(function bootEnhancerObserver() {
    const runEnhance = () => { try { window.enhanceEnemyItems(document); } catch (_) { } };

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


// --- Mostrar/ocultar el botón general "Coger Tesoro" según haya héroes o no ---
(async () => {
    try {
        const btnGlobal = document.getElementById('btn_coger_tesoro');
        if (!btnGlobal) return;

        const heroes = await window.tc_loadHeroesDestino();
        if (heroes.length > 0) {
            // Hay héroes en slots → ocultamos el botón global
            btnGlobal.style.visibility = "hidden";
            // Y permitimos que los botones individuales class="btn_coger_tesoro" se vean
            document.querySelectorAll('.btn_coger_tesoro').forEach(b => b.style.visibility = 'visible');
        } else {
            // No hay héroes → mostramos el botón global
            btnGlobal.style.visibility = "visible";
            // Y ocultamos los individuales (si hubiera)
            document.querySelectorAll('.btn_coger_tesoro').forEach(b => b.style.visibility = 'hidden');
        }
    } catch (e) {
        console.error('Error comprobando héroes disponibles:', e);
    }
})();


/* ==================== MAGIA: carga y utilidades ==================== */
(function(){
  let __tm_magicCache = null;

  async function tm_loadMagicTables() {
    if (__tm_magicCache) return __tm_magicCache;
    const res = await fetch('json/stats_magicos.json');
    const json = await res.json();
    __tm_magicCache = (json && json.Mágicos) || [];
    return __tm_magicCache;
  }

  function tm_findBlock(byType, blocks) {
    return (blocks || []).find(b => (b && String(b.Tipomagico).toLowerCase()) === String(byType).toLowerCase()) || null;
  }

  function tm_pickFromTable(block, roll) {
    if (!block || !Array.isArray(block.tabla)) return null;

    // Caso especial ARMA: tabla anidada "Armas_Magicas"
    if (block.Tipomagico && String(block.Tipomagico).toLowerCase() === 'arma') {
      const first = block.tabla.find(x => x && Array.isArray(x.Armas_Magicas));
      if (first) {
        return (first.Armas_Magicas || []).find(e => Number(e.Tirada) === Number(roll)) || null;
      }
    }
    // Tabla plana con "Tirada"
    return block.tabla.find(e => Number(e.Tirada) === Number(roll)) || null;
  }

  function tm_rerollAvoiding(expr, avoid, tirarDadoFn) {
    let r = tirarDadoFn(expr);
    let guard = 50;
    while (r === avoid && guard-- > 0) r = tirarDadoFn(expr);
    return r;
  }

  function tm_fmt(tipo, efecto) {
    const t = (tipo || '').trim();
    const e = (efecto || '').trim();
    if (t && e) return `${t} — ${e}`;
    return t || e || '';
  }

  window.__tm_magic = {
    load: tm_loadMagicTables,
    findBlock: tm_findBlock,
    pick: tm_pickFromTable,
    rerollAvoiding: tm_rerollAvoiding,
    fmt: tm_fmt,
  };
})();

/* =============== Lookup del tesoro maravilloso actual ================= */
(function(){
  let __tm_cache_marav = null;

  async function tm_loadMaravillosos() {
    if (__tm_cache_marav) return __tm_cache_marav;
    const resp = await fetch('json/stats_tesoros_maravillosos.json');
    const data = await resp.json();
    __tm_cache_marav = (data && data.Tesoro_Maravilloso) || [];
    return __tm_cache_marav;
  }

  // Devuelve el registro { nombre, categoria, magico, seleccion, ... } del JSON
  window.tm_getTesoroRecordByItemEl = async function(itemEl){
    try {
      const getTextAfterStrong = (root, label) => {
        const el = [...root.querySelectorAll('p > strong')].find(s => s.textContent.trim().replace(':','') === label);
        if (!el || !el.parentElement) return '';
        return el.parentElement.textContent.replace(el.textContent, '').trim().replace(/^[:\s]+/,'').trim();
      };
      const botin = getTextAfterStrong(itemEl, 'Botín'); // sin .png
      if (!botin) return null;
      const nombrePng = `${botin}.png`;
      const all = await tm_loadMaravillosos();
      return all.find(r => r && r.nombre === nombrePng) || null;
    } catch(e){
      console.error('tm_getTesoroRecordByItemEl error:', e);
      return null;
    }
  };
})();

/**
 * Enriquecer un ítem con atributo mágico si el registro del tesoro tiene "magico":"SI".
 * @param {Object} saveItem  Ítem ya listo para guardar (objeto/arma/armadura)
 * @param {String} categoria "objeto" | "arma" | "armadura"
 * @param {Object} tesoroRec Registro original de stats_tesoros_maravillosos.json (con magico, seleccion, categoria)
 * @param {Function} tirarDadoFn Tu función tirarDado(expr)
 * @returns {Promise<Object>} saveItem mutado con magia (nombre/uso/especial)
 */

async function applyMagicalAffixIfAny(saveItem, categoria, tesoroRec, tirarDadoFn) {
  try {
    if (!tesoroRec || String(tesoroRec.magico).toUpperCase() !== 'SI') return saveItem;

    // Mapear tipo de magia
    let tipomagico = 'Objeto';
    const cat = String(categoria || '').toLowerCase();
    if (cat === 'arma') tipomagico = 'Arma';
    else if (cat === 'armadura') tipomagico = 'Armadura';

    // 1) Cargar tabla mágica
    const blocks = await window.__tm_magic.load();
    const block = window.__tm_magic.findBlock(tipomagico, blocks);
    if (!block) return saveItem;

    // 2) Tirada principal
    const roll = tirarDadoFn(block.seleccion);
    let entry = window.__tm_magic.pick(block, roll);
    if (!entry) return saveItem;

    let curseText = '';
    let hadCurse = false;
    let positiveRoll = null;

    // 3) ¿Maldición?
    const isCurse = (entry.Tipo || '').toLowerCase().includes('maldito') ||
                    (entry.Efecto || '').toLowerCase().includes('maldito') ||
                    Number(roll) === 10;
    if (isCurse) {
      hadCurse = true;

      // Tirada de maldición (si hay tabla)
      const curseTable = entry.Maldiciones || [];
      const curseExpr  = entry.TiradaMaldicion || '1d10';
      if (Array.isArray(curseTable) && curseTable.length) {
        const cRoll  = tirarDadoFn(curseExpr);
        const cEntry = curseTable.find(m => Number(m.Tirada) === Number(cRoll));
        if (cEntry) curseText = (cEntry.Efecto || '').trim();
      }

      // Re-roll positivo evitando 10
      positiveRoll = window.__tm_magic.rerollAvoiding(block.seleccion, 10, tirarDadoFn);
      const positive = window.__tm_magic.pick(block, positiveRoll);
      if (positive) entry = positive;
    }

    // 4) Volcar magia en el ítem
    const addText = window.__tm_magic.fmt(entry.Tipo, entry.Efecto);

    // Concatenar texto mágico al campo visible (uso/especial)
    if ('uso' in saveItem) {
      saveItem.uso = [saveItem.uso, addText].filter(Boolean).join(' | ');
    } else if ('especial' in saveItem) {
      saveItem.especial = [saveItem.especial, addText].filter(Boolean).join(' | ');
    } else if ('Efecto' in saveItem) {
      saveItem.Efecto = [saveItem.Efecto, addText].filter(Boolean).join(' | ');
    } else {
      saveItem.uso = addText;
    }

    // 🔸 NOMBRE: añadir solo el Tipo mágico (sin Efecto)
    const tipoMagico = (entry.Tipo || '').trim();
    if (hadCurse && curseText) {
      if ('nombre' in saveItem)
        saveItem.nombre = `${saveItem.nombre} Maldito: ${curseText}.${tipoMagico ? ' *' + tipoMagico + '*' : ''}`;
      else if ('arma' in saveItem)
        saveItem.arma = `${saveItem.arma} Maldito: ${curseText}.${tipoMagico ? ' *' + tipoMagico + '*' : ''}`;
      else if ('armadura' in saveItem)
        saveItem.armadura = `${saveItem.armadura} Maldito: ${curseText}.${tipoMagico ? ' *' + tipoMagico + '*' : ''}`;
    } else if (tipoMagico) {
      if ('nombre' in saveItem)
        saveItem.nombre = `${saveItem.nombre} *${tipoMagico}*`;
      else if ('arma' in saveItem)
        saveItem.arma = `${saveItem.arma} *${tipoMagico}*`;
      else if ('armadura' in saveItem)
        saveItem.armadura = `${saveItem.armadura} *${tipoMagico}*`;
    }

    // Info para UI
    saveItem._magia = {
      tipomagico,
      roll,
      positiveRoll,
      hadCurse,
      curseText,
      entry
    };
    return saveItem;

  } catch (e) {
    console.error('applyMagicalAffixIfAny error:', e);
    return saveItem;
  }
}


function tm_renderMagicInfoInItem(itemEl, magia) {
  try {
    if (!itemEl || !magia) return;
    const info = document.createElement('div');
    info.style.cssText = 'margin-top:6px; padding:6px; border-left:3px solid #8B4513; background:rgba(0,0,0,.2); border-radius:4px;';

    const parts = [];
    parts.push(`<b style="color:#d4af37;">Magia:</b> ${magia.tipomagico || ''}`);
    if (magia.hadCurse) {
      parts.push(`<span style="color:#e57373; margin-left:.5em;">Maldición: ${magia.curseText || ''}</span>`);
      if (magia.positiveRoll != null) {
        parts.push(`<span style="color:#81c784; margin-left:.5em;">Re-Tirada: ${magia.positiveRoll}</span>`);
      }
    } else if (magia.roll != null) {
      parts.push(`<span style="color:#81c784; margin-left:.5em;">Tirada: ${magia.roll}</span>`);
    }
    if (magia.entry) {
      const tipo = (magia.entry.Tipo || '').trim();
      const ef   = (magia.entry.Efecto || '').trim();
      const res  = [tipo, ef].filter(Boolean).join(' — ');
      if (res) parts.push(`<div style="margin-top:4px;"><i>${res}</i></div>`);
    }

    info.innerHTML = `<div>${parts.join(' ')}</div>`;
    // Evitar duplicados si el usuario hace varias pruebas sobre el mismo bloque
    const prev = itemEl.querySelector('[data-magic-info="1"]');
    if (prev) prev.remove();

    info.setAttribute('data-magic-info','1');
    itemEl.appendChild(info);
  } catch (e) {
    console.error('tm_renderMagicInfoInItem error:', e);
  }
}
