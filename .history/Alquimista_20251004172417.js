// Ingredientes y partes de monstruos
const ingredients = [
    "Raíz arqueada", "Jengibre ceniciento", "Ajenjo Espinado", "Ambrosía", "Equinácea azul",
    "Callicarpa brillante", "Polen del Amaru", "Corteza de arce rojo", "Artemisa salada",
    "Asclepia picante", "Frambuesa gigante", "Baya lunar", "Laurel del monje", "Agracejo",
    "Belladona", "Dulcamara", "Hiedra dulce", "Perejil tóxico", "Barbárea", "Trébol llorón"
];

const monsterParts = Array.from(new Set([
    "Ectoplasma", "Colmillo de araña", "Plumas", "Sangre humana", "Tejido cerebral",
    "Corazón bestial", "Quitina", "Sangre de dragón", "Pelo de elfo", "Alas murciélago",
    "Hojas enredador", "Polvo de huesos", "Uñas", "Ojo de goblin", "Escamas",
    "Piel", "Ojo de medusa", "Lengua", "Polvo de momia", "Sangre de necro",
    "Diente de ogro", "Sangre de orco", "Cola de rata", "Viscosidad", "Piel anfibia",
    "Sangre de troll", "Sangre Vampiro", "Piel de zombi"
]));

const defaultRecipes = [
    { type: "Básica", name: "Poción de Curación", ingredients: ["Sangre humana", "Cola de rata", "Jengibre ceniciento"], default: true, title: "Sana Sanita" },
    { type: "Básica", name: "Contra Enfermedades", ingredients: ["Piel de zombi", "Ala de murciélago", "Laurel del monje"], default: true, title: "Sana enferme" },
    { type: "Básica", name: "Flamígera", ingredients: ["Corazón de bestia", "Cola de rata", "Baya lunar"], default: true, title: "pum" },
    { type: "Básica", name: "Antídoto", ingredients: ["Colmillo de araña", "Barbárea", "Agracejo"], default: true, title: "cura eneno" },
    { type: "Básica", name: "Experiencia", ingredients: ["Sangre de dragón", "Hiedra dulce", "Belladona"], default: true, title: "Exp up" },
    { type: "Básica", name: "Restauración", ingredients: ["Sangre de vampiro", "Sangre de troll", "Corteza de arce rojo"], default: true, title: "restaura tripita" }
];

// Nombres de pociones
const potionNames = {
    Básica: {
        d3_1_2: [
            "Experiencia", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
            "Maná", "Fuerza", "Sabiduría", "Ácido", "Nauseabunda", "Flamígera",
            "Invisibilidad", "Corrosión", "Contra Enfermedades", "Antídoto",
            "Veneno", "Fuego Líquido", "Frasco del Vacío", "Aceite para Armas"
        ],
        d3_3: [
            "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
            "Resistencia al Fuego", "Escama de Dragón", "Restauración",
            "Escupefuego", "Humo"
        ]
    },
    Débil_and_Suprema: [
        "Flamígera", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
        "Maná", "Fuerza", "Sabiduría", "Ácido", "Contra Enfermedades", "Antídoto"
    ]
};

