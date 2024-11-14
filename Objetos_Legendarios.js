window.onload = function() {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('img/Listado_Cartas.json')
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

// Función para cambiar la imagen cuando se selecciona un tesoro en el desplegable
function cambiarImagenSeleccionada() {
    const selector = document.getElementById('selector-tesoro-0');
    const imagen = document.getElementById('imagen-tesoro');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Objeto_Legendario/${tesoroSeleccionado}`;
}

// Función para cargar una imagen aleatoria
function cargarTesoroLegendario() {
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Objeto_Legendario;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Objeto_Legendario/${tesoroAleatorio}`;

            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-0');
            selector.value = tesoroAleatorio;
// Muestra los dos tesoros y sus selectores
            document.getElementById('single-treasure-container').style.display = 'flex';

        });
}

 



 // Función para barajar y poner la imagen de trasera del tesoro
        function barajarTesoros() {
          	document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera legendarios.png';
        }
