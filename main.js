// Función para cambiar la imagen a un objeto legendario aleatorio
function cambiarImagen() {
    // Generar un número aleatorio entre 1 y 51
    var numeroAleatorio = Math.floor(Math.random() * 51) + 1;
    
    // Formatear el número para que siempre tenga tres dígitos (001, 002, ..., 051)
    var numeroFormateado = ('000' + numeroAleatorio).slice(-3);
    
    // Construir la ruta de la imagen aleatoria
    var nuevaImagen = 'tesoros_legendarios/Tesorolegendario_' + numeroFormateado + '-min.png';
    
    // Cambiar la imagen en la página
    document.getElementById('imagen-legendaria').src = nuevaImagen;
}

// Función para restaurar la imagen original
function restaurarImagen() {
    document.getElementById('imagen-legendaria').src = 'objetos_legendarios.png';
}
