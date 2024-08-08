class Carta {
    constructor(numero, simbolo, color, imagen, visible){
        this.numero = numero;
        this.simbolo = simbolo;
        this.color = color;
        this.imagen = imagen;
        this.visible = visible;
    }

    isVisible() {
        return this.visible;
    }

    setVisible(visible){
        this.visible = visible;
    }

    hola(){
        console.log('hola');
    }

}

export default Carta;