// Descripciones de las pociones
const potionDescriptions = {
    "Experiencia": "Otorga 300 EXP. Un héroe sólo puede beber una entre mazmorras.",
    "Constitución": "Débil: +10 CON; Básica: +15 CON; Supremaa: +20 CON.",
    "Valentía": "Débil: +10 DET; Básica: +15 DET; Supremaa: +20 DET.",
    "Destreza": "Débil: +5 DES; Básica: +10 DES; Supremaa: +15 DES.",
    "Energía": "Débil: +1 ENERGÍA; Básica: +2 ENERGÍA; Supremaa: +3 ENERGÍA.",
    "Vitalidad": "Débil: 1d4 VIT; Básica: 1d6 VIT; Supremaa: 1d10 VIT.",
    "Maná": "Débil: 1d20 Maná; Básica: 2d20 Maná; Supremaa: 3d20 Maná.",
    "Fuerza": "Débil: +10 FUE; Básica: +15 FUE; Supremaa: +20 FUE.",
    "Sabiduría": "Débil: +10 SAB; Básica: +15 SAB; Supremaa: +20 SAB.",
    "Ácido": "Débil: 1d6 DAÑ; Básica: 1d10 DAÑ; Supremaa: 1d12 DAÑ.",
    "Nauseabunda": "Cualquier miniatura en esa casilla realizará una tirada de DET o perderá su siguiente turno. Cualquier miniatura en una casilla adyacente realizará una tirada de DET +20. No tiene efecto en No muertos.",
    "Flamígera": "Débil: 1d6 DAÑ; Básica: 1d10 DAÑ; Supremaa: 1d12 DAÑ.",
    "Invisibilidad": "Quita al héroe del tablero hasta que la batalla termine. Cuando finalice, vuelve a cualquier casilla de la loseta.",
    "Corrosión": "Para abrir una puerta. El héroe debe gastar 1 PA adyacente a una puerta para usar esta poción y abrirla automáticamente.",
    "Contra Enfermedades": "Débil tiene un 75% de éxito, la Básica y la Supremaa tendrán un 100%. Además, la Supremaa curará un 1d3 VIT.",
    "Antídoto": "Débil tiene un 75% de éxito, la Básica y la Supremaa tendrán un 100%. Además, la Supremaa curará un 1d3 VIT.",
    "Veneno": "Puede aplicarse a un arma en cualquier momento, también se puede usar para envenenar 5 proyectiles. Dura hasta el final de la próxima batalla. Los enemigos dañados con un arma envenenada perderán 1 VIT cada turno.",
    "Fuego Líquido": "Esta poción puede aplicarse en un arma a melé, prendiéndola. El arma causará daño de fuego hasta el final de la batalla.",
    "Frasco del Vacío": "Cuando se abre este frasco, absorbe toda la magia. Cualquier hechizo lanzado en la batalla sufre una penalización de -20 además de su modificación de VH.",
    "Aceite para Armas": "Cada arma de filo puede ser cubierta con esta pócima. Otorgará +1 DAÑ hasta que abandonéis la mazmorra.",
    "Velocidad": "Beber esto otorgará al héroe un extra de movimiento de +1 durante el resto de la mazmorra.",
    "Polvo Químico": "Si se usa antes de buscar en una habitación o pasillo, se puede volver a tirar y elegir el mejor resultado. 1 uso.",
    "Elixir de Arquero": "Utilizado en armas a distancia, añadirá +1 DAÑ hasta abandonar la mazmorra.",
    "Poción de Furia": "Esta poción otorga la ventaja 'Frenesí' sin pagar coste de energía. Dura una batalla completa.",
    "Resistencia al Fuego": "Todo el daño de fuego es reducido en 1d10. Haz una tirada cada vez que el Héroe es dañado. Dura hasta el final de la siguiente batalla.",
    "Escama de Dragón": "El héroe ignora todo el daño durante 3 turnos, exceptuando el daño mágico o de veneno. La armadura puede seguir siendo dañada, pero el Héroe no perderá VIT.",
    "Restauración": "Restaura toda la vitalidad de un héroe y elimina enfermedades y venenos.",
    "Escupefuego": "Alcance de 2 casillas y puede causar 1d8 Daño de Fuego en la casilla adyacente al héroe o 1d4 Daño de Fuego en la casilla adyacente y la siguiente a esa también.",
    "Humo": "Obstruye la LDV en la casilla donde explota y las 8 adyacentes. Toda pelea dentro del rango del humo sufre -20 HC y disparar a través del humo no es posible. Dura 4 turnos."
};

// LocalStorage Keys
const INVENTORY_KEY = "alchemy_inventory";
const RECIPES_KEY = "alchemy_recipes";

// Cargar datos iniciales
const inventory = JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];

// Borrar datos de alquimia
function resetAlchemyData() {
    customConfirm("Eliminar Todo Conocimiento",
        "reiniciar_alquimia", "Inventario y recetas serán borrados.<br>El destino no permite deshacerlo.<br><br><strong>¿Estás seguro?</strong>",
        () => {
            localStorage.removeItem("alchemy_inventory");
            localStorage.removeItem("alchemy_recipes");
            customAlert("¡Se han eliminado los datos de Alquimia! Comenzamos de 0.", "reiniciar_alquimia");
            location.reload();
        },
        () => {}
    );
}

// ✅ MODIFICADA: customAlert con hook y contenedor adicional
function customAlert(message, imagen_icono, onAfterRender) {
    if (typeof Swal !== 'undefined' && Swal.fire) {
        Swal.fire({
            html: `${message}<div id="custom-alert-extra" style="margin-top:10px;"></div>`,
            imageUrl: `img/interface/${imagen_icono}.png`,
            imageWidth: 150,
            imageHeight: 150,
            confirmButtonText: 'Entendido',
            customClass: {
                popup: 'mi-popup-veneno',
                title: 'mi-titulo-veneno',
                content: 'mi-texto-veneno'
            },
            didOpen: () => {
                if (typeof onAfterRender === 'function') {
                    try { onAfterRender(); } catch (e) { console.error(e); }
                }
            }
        });
    } else {
        alert(message); // fallback
    }
}

// confirm con SweetAlert2
function customConfirm(mensaje_confirmacion, imagen_icono, message, onConfirm, onCancel) {
    if (typeof Swal !== 'undefined' && Swal.fire) {
        Swal.fire({
            html: message,
            imageUrl: `img/interface/${imagen_icono}.png`,
            imageWidth: 150,
            imageHeight: 150,
            showCancelButton: true,
            confirmButtonText: mensaje_confirmacion,
            cancelButtonText: 'Mejor en otro momento',
            customClass: {
                popup: 'mi-popup-veneno',
                title: 'mi-titulo-veneno',
                content: 'mi-texto-veneno'
            }
        }).then(result => {
            if (result.isConfirmed && typeof onConfirm === 'function') onConfirm();
            else if (result.dismiss === Swal.DismissReason.cancel && typeof onCancel === 'function') onCancel();
        });
    } else {
        if (confirm(message)) { if (typeof onConfirm === 'function') onConfirm(); }
        else { if (typeof onCancel === 'function') onCancel(); }
    }
}

