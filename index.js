class Carta {
    constructor(numero, simbolo, color, imagenFrente, visible) {
        this.numero = numero;
        this.simbolo = simbolo;
        this.color = color;
        this.visible = visible;
        this.imagenFrente = imagenFrente;
        this.imagenAtras = "img/Bitmap57.png";
        this.imagen = this.visible ? this.imagenFrente : this.imagenAtras;
    }

    isVisible() {
        return this.visible;
    }

    setVisible(visible) {
        this.visible = visible;
        this.imagen = this.visible ? this.imagenFrente : this.imagenAtras;
    }
}

class Solitario {
    constructor() {
        this.puntaje = 0;
        this.tablero = new Tablero();
    }

    iniciarJuego() {
        this.tablero.crearMazo();
        this.tablero.mezclarMazo();
        this.tablero.ubicarMazo();
        this.agregarEventos();
    }

    actualizarPuntaje(puntos) {
        this.puntaje += puntos;
        console.log("Puntaje:", this.puntaje);
    }

    agregarEventos() {
        $('.pilaInicial').on('click', () => this.tablero.manejarRobo());

        $('.pilaRobo, .pilaJugable').on('dragstart', function (event) {
            if($(event.target).hasClass('claseCartaRobo') || $(event.target).hasClass('claseCarta')){
                console.log("Arrastrando carta con ID:", event.target.id);
                console.log("hola");
                event.originalEvent.dataTransfer.setData('text', event.target.id);
            }
        });

        $('.pilaJugable, .pilaGanada').on('dragover', function (event) {
            event.preventDefault();
        });

        $('.pilaJugable, .pilaGanada').on('dragenter', function (event) {
            event.preventDefault();
        });

        $('.pilaJugable').on('drop', (event) => {
            if($(event.target).hasClass('pilaJugable')){
                event.preventDefault();
                let id = event.originalEvent.dataTransfer.getData('text');
                this.moverCarta(id, event.target);
            }
            else if($(event.target).hasClass('claseCarta')){
                event.preventDefault();
                let id = event.originalEvent.dataTransfer.getData('text');
                this.moverCarta(id, event.target.parentElement);
            }
        });

        $('.pilaGanada').on('drop', (event) => {
            event.preventDefault();
            let id = event.originalEvent.dataTransfer.getData('text');
            this.moverGanadora(id, event.target);
        });
        
    }

