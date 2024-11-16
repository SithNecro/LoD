const defaultCharacters = [
    { id: 'pj1', name: 'Personaje 1', vidaActual: 10, vidaMaxima: 20, mana: 10, cordura: 10, energia: 10, suerte: 10, corduraMensaje: '' },
    { id: 'pj2', name: 'Personaje 2', vidaActual: 15, vidaMaxima: 30, mana: 15, cordura: 15, energia: 15, suerte: 15, corduraMensaje: '' },
    { id: 'pj3', name: 'Personaje 3', vidaActual: 20, vidaMaxima: 40, mana: 20, cordura: 20, energia: 20, suerte: 20, corduraMensaje: '' },
    { id: 'pj4', name: 'Personaje 4', vidaActual: 25, vidaMaxima: 50, mana: 25, cordura: 25, energia: 25, suerte: 25, corduraMensaje: '' }
];

const disadvantages = [
    "Paranoia extrema: desconfías de todos.",
    "Miedo irracional a la oscuridad.",
    "Ataques de ira incontrolable.",
    "Alucinaciones constantes."
];

function loadCharacters() {
    const savedData = localStorage.getItem('characters');
    return savedData ? JSON.parse(savedData) : defaultCharacters;
}

function saveCharacters(characters) {
    localStorage.setItem('characters', JSON.stringify(characters));
}

function renderTable() {
    const characters = loadCharacters();
    const tableBody = document.getElementById('character-table');
    tableBody.innerHTML = '';

    characters.forEach((character, index) => {
        const row = document.createElement('tr');

        // Nombre y mensajes
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            <input type="text" class="input-field" value="${character.name}" onchange="updateName(${index}, this.value)">
            <div id="${character.id}-alert-vida" class="alert" style="display: none; color: red;"></div>
            <div id="${character.id}-alert-cordura" class="alert" style="display: none; color: darkviolet;"></div>
        `;
        row.appendChild(nameCell);

        // Atributos
        ['vidaActual', 'vidaMaxima', 'mana', 'cordura', 'energia', 'suerte'].forEach(attr => {
            const cell = document.createElement('td');
            cell.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <button class="action-btn btn-minus" onclick="modifyAttribute(${index}, '${attr}', -1)">-</button>
                    <span id="${character.id}-${attr}" style="margin: 0 10px;">${character[attr]}</span>
                    <button class="action-btn btn-plus" onclick="modifyAttribute(${index}, '${attr}', 1)">+</button>
                </div>
            `;
            if (attr === 'vidaActual' || attr === 'vidaMaxima') {
                cell.style.backgroundColor = character.vidaActual < character.vidaMaxima / 2 ? 'red' : '';
            }
            row.appendChild(cell);
        });

        tableBody.appendChild(row);

        // Mostrar mensajes si es necesario
        checkAlerts(character, index);
    });

    saveCharacters(characters);
}

function updateName(index, newName) {
    const characters = loadCharacters();
    characters[index].name = newName;
    saveCharacters(characters);
}

function modifyAttribute(index, attr, value) {
    const characters = loadCharacters();
    const character = characters[index];

    character[attr] = Math.max(0, character[attr] + value);

    // Reglas adicionales para Vida y Cordura
    if (attr === 'vidaActual' || attr === 'vidaMaxima') {
        if (character.vidaActual < character.vidaMaxima / 2) {
            document.getElementById(`${character.id}-vidaActual`).parentElement.parentElement.style.backgroundColor = 'red';
            document.getElementById(`${character.id}-vidaMaxima`).parentElement.parentElement.style.backgroundColor = 'red';
        } else {
            document.getElementById(`${character.id}-vidaActual`).parentElement.parentElement.style.backgroundColor = '';
            document.getElementById(`${character.id}-vidaMaxima`).parentElement.parentElement.style.backgroundColor = '';
        }
    }

    if (attr === 'cordura' && character.cordura === 0) {
        const randomDisadvantage = disadvantages[Math.floor(Math.random() * disadvantages.length)];
        character.corduraMensaje = randomDisadvantage;
    } else if (attr === 'cordura') {
        character.corduraMensaje = '';
    }

    saveCharacters(characters);
    renderTable();
}

function checkAlerts(character, index) {
    const vidaAlert = document.getElementById(`${character.id}-alert-vida`);
    const corduraAlert = document.getElementById(`${character.id}-alert-cordura`);

    // Verificar alerta de vida
    if (character.vidaActual < character.vidaMaxima / 2) {
        vidaAlert.innerText = "-1 Acción";
        vidaAlert.style.display = 'block';
    } else {
        vidaAlert.style.display = 'none';
    }

    // Verificar alerta de cordura
    if (character.corduraMensaje) {
        corduraAlert.innerText = character.corduraMensaje;
        corduraAlert.style.display = 'block';
    } else {
        corduraAlert.style.display = 'none';
    }
}

window.onload = renderTable;
