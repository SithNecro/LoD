async function loadMenu() {
    try {
        const response = await fetch('menu.html'); // Aseg�rate de que la ruta sea correcta
        const menuHtml = await response.text();
        document.getElementById('sidebar').innerHTML = menuHtml;
    } catch (error) {
        console.error('Error al cargar el men�:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu(); // Llamada inicial para cargar el men� en el contenedor lateral
});