// Botón "Comenzar de 0"
document.getElementById("reset-button").addEventListener("click", resetAlchemyData);

// Guardar
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    if (typeof renderRecipeTable === 'function') renderRecipeTable();
}
function saveRecipes() {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

// Listas combinadas
const combinedItems = [
    ...ingredients.map(name => ({ name, type: "Ingrediente" })),
    ...monsterParts.map(name => ({ name, type: "Parte" }))
].sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
});

// Ordenar inventario
function sortInventory() {
    inventory.sort((a, b) => {
        const typeA = ingredients.includes(a.name) ? "Ingrediente" : "Parte";
        const typeB = ingredients.includes(b.name) ? "Ingrediente" : "Parte";
        if (typeA !== typeB) return typeA.localeCompare(typeB);
        return a.name.localeCompare(b.name);
    });
}

// Render inventario
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    if (!tbody) { console.error("El elemento #inventory-table tbody no existe."); return; }
    tbody.innerHTML = "";

    if (inventory.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No hay elementos en el inventario.</td></tr>";
        return;
    }

    sortInventory();

    inventory.forEach((item, index) => {
        const itemType = ingredients.includes(item.name) ? "Ingrediente" : "Parte";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${itemType}</td>
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "Sí" : "No"}</td>
            <td>
                <button class="btn_delete" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;"></button>
            </td>
        `;
        tbody.appendChild(row);

        const removeButton = row.querySelector(".btn_delete");
        removeButton.addEventListener("click", () => {
            removeInventoryItem(index);
        });
    });
}

// Eliminar del inventario
function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) { console.error("Índice inválido:", index); return; }
    const itemName = inventory[index].name;

    customConfirm("Eliminar el Ingrediente",
        "eliminar_ingrediente",
        `¿Deseas desterrar </strong>"${itemName}"</strong> de tu inventario?<br>Una vez hecho, su esencia se perderá para siempre.`,
        () => {
            const removedItem = inventory.splice(index, 1);
            saveInventory();
            renderInventoryTable();
            customAlert(`Ingrediente <strong>"${removedItem[0].name}"</strong> Destruido.`, "eliminar_ingrediente");
        },
        () => {}
    );
}

// 🔸 Normalización para comprobaciones
function normStr(s) {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
}

// 🔸 ¿tengo el material?
function hasMaterialAvailable(name) {
    const target = normStr(name);
    return inventory.some(it => normStr(it.name) === target && (it.units || 0) > 0);
}

// 🔸 Pinta ingredientes con colores (coma blanca)
function formatRecipeIngredientsWithAvailability(ingredientsArr) {
    if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) return "";
    const parts = [];
    ingredientsArr.forEach((ing, idx) => {
        const ok = hasMaterialAvailable(ing);
        parts.push(`<span style="color:${ok ? '#67e667' : '#ff6b6b'}; font-weight:bold;">${ing}</span>`);
        if (idx < ingredientsArr.length - 1) parts.push(`<span style="color:#fff;">, </span>`);
    });
    return parts.join('');
}

// Render recetario
function renderRecipeTable() {
    const tbody = document.querySelector("#recipe-table tbody");
    if (!tbody) { console.error("El elemento #recipe-table tbody no existe."); return; }
    tbody.innerHTML = "";

    if (recipes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No hay recetas registradas.</td></tr>";
        return;
    }

    sortRecipes();

    recipes.forEach((recipe, index) => {
        const row = document.createElement("tr");
        const description = potionDescriptions[recipe.name] || "Descripción no disponible";
        const potionLink = `<span style="color: white;"><p href="#" title="${description}">${recipe.name}</p></span>`;
        const ingHTML = formatRecipeIngredientsWithAvailability(recipe.ingredients);

        row.innerHTML = `
            <td>${potionLink}</td>
            <td>${recipe.type}</td>
            <td>${ingHTML}</td>
            <td>${recipe.default ? "" : `
                <button class="forget-recipe" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Olvidar</button>
            `}</td>
        `;
        tbody.appendChild(row);

        if (!recipe.default) {
            const forgetButton = row.querySelector(".forget-recipe");
            forgetButton.addEventListener("click", () => {
                forgetRecipe(index);
            });
        }
    });
}

// Ordenar recetas
function sortRecipes() {
    recipes.sort((a, b) => a.name.localeCompare(b.name));
}

// Olvidar receta
function forgetRecipe(index) {
    const recipeToForget = recipes[index];
    if (recipeToForget.default) {
        customAlert(`La receta <strong>"${recipeToForget.name}"</strong> es predeterminada y no se puede olvidar.`, "eliminar_receta");
        return;
    }

    customConfirm(
        "Olvidar Receta",
        "eliminar_receta",
        `¿Deseas olvidar la Receta <strong>"${recipeToForget.name}"</strong>?<br>Una vez hecho, su conocimiento se desvanecerá para siempre.`,
        () => {
            recipes.splice(index, 1);
            saveRecipes();
            renderRecipeTable();
            customAlert(`Receta <strong>"${recipeToForget.name}"</strong> olvidada con éxito.`, "eliminar_receta");
        },
        () => {}
    );
}

// Añadir material al inventario
document.getElementById("add-material").addEventListener("click", () => {
    const material = document.getElementById("material-select").value;
    const units = parseInt(document.getElementById("material-units").value, 10);
    const exquisite = document.getElementById("material-exquisite").checked;

    const existing = inventory.find(item => item.name === material && item.exquisite === exquisite);
    if (existing) existing.units += units;
    else inventory.push({ name: material, units, exquisite });

    saveInventory();
    renderInventoryTable();
});

// Inicializar desplegable de materiales
function initializeMaterialDropdown() {
    const materialSelect = document.getElementById("material-select");
    materialSelect.innerHTML = "";
    combinedItems.forEach(({ name, type }) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = `${type}: ${name}`;
        materialSelect.appendChild(option);
    });
}

// DOM Ready (carga básica)
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");

    let storedRecipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];
    const isDefaultLoaded = storedRecipes.some(recipe => recipe.default);
    if (!isDefaultLoaded) {
        storedRecipes = [...storedRecipes, ...defaultRecipes];
        localStorage.setItem(RECIPES_KEY, JSON.stringify(storedRecipes));
    }
    recipes.length = 0;
    recipes.push(...storedRecipes);

    initializeMaterialDropdown();
    renderInventoryTable();
    renderRecipeTable();
});

// Popular selects de poción desde inventario
function populatePotionSelectors() {
    const selectors = document.querySelectorAll(".potion-selector");
    const usedNames = Array.from(selectors)
        .filter(select => select.value)
        .map(select => select.value.split("#")[0]);

    selectors.forEach(select => {
        const type = select.dataset.type;
        const previousValue = select.value;
        select.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccionar material";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        const availableItems = inventory.filter(item =>
            (type === "ingredient" && ingredients.includes(item.name) && item.units > 0) ||
            (type === "monsterPart" && monsterParts.includes(item.name) && item.units > 0)
        );

        availableItems.forEach(item => {
            const optionValue = `${item.name}#${item.exquisite ? "Exquisito" : "Normal"}`;
            const optionText = `${item.name} (${item.exquisite ? "Exquisito" : "Normal"})`;
            const isNameUsed = usedNames.includes(item.name);

            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionText;

            if (isNameUsed && optionValue !== previousValue) option.disabled = true;
            select.appendChild(option);
        });

        select.value = previousValue || "";
    });
}

