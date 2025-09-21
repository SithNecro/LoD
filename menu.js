  // Funcionalidad de Moral
        const maxMoral = document.getElementById('maxMoral');
        const medMoral = document.getElementById('medMoral');
        const moralActual = document.getElementById('moralActual');
        const moralIncrement = document.getElementById('moralIncrement');
        const moralDecrement = document.getElementById('moralDecrement');
        const alerta = document.getElementById('alerta');
        const alerta2 = document.getElementById('alerta2');
        const moralBajaAudio = document.getElementById('moralBajaAudio');
        const dinero = document.getElementById('Dinero');
        const minAmenaza = document.getElementById('minAmenaza');
        const maxAmenaza = document.getElementById('maxAmenaza');
        const eventoAmenaza = document.getElementById('eventoAmenaza');
        const amenazaActual = document.getElementById('amenazaActual');
        const amenazaIncrement = document.getElementById('amenazaIncrement');
        const amenazaDecrement = document.getElementById('amenazaDecrement');
        const eventoAmenazaAudio = document.getElementById('eventoAmenazaAudio');

        let sonidoActivo = true;

        //Esta función es para desactivar los sonidos de tiradas de dado etc o activarlos
        function aplicarEstado() {
            const btn = document.getElementById('btnSonido');
            const sfx = document.getElementById('sfx');
            btn.classList.toggle('off', !sonidoActivo);
            btn.setAttribute('aria-pressed', String(sonidoActivo));
            btn.setAttribute('aria-label', sonidoActivo ? 'Sonido activado' : 'Sonido desactivado');
            if (sfx) sfx.muted = !sonidoActivo;
        }
        // guarda el estado del botón de desactivar sonidos
        function guardarEstado() { localStorage.setItem('sonido', sonidoActivo ? 'on' : 'off'); }
        // Carga el estado del botón de desactivar sonidos
        function cargarEstado() {
            const pref = localStorage.getItem('sonido');
            if (pref) sonidoActivo = pref === 'on';
            aplicarEstado();
        }

        function toggleSonido() { sonidoActivo = !sonidoActivo; aplicarEstado(); guardarEstado(); }

        function playSfx() { if (!sonidoActivo) return; const sfx = document.getElementById('sfx'); if (sfx) { sfx.currentTime = 0; sfx.play(); } }





        function actualizarIcono() { icono.src = sonidoActivo ? 'img/interface/btn_con_musica.png' : 'img/interface/btn_sin_musica.png'; icono.alt = sonidoActivo ? 'Sonido activado' : 'Sonido desactivado'; }


        // Guardar en localStorage al cambiar los valores
        function saveValues() {


            // Guardar todos los valores de Moral
            localStorage.setItem('maxMoral', maxMoral.value);
            localStorage.setItem('medMoral', medMoral.value);
            localStorage.setItem('moralActual', moralActual.value);
            localStorage.setItem('dinero', dinero.value);
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
            if (localStorage.getItem('dinero')) {
                dinero.value = localStorage.getItem('dinero'); // Usa el ID en minúscula
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
            if (localStorage.getItem('sonido')) {
                const pref = localStorage.getItem('sonido');
                if (pref) sonidoActivo = pref === 'on';
                aplicarEstado();
            }
            checkMoral(); // Verificar la moral cargada
        }

        // Navegar a una página guardando los valores antes
        function saveAndNavigate(url) {

            saveValues(); // Guardar valores en localStorage
            window.top.location.href = url; // Navegar a la nueva página en el marco principal
        }
        // Asegúrate de que se guarde el dinero cuando se modifique
        dinero.addEventListener('input', function () {
            localStorage.setItem('dinero', dinero.value); // Guarda automáticamente al cambiar
        });
        // Función para verificar si la moral es menor a la media
        function checkMoral() {
            const currentMoral = parseInt(moralActual.value);
            const currentMed = parseInt(medMoral.value);

            if (currentMoral < currentMed) {
                alerta.textContent = "       Todos Sufren -20 DET";

                alerta.style.display = 'block';
                if (currentMoral == currentMed - 1) {
                    let ComprobarMute = localStorage.getItem('sonido')
                    if (ComprobarMute == "on") {
                        moralBajaAudio.play();
                    }
                }
                // Cambia el fondo a amarillo
                moralActual.style.backgroundColor = 'orange';
                medMoral.style.backgroundColor = 'orange';
            } else {
                alerta.style.display = 'none';
                moralBajaAudio.pause();
                moralBajaAudio.currentTime = 0;
                moralActual.style.backgroundColor = 'rgba(40, 40, 40, 0.9)'; // correcto
                medMoral.style.backgroundColor = 'rgba(40, 40, 40, 0.9)'; // correcto
            }
            if (currentMoral == 0) {
                let ComprobarMute = localStorage.getItem('sonido')
                if (ComprobarMute == "on") {
                    moral0Audio.play();
                }
                alerta.textContent = "Los Héroes deben HUIR de la mazmorra en cuanto estén fuera de combate.";
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
                let ComprobarMute = localStorage.getItem('sonido')
                if (ComprobarMute == "on") {
                    eventoAmenazaAudio.play();
                }
            } else {
                amenazaActual.style.backgroundColor = 'rgba(40, 40, 40, 0.9)'; // correcto; // correcto
                eventoAmenaza.style.backgroundColor = 'rgba(40, 40, 40, 0.9)'; // correcto; // correcto
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
            checkAmenaza();
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