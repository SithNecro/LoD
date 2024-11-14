async function loadMenu() {
    try {
        const response = await fetch('menu.html');
        const menuHtml = await response.text();
        document.getElementById('sidebar').innerHTML = menuHtml;

        // Configurar eventos después de cargar el menú en el DOM
        initMenuEvents();
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu(); // Llamada inicial para cargar el menú en el contenedor lateral
});
