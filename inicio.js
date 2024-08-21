document.getElementById('inicio-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombreJugador = document.getElementById('nombre-jugador').value;
    
    // Guardar el nombre del jugador en el almacenamiento local
    localStorage.setItem('nombreJugador', nombreJugador);
    
    // Redireccionar a la página del juego
    window.location.href = 'index.html'; 
});
