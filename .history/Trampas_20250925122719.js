window.onload = function () {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Trampas;
            const selector = document.getElementById('selector-tesoro-0');
            const selectorExtra = document.getElementById('selector-tesoro-extra');
            tesoros.forEach(tesoro => {
                let option2 = document.createElement('option');
                option2.value = tesoro;
                option2.text = tesoro.replace('.png', '').replace('_', ' ');
                selectorExtra.appendChild(option2);
            });
            // Añadir opciones al selector
            tesoros.forEach(tesoro => {
                let option1 = document.createElement('option');
                option1.value = tesoro;
                option1.text = tesoro.replace('.png', '').replace('_', ' ');
                selector.appendChild(option1);
            });
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));

}

// Cambiar la imagen según el desplegable
function cambiarImagenSeleccionada() {
    const selector = document.getElementById('selector-tesoro-0');
    const imagen = document.getElementById('imagen-tesoro');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Trampas/${tesoroSeleccionado}`;
}

// Imagen aleatoria de trampa
function cargarTesoroLegendario() {
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Trampas;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            const imagen = document.getElementById('imagen-tesoro');
            imagen.src = `img/Trampas/${tesoroAleatorio}`;

            const selector = document.getElementById('selector-tesoro-0');
            selector.value = tesoroAleatorio;
            urlaudio = `${tesoroAleatorio}`
            urlaudio = urlaudio.replace(".png", ".mp3");
            const audio = new Audio(`img/Trampas/${urlaudio}`);
            let ComprobarMute = localStorage.getItem('sonido')
            if (ComprobarMute == "on") {
                audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
            }
            document.getElementById('single-treasure-container').style.display = 'flex';
        });
}

// Barajar trampas
function barajarTesoros() {
    document.getElementById('imagen-tesoro').src = 'img/traseras/Trasera trampas.png';
}

// Cambiar moral del grupo
function BajarMoral(valor) {
    const iframe = document.getElementById('iframeMenu');
    iframe.contentWindow.postMessage({ tipo: 'cambiarMoral', valor }, '*');
}

// Botón de ayuda (SweetAlert2)
document.getElementById("help-button").addEventListener("click", () => {
    Swal.fire({
        title: 'Reglas del Juego',
        html: `
      <h3 style="text-align:left; color:#d4af37;">Abrir una Puerta o Cofre</h3>
      <p style="text-align:left">
        Abrir una puerta o un cofre cuesta <b>1 PA</b> y requiere que la miniatura esté adyacente a su objetivo.<br>
          <br><strong style="color:#d4af37;">Seguid los siguientes pasos:</strong>
          <strong style="color:white;"> Los pasos 1 y 2 los hace la App al pulsar en "Abrir Puerta o Cofre":</strong>
      </p>
      <ol style="text-align:left; padding-left:20px;">
        <li>El Nivel de Amenaza sube en 1.</li>
        <li>Tira un <b>1d10</b> y un <b>1d6</b> a la vez. Si el <b>1d6</b> es un 6, la puerta o cofre tiene una trampa.<br>
            Robad una carta de trampas y aplicadla. Luego mira la tabla de puertas para ver si está cerrada con llave.<br>
            Ver “cerrado” más adelante.</li>
        <li>Una vez abierta, mira la carta superior y coloca la siguiente loseta correspondiente.<br>
            Si es un cofre, consultad la tabla de mobiliario para ver qué contiene.</li>
        <li>En el caso de una puerta, realizad una tirada para ver si hay monstruos dentro.<br>
            Ver ‘Encuentros’ y ‘Colocando Enemigos’ en la página 103.</li>
      </ol>
     <img style="width:50%"src="img/FAQ/FAQ_Puertas.png" alt="FAQ" class="faq-image">`,
        confirmButtonText: 'Aceptar',
        background: '#222',
        color: '#fff',
        confirmButtonColor: '#d4af37',
        width: '600px'
    });
});

// Reproducir sonido
function playSound(elemento) {
    var audio = document.getElementById(elemento);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        const audio = new Audio("sonidos/dados.mp3");
        audio.play();
    }
}

// Tirada de dados
async function tirarDado(caras) {
    // Mostrar el cuadro de estado si estaba oculto
    document.getElementById('estado-container').style.display = 'flex';

    // Imagen de "en proceso" mientras ruedan los dados
    document.getElementById('estado-imagen').src = "img/interface/cerradura.png";
    document.getElementById('estado-texto').innerHTML = "Comprobando la cerradura...";
    // Mostrar el cuadro de estado si estaba oculto
    document.getElementById('estado-container').style.display = 'flex';

    const iframe = document.getElementById('iframeMenu');
    const valor = 1;
    iframe.contentWindow.postMessage({ tipo: 'cambiarAmenaza', valor }, '*');

    let ComprobarMute = localStorage.getItem('sonido');
    if (ComprobarMute == "on") {
        playSound("diceSound");
    }

    // Tirada de d6
    rollDice(6, 'dice-image6', 'result6');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const valordadoTiradad6 = parseInt(document.getElementById('result6').innerText);

    if (ComprobarMute == "on") {
        playSound("diceSound");
    }

    // Tirada de d10
    rollDice(10, 'dice-image10', 'result10');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const valordadoTiradad10 = parseInt(document.getElementById('result10').innerText);

    // Variables de estado
    let estadocerrado = "";
    let tienetrampa = "";

    // Resultado de la cerradura
    if (valordadoTiradad10 <= 6) {
        estadocerrado = "La cerradura está abierta.";
    } else if (valordadoTiradad10 === 7) {
        estadocerrado = "Está cerrado con llave: Forzar Cerr: 0%, VIT 10";
    } else if (valordadoTiradad10 === 8) {
        estadocerrado = "Está cerrado con llave: Forzar Cerr: -10%, VIT 15";
    } else if (valordadoTiradad10 === 9) {
        estadocerrado = "Está cerrado con llave: Forzar Cerr: -15%, VIT 20";
    } else if (valordadoTiradad10 === 10) {
        estadocerrado = "Está cerrado con llave: Forzar Cerr: -20%, VIT 25";
    }

    // Trampas (si el d6 es 6)
    if (valordadoTiradad6 === 6) {
        tienetrampa = "¡¡Cuidado!! Se ha activado una trampa.";
        iframe.contentWindow.postMessage({ tipo: 'cambiarAmenaza', valor }, '*');

        // Mostrar la columna de trampa
        document.getElementById('estado-col-der').style.display = 'flex';

        // Cargar automáticamente una carta de trampa aleatoria
        cargarTesoroLegendario();
    } else {
        tienetrampa = "<br>Parece que no hay trampas cerca.";
        // Ocultar columna de trampa si no hay
        document.getElementById('estado-col-der').style.display = 'none';
    }

    // Mostrar candado y texto en el cuadro
    let imagenPuerta = (valordadoTiradad10 <= 6)
        ? "img/interface/candado_abierto.png"
        : "img/interface/candado_cerrado.png";

    document.getElementById('estado-imagen').src = imagenPuerta;
    document.getElementById('estado-texto').innerHTML = 'La Amenaza Actual sube +1' + '<br><br>' + estadocerrado + '<br>' + tienetrampa;
}
// Cargar carta aleatoria para el bloque extra
function cargarTesoroExtra() {
    fetch('json/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.Trampas;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            const imagen = document.getElementById('imagen-tesoro-extra');
            imagen.src = `img/Trampas/${tesoroAleatorio}`;

            // Seleccionar en el desplegable
            const selector = document.getElementById('selector-tesoro-extra');
            selector.value = tesoroAleatorio;
        }); 
        
    
    document.getElementById('trampa-container').style.display = 'flex';
       urlaudio = `${tesoroAleatorio}`
    urlaudio = urlaudio.replace(".png", ".mp3");
    const audio = new Audio(`img/Trampas/${urlaudio}`);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
    }
}

// Barajar: volver a mostrar trasera
function barajarTesoroExtra() {
    document.getElementById('imagen-tesoro-extra').src = 'img/traseras/Trasera trampas.png';
}
function sonidoCritico() {
    var audio = document.getElementById(diceSound);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        const audio = new Audio("sonidos/critico.mp3");
        audio.play();
    }

}
// Cambiar carta desde el desplegable
function cambiarImagenExtra() {
    const selector = document.getElementById('selector-tesoro-extra');
    const imagen = document.getElementById('imagen-tesoro-extra');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/Trampas/${tesoroSeleccionado}`;
    urlaudio = `${tesoroSeleccionado}`
    urlaudio = urlaudio.replace(".png", ".mp3");
    const audio = new Audio(`img/Trampas/${urlaudio}`);
    let ComprobarMute = localStorage.getItem('sonido')
    if (ComprobarMute == "on") {
        audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
    }
}