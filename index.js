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


        $('.pilaJugable img, .pilaGanada img').on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData('text', event.target.id);
        });

        $('.pilaJugable, .pilaGanada').on('dragover', function (event) {
            event.preventDefault();
        });

        $('.pilaJugable, .pilaGanada').on('dragenter', function (event) {
            $(this).addClass("prueba");
            event.preventDefault();
        });

        $('.pilaJugable, .pilaGanada').on('drop', (event) => {
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
    }

    moverCarta(idCartaOrigen, destinoElemento) {
        let carta = document.getElementById(idCartaOrigen);
        let infoCarta = idCartaOrigen.split("-");
        let pila = infoCarta[2];
        let posicionCarta = parseInt(infoCarta[3]);

        let nuevaPosicion = destinoElemento.childElementCount;
        let nuevaPila = destinoElemento.id.split("-")[1];
        
        if(this.tablero.puedeMover(pila, posicionCarta, nuevaPila, nuevaPosicion)){
            let cartasArrastradas = this.tablero.pilasJugables[pila].length - posicionCarta;
            let cartaLogica = this.tablero.pilasJugables[pila].splice(posicionCarta , cartasArrastradas);

            this.tablero.pilasJugables[nuevaPila].push(...cartaLogica);
            carta.id = "carta-jugable-" + nuevaPila + "-" + nuevaPosicion;
            destinoElemento.append(carta);
            
            this.tablero.pilasJugables[pila][posicionCarta-1].visible=true;       // ************** AUN NO SE REFLEJA EL CAMBIO DE VISIBILIDAD EN EL FRONT
            console.log(this.tablero.pilasJugables[pila][posicionCarta-1]);

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
    }


class Tablero {
    constructor() {
        this.mazo = [];
        this.pilasJugables = [];
        this.pilasGanadas = [[], [], [], []]; // Para las 4 pilas ganadas
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

        // Distribuir cartas en pilas jugables
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
        $('.pilaInicial').empty(); // Limpia el contenido de la pilaInicial

        // Agregar cartas al área de robo
        for (let i = 0; i < this.mazo.length; i++) {
            let carta = $('<img></img>');
            carta.attr("src", this.mazo[i].imagen);
            carta.attr("id", `carta-${i}`);
            carta.attr("draggable", true);
            carta.attr("class", 'carta')
            $('.pilaInicial').append(carta);
        }

        // Agregar cartas a las pilas jugables
        for (let i = 0; i < this.pilasJugables.length; i++) {
            let pila = this.pilasJugables[i];
            for (let j = 0; j < pila.length; j++) {
                let carta = $('<img></img>');
                carta.attr("src", pila[j].imagen);
                carta.attr("id", `carta-jugable-${i}-${j}`);
                //carta.attr("draggable", pila[j].isVisible());
                carta.attr("class", 'claseCarta');
                // carta.css({
                //     position: 'absolute',
                //     top: `${j * 30}px`,
                //     left: `${i * 100}px`
                // });
                $(`#pilaJugable-${i}`).append(carta);
            }
        }
    }

    manejarRobo() {
        if (this.mazo.length > 0) {
            let carta = this.mazo.pop();
            carta.setVisible(true);
            this.pilaRobo.push(carta);
            let cartaElemento = $('<img></img>');
            cartaElemento.attr("src", carta.imagen);
            cartaElemento.attr("draggable", true);
            cartaElemento.attr("id", `carta-robo-${this.pilaRobo.length - 1}`);
            $('.pilaRobo').append(cartaElemento);
        } else {
            console.log("No hay más cartas para robar.");
        }
    }

    puedeMover(pila, posicionCarta, nuevaPila, nuevaPosicion) {
        let carta = this.pilasJugables[pila][posicionCarta];
        let cartaDestino = this.pilasJugables[nuevaPila][nuevaPosicion - 1];

        if(this.pilasJugables[nuevaPila].length === 0 && carta.numero === 13){
            console.log("K se puede mover xd");
            return true;
        }

        
        else if( cartaDestino.numero - carta.numero === 1 && (carta.color !== cartaDestino.color) ){
            console.log("se puede mover por diferencia ");
            return true;
        }

        return false;
    }

    esMovimientoValido(carta, cartaSuperior) {
        // Verifica si la carta es del color alterno y tiene un valor descendente
        return carta.color !== cartaSuperior.color && carta.numero === cartaSuperior.numero - 1;
    }

    verificarGanado() {
        // Verifica si el juego ha sido ganado (por ejemplo, si todas las cartas están en las pilas ganadas)
        let cartasEnGanadas = this.pilasGanadas.flat().length;
        if (cartasEnGanadas === 52) {
            console.log("¡Has ganado el juego!");
            alert("¡Has ganado el juego!");
        }
    }



    //Pruebas
    // aplicarEventos(){
    //     for (let i = 0; i < this.pilasJugables.length; i++) {
    //         for (let j = 0; j < this.pilasJugables[i].length; j++) {
    //           const carta = this.pilasJugables[i][j];
    //           ().on('dragstart', (e) => {
    //             // Set the data being dragged to the card's ID or other identifying information
    //             e.originalEvent.dataTransfer.setData('text', $(carta).attr('id'));
    //           });
    //         }
    //       }
    // }

}

$(document).ready(function() {
    let solitario = new Solitario();
    solitario.iniciarJuego();
});
