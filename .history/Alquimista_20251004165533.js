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
// Agregar descripciones de las pociones
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


// Función para borrar las claves específicas de localStorage
// Función para borrar las claves específicas de localStorage con confirmación
function resetAlchemyData() {
    customConfirm("Eliminar Todo Conocimiento",
        "reiniciar_alquimia", "Inventario y recetas serán borrados.<br>El destino no permite deshacerlo.<br><br><strong>¿Estás seguro?</strong>",
        () => {
            localStorage.removeItem("alchemy_inventory");
            localStorage.removeItem("alchemy_recipes");
            customAlert("¡Se han eliminado los datos de Alquimia! Comenzamos de 0.", "reiniciar_alquimia");
            location.reload();
        },
        () => {
            // customAlert("La acción ha sido cancelada. Los datos no se han eliminado.");
        }
    );
}
// Reemplazo de alert con SweetAlert2 e icono personalizado
function customAlert(message, imagen_icono) {
    if (typeof Swal !== 'undefined' && Swal.fire) {
        Swal.fire({
            // title: '⚗️ Alquimia',
            html: message,
            imageUrl: `img/interface/${imagen_icono}.png`,   // tu icono personalizado
            imageWidth: 150,
            imageHeight: 150,
            confirmButtonText: 'Entendido',
            customClass: {
                popup: 'mi-popup-veneno',
                title: 'mi-titulo-veneno',
                content: 'mi-texto-veneno'
            }
        });
    } else {
        alert(message); // fallback si no carga Swal
    }
}

// Reemplazo de confirm con SweetAlert2 e icono personalizado
function customConfirm(mensaje_confirmacion, imagen_icono, message, onConfirm, onCancel) {
    if (typeof Swal !== 'undefined' && Swal.fire) {
        Swal.fire({

            //title: '¿Estás seguro?',
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
        // fallback nativo
        if (confirm(message)) {
            if (typeof onConfirm === 'function') onConfirm();
        } else {
            if (typeof onCancel === 'function') onCancel();
        }
    }
}

// Asociar la función al botón "Comenzar de 0"
document.getElementById("reset-button").addEventListener("click", resetAlchemyData);
// Guardar en LocalStorage
// 🔧 MODIFICADA: al guardar inventario, refrescamos el libro de recetas
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    // Refrescar recetario para mostrar disponibilidad en tiempo real
    if (typeof renderRecipeTable === 'function') {
        renderRecipeTable();
    }
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
// Eliminar elementos del inventario

function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) {
        console.error("Índice de inventario inválido:", index);
        return;
    }

    const itemName = inventory[index].name;

    customConfirm("Eliminar el Ingrediente",
        "eliminar_ingrediente", `¿Deseas desterrar </strong>"${itemName}"</strong> de tu inventario?<br>Una vez hecho, su esencia se perderá para siempre.`,
        () => {
            // Acción al confirmar
            const removedItem = inventory.splice(index, 1);
            saveInventory();
            renderInventoryTable();
            customAlert(`Ingrediente <strong>"${removedItem[0].name}"</strong> Destruido.`, "eliminar_ingrediente");
        },
        () => {
            // Acción al cancelar (opcional)
            //customAlert(`La eliminación de "${itemName}" fue cancelada.`, "pocima");
        }
    );
}
// Renderizar recetario como tabla
// Renderizar la tabla de recetas
// Renderizar la tabla de recetas
// Actualizar la función renderRecipeTable
// 🔧 MODIFICADA: render de la tabla de recetas con ingredientes coloreados según disponibilidad
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

        // Descripción de la poción (tooltip)
        const description = potionDescriptions[recipe.name] || "Descripción no disponible";
        const potionLink = `<span style="color: white;"><p href="#" title="${description}">${recipe.name}</p></span>`;

        // 🔹 Ingredientes con color por disponibilidad
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

