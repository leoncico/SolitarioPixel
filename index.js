class Carta {
    constructor(numero, simbolo, color, imagenFrente, visible){
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

    setVisible(visible){
        this.visible = visible;
    }
}

class Solitario {
    constructor(){
        this.puntaje = 0;
        this.tablero = new Tablero();
    }

    iniciarJuego(){
        this.tablero.crearMazo();
        this.tablero.mezclarMazo();
        this.tablero.ubicarMazo();
    }

}

class Tablero {
    constructor(){
        this.mazo = [];

        this.pilasJugables = [];
    }

    crearMazo(){
        let colores = {
            trebol:"negro",
            diamante:"rojo",
            pica:"negro",
            corazon:"rojo"
        };

        let contImg = 1;
        for(let valor in colores){
            for(let j=1; j<=13; j++){
                let carta = new Carta(
                    j, 
                    valor, 
                    colores[valor],
                    "img/Bitmap" + contImg + ".png",
                    true
                );
                contImg += 1;
                this.mazo.push(carta);
            };
        };
};

    // Esto mezcla el mazo y acomoda logicamente las cartas jugables
    mezclarMazo(){
        for (let i = this.mazo.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
        }

        for (let i = 0; i < 7; i++) {
            let pila = [];
            for (let k = 0; k <= i; k++) {
                pila.push(this.mazo.pop());
            }
            this.pilasJugables.push(pila);
        }
        
    }

    ubicarMazo(){
        for(let i=0; i< this.mazo.length; i++){
            let carta = $('<img></img>');
            carta.attr("src", this.mazo[i].imagen);
            $('.pilaInicial').append(carta);
        }

        for (let i = 0; i < this.pilasJugables.length; i++) {
            console.log(this.pilasJugables);
            let pila = this.pilasJugables[i];
            for (let j = 0; j < pila.length; j++) {
                let carta = $('<img></img>');
                carta.attr("src", pila[j].imagen);
                carta.css({
                    position: 'absolute',
                    top: `${j * 30}px`,
                    left: `${i * 100}px`
                });
                $(`#pilaJugable${i}`).append(carta);
            }
        };
    };
};

class Pila{
    constructor(){
        this.cartas = [];
    }

    revelar() {
        console.log('Metodo debe ser reescrito en su hijo');
    }
    
}

class Jugable extends Pila{
    constructor(){
        super();
    }


}

let solitario = new Solitario();
solitario.iniciarJuego();