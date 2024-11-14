
        // Funcionalidad de Moral
        const maxMoral = document.getElementById('maxMoral');
        const medMoral = document.getElementById('medMoral');
        const moralActual = document.getElementById('moralActual');
        const moralIncrement = document.getElementById('moralIncrement');
        const moralDecrement = document.getElementById('moralDecrement');
        const alerta = document.getElementById('alerta');
        const alerta2 = document.getElementById('alerta2');
        const moralBajaAudio = document.getElementById('moralBajaAudio');

        const minAmenaza = document.getElementById('minAmenaza');
        const maxAmenaza = document.getElementById('maxAmenaza');
        const eventoAmenaza = document.getElementById('eventoAmenaza');
        const amenazaActual = document.getElementById('amenazaActual');
        const amenazaIncrement = document.getElementById('amenazaIncrement');
        const amenazaDecrement = document.getElementById('amenazaDecrement');
        const eventoAmenazaAudio = document.getElementById('eventoAmenazaAudio');
        // Guardar en localStorage al cambiar los valores
        function saveValues() {


            // Guardar todos los valores de Moral
            localStorage.setItem('maxMoral', maxMoral.value);
            localStorage.setItem('medMoral', medMoral.value);
            localStorage.setItem('moralActual', moralActual.value);

            // Guardar todos los valores de Amenaza
            localStorage.setItem('minAmenaza', minAmenaza.value);
            localStorage.setItem('maxAmenaza', maxAmenaza.value);
            localStorage.setItem('eventoAmenaza', eventoAmenaza.value);
            localStorage.setItem('amenazaActual', amenazaActual.value);
        }

        // Cargar los valores de localStorage si existen
        function loadValues() {
            // Cargar todos los valores de Moral
            if (localStorage.getItem('maxMoral')) {
                maxMoral.value = localStorage.getItem('maxMoral');
            }
            if (localStorage.getItem('medMoral')) {
                medMoral.value = localStorage.getItem('medMoral');
            } else {
                medMoral.value = Math.floor(maxMoral.value / 2); // Recalcular si no está guardado
            }
            if (localStorage.getItem('moralActual')) {
                moralActual.value = localStorage.getItem('moralActual');
            }

            // Cargar todos los valores de Amenaza
            if (localStorage.getItem('minAmenaza')) {
                minAmenaza.value = localStorage.getItem('minAmenaza');
            }
            if (localStorage.getItem('maxAmenaza')) {
                maxAmenaza.value = localStorage.getItem('maxAmenaza');
            }

            if (localStorage.getItem('eventoAmenaza')) {
                eventoAmenaza.value = localStorage.getItem('eventoAmenaza');
            }
            if (localStorage.getItem('amenazaActual')) {
                amenazaActual.value = localStorage.getItem('amenazaActual');
            }

            checkMoral(); // Verificar la moral cargada
        }

        // Navegar a una página guardando los valores antes
        function saveAndNavigate(url) {

            saveValues(); // Guardar valores en localStorage
            window.top.location.href = url; // Navegar a la nueva página en el marco principal
        }

        // Función para verificar si la moral es menor a la media
        function checkMoral() {
            const currentMoral = parseInt(moralActual.value);
            const currentMed = parseInt(medMoral.value);

            if (currentMoral < currentMed) {
                alerta.textContent = "       Todos Sufren -20 DET";

                alerta.style.display = 'block';
                if (currentMoral == currentMed - 1) {
                    moralBajaAudio.play();
                }
                // Cambia el fondo a amarillo
                moralActual.style.backgroundColor = 'yellow';
                medMoral.style.backgroundColor = 'yellow';
            } else {
                alerta.style.display = 'none';
                moralBajaAudio.pause();
                moralBajaAudio.currentTime = 0;
                moralActual.style.backgroundColor = 'white';
                medMoral.style.backgroundColor = 'white';
            }
            if (currentMoral == 0) {
                moral0Audio.play();
                alerta.textContent = "Los Héroes deben HUIR de la mazmorra en cuanto estén fuera de combates.";
                moralActual.style.backgroundColor = 'red';
            }
        }

        // Función para verificar si la amenaza es mayor a la del evento
        function checkAmenaza() {
            const currentAmenaza = parseInt(amenazaActual.value);
            const currentEvento = parseInt(eventoAmenaza.value);

            if (currentAmenaza == currentEvento) {
                alerta2.style.display = 'block';
                amenazaActual.style.backgroundColor = 'orange';
                eventoAmenaza.style.backgroundColor = 'orange';
                eventoAmenazaAudio.play();
            } else {
                amenazaActual.style.backgroundColor = 'white';
                eventoAmenaza.style.backgroundColor = 'white';
                alerta2.style.display = 'none';
                eventoAmenazaAudio.pause();
                eventoAmenazaAudio.currentTime = 0;
            }
        }


        // Eventos para cambiar valores
        maxMoral.addEventListener('input', function () {
            medMoral.value = Math.floor(maxMoral.value / 2);
            checkMoral();
            saveValues(); // Guardar al cambiar el valor
        });

        moralIncrement.addEventListener('click', function () {
            if (parseInt(moralActual.value) < parseInt(maxMoral.value)) {
                moralActual.value = parseInt(moralActual.value) + 1;
                checkMoral();
                saveValues(); // Guardar al incrementar
            }
        });

        moralDecrement.addEventListener('click', function () {
            if (parseInt(moralActual.value) > 0) {
                moralActual.value = parseInt(moralActual.value) - 1;
                checkMoral();
                saveValues(); // Guardar al decrementar
            }
        });

        amenazaIncrement.addEventListener('click', function () {
            if (parseInt(amenazaActual.value) < parseInt(maxAmenaza.value)) {
                amenazaActual.value = parseInt(amenazaActual.value) + 1;
                checkAmenaza();
                saveValues();
            }
        });

        amenazaDecrement.addEventListener('click', function () {
            if (parseInt(amenazaActual.value) > parseInt(minAmenaza.value)) {
                amenazaActual.value = parseInt(amenazaActual.value) - 1;
                checkAmenaza();
                saveValues();
            }
        });



        // Manejador para recibir mensajes desde el documento principal
        window.addEventListener('message', function (event) {
            // Obtenemos el elemento amenazaActual
            const amenazaActualElem = document.getElementById('amenazaActual');
            if (event.data.tipo === 'solicitarAmenazaActual') {
                // Enviar el valor actual de amenazaActual al documento principal
                const amenazaActual = amenazaActualElem.value; // Obtener el valor actual
                event.source.postMessage({ tipo: 'amenazaActual', valor: amenazaActual }, event.origin);
            }
            if (event.data.tipo === 'cambiarAmenaza') {
                cambiarAmenaza(event.data.valor);
            }
            if (event.data.tipo === 'cambiarMoral') {
                cambiarMoral(event.data.valor);
            }
        });

        // Función para cambiar el nivel de amenaza
        function cambiarAmenaza(valor) {
            const amenazaActualElem = document.getElementById('amenazaActual');
            const amenazaminAmenaza = document.getElementById('minAmenaza');
            const amenazamaxAmenaza = document.getElementById('maxAmenaza');
            let actual = parseInt(amenazaActualElem.value, 10);
            actual += valor; // Sumar o restar según el valor recibido
            // Obtén los valores mínimo y máximo
            const minAmenaza = parseInt(amenazaminAmenaza.value, 10);
            const maxAmenaza = parseInt(amenazamaxAmenaza.value, 10);
            // Verifica los límites
            if (actual >= minAmenaza && actual <= maxAmenaza) {
                amenazaActualElem.value = actual; // Cambia el valor del span
            } else if (actual < minAmenaza) {
                amenazaActualElem.value = minAmenaza; // Ajusta al mínimo
            } else if (actual > maxAmenaza) {
                amenazaActualElem.value = maxAmenaza; // Ajusta al máximo
            }
            saveValues(); // Guardar al incrementar
        }
        // Asegúrate de que loadValues se llame al cargar la página
        document.addEventListener('DOMContentLoaded', function () {
            loadValues(); // Cargar valores al inicio
        });

        // Función para cambiar el nivel de amenaza
        function cambiarMoral(valor) {
            const moralActualElem = document.getElementById('moralActual');
            const moralmax = document.getElementById('maxMoral');
            let actual = parseInt(moralActualElem.value, 10);
            actual += valor; // Sumar o restar según el valor recibido
            // Obtén los valores mínimo y máximo
            const mMax = parseInt(moralmax.value, 10);
            // Verifica los límites
            if (actual <= mMax && actual > 0) {
                moralActualElem.value = actual; // Cambia el valor del span
            } else if (actual <= 0) {
                moralActualElem.value = 0; // Ajusta al mínimo
            } else if (actual > mMax) {
                moralActualElem.value = mMax; // Ajusta al máximo
            }
            checkMoral();
            saveValues(); // Guardar al incrementar
        }
        // Asegúrate de que loadValues se llame al cargar la página
        document.addEventListener('DOMContentLoaded', function () {
            loadValues(); // Cargar valores al inicio
        });
   
        let playerTab = null; // Variable para la nueva pestaña
        let activeButton = null;  // Botón activo en la página

        function playMusic(type) {
            // Abre una nueva pestaña o reutiliza la existente
            if (!playerTab || playerTab.closed) {
                playerTab = window.open('player.html', '_blank');

                // Envía la URL de la pestaña principal al abrir player.html
                playerTab.onload = () => {
                    playerTab.postMessage({ action: 'setOrigin', originUrl: window.location.href }, '*');
                };

                // Envía el tipo de música a reproducir después de una breve espera
                setTimeout(() => {
                    playerTab.postMessage({ action: 'play', trackType: type }, '*');
                }, 1000);
            } else {
                // Si la pestaña de audio ya está abierta, envía el mensaje de reproducción inmediatamente
                playerTab.postMessage({ action: 'play', trackType: type }, '*');
            }

            // Cambiar estado visual del botón de silencio
            document.getElementById('muteButton').classList.add('active');

            // Actualizar estado visual del botón de audio activo
            if (activeButton) activeButton.classList.remove('pressed');
            const button = event.target;
            button.classList.add('pressed');
            activeButton = button;
        }

        function stopMusic() {
            // Verificar si la pestaña de audio existe y sigue abierta
            if (playerTab && !playerTab.closed) {
                playerTab.postMessage({ action: 'stop' }, '*');
                playerTab.close(); // Cerrar la pestaña
            }

            // Cambiar estado visual del botón de silencio y botones de audio
            document.getElementById('muteButton').classList.remove('active');
            if (activeButton) activeButton.classList.remove('pressed');
            activeButton = null;
        }
   