// Generar selects de ingredientes según tipo
function generatePotionSelectors(type) {
    const container = document.getElementById("potion-ingredients");
    container.innerHTML = "";
    if (!type) return;

    container.classList.add("fila3");

    if (type === "Básica") {
        const combinations = [
            {
                label: "2 Ingredientes + 1 Parte",
                value: "ingredientsFirst",
                selectors: [
                    { type: "ingredient", count: 2 },
                    { type: "monsterPart", count: 1 }
                ]
            },
            {
                label: "1 Ingrediente + 2 Partes",
                value: "partsFirst",
                selectors: [
                    { type: "ingredient", count: 1 },
                    { type: "monsterPart", count: 2 }
                ]
            }
        ];

        const radioContainer = document.createElement("div");
        radioContainer.classList.add("fila3a");
        const selectsContainer = document.createElement("div");
        selectsContainer.classList.add("fila3b");

        combinations.forEach((combination, index) => {
            const label = document.createElement("label");
            label.style.marginRight = "10px";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "selectorCombination";
            radio.value = combination.value;
            if (index === 0) radio.checked = true;
            radio.addEventListener("change", () => {
                createSelectors(combination.selectors, selectsContainer);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + combination.label));
            radioContainer.appendChild(label);
        });

        container.appendChild(radioContainer);
        container.appendChild(selectsContainer);
        createSelectors(combinations[0].selectors, selectsContainer);

    } else {
        let selectorsNeeded;
        if (type === "Débil") {
            selectorsNeeded = [
                { type: "ingredient", count: 1 },
                { type: "monsterPart", count: 1 }
            ];
        } else if (type === "Suprema") {
            selectorsNeeded = [
                { type: "ingredient", count: 2 },
                { type: "monsterPart", count: 2 }
            ];
        }
        const selectsContainer = document.createElement("div");
        selectsContainer.classList.add("fila3b");
        container.appendChild(selectsContainer);
        createSelectors(selectorsNeeded, selectsContainer);
    }
}

// Crear selects
function createSelectors(selectorsNeeded, container = document.getElementById("potion-ingredients")) {
    if (!container) return;

    const existingSelectors = container.querySelectorAll(".potion-selector");
    existingSelectors.forEach(s => s.remove());

    selectorsNeeded.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            const select = document.createElement("select");
            select.classList.add("potion-selector");
            select.dataset.type = type;

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Seleccionar material";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            select.addEventListener("change", () => populatePotionSelectors());
            container.appendChild(select);
        }
    });

    populatePotionSelectors();
}

// Detectar cambio de tipo de poción
document.getElementById("potion-type").addEventListener("change", (e) => {
    generatePotionSelectors(e.target.value);
});

