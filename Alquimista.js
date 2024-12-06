// Ingredientes y partes de monstruos
const ingredients = [
    "Raíz arqueada", "Jengibre ceniciento", "Ajenjo Espinado", "Ambrosía", "Equinácea azul",
    "Callicarpa brillante", "Polen del Amaru", "Corteza de arce rojo", "Artemisa salada",
    "Asclepia picante", "Frambuesa gigante", "Baya lunar", "Laurel del monje", "Agracejo",
    "Belladona", "Dulcamara", "Hiedra dulce", "Perejil tóxico", "Barbarea", "Trébol llorón"
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
    { type: "Basica", name: "Poción de Curación", ingredients: ["Sangre humana", "Cola de rata", "Jengibre ceniciento"], default: true, title: "Sana Sanita" },
    { type: "Basica", name: "Contra Enfermedades", ingredients: ["Piel de zombi", "Ala de murciélago", "Laurel del monje"], default: true, title: "Sana enferme" },
    { type: "Basica", name: "Flamígera", ingredients: ["Corazón de bestia", "Cola de rata", "Baya lunar"], default: true, title: "pum" },
    { type: "Basica", name: "Antídoto", ingredients: ["Colmillo de araña", "Barbárea", "Agracejo"], default: true, title: "cura eneno" },
    { type: "Basica", name: "Experiencia", ingredients: ["Sangre de dragón", "Hiedra dulce", "Belladona"], default: true, title: "Exp up" },
    { type: "Basica", name: "Restauración", ingredients: ["Sangre de vampiro", "Sangre de troll", "Corteza de arce rojo"], default: true, title: "restaura tripita" }
];
// Nombres de pociones
const potionNames = {
    Basica: {
        d3_1_2: [
            "Experiencia", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
            "Mana", "Fuerza", "Sabiduría", "Ácido", "Nauseabunda", "Flamígera",
            "Invisibilidad", "Corrosión", "Contra Enfermedades", "Antídoto",
            "Veneno", "Fuego Líquido", "Frasco del Vacío", "Aceite para Armas"
        ],
        d3_3: [
            "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
            "Resistencia al Fuego", "Escama de Dragón", "Restauración",
            "Escupefuego", "Humo"
        ]
    },
    Debil_and_Suprema: [
        "Flamígera", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
        "Mana", "Fuerza", "Sabiduría", "Ácido", "Contra Enfermedades", "Antídoto"
    ]
};
// Agregar descripciones de las pociones
const potionDescriptions = {
    "Experiencia": "Otorga 300 EXP. Un héroe sólo puede beber una entre mazmorras.",
    "Constitución": "Debil: +10 CON; Basica: +15 CON; Supremaa: +20 CON.",
    "Valentía": "Debil: +10 DET; Basica: +15 DET; Supremaa: +20 DET.",
    "Destreza": "Debil: +5 DES; Basica: +10 DES; Supremaa: +15 DES.",
    "Energía": "Debil: +1 ENERGÍA; Basica: +2 ENERGÍA; Supremaa: +3 ENERGÍA.",
    "Vitalidad": "Debil: 1d4 VIT; Basica: 1d6 VIT; Supremaa: 1d10 VIT.",
    "Mana": "Debil: 1d20 Maná; Basica: 2d20 Maná; Supremaa: 3d20 Maná.",
    "Fuerza": "Debil: +10 FUE; Basica: +15 FUE; Supremaa: +20 FUE.",
    "Sabiduría": "Debil: +10 SAB; Basica: +15 SAB; Supremaa: +20 SAB.",
    "Ácido": "Debil: 1d6 DAÑ; Basica: 1d10 DAÑ; Supremaa: 1d12 DAÑ.",
    "Nauseabunda": "Cualquier miniatura en esa casilla realizará una tirada de DET o perderá su siguiente turno. Cualquier miniatura en una casilla adyacente realizará una tirada de DET +20. No tiene efecto en No muertos.",
    "Flamígera": "Debil: 1d6 DAÑ; Basica: 1d10 DAÑ; Supremaa: 1d12 DAÑ.",
    "Invisibilidad": "Quita al héroe del tablero hasta que la batalla termine. Cuando finalice, vuelve a cualquier casilla de la loseta.",
    "Corrosión": "Para abrir una puerta. El héroe debe gastar 1 PA adyacente a una puerta para usar esta poción y abrirla automáticamente.",
    "Contra Enfermedades": "Debil tiene un 75% de éxito, la Basica y la Supremaa tendrán un 100%. Además, la Supremaa curará un 1d3 VIT.",
    "Antídoto": "Debil tiene un 75% de éxito, la Basica y la Supremaa tendrán un 100%. Además, la Supremaa curará un 1d3 VIT.",
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


// Función para borrar las claves específicas de localStorage
// Función para borrar las claves específicas de localStorage con confirmación
function resetAlchemyData() {
    const confirmation = confirm("¿Estás seguro de que quieres eliminar el inventario y el recetario de pociones conocidas? Esta acción no se puede deshacer.");
    if (confirmation) {
        localStorage.removeItem("alchemy_inventory"); // Elimina el inventario
        localStorage.removeItem("alchemy_recipes"); // Elimina las recetas
        alert("¡Se han eliminado los datos de Alquimia! Comenzamos de 0.");
        location.reload(); // Recarga la página para aplicar cambios
    } else {
        alert("La acción ha sido cancelada. Los datos no se han eliminado.");
    }
}

// Asociar la función al botón "Comenzar de 0"
document.getElementById("reset-button").addEventListener("click", resetAlchemyData);
// Guardar en LocalStorage
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function saveRecipes() {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}
// Ordenar ingredientes y partes por tipo y nombre
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
// Renderizar inventario (original)
// Renderizar inventario
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    if (!tbody) {
        console.error("El elemento #inventory-table tbody no existe.");
        return;
    }

    tbody.innerHTML = "";

    if (inventory.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No hay elementos en el inventario.</td></tr>";
        return;
    }

    sortInventory(); // Ordenar el inventario antes de renderizar

    inventory.forEach((item, index) => {
        const itemType = ingredients.includes(item.name) ? "Ingrediente" : "Parte";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${itemType}</td>
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "Sí" : "No"}</td>
            <td>
                <button class="remove-item" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        const removeButton = row.querySelector(".remove-item");
        removeButton.addEventListener("click", () => {
            removeInventoryItem(index);
        });
    });
}
// Eliminar elementos del inventario