    moverGanadora(idCartaOrigen, destinoElemento){
        // BUG CUANDO LA CARTA FUE ROBADA ANTES Y VIENE DE PILA JUGABLE SE HACE NULA LA CARTA QUE SE QUIERE MOVER
        let cartaElemento = document.getElementById(idCartaOrigen);
        let pilaDestino = destinoElemento.id.split("-")[1];
        
        let infoCarta = idCartaOrigen.split("-");
        let pila = infoCarta[2];
        let posicionCarta = parseInt(infoCarta[3]);

        let pilaGanada = this.tablero.pilasGanadas[pilaDestino];

        if(destinoElemento.classList.contains("pilaGanada") && cartaElemento.classList.contains("claseCarta")){
            let cartaLogica = this.tablero.pilasJugables[pila][posicionCarta];
            if(cartaLogica.numero === 1){
                pilaGanada.push(this.tablero.pilasJugables[pila].pop());
                cartaElemento.classList.remove('claseCarta');
                cartaElemento.setAttribute("class", 'claseCartaGanada');
                cartaElemento.setAttribute("id", `carta-ganada-${pilaDestino}-${cartaLogica.numero}`);
                destinoElemento.append(cartaElemento);
                this.tablero.verificarGanado();
                if(posicionCarta !==0){
                    let cartaRevelada = this.tablero.pilasJugables[pila][posicionCarta-1];
                    cartaRevelada.setVisible(true); 
                    let idCartaRevelada = "carta-jugable-" + pila + "-" + (posicionCarta-1);
                    let cartaReveladaFront = document.getElementById(idCartaRevelada);
                    cartaReveladaFront.setAttribute("src", cartaRevelada.imagen);
                    cartaReveladaFront.setAttribute("draggable", true);
                }
            }
        }
    
        else if(destinoElemento.classList.contains("claseCartaGanada") && cartaElemento.classList.contains("claseCarta")){
            let cartaLogica = this.tablero.pilasJugables[pila][posicionCarta];
            pilaDestino = destinoElemento.id.split("-")[2];
            let indiceUltimoElemento = this.tablero.pilasGanadas[pilaDestino].length - 1;
            pilaGanada =  this.tablero.pilasGanadas[pilaDestino];

            if(cartaLogica.numero - this.tablero.pilasGanadas[pilaDestino][indiceUltimoElemento].numero === 1 && cartaLogica.simbolo === this.tablero.pilasGanadas[pilaDestino][indiceUltimoElemento].simbolo){
                pilaGanada.push(this.tablero.pilasJugables[pila].pop());
                cartaElemento.classList.remove('claseCarta');
                cartaElemento.setAttribute("class", 'claseCartaGanada');
                cartaElemento.setAttribute("id", `carta-ganada-${pilaDestino}-${cartaLogica.numero}`);
                //destinoElemento.append(cartaElemento);
                destinoElemento.parentElement.append(cartaElemento);
                this.tablero.verificarGanado();
                if(posicionCarta !==0){
                    let cartaRevelada = this.tablero.pilasJugables[pila][posicionCarta-1];
                    cartaRevelada.setVisible(true); 
                    let idCartaRevelada = "carta-jugable-" + pila + "-" + (posicionCarta-1);
                    let cartaReveladaFront = document.getElementById(idCartaRevelada);
                    cartaReveladaFront.setAttribute("src", cartaRevelada.imagen);
                    cartaReveladaFront.setAttribute("draggable", true);
                }
            }
           
        }

        else if(destinoElemento.classList.contains("pilaGanada") && cartaElemento.classList.contains("claseCartaRobo")){
            let cartaLogica = this.tablero.pilaRobo[this.tablero.pilaRobo.length-1];
            if(cartaLogica.numero === 1){
                pilaGanada.push(this.tablero.pilaRobo.pop());
                cartaElemento.classList.remove('claseCarta');
                cartaElemento.setAttribute("class", 'claseCartaGanada');
                cartaElemento.setAttribute("id", `carta-ganada-${pilaDestino}-${cartaLogica.numero}`);
                destinoElemento.append(cartaElemento);
            }

        }

        
        else if(destinoElemento.classList.contains("claseCartaGanada") && cartaElemento.classList.contains("claseCartaRobo")){
            let cartaLogica = this.tablero.pilaRobo[this.tablero.pilaRobo.length-1];
            pilaDestino = destinoElemento.id.split("-")[2];
            let indiceUltimoElemento = this.tablero.pilasGanadas[pilaDestino].length - 1;
            pilaGanada =  this.tablero.pilasGanadas[pilaDestino];


            if(cartaLogica.numero - this.tablero.pilasGanadas[pilaDestino][indiceUltimoElemento].numero === 1 && cartaLogica.simbolo === this.tablero.pilasGanadas[pilaDestino][indiceUltimoElemento].simbolo){
                pilaGanada.push(this.tablero.pilaRobo.pop());
                cartaElemento.classList.remove('claseCarta');
                cartaElemento.setAttribute("class", 'claseCartaGanada');
                cartaElemento.setAttribute("id", `carta-ganada-${pilaDestino}-${cartaLogica.numero}`);
                //destinoElemento.append(cartaElemento);
                destinoElemento.parentElement.append(cartaElemento);
                this.tablero.verificarGanado();
            }
        }

        
        
    }

    moverCarta(idCartaOrigen, destinoElemento) {
        let carta = document.getElementById(idCartaOrigen);
        let claseCarta = carta.className;

        if(claseCarta === "claseCarta"){
            let infoCarta = idCartaOrigen.split("-");
            let pila = infoCarta[2];
            let posicionCarta = parseInt(infoCarta[3]);

            let nuevaPosicion = destinoElemento.childElementCount;
            let nuevaPila = destinoElemento.id.split("-")[1];
            
            if(this.tablero.puedeMover(this.tablero.pilasJugables[pila][posicionCarta] , nuevaPila, nuevaPosicion)){
                let cartasArrastradas = this.tablero.pilasJugables[pila].length - posicionCarta;
                let cartaLogica = this.tablero.pilasJugables[pila].splice(posicionCarta , cartasArrastradas);

                this.tablero.pilasJugables[nuevaPila].push(...cartaLogica);
                carta.id = "carta-jugable-" + nuevaPila + "-" + nuevaPosicion;
                destinoElemento.append(carta);

                if(posicionCarta !==0){
                    let cartaRevelada = this.tablero.pilasJugables[pila][posicionCarta-1];
                    cartaRevelada.setVisible(true); 
                    let idCartaRevelada = "carta-jugable-" + pila + "-" + (posicionCarta-1);
                    let cartaReveladaFront = document.getElementById(idCartaRevelada);
                    cartaReveladaFront.setAttribute("src", cartaRevelada.imagen);
                    cartaReveladaFront.setAttribute("draggable", true);
                }
                
                posicionCarta += 1;
                nuevaPosicion += 1;
                let siguienteCarta = document.getElementById("carta-jugable-" + pila + "-" + posicionCarta);
                while(siguienteCarta){
                    siguienteCarta.id = "carta-jugable-" + nuevaPila + "-" + nuevaPosicion;
                    destinoElemento.append(siguienteCarta);
                    posicionCarta += 1;
                    nuevaPosicion += 1;
                    siguienteCarta = document.getElementById("carta-jugable-" + pila + "-" + posicionCarta);
                }
            }
            
        }

        else if(claseCarta === "claseCartaRobo"){
            let nuevaPosicion = destinoElemento.childElementCount;
            let nuevaPila = destinoElemento.id.split("-")[1];
            let cartaRobo = this.tablero.pilaRobo[this.tablero.pilaRobo.length-1];
            
            if(this.tablero.puedeMover(cartaRobo, nuevaPila, nuevaPosicion)){
                let cartaLogica = this.tablero.pilaRobo.pop();
                this.tablero.pilasJugables[nuevaPila].push(cartaLogica);
                carta.id = "carta-jugable-" + nuevaPila + "-" + nuevaPosicion;
                carta.classList.remove('claseCartaRobo');
                carta.setAttribute("class" , 'claseCarta');
                destinoElemento.append(carta);
            }
        }

    }

}


