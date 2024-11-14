async function loadMenu() {
    try {
        const response = await fetch('menu.html'); // Asegúrate de que la ruta sea correcta
        const menuHtml = await response.text();
        document.getElementById('sidebar').innerHTML = menuHtml;
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu(); // Llamada inicial para cargar el menú en el contenedor lateral
});