function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) {
        console.error("Índice de inventario inválido:", index);
        return;
    }

    const removedItem = inventory.splice(index, 1); // Eliminar del inventario
    saveInventory(); // Guardar cambios en LocalStorage
    renderInventoryTable(); // Actualizar la tabla
    alert(`Elemento "${removedItem[0].name}" eliminado con éxito.`);
}
// Renderizar recetario como tabla
// Renderizar la tabla de recetas
// Renderizar la tabla de recetas
// Actualizar la función renderRecipeTable
function renderRecipeTable() {
    const tbody = document.querySelector("#recipe-table tbody");
    if (!tbody) {
        console.error("El elemento #recipe-table tbody no existe.");
        return;
    }

    tbody.innerHTML = "";

    if (recipes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No hay recetas registradas.</td></tr>";
        return;
    }

    sortRecipes(); // Ordenar recetas antes de renderizar

    recipes.forEach((recipe, index) => {
        const row = document.createElement("tr");

        // Obtener la descripción de la poción
        const description = potionDescriptions[recipe.name] || "Descripción no disponible";

        // Crear el enlace con tooltip
        const potionLink = `<a href="#" title="${description}">${recipe.name}</a>`;

        row.innerHTML = `
            <td>${potionLink}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
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

// Función para olvidar una receta
function forgetRecipe(index) {
    const recipeToForget = recipes[index];
    if (recipeToForget.default) {
        alert(`La receta "${recipeToForget.name}" es predeterminada y no se puede olvidar.`);
        return;
    }

    const confirmation = confirm(`¿Estás seguro de que quieres olvidar la receta "${recipeToForget.name}"?`);
    if (!confirmation) return;

    recipes.splice(index, 1);
    saveRecipes();
    renderRecipeTable();
    alert(`Receta "${recipeToForget.name}" olvidada con éxito.`);
}




// Agregar material al inventario
// Evento para agregar material al inventario
document.getElementById("add-material").addEventListener("click", () => {
    const material = document.getElementById("material-select").value;
    const units = parseInt(document.getElementById("material-units").value, 10);
    const exquisite = document.getElementById("material-exquisite").checked;

    const existing = inventory.find(item => item.name === material && item.exquisite === exquisite);
    if (existing) {
        existing.units += units;
    } else {
        inventory.push({ name: material, units, exquisite });
    }

    saveInventory();
    renderInventoryTable();
});

// Inicializar materiales en el desplegable
// Inicializar el desplegable de materiales
function initializeMaterialDropdown() {
    const materialSelect = document.getElementById("material-select");
    combinedItems.forEach(({ name, type }) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = `${type}: ${name}`;
        materialSelect.appendChild(option);
    });
}

// Inicializar
// Inicializar
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


// Popular los desplegables con los materiales del inventario
// Popular los desplegables con los materiales del inventario
function populatePotionSelectors() {
    const selectors = document.querySelectorAll(".potion-selector");
    const usedNames = Array.from(selectors)
        .filter(select => select.value) // Filtrar solo los que ya tienen un valor seleccionado
        .map(select => select.value.split("#")[0]); // Extraer solo el nombre (ignorando exquisito)

    selectors.forEach(select => {
        const type = select.dataset.type; // "ingredient" o "monsterPart"
        const previousValue = select.value; // Guardar el valor seleccionado previamente
        select.innerHTML = ""; // Limpiar opciones previas

        // Añadir la opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccionar material";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Filtrar opciones disponibles en el inventario según el tipo
        const availableItems = inventory.filter(item =>
            (type === "ingredient" && ingredients.includes(item.name) && item.units > 0) ||
            (type === "monsterPart" && monsterParts.includes(item.name) && item.units > 0)
        );

        availableItems.forEach(item => {
            const optionValue = `${item.name}#${item.exquisite ? "Exquisito" : "Normal"}`;
            const optionText = `${item.name} (${item.exquisite ? "Exquisito" : "Normal"})`;

            // Verificar si el nombre del material ya está en uso en otros selectores
            const isNameUsed = usedNames.includes(item.name);

            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionText;

            // Deshabilitar si el nombre ya está en uso en otro selector
            if (isNameUsed && optionValue !== previousValue) {
                option.disabled = true;
            }

            select.appendChild(option);
        });

        // Restaurar el valor previamente seleccionado, si todavía está disponible
        select.value = previousValue || "";
    });
}
// Generar los desplegables para seleccionar materiales
function generatePotionSelectors(type) {
    const container = document.getElementById("potion-ingredients");
    container.innerHTML = ""; // Limpiar cualquier contenido previo

    if (!type) {
        return; // No hacer nada si no se ha seleccionado un tipo
    }

    if (type === "Basica") {
        // Configuración para las combinaciones posibles
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

        // Crear botones de radio para elegir la combinación
        const switcher = document.createElement("div");
        switcher.style.marginBottom = "10px"; // Separar botones de los selectores

        combinations.forEach((combination, index) => {
            const label = document.createElement("label");
            label.style.marginRight = "10px";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "selectorCombination";
            radio.value = combination.value;
            if (index === 0) {
                radio.checked = true; // Selección predeterminada
            }

            // Al cambiar el radio, generar los selectores correspondientes
            radio.addEventListener("change", () => {
                createSelectors(combination.selectors);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + combination.label));
            switcher.appendChild(label);
        });

        container.appendChild(switcher);

        // Crear los selectores iniciales
        createSelectors(combinations[0].selectors);
    } else {
        let selectorsNeeded;

        if (type === "Debil") {
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

        createSelectors(selectorsNeeded);
    }
}

function createSelectors(selectorsNeeded) {
    const container = document.getElementById("potion-ingredients");

    // Eliminar selectores existentes
    const existingSelectors = container.querySelectorAll(".potion-selector");
    existingSelectors.forEach(selector => selector.remove());

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

    populatePotionSelectors(); // Llenar selectores con opciones
}

// Detectar cambio en el tipo de poción y generar los desplegables
document.getElementById("potion-type").addEventListener("change", (e) => {
    generatePotionSelectors(e.target.value);
});


// Inicializar
// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
    if (!localStorage.getItem(RECIPES_KEY)) {


        localStorage.setItem(RECIPES_KEY, JSON.stringify(defaultRecipes));
        console.log("Recetas predeterminadas guardadas:", defaultRecipes);
    }
    // Leer inventario y recetas de LocalStorage
    const storedRecipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];
    recipes.length = 0; // Vaciar el array actual (si ya existe en memoria)
    recipes.push(...storedRecipes); // Asegurarse de que contiene las recetas cargadas
    console.log("Recetas cargadas:", recipes);

    // Renderizar elementos de la interfaz
    initializeMaterialDropdown(); // Inicializar el desplegable de materiales
    renderInventoryTable(); // Renderizar el inventario

    generatePotionSelectors(""); // Limpiar y generar los selectores de ingredientes
});
// Función para generar un nombre de poción basado en el tipo
function getPotionName(type) {
    if (type === "Basica") {
        const roll = Math.floor(Math.random() * 3) + 1; // Tirada de 1d3
        if (roll === 1 || roll === 2) {
            const BasicaNames = [
                "Experiencia", "Constitución", "Valentía", "Destreza", "Energía",
                "Vitalidad", "Mana", "Fuerza", "Sabiduría", "Ácido",
                "Nauseabunda", "Flamígera", "Invisibilidad", "Corrosión",
                "Contra Enfermedades", "Antídoto", "Veneno", "Fuego Líquido",
                "Frasco del Vacío", "Aceite para Armas"
            ];
            return BasicaNames[Math.floor(Math.random() * BasicaNames.length)];
        } else {
            const rareNames = [
                "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
                "Resistencia al Fuego", "Escama de Dragón", "Restauración",
                "Escupefuego", "Humo"
            ];
            return rareNames[Math.floor(Math.random() * rareNames.length)];
        }
    } else if (type === "Debil" || type === "Suprema") {
        const advancedNames = [
            "Flamígera", "Constitución", "Valentía", "Destreza", "Energía",
            "Vitalidad", "Mana", "Fuerza", "Sabiduría", "Ácido",
            "Contra Enfermedades", "Antídoto"
        ];
        return advancedNames[Math.floor(Math.random() * advancedNames.length)];
    }
    return "Poción Desconocida";
}
// Gestión de botellas vacías
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

