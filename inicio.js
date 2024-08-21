document.getElementById('inicio-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreJugador = document.getElementById('nombre-jugador').value;
    localStorage.setItem('nombreJugador', nombreJugador);
    window.location.href = 'index.html'; 
});
