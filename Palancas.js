window.onload = function() {
    // Cargar la lista de tesoros desde el archivo JSON
    fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.PalancasNegras;
           
            const selector2 = document.getElementById('selector-tesoro-1');
            

            // Añadir opciones al selector
            tesoros.forEach(tesoro => {
                // Crear una opción para el primer selector
               

                // Crear una opción para el segundo selector
                let option2 = document.createElement('option');
                option2.value = tesoro;
                option2.text = tesoro.replace('.png', '').replace('_', ' ');
                selector2.appendChild(option2);

               
            });
        })
        .catch(error => console.error('Error al cargar los tesoros:', error));
        fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            const tesoros = data.PalancasRojas;
           
            
            const selector3 = document.getElementById('selector-tesoro-2');

            // Añadir opciones al selector
            tesoros.forEach(tesoro => {
                // Crear una opción para el primer selector
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
}

// Función para cargar una imagen aleatoria
function cargarTesoroCorriente(color) {
    const palancasAudio = document.getElementById('palancasAudio');
    const imagen = document.getElementById('imagen-tesoro-2');
    const imagen2 = document.getElementById('imagen-tesoro-1');
    if (imagen2.src === "https://sithnecro.github.io/Test5/img/traseras/PalancaNDOWN.png" || imagen.src === "https://sithnecro.github.io/Test5/img/traseras/PalancaRDOWN.png" )
    {
        document.getElementById('imagen-tesoro-1').src = 'img/traseras/PalancaNUP.png';
		document.getElementById('imagen-tesoro-2').src = 'img/traseras/PalancaRUP.png';
    } else if (color === "Rojas")
    {
       
        fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            palancasAudio.play();
            const tesoros = data.PalancasRojas;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            
            

            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-2');
            selector.value = tesoroAleatorio;
            // Muestra los dos tesoros y sus selectores
            
            imagen.src = `img/traseras/PalancaRDOWN.png`;
            imagen2.src = `img/PalancasRojas/${tesoroAleatorio}`;
        });
    } else if (color === "Negras")
    {
        fetch('img/Listado_Cartas.json')
        .then(response => response.json())
        .then(data => {
            palancasAudio.play();
            const tesoros = data.PalancasNegras;
            const randomIndex = Math.floor(Math.random() * tesoros.length);
            const tesoroAleatorio = tesoros[randomIndex];

            // Cambiar la imagen
            
            imagen2.src = `img/traseras/PalancaNDOWN.png`;
            imagen.src = `img/PalancasNegras/${tesoroAleatorio}`;
            // Seleccionar el tesoro en el desplegable
            const selector = document.getElementById('selector-tesoro-1');
            selector.value = tesoroAleatorio;


        });
    }
    
}



// Funciones para cambiar la imagen seleccionada en los selectores individuales
function cambiarImagenSeleccionadaTesoro1() {
    const selector = document.getElementById('selector-tesoro-1');
    const imagen = document.getElementById('imagen-tesoro-1');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/PalancasNegras/${tesoroSeleccionado}`; // Ajusta la ruta
}

function cambiarImagenSeleccionadaTesoro2() {
    const selector = document.getElementById('selector-tesoro-2');
    const imagen = document.getElementById('imagen-tesoro-2');
    const tesoroSeleccionado = selector.value;
    imagen.src = `img/PalancasRojas/${tesoroSeleccionado}`; // Ajusta la ruta
}



 // Función para barajar y poner la imagen de trasera del tesoro
        function barajarTesoros() {
          
		document.getElementById('imagen-tesoro-1').src = 'img/traseras/PalancaNUP.png';
		document.getElementById('imagen-tesoro-2').src = 'img/traseras/PalancaRUP.png';
        }
