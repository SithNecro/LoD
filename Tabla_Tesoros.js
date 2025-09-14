window.onload = function () {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Buscar_Objetos;
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
    imagen.src = `img/Buscar_Objetos/${tesoroSeleccionado}`;
    tirarDado(10);

}

// Función para cargar una imagen aleatoria
function cargarTesoroLegendario() {
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Buscar_Objetos;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Buscar_Objetos/${tesoroAleatorio}`;

            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-0');
            selector.value = tesoroAleatorio;
            // Muestra los dos tesoros y sus selectores
            document.getElementById('single-treasure-container').style.display = 'flex';
            const hueco = document.getElementById('hueco');
            //hueco.innerHTML = '<iframe src="Tesoros_Superiores.html" width="700" height="700" loading="lazy" style="border:0;"></iframe>';
tirarDado(10);
        });
}
function playSound() {
    var audio = document.getElementById("diceSound");
    audio.play();
}

async function tirarDado(caras) {
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        playSound();
    }
    rollDice(10, 'dice-image', 'result');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const valordadoTiradad10 = document.getElementById('result');
    valordadoTiradad10.style.display = 'none';

}


// Función para barajar y poner la imagen de trasera del tesoro
function barajarTesoros() {
    document.getElementById('imagen-tesoro').src = 'img/traseras/Tabla_Tesoros.png';
}
