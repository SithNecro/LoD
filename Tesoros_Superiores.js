window.onload = function() {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Tesoros_Superiores;
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
    imagen.src = `img/Tesoros_Superiores/${tesoroSeleccionado}`;
    cargarStatsObjeto(tesoroSeleccionado);
    
   
}

// Función para cargar una imagen aleatoria
// Función auxiliar para tirar dados tipo "1d10", "2d6-1", etc.
function tirarDado(expresion) {
    // admite formato XdY-Z (Z opcional)
    const match = expresion.match(/(\d+)d(\d+)(?:\s*-\s*(\d+))?/i);
    if (!match) return null;
    const veces = parseInt(match[1],10);
    const caras = parseInt(match[2],10);
    const restar = match[3] ? parseInt(match[3],10) : 0;
    let total = 0;
    for (let i = 0; i < veces; i++) {
        total += Math.floor(Math.random() * caras) + 1;
    }
    return total - restar;
}

// Función para cargar una imagen aleatoria y mostrar sus datos
function cargarTesoroSuperior() {
    fetch('img/Listado_Cartas.json')
        .then(r => r.json())
        .then(data => {
            const tesoros = data.Tesoros_Superiores;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Tesoros_Superiores/${tesoroAleatorio}`;

            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-0');
            selector.value = tesoroAleatorio;

            // Mostrar contenedor adecuado
            document.getElementById('two-treasures-container').style.display = 'none';
            document.getElementById('single-treasure-container').style.display = 'flex';

               cargarStatsObjeto(tesoroAleatorio);
        });
}

  // Función para cargar la habilidad de buscatesoros, mostrando dos tesoros
function habilidadBuscatesoros() {
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Tesoros_Superiores; // Cargar la lista de tesoros desde el JSON
            
            // Seleccionar dos tesoros aleatorios
            let tesoro1 = tesoros[Math.floor(Math.random() * tesoros.length)];
            let tesoro2;

            // Asegurar que los dos tesoros no sean iguales
            do {
                tesoro2 = tesoros[Math.floor(Math.random() * tesoros.length)];
            } while (tesoro1 === tesoro2);

            // Cambia la imagen de ambos tesoros
            document.getElementById('imagen-tesoro-1').src = `img/Tesoros_Superiores/${tesoro1}`;
            document.getElementById('imagen-tesoro-2').src = `img/Tesoros_Superiores/${tesoro2}`;
            //Selecciona en los desplegables los objetos
            const selector1 = document.getElementById('selector-tesoro-1');
            selector1.value = tesoro1;
            const selector2 = document.getElementById('selector-tesoro-2');
            selector2.value = tesoro2;


            // Muestra los dos tesoros y sus selectores
            document.getElementById('two-treasures-container').style.display = 'flex';
            document.getElementById('single-treasure-container').style.display = 'none';
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));
}

// Funciones para cambiar la imagen seleccionada en los selectores individuales
function cambiarImagenSeleccionadaTesoro1() {
    const selector = document.getElementById('selector-tesoro-1');
    const imagen = document.getElementById('imagen-tesoro-1');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoros_Superiores/${tesoroSeleccionado}`; // Ajusta la ruta
}

function cambiarImagenSeleccionadaTesoro2() {
    const selector = document.getElementById('selector-tesoro-2');
    const imagen = document.getElementById('imagen-tesoro-2');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Tesoros_Superiores/${tesoroSeleccionado}`; // Ajusta la ruta
}



 // Función para barajar y poner la imagen de trasera del tesoro
        function barajarTesoros() {
          	document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera_tesoro_superior.png';
		    document.getElementById('imagen-tesoro-1').src = 'img/traseras/Trasera_tesoro_superior.png';
		    document.getElementById('imagen-tesoro-2').src = 'img/traseras/Trasera_tesoro_superior.png';
            const detalle2 = document.getElementById('enemigos-lista');
                    detalle2.innerHTML = ``; // limpiar
        }
// Función para bajar la moral
        function BajarMoral(valor){
            const iframe = document.getElementById('iframeMenu');
                        iframe.contentWindow.postMessage({ tipo: 'cambiarMoral', valor }, '*');
            }

 // Cargar stats y pintar detalles
 function cargarStatsObjeto(tesoroSeleccionado){
            fetch('img/stats_tesoros_superiores.json')
                .then(r2 => r2.json())
                .then(stats => {
                   
                    
                    
                    
                    const detalle2 = document.getElementById('enemigos-lista');
                    detalle2.innerHTML = ``; // limpiar
                    const item = document.createElement('div');
                    item.className = 'enemigo-item';
                    //item.innerHTML = `<div>hola</div><div>hola</div><div>hola</div>`;
                    
                    const tesoro = stats.Tesoros_Superiores.find(t => t.nombre === tesoroSeleccionado);
                    if (!tesoro) {
                        let html = '<div>No se encontró información de este tesoro.</div>';
                        item.innerHTML = html;
                    detalle2.appendChild(item);
                        return;
                    }

                    // Nombre (sin .png)
                    let html = `<div><p><strong>Botín:</strong> ${tesoro.nombre.replace(/\.png$/i,'')}</p></div>`;
                    // Rotura
                    if (tesoro.rotura) {
                        const roturaRand = tirarDado(tesoro.rotura);
                        //html += `<div><p><strong>Rotura del objeto:</strong> ${tesoro.rotura} (Resultado: ${roturaRand})</p></div>`;
                          html += `<div><p><strong>Rotura del objeto:</strong> ${roturaRand}</p></div>`;
                    
                    }

                    // Valor
                   if (tesoro.valor) {
    let valorTexto = tesoro.valor;

    // ¿es una tirada de dados tipo "3d100"?
    if (/^\d+d\d+$/i.test(tesoro.valor)) {
        const [num, caras] = tesoro.valor.toLowerCase().split("d").map(Number);
        let total = 0;
        let tiradas = [];
        for (let i = 0; i < num; i++) {
            const t = Math.floor(Math.random() * caras) + 1;
            total += t;
            tiradas.push(t);
        }
        valorTexto = `${tesoro.valor} → [${tiradas.join(", ")}] = ${total}`;
    }

    html += `<div><p><strong>Valor del objeto:</strong> ${valorTexto}</p></div>`;
}

                    // Selección
                    if (tesoro.seleccion) {
                        
                        const selRand = tirarDado(tesoro.seleccion);
                        if (tesoro.seleccion != "1d1"){
                        html += `<div><p><strong style="color: green;">Selección:</strong> ${tesoro.seleccion} (resultado: ${selRand})</p></div>`;
                    }
                        // Buscar en tabla
                        const itemTabla = tesoro.tabla.find(e => e.tirada === selRand);
                        if (itemTabla) {
                            html += '<div style="margin-left:1em">';
                            for (const [k,v] of Object.entries(itemTabla)) {
                                if (v !== null) {
                                    if (k == "tirada"){}
                                    else{
                                    html += `<div><p><strong style="color: green;">${k}:</strong> ${v}</p></div>`;}
                                }
                            }
                            html += '</div>';
                        }
                    }

                    //detalle.innerHTML = html;
                    item.innerHTML = html;
                    detalle2.appendChild(item);

                    //Reproduccion audio
                    const nombreAudio = tesoroSeleccionado.replace(/\.png$/i, '.mp3');
                    const audio = new Audio(`img/Tesoros_Superiores//${nombreAudio}`);
                    audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
                    
                   
                });
                }