class Tablero {
    constructor() {
        this.mazo = [];
        this.pilasJugables = [];
        this.pilasGanadas = [[],[],[],[]];
        this.pilaRobo = [];
    }

    crearMazo() {
        let colores = {
            trebol: "negro",
            diamante: "rojo",
            corazon: "rojo",
            pica: "negro"
        };

        let contImg = 1;
        for (let valor in colores) {
            for (let j = 1; j <= 13; j++) {
                let carta = new Carta(
                    j,
                    valor,
                    colores[valor],
                    "img/Bitmap" + contImg + ".png",
                    false
                );
                contImg += 1;
                this.mazo.push(carta);
            }
        }
    }

    mezclarMazo() {
        for (let i = this.mazo.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
        }

        for (let i = 0; i < 7; i++) {
            let pila = [];
            for (let k = 0; k <= i; k++) {
                let visible = (k === i);
                let carta = this.mazo.pop();
                carta.setVisible(visible);
                pila.push(carta);
            }
            this.pilasJugables.push(pila);
        }
    }

    ubicarMazo() {
        $('.pilaInicial').empty();

        for (let i = 0; i < this.mazo.length; i++) {
            let carta = $('<img></img>');
            carta.attr("src", this.mazo[i].imagen);
            carta.attr("id", `carta-${i}`);
            carta.attr("draggable", false);
            //carta.attr("class", 'claseCartaRobo')
            $('.pilaInicial').append(carta);
        }

        for (let i = 0; i < this.pilasJugables.length; i++) {
            let pila = this.pilasJugables[i];
            for (let j = 0; j < pila.length; j++) {
                let carta = $('<img></img>');
                carta.attr("src", pila[j].imagen);
                carta.attr("id", `carta-jugable-${i}-${j}`);
                carta.attr("draggable", pila[j].isVisible());
                carta.attr("class", 'claseCarta');
                $(`#pilaJugable-${i}`).append(carta);
            }
        }
    }

    manejarRobo() {
        if (this.mazo.length > 0) {
            let carta = this.mazo.pop();
            carta.setVisible(true);
            this.pilaRobo.push(carta);
            let cartaElemento = $('<img>');
            cartaElemento.attr("src", carta.imagen);
            cartaElemento.attr("draggable", true);
            cartaElemento.attr("id", `carta-robo-${this.pilaRobo.length - 1}`);
            cartaElemento.attr("class", 'claseCartaRobo')
            $('.pilaRobo').append(cartaElemento);
        } 
        
        else {
            $('.pilaRobo').empty();
            $('.pilaInicial').empty(); 
            this.mazo = this.pilaRobo.reverse().slice();
            this.pilaRobo = []; 
            for (let i = 0; i < this.mazo.length; i++) {
                let carta = $('<img></img>');
                carta.attr("src", this.mazo[i].imagenAtras);
                carta.attr("id", `carta-${i}`);
                carta.attr("draggable", false);
                carta.attr("class", 'claseCartaRobo');
                $('.pilaInicial').append(carta);
            }
            console.log("Reinicio de baraja");
        }
    }

    puedeMover(carta, nuevaPila, nuevaPosicion) {
        let cartaDestino = this.pilasJugables[nuevaPila][nuevaPosicion - 1];
        try{
            if(this.pilasJugables[nuevaPila].length === 0 && carta.numero === 13){
                return true;
            }

            else if( cartaDestino.numero - carta.numero === 1 && (carta.color !== cartaDestino.color) ){
                return true;
            }
        }
        
        catch{
            console.log("No se puede mover la carta a ese lugar");
        }
        
        return false;
    }

    verificarGanado() {
        let cartasEnGanadas = this.pilasGanadas.flat().length;
        if (cartasEnGanadas === 52) {
            console.log("¡Has ganado el juego!");
            alert("¡Has ganado el juego!");
        }
    }
}

$(document).ready(function() {
    let solitario = new Solitario();
    solitario.iniciarJuego();
});
window.onload = function() {
    const nombreJugador = localStorage.getItem('nombreJugador');
    if (nombreJugador) {
        document.getElementById('nombre-jugador-display').textContent = `Jugador: ${nombreJugador}`;
    }
};