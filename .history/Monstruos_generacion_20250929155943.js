let monstersByCategory = {};
let equipo = {};

const coloresId = [
    "white", "red", "lightblue", "green", "yellow", "orange", "black", "gray",
    "darkblue", "darkgreen", "brown", "violet", "gold", "silver", "turquoise"
];

function populateCantidadSelect() {
    const sel = document.getElementById("cantidadSelect");
    sel.innerHTML = "";
    for (let i = 1; i <= 15; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        if (i === 1) opt.selected = true;
        sel.appendChild(opt);
    }
}

// Cargar JSONs
Promise.all([
    fetch("json/Monstruos_stats.json").then(r => r.json()),
    fetch("json/Monstruos_equipo.json").then(r => r.json()),
    fetch("json/tamanos_monstruos.json").then(r => r.json()) // 🔹 nuevo
]).then(([monstruosData, equipoData, tamanosData]) => {
    monstersByCategory = monstruosData;
    equipo = equipoData;
    tamanos = tamanosData.tamaños || {}; // 🔹 accedemos al objeto interno


    // Poblar categorías
    const catSelect = document.getElementById("monsterCategorySelect");
    Object.keys(monstruosData).sort().forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        catSelect.appendChild(opt);
    });

    populateEquipoSelects();
    populateCantidadSelect();
    loadFromLocalStorage();
}).catch(err => {
    console.error("Error cargando JSONs:", err);
    populateCantidadSelect();
});
const togglePanelBtn = document.getElementById("togglePanelBtn");
//poner todos los checks de activado a false
const resetTurnsBtn = document.getElementById("resetTurnsBtn");

resetTurnsBtn.addEventListener("click", () => {
    const allCards = document.querySelectorAll(".monster-card");
    allCards.forEach(card => {
        const vidaItems = card.querySelectorAll(".vida-item");
        vidaItems.forEach((item, idx) => {
            const chk = item.querySelector(".chk-activado");
            const lbl = item.querySelector(".lbl-activado");
            if (chk && lbl) {
                chk.checked = false;
                lbl.style.backgroundColor = "transparent";
                lbl.style.color = "inherit";
                chk.style.accentColor = "";
            }

            // actualizar estado en memoria
            if (card._activados) {
                card._activados[idx] = false;
            }
        });

        // actualizar dataset
        const data = JSON.parse(card.dataset.info || "{}");
        data.activados = card._activados || [];
        card.dataset.info = JSON.stringify(data);
    });

    saveToLocalStorage();
});
const monsterPanel = document.getElementById("monsterPanel");

togglePanelBtn.addEventListener("click", () => {
    if (monsterPanel.style.display === "none") {
        monsterPanel.style.display = "block";
        togglePanelBtn.textContent = "Ocultar Panel de Monstruos";
    } else {
        monsterPanel.style.display = "none";
        togglePanelBtn.textContent = "Mostrar Panel de Monstruos";
    }
});
function populateMonstersByCategory(cat) {
    const select = document.getElementById("monsterSelect");
    select.innerHTML = `<option value="" disabled selected>-- Selecciona monstruo --</option>`;
    if (!monstersByCategory[cat]) return;

    monstersByCategory[cat]
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
        .forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.nombre; // usamos nombre como clave
            opt.textContent = m.nombre;
            select.appendChild(opt);
        });
}

document.getElementById("monsterCategorySelect").addEventListener("change", e => {
    populateMonstersByCategory(e.target.value);
});

function populateEquipoSelects() {
    document.getElementById("armaSelect").innerHTML =
        (equipo.Armas || []).map((a, i) => `<option value="${i}">${a.Tipo}</option>`).join("");
    document.getElementById("armaduraSelect").innerHTML =
        (equipo.Armaduras || []).map((a, i) => `<option value="${i}">${a.Tipo}</option>`).join("");
    document.getElementById("hechizoSelect").innerHTML =
        (equipo.Hechizos || []).map((h, i) => `<option value="${i}">${h.Tipo}</option>`).join("");
}

