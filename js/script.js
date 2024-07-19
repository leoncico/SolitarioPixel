
let mazo = []

let colores = {
    trebol:"negro",
    diamante:"rojo",
    pica:"negro",
    corazon:"rojo"
}

let contImg = 1

function crearBaraja(){
    for(let valor in colores){
        for(let j=1; j<=13; j++){
            let carta = {
                numero: j,
                simbolo: valor,
                color: colores[valor],
                imagen: "Bitmap" + contImg
            }
            contImg += 1
            mazo.push(carta)
        }
    }
}

crearBaraja()

console.log(mazo)