// Función para olvidar una receta
function forgetRecipe(index) {
    const recipeToForget = recipes[index];
    if (recipeToForget.default) {
        customAlert(
            `La receta <strong>"${recipeToForget.name}"</strong> es predeterminada y no se puede olvidar.`,
            "eliminar_receta"
        );
        return;
    }

    customConfirm(
        "Olvidar Receta",
        "eliminar_receta",
        `¿Deseas olvidar la Receta <strong>"${recipeToForget.name}"</strong>?<br>Una vez hecho, su conocimiento se desvanecerá para siempre.`,
        () => {
            // Acción al confirmar
            recipes.splice(index, 1);
            saveRecipes();
            renderRecipeTable();
            customAlert(
                `Receta <strong>"${recipeToForget.name}"</strong> olvidada con éxito.`,
                "eliminar_receta"
            );
        },
        () => {
            // Acción al cancelar (opcional)
            // customAlert(`Has decidido conservar la receta "${recipeToForget.name}".`, "receta");
        }
    );


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
      // 🔑 Limpia el select antes de volver a rellenarlo
    materialSelect.innerHTML = "";
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
// Reemplaza la función generatePotionSelectors existente por esta
function generatePotionSelectors(type) {
    const container = document.getElementById("potion-ingredients");
    container.innerHTML = ""; // Limpiar cualquier contenido previo

    if (!type) return;

    // Asegurarnos de que container actúe como fila3 (column)
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

        // Subcontenedor para los radios (fila3a)
        const radioContainer = document.createElement("div");
        radioContainer.classList.add("fila3a");

        // Subcontenedor para los selects (fila3b)
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

            // IMPORTANTE: al cambiar, generamos los selects DENTRO de selectsContainer
            radio.addEventListener("change", () => {
                createSelectors(combination.selectors, selectsContainer);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + combination.label));
            radioContainer.appendChild(label);
        });

        container.appendChild(radioContainer);
        container.appendChild(selectsContainer);

        // Crear los selectores iniciales dentro de selectsContainer
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

