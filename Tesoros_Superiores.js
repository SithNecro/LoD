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
}

// Función para cargar una imagen aleatoria
function cargarTesoroSuperior() {
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
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
// Muestra los dos tesoros y sus selectores
            document.getElementById('two-treasures-container').style.display = 'none';
            document.getElementById('single-treasure-container').style.display = 'flex';

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
        }
        function BajarMoral(valor){
            const iframe = document.getElementById('iframeMenu');
                        iframe.contentWindow.postMessage({ tipo: 'cambiarMoral', valor }, '*');
            }