function updateVidaBar(barFill, val, max) {
    const percent = max === 0 ? 0 : val / max;
    barFill.style.setProperty("--vida-scale", percent);
    const textEl = barFill.querySelector(".vida-bar-text");
    if (textEl) textEl.textContent = `${val}/${max}`;
    let color;
    if (percent > 0.7) color = "linear-gradient(to right,#77dd77,#c1f0c1)";
    else if (percent > 0.3) color = "linear-gradient(to right,#fdfd96,#fffac8)";
    else color = "linear-gradient(to right,#ff6961,#ffcccb)";
    barFill.style.setProperty("--vida-color", color);
}

function renderCard(monster, category, armas, armaduras, hechizos, color = "#fff", vidas = null, save = true) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("monster-card");
    wrapper.style.backgroundColor = color;

    const cantidad = vidas ? vidas.length : parseInt(document.getElementById("cantidadSelect").value || "1", 10);
    wrapper._vidas = vidas ? vidas.slice() : Array(cantidad).fill(monster.vida);

    const barraBase = 100;
    const barraExtra = monster.vida * 2;
    const barraMax = 300;
    const barraWidth = Math.min(barraBase + barraExtra, barraMax);

    // --- Armas con iconos especiales ---
    const armasHTML = (armas || []).map(a => {
        let icono = "🗡️";
        if (a.Tipo.toLowerCase() === "arma maldita") icono = "🗡️☠️";
        if (a.Tipo.toLowerCase() === "arma envenenada") icono = "🗡️🧪";
        return `<span class="equipment" data-tooltip="${a.Efecto || ""}">${icono} ${a.Tipo}${a.Daño ? " (" + a.Daño + ")" : ""}</span>`;
    }).join("");

    const armadurasHTML = (armaduras || []).map(a => `<span class="equipment" data-tooltip="${a.Efecto || ""}">🛡️ ${a.Tipo}</span>`).join("");

   const hechizosHTML = (hechizos || []).length
    ? `<strong>Hechizos:</strong> ` +
      (hechizos || []).map(h => `
          <span 
              class="tooltip-hechizo"
              data-tippy-content="<div style='width:500px;height:500px;font-size:20px; text-align:center; border:5px solid orange; border-radius:10px; padding:5px;'>
    <img src='img/hechizos/${h.Tipo}.png' style='width:200px;height:20px%;display:block;margin:0 auto 5px auto;'>
    ${h.Efecto}
</div>">
              ${h.Categoría}: ${h.Tipo}
          </span>`
      ).join(", ")
    : "";

    // --- Vidas grid ---
    wrapper._activados = (vidas && vidas._activados) ? vidas._activados.slice() : Array(cantidad).fill(false);

    let vidasGrid = '<div class="vidas-grid">';
    wrapper._vidas.forEach((vida, i) => {
        const colorBorde = coloresId[i] || "black";
        const checkedAttr = wrapper._activados[i] ? "checked" : "";
        vidasGrid += `
            <div class="vida-item" style="border:10px solid ${colorBorde};background-color: gray;" >
            <label class="lbl-activado" style="font-size:12px;display:block;margin-bottom:3px;">
            <input type="checkbox" class="chk-activado" data-idx="${i}" ${checkedAttr}> ¿Activado?
            </label>
            <div style="display:flex;gap:6px;align-items:center">
            <div class="vida-id">${i + 1}</div>
            <button class="vida-btn restar">-</button>
            <div class="vida-bar" style="width:${barraWidth}px">
                <div class="vida-bar-fill"><span class="vida-bar-text">${vida}/${monster.vida}</span></div>
            </div>
            <button class="vida-btn sumar">+</button>
            </div>
            <!-- 🔹 Botón de saquear oculto por defecto -->
            <div class="saqueo-container" style="text-align:center; margin-top:5px;">
            <button class="btn-saquear" style="display:none; font-size:12px; padding:2px 6px;">Saquea</button>
            <div class="resultado-saqueo" style="font-size:12px; margin-top:3px; color:gold;"></div>
            </div>
            </div>`;
    });
    vidasGrid += "</div>";

    // --- HTML principal ---
    wrapper.innerHTML = `
        <button class="remove-btn">X</button>
        <div class="monster-header">
            <div class="monster-left">
                <img src="${obtenerImagenToken(monster.nombreBase || monster.nombre)}" 
                     alt="${monster.nombre}"
                     onerror="this.onerror=null; this.src='img/Monstruos/imagenes/default.png';">
                <div class="death-overlay"></div>
            </div>

            <div class="monster-basic">
                <h2>${monster.nombre}</h2>
               <p>
   
  <span class="tipo-monstruo" 
        data-tipo="${monster.tipo}"><strong>Tipo:</strong>
        ${monster.tipo}
  </span>
</p>
                <p>❤️ <strong>:</strong> ${monster.vida}</p>
                <p><strong>EXP:</strong> ${monster.exp} 💰 ${monster.recompensa}</p>
            </div>

            <div class="monster-center">
                <div class="center-row">
                    <div class="weapons-column">${armasHTML}</div>
                    <div class="armors-column">${armadurasHTML}</div>
                </div>
                <div class="center-row">
                    <table>
                        <tr>
                            <th>HC</th><th>HD</th><th>DAÑ</th><th>DET</th>
                            <th>RG</th><th>AN</th><th>M</th><th>DES</th>
                        </tr>
                        <tr>
                            <td>${monster.HC}</td><td>${monster.HD}</td><td>${monster.DAN}</td><td>${monster.DET}</td>
                            <td>${monster.RG}</td><td>${monster.AN}</td><td>${monster.M}</td><td>${monster.DES}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="monster-right">
                ${monster.habilidades.map(h => `<p>${h}</p>`).join("")}
            </div>
        </div>

        <div class="hechizos-list">${hechizosHTML}</div>

        ${vidasGrid}
    `;

    // --- Botón eliminar ---
    wrapper.querySelector(".remove-btn").addEventListener("click", () => {
        wrapper.remove();
        saveToLocalStorage();
    });

    const deathOverlay = wrapper.querySelector(".death-overlay");
    const vidaItems = wrapper.querySelectorAll(".vida-item");

    function actualizarVida(idx, nuevaVida) {
        wrapper._vidas[idx] = Math.max(0, Math.min(monster.vida, nuevaVida));
        const barFill = vidaItems[idx].querySelector(".vida-bar-fill");
        updateVidaBar(barFill, wrapper._vidas[idx], monster.vida);

        // Mostrar u ocultar botón de saqueo
        const btnSaqueo = vidaItems[idx].querySelector(".btn-saquear");
        if (wrapper._vidas[idx] === 0) {
            btnSaqueo.style.display = "inline-block";
        } else {
            btnSaqueo.style.display = "none";
        }

        deathOverlay.style.display = wrapper._vidas.every(v => v === 0) ? "block" : "none";
        saveToLocalStorage();
    }

    vidaItems.forEach((item, idx) => {
        const barFill = item.querySelector(".vida-bar-fill");
        updateVidaBar(barFill, wrapper._vidas[idx], monster.vida);
        item.querySelector(".restar").addEventListener("click", () => actualizarVida(idx, wrapper._vidas[idx] - 1));
        item.querySelector(".sumar").addEventListener("click", () => actualizarVida(idx, wrapper._vidas[idx] + 1));
        //eventos del check activado
        const chk = item.querySelector(".chk-activado");
        const lbl = item.querySelector(".lbl-activado");

        function actualizarEstiloActivado() {
            if (chk.checked) {
                lbl.style.backgroundColor = "red";
                lbl.style.color = "white";
                chk.style.accentColor = "red"; // hace que el check en navegadores modernos sea rojo
            } else {
                lbl.style.backgroundColor = "transparent";
                lbl.style.color = "inherit";
                chk.style.accentColor = "";
            }
        }

        // inicializar estilo
        actualizarEstiloActivado();

        // evento cambio
        chk.addEventListener("change", () => {
            wrapper._activados[idx] = chk.checked;
            actualizarEstiloActivado();
            saveToLocalStorage();
        });
        // 🔹 Evento del botón Saquear
        // 🔹 Evento del botón Saquear
        const btnSaqueo = item.querySelector(".btn-saquear");
        const resultado = item.querySelector(".resultado-saqueo");
        btnSaqueo.addEventListener("click", async () => {
            const tipoSaqueo = monster.recompensa.trim();
            const imgSrc = `img/Monstruos/saquear/${tipoSaqueo}.png`;

            // Tirada aleatoria 1d10
            const tirada = Math.floor(Math.random() * 10) + 1;

            // Cargar el JSON de saqueo si no está ya cargado
            if (!window.saqueoData) {
                window.saqueoData = await fetch("json/Monstruos_saquear_cadaveres.json").then(r => r.json());
            }

            // Buscar objeto correspondiente en el JSON
            let objetoGanado = "Nada encontrado";
            const tabla = window.saqueoData[tipoSaqueo];
            if (tabla) {
                const entrada = tabla.find(e => e["1d10"] === String(tirada));
                if (entrada) objetoGanado = entrada.Objeto;
            }

            Swal.fire({
                title: `¡Saqueo de ${monster.nombre}!`,
                html: `
            <img src="${imgSrc}" style="width:300px;height:300px;object-fit:contain;"><br>
            <p>Has tirado un <strong>d10</strong> y salió: <strong>${tirada}</strong></p>
            <p><strong>Has encontrado:</strong> ${objetoGanado}</p>
        `,
                confirmButtonText: "Aceptar"
            }).then(() => {
                btnSaqueo.style.display = "none";
                resultado.innerHTML = `<span style="color:gold;">Saqueado (d10=${tirada}): ${objetoGanado}</span>`;

                // Guardar resultado en la data de la carta
                const data = JSON.parse(wrapper.dataset.info || "{}");
                data.saqueos = data.saqueos || {};
                data.saqueos[idx] = { tirada, objeto: objetoGanado };
                wrapper.dataset.info = JSON.stringify(data);
                saveToLocalStorage();
            });
        });
    });

    deathOverlay.style.display = wrapper._vidas.every(v => v === 0) ? "block" : "none";

    if (save) saveToLocalStorage();

 

    // Inicializar tooltips solo dentro de esta carta
    tippy(wrapper.querySelectorAll('.tooltip-hechizo'), {
        allowHTML: true,
        animation: 'scale',
        theme: 'carta',
        placement: 'top',
        maxWidth: 500,
    });

    // 🔹 Tooltip para el tipo de monstruo
    const tipoEl = wrapper.querySelector(".monster-basic p span.tipo-monstruo");
    if (tipoEl) {
        const tipoTexto = tipoEl.dataset.tipo.split("/")[0].trim(); // solo la primera parte
        const imgSrc = `img/Monstruos/comportamiento/${tipoTexto}.png`;

        tippy(tipoEl, {
            allowHTML: true,
            animation: 'scale',
            theme: 'carta',
            placement: 'right',
            content: `<img src="${imgSrc}" style="width:300%;height:300%;object-fit:contain;">`,
        });
    }

    return wrapper;

}


