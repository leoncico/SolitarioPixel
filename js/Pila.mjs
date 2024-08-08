import Carta from './Carta.mjs';

class Pila {
    constructor(){
        this.cartas = [];
    };

    prueba(){
        let carta = new Carta(1, 'trebol', 'negro', 'xd', true);
        carta.hola();
    };
}

const pila = new Pila();

pila.prueba();