// DOM Ready adicional
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
    if (!localStorage.getItem(RECIPES_KEY)) {
        localStorage.setItem(RECIPES_KEY, JSON.stringify(defaultRecipes));
        console.log("Recetas predeterminadas guardadas:", defaultRecipes);
    }
    const storedRecipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];
    recipes.length = 0;
    recipes.push(...storedRecipes);
    console.log("Recetas cargadas:", recipes);

    initializeMaterialDropdown();
    renderInventoryTable();
    generatePotionSelectors("");
});

// Nombre de poción aleatorio por tipo
function getPotionName(type) {
    if (type === "Básica") {
        const roll = Math.floor(Math.random() * 3) + 1;
        if (roll === 1 || roll === 2) {
            const BásicaNames = [
                "Experiencia", "Constitución", "Valentía", "Destreza", "Energía",
                "Vitalidad", "Maná", "Fuerza", "Sabiduría", "Ácido",
                "Nauseabunda", "Flamígera", "Invisibilidad", "Corrosión",
                "Contra Enfermedades", "Antídoto", "Veneno", "Fuego Líquido",
                "Frasco del Vacío", "Aceite para Armas"
            ];
            return BásicaNames[Math.floor(Math.random() * BásicaNames.length)];
        } else {
            const rareNames = [
                "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
                "Resistencia al Fuego", "Escama de Dragón", "Restauración",
                "Escupefuego", "Humo"
            ];
            return rareNames[Math.floor(Math.random() * rareNames.length)];
        }
    } else if (type === "Débil" || type === "Suprema") {
        const advancedNames = [
            "Flamígera", "Constitución", "Valentía", "Destreza", "Energía",
            "Vitalidad", "Maná", "Fuerza", "Sabiduría", "Ácido",
            "Contra Enfermedades", "Antídoto"
        ];
        return advancedNames[Math.floor(Math.random() * advancedNames.length)];
    }
    return "Poción Desconocida";
}

// Gestión de botellas y skill
let emptyBottles = parseInt(localStorage.getItem("empty_bottles")) || 0;
let alchemyskill = parseInt(localStorage.getItem("alchemy_skill")) || 0;

function updateBottleCount() {
    document.getElementById("empty-bottles").value = emptyBottles;
    localStorage.setItem("empty_bottles", emptyBottles);
}
function updateAlchemyskill() {
    document.getElementById("alchemy-skill").value = alchemyskill;
    localStorage.setItem("alchemy_skill", alchemyskill);
}
document.getElementById("add-bottle").addEventListener("click", () => { emptyBottles++; updateBottleCount(); });
document.getElementById("remove-bottle").addEventListener("click", () => { if (emptyBottles > 0) { emptyBottles--; updateBottleCount(); } });
document.getElementById("add-alchemy").addEventListener("click", () => { alchemyskill++; updateAlchemyskill(); });
document.getElementById("remove-alchemy").addEventListener("click", () => { if (alchemyskill > 0) { alchemyskill--; updateAlchemyskill(); } });

document.querySelectorAll(".potion-selector").forEach(select => {
    select.addEventListener("change", () => populatePotionSelectors());
});

// ====== DB compartida con Hojas_Personajes (IndexedDB) ======
// 🔁 ACTUALIZA el nombre de la BD compartida
const DB_NAME = 'PersonajesDB';
const STORE_SLOTS = 'slots';
const STORE_PERSONAJES = 'personajes';

let __db_ref = null;
async function openDBShared() {
    if (window.db) return window.db;
    if (__db_ref) return __db_ref;
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => { __db_ref = req.result; resolve(__db_ref); };
    });
}

// 🔧 Afectada: leemos héroes cargados y coercionamos ids numéricos
async function getLoadedHeroesFromSlots() {
    const db = await openDBShared();
    const slotIds = [1, 2, 3, 4];

    // 1) obtener personajeId de cada slot
    const personajeIds = await Promise.all(slotIds.map(slot => new Promise((resolve) => {
        const tx = db.transaction(STORE_SLOTS, 'readonly');
        const st = tx.objectStore(STORE_SLOTS);
        const r = st.get(slot);
        r.onsuccess = () => resolve(r.result?.personajeId ?? null);
        r.onerror   = () => resolve(null);
    })));

    // 2) cargar personajes por id (coercionando a number si procede)
    const heroes = [];
    for (let i = 0; i < slotIds.length; i++) {
        let pid = personajeIds[i];
        if (pid == null) continue;

        // si es string numérico → a number
        if (typeof pid === 'string' && pid.trim() !== '' && !Number.isNaN(Number(pid))) {
            pid = Number(pid);
        }

        const p = await new Promise((resolve) => {
            const tx = db.transaction(STORE_PERSONAJES, 'readonly');
            const st = tx.objectStore(STORE_PERSONAJES);
            const r = st.get(pid);
            r.onsuccess = () => resolve(r.result || null);
            r.onerror   = () => resolve(null);
        });

        if (p) heroes.push({ slot: slotIds[i], id: p.id, nombre: p.nombre || `Héroe ${slotIds[i]}` });
    }
    return heroes;
}