function saveToLocalStorage() {
    const cards = [...document.querySelectorAll(".monster-card")].map(card => {
        const data = JSON.parse(card.dataset.info || "{}");
        data.vidas = card._vidas;
        data.color = card.style.backgroundColor;
        data.activados = card._activados || [];   // 🔹 Guardamos los checks
        return data;
    });
    localStorage.setItem("monstersInPlay", JSON.stringify(cards));
}

function loadFromLocalStorage() {
    const saved = JSON.parse(localStorage.getItem("monstersInPlay") || "[]");
    const container = document.getElementById("monsterContainer");
    container.innerHTML = ""; // opcional: limpiar antes de restaurar

    saved.forEach(data => {
        const monster = (monstersByCategory[data.category] || []).find(m => m.nombre === data.monsterName);
        if (!monster) {
            console.warn("Monstruo no encontrado para", data);
            return;
        }

        const armas = (data.armas || []).map(i => equipo.Armas[i]).filter(Boolean);
        const armaduras = (data.armaduras || []).map(i => equipo.Armaduras[i]).filter(Boolean);
        const hechizos = (data.hechizos || []).map(i => equipo.Hechizos[i]).filter(Boolean);

        // PREPARAR 'vidas' para pasarlo a renderCard:
        // hacemos una copia del array de vidas y le añadimos la propiedad _activados
        const vidasParam = data.vidas ? data.vidas.slice() : null;
        if (vidasParam) {
            vidasParam._activados = Array.isArray(data.activados) ? data.activados.slice() : [];
        }

        // Crear la carta sin forzar guardado (save = false)
        const card = renderCard(monster, data.category, armas, armaduras, hechizos, data.color || "#fff", vidasParam, false);

        // Guardar la info original en el dataset (como antes)
        card.dataset.info = JSON.stringify(data);

        // Insertar en DOM
        container.appendChild(card);

        // Restaurar saqueos guardados (data.saqueos guarda objetos {tirada, objeto})
        if (data.saqueos) {
            const vidaItems = card.querySelectorAll(".vida-item");
            Object.entries(data.saqueos).forEach(([idx, saqueo]) => {
                const item = vidaItems[idx];
                if (item) {
                    const btnSaqueo = item.querySelector(".btn-saquear");
                    const resultado = item.querySelector(".resultado-saqueo");
                    if (btnSaqueo) btnSaqueo.style.display = "none";
                    if (resultado) resultado.innerHTML = `<span style="color:gold;">Saqueado (d10=${saqueo.tirada}): ${saqueo.objeto}</span>`;
                }
            });
        }
    });
}
document.getElementById("addMonsterBtn").addEventListener("click", () => {
    const category = document.getElementById("monsterCategorySelect").value;
    const monsterName = document.getElementById("monsterSelect").value;
    if (!category || !monsterName) return;
    const monster = (monstersByCategory[category] || []).find(m => m.nombre === monsterName);
    if (!monster) return;

    const armasSel = [...document.getElementById("armaSelect").selectedOptions].map(o => parseInt(o.value));
    const armadurasSel = [...document.getElementById("armaduraSelect").selectedOptions].map(o => parseInt(o.value));
    const hechizosSel = [...document.getElementById("hechizoSelect").selectedOptions].map(o => parseInt(o.value));
    const colorSel = document.getElementById("colorSelect").value;

    const armas = armasSel.map(i => equipo.Armas[i]).filter(Boolean);
    const armaduras = armadurasSel.map(i => equipo.Armaduras[i]).filter(Boolean);
    const hechizos = hechizosSel.map(i => equipo.Hechizos[i]).filter(Boolean);

    const card = renderCard(monster, category, armas, armaduras, hechizos, colorSel);
    const infoObj = { monsterName, category, armas: armasSel, armaduras: armadurasSel, hechizos: hechizosSel, color: colorSel, vidas: card._vidas };
    card.dataset.info = JSON.stringify(infoObj);
    document.getElementById("monsterContainer").appendChild(card);
    saveToLocalStorage();
});

function populateMonstersOnCategoryChange() {
    // helper: nothing extra
}

document.addEventListener("mousedown", function (e) {
    const target = e.target;
    if (target.tagName === "OPTION" && target.parentElement && target.parentElement.multiple) {
        e.preventDefault();
        target.selected = !target.selected;
    }
});