// Reemplaza la función createSelectors existente por esta
function createSelectors(selectorsNeeded, container = document.getElementById("potion-ingredients")) {
    if (!container) return;

    // Eliminar únicamente los selects existentes dentro de este contenedor
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

            // rellenado posterior por populatePotionSelectors
            select.addEventListener("change", () => populatePotionSelectors());
            container.appendChild(select);
        }
    });

    // Rellenar opciones (busca todos los .potion-selector en el documento)
    populatePotionSelectors();
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
    if (type === "Básica") {
        const roll = Math.floor(Math.random() * 3) + 1; // Tirada de 1d3
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

        customAlert(
            `No se puede crear una poción sin <strong>Botellas Vacías</strong>.`,
            "sin_botellas"
        );
        return;
    }

    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {

        customAlert(
            `Primero Selecciona la Calidad de la Poción`,
            "selecciona_pocion"
        );
        return;
    }

    const selectedItems = Array.from(selectors).map(select => {
        const [name, quality] = select.value.split("#");
        return { name, exquisite: quality === "Exquisito" };
    });

    if (selectedItems.some(item => !item.name)) {
        customAlert(
            `Debes seleccionar todos los <strong>Ingredientes</strong> que vas a usar.`,
            "ingredientes_alquimia"
        );
        return;
    }

    // Verificar inventario
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
            customAlert(
                `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br>
                <strong>¡ÉXITO CRÍTICO!"</strong><br><br>** Mejora Hab. ALQ. en 1 ó<br>Recupera Toda la Energía **`,
                "pocion_critico"
            ); return;
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


        // Crear poción
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            const audio = new Audio(`img/interface/pocion_burbujeante.mp3`);
            let ComprobarMute = localStorage.getItem('sonido')
            if (ComprobarMute == "on") {
                audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
            }
            customAlert(
                `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br>
                <br>¡La Poción <strong>"${potionName}"</strong> ha sido elaborada con éxito!<br><br>
                ** Recuerda añadirla a tu Inventario. **`,
                "crea_pocion"
            );
        } else {
            const audio = new Audio(`img/interface/Eureka.mp3`);
            let ComprobarMute = localStorage.getItem('sonido')
            if (ComprobarMute == "on") {
                audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
            }

            potionName = getPotionName(type);
            customAlert(
                `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br>
                <br>¡Has Descubierto una nueva Poción:<strong>"${potionName}"!</strong><br>
                <br>¡La Poción <strong>"${potionName}"</strong> ha sido elaborada con éxito!<br><br>
                ** Recuerda añadirla a tu Inventario. **`,
                "crea_pocion"
            );

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
                    // Eliminar del inventario si se queda en 0
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });
        if (roll >= 95) {
            emptyBottles--;
            customAlert(
                `Has obtenido un <span style="border: 3px solid limegreen; padding: 5px; border-radius: 6px; font-weight: bold;">${roll}</span> en la Tirada.<br>
            ¡Los ingredientes se han estropeado!<br><br>
            <strong>Has Perdido los Siguientes Ingredientes:</strong><br>${selectedItems.map(item => item.name).join("<br>")}`,
                "fracaso_pocion"
            );
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
            ? "Ocultar Añadir Poción a Mano"
            : "Añadir Poción a Mano";

        // Resetear contenido del contenedor
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
    rowDiv.style.marginBottom = "10px"; // opcional: espacio con el siguiente elemento

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Calidad de la Poción: ";
    typeLabel.style.marginRight = "10px"; // separa label del select

    const typeSelect = document.createElement("select");
    typeSelect.id = "manual-potion-type";
    typeSelect.style.flex = "1"; // ocupa el resto del espacio

    ["", "Débil", "Básica", "Suprema"].forEach(type => {
        const option = document.createElement("option");
        //  option.value = type.toLowerCase();
        option.textContent = type || "Seleccionar tipo";
        typeSelect.appendChild(option);
    });

    // Añadir label y select al contenedor
    rowDiv.appendChild(typeLabel);
    rowDiv.appendChild(typeSelect);
    container.appendChild(rowDiv);

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

    // Desplegable de nombre de poción
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

    // Generar los selects según el tipo de poción
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

    // Botón para añadir al recetario
    const addButton = document.createElement("button");
    addButton.textContent = "Añadir al Libro de Alquimia";
    addButton.className = "btn_opciones";
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "10px"; // opcional, para separar del resto

    buttonContainer.appendChild(addButton);
    addButton.addEventListener("click", () => {
        const selectedPotionName = potionNameSelect.value;
        const materialSelects = Array.from(form.querySelectorAll("select")).slice(1); // ignorar select de poción
        const selectedMaterials = materialSelects.map(s => s.value).filter(v => v);

        if (!selectedPotionName) {
            customAlert("Debes seleccionar el Nombre de la Poción.", "nueva_receta");
            return;
        }

        if (selectedMaterials.length < materialSelects.length) {
            customAlert("Debes seleccionar todos los materiales sin repetir.", "nueva_receta");
            return;
        }

        // Comprobar si la receta ya existe (sin importar el orden de los materiales)
        const recipeExists = recipes.some(recipe =>
            recipe.name === selectedPotionName &&
            recipe.type === type &&
            arraysEqualUnordered(recipe.ingredients, selectedMaterials)
        );

        if (recipeExists) {
            customAlert("¡Ya conoces esta receta!", "nueva_receta");
            return;
        }

        // Crear la nueva receta
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

    // --------- FUNCIONES AUXILIARES ---------

    function createSelect(container, labelText, optionsArray) {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        rowDiv.style.alignItems = "center";
        rowDiv.style.marginBottom = "8px"; // espacio entre filas

        const label = document.createElement("label");
        label.textContent = labelText + ": ";
        label.style.width = "150px"; // ancho fijo para alinear todos los selects
        label.style.marginRight = "10px";

        const select = document.createElement("select");
        select.style.flex = "1"; // ocupa todo el espacio restante

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

        // Evento para evitar duplicados
        select.addEventListener("change", () => {
            enforceUniqueSelections(container);
        });

        rowDiv.appendChild(label);
        rowDiv.appendChild(select);
        container.appendChild(rowDiv);
    }


    function enforceUniqueSelections(container) {
        const selects = Array.from(container.querySelectorAll("select")).slice(1); // el 1º es poción
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
function reproducirAudiosSecuencial(audios) {
    let i = 0;
    const basePath = "img/interface/";

    function playNext() {
        if (i >= audios.length) return;
        const audio = new Audio(basePath + audios[i]);
        i++;
        let ComprobarMute = localStorage.getItem('sonido')
        if (ComprobarMute == "on") {
            audio.play().catch(err => console.error("No se pudo reproducir el audio:", err));
        }
        audio.addEventListener("ended", playNext);
    }

    playNext();
}

// 🔸 NUEVO: helper para normalizar (minúsculas + sin tildes)
function normStr(s) {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
}

// 🔸 NUEVO: comprueba si hay al menos 1 unidad de un material (sin distinguir exquisito) en inventario
function hasMaterialAvailable(name) {
    const target = normStr(name);
    return inventory.some(it => normStr(it.name) === target && (it.units || 0) > 0);
}

// 🔸 NUEVO: devuelve HTML con ingredientes coloreados y comas en blanco
function formatRecipeIngredientsWithAvailability(ingredientsArr) {
    if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) return "";
    const parts = [];
    ingredientsArr.forEach((ing, idx) => {
        const ok = hasMaterialAvailable(ing);
        parts.push(`<span style="color:${ok ? '#67e667' : '#ff6b6b'}; font-weight:bold;">${ing}</span>`);
        if (idx < ingredientsArr.length - 1) {
            parts.push(`<span style="color:#fff;">, </span>`); // coma en blanco
        }
    });
    return parts.join('');
}