// 🔧 Afectada: guardar poción en inventario del héroe (coerción del id del <select>)
async function addPotionToHeroInventory(personajeId, { nombrePocion, tipoPocion, tooltipTitulo }) {
    const db = await openDBShared();

    // coerción segura: si es numérico, úsalo como number
    let key = personajeId;
    if (typeof key === 'string' && key.trim() !== '' && !Number.isNaN(Number(key))) {
        key = Number(key);
    }

    const personaje = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PERSONAJES, 'readonly');
        const st = tx.objectStore(STORE_PERSONAJES);
        const r = st.get(key);
        r.onsuccess = () => resolve(r.result || null);
        r.onerror   = () => reject(r.error);
    });

    if (!personaje) throw new Error('Personaje no encontrado');

    if (!personaje.inventario) personaje.inventario = { objetos: [], armaduras: [], armas: [] };
    if (!Array.isArray(personaje.inventario.objetos)) personaje.inventario.objetos = [];

    personaje.inventario.objetos.push({
        id: Date.now(),
        nombre: nombrePocion,
        lugar: 'Mochila',
        cantidad: 1,
        peso: 1,
        durabilidad: 0,
        uso: `${tipoPocion}${tooltipTitulo ? ' · ' + tooltipTitulo : ''}`
    });

    await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_PERSONAJES, 'readwrite');
        const st = tx.objectStore(STORE_PERSONAJES);
        const r = st.put(personaje);
        r.onsuccess = () => resolve();
        r.onerror   = () => reject(r.error);
    });

    return personaje;
}



// Inyectar selector de héroe dentro del alert
async function attachPotionInventorySelectorInAlert({ nombrePocion, tipoPocion, tooltipTitulo = '' }) {
    const extra = document.getElementById('custom-alert-extra');
    if (!extra) return;

    const heroes = await getLoadedHeroesFromSlots();
    const options = heroes.length
        ? heroes.map(h => `<option value="${h.id}">Slot ${h.slot} · ${h.nombre}</option>`).join('')
        : `<option value="">(no hay héroes cargados)</option>`;

    extra.innerHTML = `
      <div class="alert-section" style="margin-top:10px;">
        <label class="form-label">¿En qué inventario guardar la poción?</label>
        <select id="alertSelHero" class="form-select" ${heroes.length ? '' : 'disabled'}>${options}</select>
        <p class="small" style="margin:6px 0 10px;">
          Se guardará en <em>Objetos</em> con: Lugar <strong>Mochila</strong>, Cantidad <strong>1</strong>, Peso <strong>1</strong>, Durabilidad <strong>0</strong>, Uso <strong>${tipoPocion}${tooltipTitulo ? ' · ' + tooltipTitulo : ''}</strong>.
        </p>
        <button id="alertSavePotion" class="btn btn-primary">Guardar en inventario</button>
      </div>
    `;

    const btn = document.getElementById('alertSavePotion');
    if (btn) {
        btn.onclick = async () => {
            const sel = document.getElementById('alertSelHero');
            const personajeId = sel ? sel.value : '';
            if (!personajeId) {
                customAlert('No hay héroes cargados en los slots para guardar la poción.', 'crea_pocion');
                return;
            }
            try {
                await addPotionToHeroInventory(personajeId, { nombrePocion, tipoPocion, tooltipTitulo });
                customAlert(`Se añadió <strong>${nombrePocion}</strong> al inventario del héroe seleccionado.`, 'crea_pocion');
            } catch (e) {
                console.error(e);
                customAlert('No se pudo guardar la poción en el inventario.', 'crea_pocion');
            }
        };
    }
}

