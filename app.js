async function loadMenu() {
    try {
        const response = await fetch('menu.html');
        const menuHtml = await response.text();
        document.getElementById('sidebar').innerHTML = menuHtml;

        // Configurar eventos despu�s de cargar el men� en el DOM
        initMenuEvents();
    } catch (error) {
        console.error('Error al cargar el men�:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu(); // Llamada inicial para cargar el men� en el contenedor lateral
});
