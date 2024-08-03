
let mazo = [];
let pilas = [];

let colores = {
    trebol:"negro",
    diamante:"rojo",
    pica:"negro",
    corazon:"rojo"
};

let contImg = 1;

function crearBaraja(){
    for(let valor in colores){
        for(let j=1; j<=13; j++){
            let carta = {
                numero: j,
                simbolo: valor,
                color: colores[valor],
                imagen: "img/Bitmap" + contImg + ".png"
            };
            contImg += 1;
            mazo.push(carta);
        };
    };
};

function mezclarCartas(){
    for (let i = mazo.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
    return mazo;
}

function iniciarBaraja(){

    let cantidadCartas = 1;

    for(let i=0; i<7; i++){ // cambiar a while
        let pila = $('<div></div>');
        pila.attr("class", 'pila');
        while(cantidadCartas < 0){
            let carta = $('<img>');
            carta.attr("src", mazo[i].imagen);
            $('.pila').append(carta);
        };
        $('#tablero').append(pila);
    };
    
};

function formarPila(cantidad){
    let pila = [];
    for(let i=0; i<cantidad; i++){
        let carta = mazo.pop();
        pila.push(carta);
    };
    
}

crearBaraja();
iniciarBaraja();
mezclarCartas();

console.log(mazo);