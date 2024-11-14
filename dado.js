function rollDice(sides,diceimage,resultado) {
    const diceImage = document.getElementById(diceimage);
    const resultDiv = document.getElementById(resultado);  // Obtener el div del resultado
    let currentSide = 1;
    let maxSide = sides;
    let rollDuration = 2000;  // Duración de la "animación"
    let interval = 100;  // Intervalo entre los cambios de imagen
    let rotationDegree = 0;  // Grado de rotación inicial

    resultDiv.textContent = "";  // Limpiar el resultado previo

    let rollInterval = setInterval(() => {
        // Mostrar caras al azar durante la animación
        currentSide = Math.floor(Math.random() * maxSide) + 1;

        // Formatear el nombre de la imagen correctamente según el número de lados
        let formattedSide = currentSide.toString().padStart(2, '0'); // para D10 y D20
        if (sides === 6) {
            
            diceImage.src = `img/dados/D6-${currentSide}.png`;
            diceImage.style.display = 'block';
        } else if (sides === 10) {
            diceImage.src = `img/dados/D10-${formattedSide}.png`;
            diceImage.style.display = 'block';
        } else if (sides === 20) {
            diceImage.src = `img/dados/D20-${formattedSide}.png`;
            diceImage.style.display = 'block';
        }

        // Rotar la imagen simulando el "rodar" del dado
        rotationDegree = Math.floor(Math.random() * 360);  // Grado de rotación aleatorio
        diceImage.style.transform = `rotate(${rotationDegree}deg)`;

    }, interval);


    // Detener la animación después de `rollDuration` ms y mostrar el resultado final
    setTimeout(() => {
        clearInterval(rollInterval);

        // Obtener un valor final aleatorio
        let finalSide = Math.floor(Math.random() * maxSide) + 1;
        let formattedFinalSide = finalSide.toString().padStart(2, '0');

        // Mostrar la cara final del dado
        if (sides === 6) {
            diceImage.src = `img/dados/D6-${finalSide}.png`;
        } else if (sides === 10) {
            diceImage.src = `img/dados/D10-${formattedFinalSide}.png`;
        } else if (sides === 20) {
            diceImage.src = `img/dados/D20-${formattedFinalSide}.png`;
        }

        // Detener la rotación (restaurar a la posición original)
        diceImage.style.transform = 'rotate(0deg)';

        // Mostrar el resultado en el div
        resultDiv.textContent = `${finalSide}`;
    }, rollDuration);
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}