// Crear poción
document.getElementById("create-potion").addEventListener("click", () => {
    if (emptyBottles <= 0) {
        customAlert(`No se puede crear una poción sin <strong>Botellas Vacías</strong>.`, "sin_botellas");
        return;
    }

    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {
        customAlert(`Primero Selecciona la Calidad de la Poción`, "selecciona_pocion");
        return;
    }

    const selectedItems = Array.from(selectors).map(select => {
        const [name, quality] = (select.value || "").split("#");
        return { name, exquisite: quality === "Exquisito" };
    });

    if (selectedItems.some(item => !item.name)) {
        customAlert(`Debes seleccionar todos los <strong>Ingredientes</strong> que vas a usar.`, "ingredientes_alquimia");
        return;
    }

    // Comprobar inventario disponible
    const missingItems = selectedItems.filter(({ name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return !inventoryItem || inventoryItem.units < 1;
    });

    if (missingItems.length > 0) {
        customAlert(
            `Te faltan ingredientes:<br><strong>${missingItems.map(item => item.name).join("<br>")}</strong>`,
            "ingredientes_alquimia"
        );
        return;
    }

    const alchemySkill = parseInt(document.getElementById("alchemy-skill").value, 10);
    let totalAlchemySkill = alchemySkill;

    // Bonus por exquisitos
    const exquisiteBonus = selectedItems.reduce((bonus, { name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return bonus + (inventoryItem && inventoryItem.exquisite ? 10 : 0);
    }, 0);
    totalAlchemySkill += exquisiteBonus;

    // +10 si la receta ya es conocida (mismos ingredientes)
    const knownRecipe = recipes.find(recipe =>
        JSON.stringify([...recipe.ingredients].sort()) === JSON.stringify(selectedItems.map(item => item.name).sort())
    );
    if (knownRecipe) totalAlchemySkill += 10;

    // Tirada d100
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= totalAlchemySkill || roll <= 5) {
        const isCritical = roll <= 5;

        // Determinar nombre de la poción
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            const audio = new Audio(`img/interface/pocion_burbujeante.mp3`);
            let ComprobarMute = localStorage.getItem('sonido');
            if (ComprobarMute == "on") audio.play().catch(() => {});
        } else {
            const audio = new Audio(`img/interface/Eureka.mp3`);
            let ComprobarMute = localStorage.getItem('sonido');
            if (ComprobarMute == "on") audio.play().catch(() => {});
            potionName = getPotionName(type);

            // Añadir receta descubierta
            const newRecipe = { type, name: potionName, ingredients: selectedItems.map(item => item.name) };
            recipes.push(newRecipe);
            saveRecipes();
            console.log("Receta nueva agregada:", newRecipe);
        }

        // Consumir ingredientes (también en crítico)
        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });

        // Consumir botella
        emptyBottles--;

        // Mensaje
        const baseMsg = isCritical
            ? `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br><strong>¡ÉXITO CRÍTICO!</strong><br><br>`
            : `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br><br>`;

        const msg =
            `${baseMsg}` +
            (knownRecipe
                ? `¡La Poción <strong>"${potionName}"</strong> ha sido elaborada con éxito!<br><br>`
                : `¡Has Descubierto una nueva Poción: <strong>"${potionName}"</strong>!<br><br>` +
                  `¡La Poción <strong>"${potionName}"</strong> ha sido elaborada con éxito!<br><br>`) +
            `** Elige en qué Inventario guardarla. **`;

        // Mostrar alert + inyectar selector de héroe
        const tooltipTitulo = potionDescriptions[potionName] ? potionName : '';
        customAlert(msg, "crea_pocion", () => {
            attachPotionInventorySelectorInAlert({
                nombrePocion: potionName,
                tipoPocion: type,
                tooltipTitulo
            });
        });

        // Guardar y refrescar
        saveInventory();
        saveRecipes();
        renderInventoryTable();
        renderRecipeTable();

    } else {
        // Fallo
        customAlert(
            `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br>
            ¡Los ingredientes se han estropeado!<br><br>
            <strong>Has Perdido los Siguientes Ingredientes:</strong><br>${selectedItems.map(item => item.name).join("<br>")}`,
            "fracaso_pocion"
        );

        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });

        if (roll >= 95) {
            emptyBottles--;
        }

        saveInventory();
        renderInventoryTable();
        renderRecipeTable();
    }

    updateBottleCount();
});

// DOM Ready (ajustes finales)
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
    updateAlchemyskill();
});

// ===== Añadir poción manual =====
function createManualPotionAdder() {
    const container = document.getElementById("manual-potion-adder");
    const toggleButton = document.getElementById("add-manual-potion-button");

    if (!toggleButton || !container) {
        console.error("No se encontró el botón o el contenedor en el HTML.");
        return;
    }

    toggleButton.addEventListener("click", () => {
        container.style.display = container.style.display === "none" ? "block" : "none";
        toggleButton.textContent = container.style.display === "block"
            ? "Ocultar Añadir Poción a Mano"
            : "Añadir Poción a Mano";

        container.innerHTML = "";
        if (container.style.display === "block") {
            generatePotionTypeSelector(container);
        }
    });
}

function generatePotionTypeSelector(container) {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.alignItems = "center";
    rowDiv.style.marginBottom = "10px";

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Calidad de la Poción: ";
    typeLabel.style.marginRight = "10px";

    const typeSelect = document.createElement("select");
    typeSelect.id = "manual-potion-type";
    typeSelect.style.flex = "1";

    ["", "Débil", "Básica", "Suprema"].forEach(type => {
        const option = document.createElement("option");
        option.textContent = type || "Seleccionar tipo";
        typeSelect.appendChild(option);
    });

    rowDiv.appendChild(typeLabel);
    rowDiv.appendChild(typeSelect);
    container.appendChild(rowDiv);

    typeSelect.addEventListener("change", () => {
        generatePotionMaterialsForm(container, typeSelect.value);
    });
}