document.getElementById("add-bottle").addEventListener("click", () => {
    emptyBottles++;
    updateBottleCount();
});

document.getElementById("remove-bottle").addEventListener("click", () => {
    if (emptyBottles > 0) {
        emptyBottles--;
        updateBottleCount();
    }
});

document.getElementById("add-alchemy").addEventListener("click", () => {
    alchemyskill++;
    updateAlchemyskill();
});

document.getElementById("remove-alchemy").addEventListener("click", () => {
    if (alchemyskill > 0) {
        alchemyskill--;
        updateAlchemyskill();
    }
});

document.querySelectorAll(".potion-selector").forEach(select => {
    select.addEventListener("change", () => populatePotionSelectors());
});


document.getElementById("create-potion").addEventListener("click", () => {
    if (emptyBottles <= 0) {
        alert("No se puede crear la poción sin botellas vacías.");
        return;
    }

    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {
        alert("Selecciona un tipo de poción.");
        return;
    }

    const selectedItems = Array.from(selectors).map(select => {
        const [name, quality] = select.value.split("#");
        return { name, exquisite: quality === "Exquisito" };
    });

    if (selectedItems.some(item => !item.name)) {
        alert("Selecciona todos los ingredientes a usar.");
        return;
    }

    // Verificar inventario
    const missingItems = selectedItems.filter(({ name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return !inventoryItem || inventoryItem.units < 1;
    });

    if (missingItems.length > 0) {
        alert(`Faltan los siguientes ingredientes o partes en el inventario: ${missingItems.map(item => item.name).join(", ")}`);
        return;
    }

    const alchemySkill = parseInt(document.getElementById("alchemy-skill").value, 10);

    // Calcular habilidad total
    let totalAlchemySkill = alchemySkill;

    // Sumar 10 puntos por cada ingrediente o parte exquisito
    const exquisiteBonus = selectedItems.reduce((bonus, { name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return bonus + (inventoryItem && inventoryItem.exquisite ? 10 : 0);
    }, 0);

    totalAlchemySkill += exquisiteBonus;

    // Verificar si la poción es conocida
    const knownRecipe = recipes.find(recipe =>
        JSON.stringify(recipe.ingredients.sort()) === JSON.stringify(selectedItems.map(item => item.name).sort())
    );
    if (knownRecipe) totalAlchemySkill += 10;

    // Realizar tirada
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= totalAlchemySkill || roll <= 5) {
        // Éxito crítico o normal
        const isCritical = roll <= 5;

        if (isCritical) {
            alert("Has sacado:" + roll + "  ¡Éxito crítico! Mejora Hab. ALQ. en 1 o recupera energía.");
        }

        // Restar ingredientes y partes
        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    // Eliminar del inventario si se queda en 0
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });

        // Restar botella
        emptyBottles--;
        alert("Has sacado:" + roll + "  ¡Poción creada con éxito! Una botella ha sido utilizada.");

        // Crear poción
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            alert("Has sacado:" + roll + `    ¡La poción "${potionName}" ha sido creada exitosamente!`);
        } else {
            potionName = getPotionName(type);
            alert("Has sacado:" + roll + `    ¡Nueva poción creada: "${potionName}"!`);

            // Agregar la poción al recetario
            const newRecipe = {
                type,
                name: potionName,
                ingredients: selectedItems.map(item => item.name)
            };
            recipes.push(newRecipe);
            saveRecipes(); // Guardar en localStorage
            console.log("Receta nueva agregada:", newRecipe);
        }

        // Guardar cambios y actualizar vistas
        saveInventory();
        saveRecipes();
        renderInventoryTable();
        renderRecipeTable();
    } else {
        // Fallo en la creación
        alert("Has sacado:" + roll + `    Fallaste en la creación de la poción. Ingredientes usados: ${selectedItems.map(item => item.name).join(", ")}`);
        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    // Eliminar del inventario si se queda en 0
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });
        if (roll >= 95) {
            emptyBottles--;
            alert("Has sacado:" + roll + "  ¡La botella también se rompió!");
        }
        saveInventory();
        renderInventoryTable();
        renderRecipeTable();
    }

    updateBottleCount();
});

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
    updateAlchemyskill();
});
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
            ? "Ocultar añadir poción a mano"
            : "Añadir poción a mano";

        // Resetear contenido del contenedor
        container.innerHTML = "";
        if (container.style.display === "block") {
            generatePotionTypeSelector(container);
        }
    });
}

