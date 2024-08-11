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


        $('.pilaJugable img, .pilaGanada img, .pilaRobo img').on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData('text', event.target.id);
        });

        $('.pilaJugable, .pilaGanada').on('dragover', function (event) {
            event.preventDefault();
        });

        $('.pilaJugable, .pilaGanada').on('dragenter', function (event) {
            event.preventDefault();
        });

        $('.pilaJugable, .pilaGanada').on('drop', (event) => {
            event.preventDefault();
            let id = event.originalEvent.dataTransfer.getData('text');
            let cartaElemento = document.getElementById(id);
            this.moverCarta(cartaElemento, event.target);
        });
    }

    moverCarta(cartaElemento, destinoElemento) {
        let carta = $(cartaElemento);
        let destino = $(destinoElemento);

        
        let padre = destinoElemento.parentElement;

        console.log(carta, destino);

        padre.append(carta);
            carta.css({
                position: 'relative',
                top: '50',
                left: '50'
            });


        // if (this.tablero.puedeMover(carta[0], destino[0])) {
        //     destino.append(carta);
        //     carta.css({
        //         position: 'relative', // Cambiar a 'absolute' para que la carta se mueva sobre el contenedor
        //         top: '50',
        //         left: '50'
        //     });
        //     this.tablero.actualizarPuntaje(10);
        //     this.tablero.verificarGanado();
            
        // } else {
        //     console.log("Movimiento no válido.");
        // }
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
            pica: "negro",
            corazon: "rojo"
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
            $('.pilaInicial').append(carta);
        }

        // Agregar cartas a las pilas jugables
        for (let i = 0; i < this.pilasJugables.length; i++) {
            let pila = this.pilasJugables[i];
            for (let j = 0; j < pila.length; j++) {
                let carta = $('<img></img>');
                carta.attr("src", pila[j].imagen);
                carta.attr("id", `carta-jugable-${i}-${j}`);
                carta.attr("draggable", pila[j].isVisible());
                carta.css({
                    position: 'absolute',
                    top: `${j * 30}px`,
                    left: `${i * 100}px`
                });
                $(`#pilaJugable${i}`).append(carta);
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

    puedeMover(cartaElemento, destinoElemento) {
        let carta = $(cartaElemento);
        let destino = $(destinoElemento);
        let cartaID = carta.attr('id');
        let destinoID = destino.attr('id');

        console.log(cartaID+destinoID);

        if (destinoID.startsWith('pilaJugable')) {
            let index = parseInt(destinoID.replace('pilaJugable', ''), 10);
            let pila = this.pilasJugables[index];

            if (pila.length === 0) {
                return carta[0].numero === 13; // Solo el Rey puede estar en una pila vacía
            } else {
                let cartaSuperior = pila[pila.length - 1];
                return this.esMovimientoValido(carta[0], cartaSuperior);
            }
        } else if (destinoID.startsWith('pilaGanada')) {
            let index = parseInt(destinoID.replace('pilaGanada', ''), 10);
            let pilaGanada = this.pilasGanadas[index];

            if (pilaGanada.length === 0) {
                return carta[0].numero === 1; // Solo el As puede estar en una pila ganada vacía
            } else {
                let cartaSuperior = pilaGanada[pilaGanada.length - 1];
                return carta[0].numero === cartaSuperior.numero + 1 && carta[0].color === cartaSuperior.color;
            }
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
}

$(document).ready(function() {
    let solitario = new Solitario();
    solitario.iniciarJuego();
});
