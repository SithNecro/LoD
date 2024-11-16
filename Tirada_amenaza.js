
 
        // Función para lanzar un dado de cualquier tipo
        function lanzarDado(lados) {
            return Math.floor(Math.random() * lados) + 1;
        }

        let amenazaActual = null;  // Mantener la amenaza actual en un scope superior
        // Cargar valores de localStorage o usar valores por defecto
        let modificadorTirada = parseInt(localStorage.getItem('ModificadorTirada')) || 0;
        let rangoTirada = parseInt(localStorage.getItem('RangoTirada')) || 9;

        // Asignar valores iniciales a los inputs
        document.getElementById('modificadorTirada').value = modificadorTirada;
        document.getElementById('rangoTirada').value = rangoTirada;

        // Escuchar la respuesta del iframe solo una vez
        window.addEventListener('message', function (event) {
            if (event.data.tipo === 'amenazaActual') {
                amenazaActual = parseInt(event.data.valor, 10);
                if (isNaN(amenazaActual)) {
                    alert('No se pudo obtener el valor de amenazaActual');
                    return;
                }
                manejarAmenaza();
            }
        });

        // Guardar los valores en localStorage cuando se cambien los inputs
        document.getElementById('modificadorTirada').addEventListener('change', function () {
            modificadorTirada = parseInt(this.value);
            localStorage.setItem('ModificadorTirada', modificadorTirada);
        });

        document.getElementById('rangoTirada').addEventListener('change', function () {
            rangoTirada = parseInt(this.value);
            localStorage.setItem('RangoTirada', rangoTirada);
        });


        function manejarEventoAmenaza() {
            const iframe = document.getElementById('iframeMenu');
            // Enviar mensaje al iframe para solicitar el valor de amenazaActual
            iframe.contentWindow.postMessage({ tipo: 'solicitarAmenazaActual' }, '*');
        }

        async function manejarAmenaza() {
            document.getElementById("resultadoFicha").textContent = "";
            const diceImage2 = document.getElementById('dice-image2');
            diceImage2.style.display = 'none';
            const diceImage3 = document.getElementById('dice-image3');
            diceImage3.style.display = 'none';
            playSound();
            rollDice(10, 'dice-image', 'result');
            await new Promise(resolve => setTimeout(resolve, 2000));
            const valordadoTiradad10 = document.getElementById('result');
            valordadoTiradad10.style.display = 'none';
            const amenazaValor = parseInt(valordadoTiradad10.textContent) + modificadorTirada;
            const mensajeAmenaza = document.getElementById('mensajeAmenaza');
            const mensajeAmenazaActual = document.getElementById('mensajeAmenazaActual');
            const opcionesAdicionales = document.getElementById('opcionesAdicionales');
            //const tiradaD20Container = document.getElementById('tiradaD20Container');

            // Limpiamos los mensajes y opciones previos
            mensajeAmenaza.innerHTML = '';
            mensajeAmenazaActual.innerHTML = '';
            opcionesAdicionales.innerHTML = '';
            //tiradaD20Container.innerHTML = '';

            document.getElementById('imagenAmenazaContainer').innerHTML = ''; // Asegúrate de ocultar la imagen

            // Mostramos el resultado de Amenaza Actual
            mensajeAmenazaActual.innerHTML = `<span class="rojo">Amenaza Actual: ${amenazaActual}</span>`;
            // Mostramos el resultado del dado de amenaza
            mensajeAmenaza.innerHTML = `<span class="rojo">Tirada de Amenaza: ${amenazaValor}</span>`;

            // Lógica según el valor de amenaza
            if (amenazaValor === 1 || amenazaValor === 2 || amenazaValor === 3) {

                // Crear un elemento de imagen
                const imagenAmenaza = document.createElement('img');
                imagenAmenaza.alt = 'Amenaza';
                imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque
                imagenAmenaza.src = 'img/Evento_Habitacion.png';

                document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                const btnEvento = document.createElement('button');
                btnEvento.textContent = "Evento en nueva sala";
                opcionesAdicionales.appendChild(btnEvento);

                btnEvento.addEventListener('click', function () {
                    fetch('img/Listado_Cartas.json')
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('imagenAmenazaContainer').innerHTML = '';
                            const tesoros = data.Eventos_habitacion;
                            const randomIndex = Math.floor(Math.random() * tesoros.length);
                            const tesoroAleatorio = tesoros[randomIndex];

                            // Cambiar la imagen
                            const imagen = document.createElement('img');
                            imagen.src = `img/Eventos_habitacion/${tesoroAleatorio}`;
                            imagen.alt = 'Amenaza';
                            imagen.style.width = '300px'; // Puedes ajustar el tamaño
                            imagen.style.display = 'block'; // Asegúrate de que se muestre en bloque
                            document.getElementById('imagenAmenazaContainer').appendChild(imagen);

                        });

                });
            } else if (amenazaValor >= 4 && amenazaValor < rangoTirada) {
                // Crear un elemento de imagen
                const imagenAmenaza = document.createElement('img');
                imagenAmenaza.alt = 'Amenaza';
                imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque
                imagenAmenaza.src = 'img/Tranquilidad.png';

                document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                mensajeAmenaza.innerHTML += `<p><strong>No ocurre nada.</strong></p>`;
            } else if (amenazaValor === 10) {
                const imagenAmenaza = document.createElement('img');
                imagenAmenaza.alt = 'Amenaza';
                imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque
                imagenAmenaza.src = 'img/se_apagan_antorchas.png';

                document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
            }

            // Tirada d20 si amenazaValor es 9 o 10
            if (amenazaValor >= rangoTirada) {
                diceSound.pause();
                diceSound.currentTime = 0;
                playSound();
                rollDice(20, 'dice-image2', 'result2');
                await new Promise(resolve => setTimeout(resolve, 2000));
                const valordadoTiradad20 = document.getElementById('result2');
                valordadoTiradad20.style.display = 'none';
                //const tiradaD20 = lanzarDado(20);
                const tiradaD20 = parseInt(valordadoTiradad20.textContent);

                if (tiradaD20 === 20) {
                    let valorAModificar = -5;
                    modificarAmenaza(valorAModificar);
                    mensajeCombate = "Parece que todo está tranquilo... por ahora...";
                    // Crear un elemento de imagen
                    const imagenAmenaza = document.createElement('img');
                    imagenAmenaza.alt = 'Amenaza';
                    imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                    imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque
                    imagenAmenaza.src = 'img/Tranquilidad.png';

                    document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                    opcionesAdicionales.innerHTML = `<p>${mensajeCombate}</p>`;
                }
                else if (tiradaD20 > amenazaActual) {
                    let valorAModificar = 1;
                    modificarAmenaza(valorAModificar);
                }
                else {
                    mensajeAmenaza.innerHTML += `<p class="rojo"><strong>Se activa Amenaza</strong></p>`;

                    const btnAmenazaCombate = document.createElement('button');
                    btnAmenazaCombate.textContent = "Amenaza en Combate";
                    opcionesAdicionales.appendChild(btnAmenazaCombate);

                    const btnAmenazaSinCombate = document.createElement('button');
                    btnAmenazaSinCombate.textContent = "Amenaza sin Combate";
                    opcionesAdicionales.appendChild(btnAmenazaSinCombate);

                    btnAmenazaCombate.addEventListener('click', async function () {
                        // Crear un elemento de imagen
                        document.getElementById('imagenAmenazaContainer').innerHTML = '';
                        const imagenAmenaza = document.createElement('img');

                        imagenAmenaza.alt = 'Amenaza';
                        imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                        imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque


                        //dado D10 para decidir evento
                        diceImage3.style.display = 'none';
                        playSound();
                        rollDice(10, 'dice-image3', 'result3');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const valordadoTiradadcombate10 = document.getElementById('result3');
                        valordadoTiradadcombate10.style.display = 'none';
                        const tiradaCombate = parseInt(valordadoTiradadcombate10.textContent);

                        //const tiradaCombate = lanzarDado(10);
                        let mensajeCombate;
                        let valorAModificar = 0;
                        if (tiradaCombate === 1) {
                            mensajeCombate = "Una perturbación en el Vacío. Hay un cambio repentino en el Vacío que deja todos los Magos en estado de shock. Los Magos no pueden hacer nada durante el próximo turno ni parar o esquivar.";
                            valorAModificar -= 2;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Perturbacion  en el Vacio.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 2) {
                            mensajeCombate = "Tinte Verdoso. Los héroes se dan cuenta de que el tinte verdoso del filo o garra de los enemigos es algún tipo de veneno. El enemigo adquiere la regla especial 'Venenoso'.";
                            valorAModificar -= 2;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Tinte Verdoso.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 3) {
                            mensajeCombate = "Forjado bajo presión. Bajo presión unos se alzan y otros caen. Un enemigo gana +15HC hasta que muera.";
                            valorAModificar -= 3;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Forjado bajo presion.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 4 || tiradaCombate === 5) {
                            mensajeCombate = "Curación. Un enemigo que esté actualmente herido en el tablero (El que de más experiencia o aleatorio) Se curará 1d10VIT. Esto es debido a una poción de curación o intervención divina de los dioses, O quizás pura voluntad.";
                            valorAModificar -= 3;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Curacion.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 6) {
                            mensajeCombate = "Frenesí. Un enemigo comienza a rugir con rabia y ataca con una fuerza desatada. El enemigo gana el trato de 'Frenesí' hasta que muera.";
                            valorAModificar -= 3;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Frenesi.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 7) {
                            mensajeCombate = "¡Desarmado! Ya sea por un intento de desarme del enemigo por propia torpeza, Un héroe al azar deja caer su arma. Este debe hacer un test de DES Para recuperarla, Gastando 1PA. Si falla, No tendrá armas y no podrá luchar. Puede continuar intentándolo gastando 1PA por intento.";
                            valorAModificar -= 3;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Desarmado.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 8) {
                            mensajeCombate = "¡Temible! Un enemigo parece crecer en presencia. Volviéndose más temible por momentos. Gana la habilidad de 'Miedo'. No hay límite de nivel para este Miedo, Los talentos que hacen ignorarlo, funcionan.";
                            valorAModificar -= 4;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Temible.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        } else if (tiradaCombate === 9) {
                            mensajeCombate = "Refuerzos. Tiran la tabla de encuentros y colocan su resultado justo fuera de una puerta aleatoria, abierta o no, Listos para entrar a una loseta donde haya héroes. Actuarán en el último lugar de este turno. Si la puerta no está abierta, Se considerará desde ahora como abierta y sin trampas.";
                            valorAModificar -= 4;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Refuerzos.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        }
                        else {
                            mensajeCombate = "Adelante. Un enemigo estalla con un rugido feroz que impulsa sus compañeros, Haciéndolos luchar con energías renovadas. Todos los enemigos ganan +10HC hasta el final de la batalla.";
                            valorAModificar -= 6;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d10Adelante.png';
                            imagenAmenaza.style.borderRadius = "5%";
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                        }
                        modificarAmenaza(valorAModificar);
                        // opcionesAdicionales.innerHTML = `<p class="rojo"><strong>${tiradaCombate}:</strong></p>`;
                    });

                    btnAmenazaSinCombate.addEventListener('click', async function () {
                        document.getElementById('imagenAmenazaContainer').innerHTML = '';
                        //dado D10 para decidir evento
                        diceImage3.style.display = 'none';
                        playSound();
                        rollDice(20, 'dice-image3', 'result3');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const valordadoTiradadcombate10 = document.getElementById('result3');
                        valordadoTiradadcombate10.style.display = 'none';
                        const tiradaSinCombate = parseInt(valordadoTiradadcombate10.textContent);

                        //const tiradaSinCombate = lanzarDado(20);
                        let mensajeSinCombate;
                        let valorAModificar = 0;

                        // Crear un elemento de imagen
                        const imagenAmenaza = document.createElement('img');
                        imagenAmenaza.style.width = '250px';
                        imagenAmenaza.alt = 'Amenaza';
                        imagenAmenaza.style.display = 'block'; // Asegúrate de que se muestre en bloque
                        imagenAmenaza.style.display = "flex";
                        if (tiradaSinCombate >= 1 && tiradaSinCombate <= 12) {
                            mensajeSinCombate = "Aparece un montruo errante";
                            valorAModificar = -5;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d20Errante.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                        } else if (tiradaSinCombate >= 13 && tiradaSinCombate <= 15) {
                            mensajeSinCombate = "Añade una carta extra a la parte superior del mazo de exploración";
                            valorAModificar = -5;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d20Sin fin.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                        } else if (tiradaSinCombate === 16 || tiradaSinCombate === 17) {
                            mensajeSinCombate = "El riesgo de encuentro aumenta en 10 para habitaciones y pastillos hasta el final de la misión. (Acumulativo máximo el 70%)";
                            valorAModificar = -6;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d20Nos acechan.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                        } else if (tiradaSinCombate === 18 || tiradaSinCombate === 19) {
                            mensajeSinCombate = "¡Un héroe activo una trampa! La casilla en la que se encuentra el héroe es donde se ubica la trampa.";
                            valorAModificar = -7;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d20Trampa.png';
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

                        }
                        else {
                            mensajeSinCombate = "Añade 1 a todas las tiradas de escenario hasta el final de esta mazmorra. Solo puede suceder una vez por misión.";
                            valorAModificar = -10;
                            imagenAmenaza.src = 'img/Eventos_Amenaza/d20Amenaza.png';
                            imagenAmenaza.style.borderRadius = "5%";
                            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                            if (modificadorTirada === 0) {
                                modificadorTirada += 1; // Incrementar en 1
                                document.getElementById('modificadorTirada').value = modificadorTirada; // Actualizar el input
                                localStorage.setItem('ModificadorTirada', modificadorTirada); // Guardar en localStorage
                            }
                        }
                        modificarAmenaza(valorAModificar);
                        //opcionesAdicionales.innerHTML = `<p class="rojo"><strong>${tiradaSinCombate}:</strong></p>`;

                    });
                }
            }
        }

        // Función para modificar la amenaza
        async function modificarAmenaza(valorAModificar) {
            const iframe = document.getElementById('iframeMenu');
            iframe.contentWindow.postMessage({ tipo: 'cambiarAmenaza', valor: valorAModificar }, '*');
            amenazaActual += valorAModificar;  // Actualizar localmente el valor de amenazaActual
            document.getElementById('amenazaActual').innerHTML = amenazaActual;
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Asegurarse de que el iframe ha cargado
            if (iframe.contentWindow && iframe.contentWindow.checkAmenaza) {
                // Llamar a la función checkAmenaza() que está en el iframe
                iframe.contentWindow.checkAmenaza();
            }
        }

        function playSound() {
            var audio = document.getElementById("diceSound");
            audio.play();
        }

  
        let fichasAliadas = 0;
        let fichasEnemigas = 0;
        let totalFichas = 0;

        function cargarDesdeLocalStorage() {
            const aliadasLS = localStorage.getItem("fichasAliadas");
            const enemigasLS = localStorage.getItem("fichasEnemigas");
            const totalFichasLS = localStorage.getItem("totalFichas");
            const aliadasInputLS = localStorage.getItem("aliadasInput");
            const enemigasInputLS = localStorage.getItem("enemigasInput");

            if (aliadasLS && enemigasLS && totalFichasLS && aliadasInputLS && enemigasInputLS) {
                fichasAliadas = parseInt(aliadasLS);
                fichasEnemigas = parseInt(enemigasLS);
                totalFichas = parseInt(totalFichasLS);
                document.getElementById("aliadas").value = aliadasInputLS;
                document.getElementById("enemigas").value = enemigasInputLS;
                actualizarDisplay();
            }
        }
        function guardarEnLocalStorage() {
            localStorage.setItem("fichasAliadas", fichasAliadas);
            localStorage.setItem("fichasEnemigas", fichasEnemigas);
            localStorage.setItem("totalFichas", totalFichas);
            localStorage.setItem("aliadasInput", document.getElementById("aliadas").value);
            localStorage.setItem("enemigasInput", document.getElementById("enemigas").value);
        }
        // Función para inicializar la bolsa con las cantidades especificadas
        function iniciarBolsa() {
            // Si el total de fichas es distinto de 0, pedir confirmación antes de reiniciar
            if (totalFichas !== 0) {
                const confirmarReinicio = window.confirm("¿Realmente deseas reiniciar la bolsa?");
                if (!confirmarReinicio) {
                    return; // Si el usuario elige "Cancelar", no hace nada
                }
            }
            document.getElementById('imagenAmenazaContainer').innerHTML = '';
            const aliadasInput = parseInt(document.getElementById("aliadas").value);
            const enemigasInput = parseInt(document.getElementById("enemigas").value);

            if (isNaN(aliadasInput) || isNaN(enemigasInput) || aliadasInput < 1 || aliadasInput > 25 || enemigasInput < 1 || enemigasInput > 25) {
                alert("Por favor, introduce valores entre 1 y 25 para ambos campos.");
                return;
            }

            fichasAliadas = aliadasInput;
            fichasEnemigas = enemigasInput;
            totalFichas = fichasAliadas + fichasEnemigas;

            actualizarDisplay();
            guardarEnLocalStorage();
            document.getElementById("resultadoFicha").textContent = "";
            document.getElementById("imagenFicha").style.display = "none"; // Oculta la imagen al reiniciar
        }

        // Función para actualizar los contadores en pantalla
        function actualizarDisplay() {
            document.getElementById("aliadasRestantes").textContent = `Fichas Aliadas Restantes: ${fichasAliadas}`;
            document.getElementById("enemigasRestantes").textContent = `Fichas Enemigas Restantes: ${fichasEnemigas}`;
            document.getElementById("totalFichas").textContent = `Total de Fichas en la Bolsa: ${totalFichas}`;
        }

        // Función para ajustar manualmente la cantidad de fichas
        function ajustarFichas(tipo, cantidad) {
            if (tipo === "aliadas") {
                fichasAliadas = Math.max(0, fichasAliadas + cantidad); // Evita que sea negativo
            } else if (tipo === "enemigas") {
                fichasEnemigas = Math.max(0, fichasEnemigas + cantidad); // Evita que sea negativo
            }
            totalFichas = fichasAliadas + fichasEnemigas;
            actualizarDisplay();
            guardarEnLocalStorage();
        }

        // Función para sacar una ficha aleatoria
        function sacarFicha() {
            if (totalFichas === 0) {
                alert("La bolsa está vacía. Reinicia la bolsa para volver a jugar.");
                return;
            }
            let alternar = true;
            document.getElementById('imagenAmenazaContainer').innerHTML = '';
            const fichaElegida = Math.random() < (fichasAliadas / totalFichas) ? "aliada" : "enemiga";
            const imagenFicha = document.getElementById("imagenAmenazaContainer");
            const imagenAmenaza = document.createElement('img');
            imagenAmenaza.style.display = "block";
            imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
            document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);

            reproducirSonido("bolsa");
            const intervalo = setInterval(() => {
                imagenAmenaza.src = alternar ? "FIniAliadas.png" : "FIniEnemigas.png";

                alternar = !alternar;
            }, 100);
            // Detenemos el efecto de ruleta después de un tiempo
            setTimeout(() => {
                clearInterval(intervalo);


                if (fichaElegida === "aliada" && fichasAliadas > 0) {
                    fichasAliadas--;
                    document.getElementById("resultadoFicha").textContent = "¡Sacaste una ficha aliada!";
                    document.getElementById("resultadoFicha").style.color = "blue";
                    imagenAmenaza.src = "FIniAliadas.png"; // Ruta de la imagen de ficha aliada
                    imagenAmenaza.style.display = "block";
                    imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                    document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                    reproducirSonido("aliada"); // Reproduce sonido de ficha aliada
                } else if (fichaElegida === "enemiga" && fichasEnemigas > 0) {
                    fichasEnemigas--;
                    document.getElementById("resultadoFicha").textContent = "¡Sacaste una ficha enemiga!";
                    document.getElementById("resultadoFicha").style.color = "red";
                    imagenAmenaza.src = "FIniEnemigas.png"; // Ruta de la imagen de ficha enemiga
                    imagenAmenaza.style.display = "block";
                    imagenAmenaza.style.width = '250px'; // Puedes ajustar el tamaño
                    document.getElementById('imagenAmenazaContainer').appendChild(imagenAmenaza);
                    reproducirSonido("enemiga"); // Reproduce sonido de ficha enemiga
                } else {
                    document.getElementById("resultadoFicha").textContent = "Error al sacar ficha, intenta de nuevo.";
                    return;
                }

                totalFichas = fichasAliadas + fichasEnemigas;
                actualizarDisplay();
                guardarEnLocalStorage();
            }, 2000); // Duración del efecto de ruleta en milisegundos
        }

        // Función para reproducir un sonido aleatorio según el tipo de ficha
        function reproducirSonido(tipo) {
            const numeroAleatorio = Math.floor(Math.random() * 10) + 1; // Número aleatorio entre 1 y 10
            let rutaSonido = "";

            if (tipo === "aliada") {
                rutaSonido = `SonidosIniciativa/Aliado2.mp3`;
            } else if (tipo === "bolsa") {
                rutaSonido = `SonidosIniciativa/sacar_bolsa.mp3`;
            } else if (tipo === "enemiga") {
                rutaSonido = `SonidosIniciativa/Enemigo${numeroAleatorio}.mp3`;
            }

            const audio = new Audio(rutaSonido);
            audio.play();
        }
        // Escucha el cambio en los cuadros de texto para actualizar el localStorage en tiempo real
        document.getElementById("aliadas").addEventListener("input", guardarEnLocalStorage);
        document.getElementById("enemigas").addEventListener("input", guardarEnLocalStorage);

        // Inicializar la bolsa al cargar la página
        //iniciarBolsa();
        cargarDesdeLocalStorage();
  