function generatePotionTypeSelector(container) {
    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Tipo de poción: ";
    const typeSelect = document.createElement("select");
    typeSelect.id = "manual-potion-type";

    ["", "Debil", "Basica", "Suprema"].forEach(type => {
        const option = document.createElement("option");
        option.value = type.toLowerCase();
        option.textContent = type || "Seleccionar tipo";
        typeSelect.appendChild(option);
    });

    container.appendChild(typeLabel);
    container.appendChild(typeSelect);
    container.appendChild(document.createElement("br"));

    typeSelect.addEventListener("change", () => {
        generatePotionMaterialsForm(container, typeSelect.value);
    });
}

function generatePotionMaterialsForm(container, type) {
    // Limpiar cualquier formulario existente
    const existingForm = container.querySelector("#manual-potion-materials-form");
    if (existingForm) {
        existingForm.remove();
    }

    if (!type) return;

    const form = document.createElement("div");
    form.id = "manual-potion-materials-form";

    // Generar el desplegable de nombre de la poción según el tipo
    const potionNameLabel = document.createElement("label");
    potionNameLabel.textContent = "Nombre de la poción: ";
    const potionNameSelect = document.createElement("select");
    const defaultPotionOption = document.createElement("option");
    defaultPotionOption.value = "";
    defaultPotionOption.textContent = "Seleccionar poción";
    defaultPotionOption.disabled = true;
    defaultPotionOption.selected = true;
    potionNameSelect.appendChild(defaultPotionOption);

    // Obtener los nombres de las pociones según el tipo
    let availablePotions = [];
    if (type === "debil" || type === "suprema") {
        availablePotions = potionNames.Debil_and_Suprema;
    } else if (type === "basica") {
        availablePotions = [
            ...potionNames.Basica.d3_1_2,
            ...potionNames.Basica.d3_3
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

    // Determinar el número de materiales necesarios según el tipo de poción
    let selectorsNeeded;
    if (type === "debil") {
        selectorsNeeded = [
            { type: "ingredient", count: 1 },
            { type: "monsterPart", count: 1 }
        ];
    } else if (type === "basica") {
        selectorsNeeded = [
            { type: "ingredient", count: 2 },
            { type: "monsterPart", count: 1 }
        ];
    } else if (type === "suprema") {
        selectorsNeeded = [
            { type: "ingredient", count: 2 },
            { type: "monsterPart", count: 2 }
        ];
    }

    const allMaterials = [...ingredients, ...monsterParts].sort();

    // Generar los desplegables para seleccionar materiales
    selectorsNeeded.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            const materialLabel = document.createElement("label");
            materialLabel.textContent = `Material (${type}): `;
            const materialSelect = document.createElement("select");

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Seleccionar material";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            materialSelect.appendChild(defaultOption);

            allMaterials.forEach(material => {
                const option = document.createElement("option");
                option.value = material;
                option.textContent = material;
                materialSelect.appendChild(option);
            });

            form.appendChild(materialLabel);
            form.appendChild(materialSelect);
            form.appendChild(document.createElement("br"));
        }
    });

    // Botón para añadir al recetario
    const addButton = document.createElement("button");
    addButton.textContent = "Añadir al recetario";
    addButton.addEventListener("click", () => {
        const selectedPotionName = potionNameSelect.value;
        const selectedMaterials = Array.from(form.querySelectorAll("select"))
            .map(select => select.value)
            .filter(value => value); // Filtrar los no seleccionados

        if (!selectedPotionName) {
            alert("Debes seleccionar un nombre de poción.");
            return;
        }

        if (selectedMaterials.length === 0) {
            alert("Debes seleccionar al menos un material.");
            return;
        }

        // Crear una nueva receta
        const newRecipe = {
            name: selectedPotionName,
            type,
            ingredients: selectedMaterials
        };

        recipes.push(newRecipe);
        saveRecipes();
        renderRecipeTable();
        alert(`Poción "${selectedPotionName}" añadida al recetario.`);
    });

    form.appendChild(addButton);
    container.appendChild(form);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    createManualPotionAdder();
});

// Event listener para guardar la habilidad al cambiar el valor
document.getElementById("alchemy-skill").addEventListener("input", saveAlchemySkill);

// Cargar la habilidad al inicializar la página
document.addEventListener("DOMContentLoaded", loadAlchemySkill);

// Función para guardar el valor de alchemy-skill en localStorage
function saveAlchemySkill() {
    const alchemySkillValue = document.getElementById("alchemy-skill").value;
    localStorage.setItem("alchemy_skill", alchemySkillValue);
    console.log(`Habilidad de alquimia guardada: ${alchemySkillValue}`);
}

// Función para cargar el valor de alchemy-skill desde localStorage
function loadAlchemySkill() {
    const savedSkill = localStorage.getItem("alchemy_skill");
    const skillInput = document.getElementById("alchemy-skill");

    if (savedSkill !== null) {
        skillInput.value = savedSkill;
        console.log(`Habilidad de alquimia cargada: ${savedSkill}`);
    } else {
        skillInput.value = 0; // Valor por defecto si no existe en localStorage
        console.log("No se encontró habilidad de alquimia en localStorage. Usando valor predeterminado.");
    }
}