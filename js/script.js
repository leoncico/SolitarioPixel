
let mazo = [];

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

function iniciarBaraja(){
    let pila = [];
    let cantidadCartas = 1;

    
    for(let i=0; i<52; i++){
        let carta = $('<img>');
        carta.attr("src", mazo[i].imagen);
        $('#tablero').append(carta);
    };
};

crearBaraja();
iniciarBaraja();



console.log(mazo);