function generatePotionMaterialsForm(container, type) {
    const existingForm = container.querySelector("#manual-potion-materials-form");
    if (existingForm) existingForm.remove();
    if (!type) return;

    const form = document.createElement("div");
    form.id = "manual-potion-materials-form";

    const potionNameLabel = document.createElement("label");
    potionNameLabel.textContent = "Nombre de la poción: ";
    const potionNameSelect = document.createElement("select");
    const defaultPotionOption = document.createElement("option");
    defaultPotionOption.value = "";
    defaultPotionOption.textContent = "Seleccionar poción";
    defaultPotionOption.disabled = true;
    defaultPotionOption.selected = true;
    potionNameSelect.appendChild(defaultPotionOption);

    let availablePotions = [];
    if (type === "Débil" || type === "Suprema") {
        availablePotions = potionNames.Débil_and_Suprema;
    } else if (type === "Básica") {
        availablePotions = [
            ...potionNames.Básica.d3_1_2,
            ...potionNames.Básica.d3_3
        ];
    }

    availablePotions.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        potionNameSelect.appendChild(option);
    });

    form.appendChild(potionNameLabel);
    form.appendChild(potionNameSelect);
    form.appendChild(document.createElement("br"));

    if (type === "Débil") {
        createSelect(form, "Ingrediente", ingredients);
        createSelect(form, "Parte de Monstruo", monsterParts);
    }
    else if (type === "Básica") {
        createSelect(form, "Ingrediente", ingredients);
        createSelect(form, "Parte de Monstruo", monsterParts);
        createSelect(form, "Ingrediente o Parte", [...ingredients, ...monsterParts]);
    }
    else if (type === "Suprema") {
        createSelect(form, "Ingrediente", ingredients);
        createSelect(form, "Ingrediente", ingredients);
        createSelect(form, "Parte de Monstruo", monsterParts);
        createSelect(form, "Parte de Monstruo", monsterParts);
    }

    const addButton = document.createElement("button");
    addButton.textContent = "Añadir al Libro de Alquimia";
    addButton.className = "btn_opciones";
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "10px";
    buttonContainer.appendChild(addButton);

    addButton.addEventListener("click", () => {
        const selectedPotionName = potionNameSelect.value;
        const materialSelects = Array.from(form.querySelectorAll("select")).slice(1);
        const selectedMaterials = materialSelects.map(s => s.value).filter(v => v);

        if (!selectedPotionName) {
            customAlert("Debes seleccionar el Nombre de la Poción.", "nueva_receta");
            return;
        }

        if (selectedMaterials.length < materialSelects.length) {
            customAlert("Debes seleccionar todos los materiales sin repetir.", "nueva_receta");
            return;
        }

        const recipeExists = recipes.some(recipe =>
            recipe.name === selectedPotionName &&
            recipe.type === type &&
            arraysEqualUnordered(recipe.ingredients, selectedMaterials)
        );

        if (recipeExists) {
            customAlert("¡Ya conoces esta receta!", "nueva_receta");
            return;
        }

        const newRecipe = {
            name: selectedPotionName,
            type,
            ingredients: selectedMaterials
        };

        recipes.push(newRecipe);
        saveRecipes();
        renderRecipeTable();
        customAlert(
            `<strong>* HAS DESBLOQUEADO UNA NUEVA RECETA *</strong><br><br>Poción de <strong>"${selectedPotionName}"</strong> añadida a tu Libro de Alquimia.`,
            "nueva_receta"
        );
    });

    form.appendChild(buttonContainer);
    container.appendChild(form);

    function createSelect(container, labelText, optionsArray) {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        rowDiv.style.alignItems = "center";
        rowDiv.style.marginBottom = "8px";

        const label = document.createElement("label");
        label.textContent = labelText + ": ";
        label.style.width = "150px";
        label.style.marginRight = "10px";

        const select = document.createElement("select");
        select.style.flex = "1";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccionar";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        optionsArray.sort().forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            enforceUniqueSelections(container);
        });

        rowDiv.appendChild(label);
        rowDiv.appendChild(select);
        container.appendChild(rowDiv);
    }

    function enforceUniqueSelections(container) {
        const selects = Array.from(container.querySelectorAll("select")).slice(1);
        const selectedValues = selects.map(s => s.value).filter(v => v);

        selects.forEach(select => {
            Array.from(select.options).forEach(opt => {
                if (opt.value && selectedValues.includes(opt.value) && opt.value !== select.value) {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        });
    }

    function arraysEqualUnordered(a, b) {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
    }
}

// Inicialización del módulo manual
document.addEventListener("DOMContentLoaded", () => {
    createManualPotionAdder();
});

// Guardar / cargar alchemy skill
document.getElementById("alchemy-skill").addEventListener("input", saveAlchemySkill);
document.addEventListener("DOMContentLoaded", loadAlchemySkill);

function saveAlchemySkill() {
    const alchemySkillValue = document.getElementById("alchemy-skill").value;
    localStorage.setItem("alchemy_skill", alchemySkillValue);
    console.log(`Habilidad de alquimia guardada: ${alchemySkillValue}`);
}
function loadAlchemySkill() {
    const savedSkill = localStorage.getItem("alchemy_skill");
    const skillInput = document.getElementById("alchemy-skill");

    if (savedSkill !== null) {
        skillInput.value = savedSkill;
        console.log(`Habilidad de alquimia cargada: ${savedSkill}`);
    } else {
        skillInput.value = 0;
        console.log("No se encontró habilidad de alquimia en localStorage. Usando valor predeterminado.");
    }
}

// Reproducir audios en secuencia
function reproducirAudiosSecuencial(audios) {
    let i = 0;
    const basePath = "img/interface/";
    function playNext() {
        if (i >= audios.length) return;
        const audio = new Audio(basePath + audios[i]);
        i++;
        let ComprobarMute = localStorage.getItem('sonido');
        if (ComprobarMute == "on") {
            audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
        }
        audio.addEventListener("ended", playNext);
    }
    playNext();
}
