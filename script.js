let salarioUser = 0
let valorAntiguedad = 0
let categoriaUser = ""
let antiguedadUser = 0
let tituloUser = 0
let nivelTituloUser = ""

// Establecemos las opciones para comenzar con el simulador o consultar simulaciones almacenadas en el LS
const elegirAccion = document.getElementById("seleccionarAccion")
seleccionarAccion.innerHTML=`
<button class="btn btn-danger" onclick="renderizarEscalafon()">Realizar nueva simulación</button>
<button class="btn btn-warning" onclick="listarSimulaciones()">Consultar simulaciones realizadas</button>
`

// Definimos la funcion que resetea todos los contenidos y los deja en blanco
function reset(){
    const seleccionarEscalafon = document.getElementById("seleccionarEscalafon")
    seleccionarEscalafon.innerHTML = `
    `
    const cardEscalafon = document.getElementById("cardEscalafon")
    cardEscalafon.innerHTML = `
    `
    const seleccionarAntiguedad = document.getElementById("seleccionarAntiguedad")
    seleccionarAntiguedad.innerHTML =`
    `
    const seleccionarTitulo = document.getElementById("seleccionarTitulo")
    seleccionarTitulo.innerHTML = `
    `
    const cardTitulos = document.getElementById("cardTitulos")
    cardTitulos.innerHTML = `
    `
    const tablaSueldo = document.getElementById("tablaSueldo")
    tablaSueldo.innerHTML = `
    `
}

// Renderizamos las opciones a elegir de categoria, tomandolas de un archivo .json
function renderizarEscalafon() {
    reset()
    seleccionarEscalafon.innerHTML = `
        <h6> Ingrese la categoria elegida para la simulación:</h6>
    `

    fetch("./escalafon.json")
    .then((res) => res.json())
    .then((datos) => {

        datos.forEach(e => {

            let divCard = document.createElement("div")
            divCard.id = e.id
            divCard.innerHTML = `
                <div class="m-1">
                <a href="#" class="btn btn-primary" onclick="escalafonElegido('${e.basico}','${e.valorAntiguedad}','${e.categoria}')">${e.categoria}</a>
                </div>
                `
    
            cardEscalafon.append(divCard)
        })})
      }


// Una vez elegida la categoria tomamos los valores y anulamos los clickon de los botones
function escalafonElegido(escalafonBasico, valorAntiguedad, escalafonCategoria) {
    salarioUser = parseInt(escalafonBasico)
    valorAntiguedadUser = parseInt(valorAntiguedad)
    categoriaUser = escalafonCategoria

    return anularEscalafon()    
}

function anularEscalafon() {
    cardEscalafon.innerHTML = ``
    
    fetch("./escalafon.json")
    .then((res) => res.json())
    .then((datos) => {

        datos.forEach(e => {

        let divCard = document.createElement("div")
        divCard.id = e.id
        divCard.innerHTML = `
            <div class="m-1">
            <a href="#" class="btn btn-primary">${e.categoria}</a>
            </div>
            `
    
        cardEscalafon.append(divCard)
        })})
    
        return elegirAntiguedad()
}

// Solicita el valor de la antiguedad por un input, que se anula luego
function elegirAntiguedad(){

seleccionarAntiguedad.innerHTML = `
    <form id="antiguedadUser"> 
        <h6> Ingrese la antiguedad elegida para la simulación:</h6>
        <input type="number" min="0" step="1" id="antiguedad">
        <input type="submit" id="subir" value="Seleccionar">
    </form>
`

document.getElementById("antiguedadUser").addEventListener("submit", (e) => {
    let infoEvent = e.target
    antiguedadUser = infoEvent.querySelector('#antiguedad')
    antiguedadUser = parseInt(antiguedad.value)
    document.getElementById("subir").disabled = true;
    
    return renderizarTitulos();
})
}

// Muestra las opciones de titulos para elegir, tomadas de un archivo .json
function renderizarTitulos() {
    
    seleccionarTitulo.innerHTML = `
        <h6> Ingrese el nivel de estudio alcanzado elegido para la simulación:</h6>
        `
    
    
    fetch("./titulos.json")
    .then((res) => res.json())
    .then((datos) => {

        datos.forEach(e => {

        let divCardTit = document.createElement("div")
        divCardTit.id = e.id
        divCardTit.innerHTML = `
            <div class="m-3">
            <a href="#" class="btn btn-primary" onclick="tituloElegido('${e.porcentaje}','${e.nivel}')">${e.nivel}</a>
            </div>
            `

        cardTitulos.append(divCardTit)

    })})
}


// Toma los valores del titulo elegido y sigue a calcular sueldo
function tituloElegido(tituloPorcentaje, tituloNivel) {
    tituloUser = parseFloat(tituloPorcentaje)
    nivelTituloUser = tituloNivel

    return calcularSueldo()
}



function calcularSueldo() {

    let antiguedadTabla = valorAntiguedadUser * antiguedadUser  // Arroja el valor para el item antiguedad
    let tituloTabla = salarioUser * tituloUser // arroja el valor para el item titulo

    sueldoBruto = salarioUser + antiguedadTabla + tituloTabla  // Arroja el salario Bruto
    

    // Tabla donde va a ser visualizada la informacion con boton al final para realizar una nueva simulacion
    tablaSueldo.innerHTML = `
    <table class="mx-auto w-50 table table-striped table-hover">
    <tr class="bg-success text-white fw-bold">
    <td>Concepto</td>
    <td>Monto</td>
    </tr>
    <tr>
    <td>Salario Basico -- ${categoriaUser}</td>
    <td>$ ${salarioUser}</td>
    </tr>
    <tr>
    <td>Antiguedad -- ${antiguedadUser} años</td>
    <td>$ ${antiguedadTabla}</td>
    </tr>
    <tr>
    <td>Titulo -- ${nivelTituloUser}</td>
    <td>$ ${tituloTabla}</td>
    </tr>
    <tr class="bg-success text-white fw-bold">
    <td>Sueldo Bruto</td>
    <td>$ ${sueldoBruto}</td>
    </tr>
    </table>
    `
    return guardarSimulacion()
}


// Creamos la matriz que nos permitira guardar la informacion en el LS, para despues consultarla
class Simulacion {
    constructor(categoria, antiguedad, titulo, bruto) {
        this.categoria = categoria,
        this.antiguedad = antiguedad,
        this.titulo = titulo,
        this.bruto = bruto
    }
}

// Definimos la matriz que se ejecuta una vez finalizada la simulacion y guarda la misma en el LS, sin borrar lo ya almacenado
function guardarSimulacion(){ 
        const simulacionActual = {
          categoria: categoriaUser,
          antiguedad: antiguedadUser,
          titulo: nivelTituloUser,
          bruto: sueldoBruto
        };
        
        let simulaciones = JSON.parse(localStorage.getItem("Simulacion")) || [];
        simulaciones.push(simulacionActual);
        localStorage.setItem("Simulacion", JSON.stringify(simulaciones));
}
    

// Definimos la funcion que mostrara las simulaciones en caso de ser llamada en la primera decision de la aplicacion
function listarSimulaciones(){
    reset()

    let SIMULACIONES = JSON.parse(localStorage.getItem("Simulacion"))
    let numeroSimulacion = 0
    SIMULACIONES.forEach ((simulacion => {
        let divCard = document.createElement("div")
        divCard.id = simulacion.id
        
        numeroSimulacion = numeroSimulacion + 1

        divCard.innerHTML = `
        
        <div class="m-3">
        <h5 class="p-2 text-bg-dark"> Simulación Nº ${numeroSimulacion}</h5>
        <h6> Categoria: ${simulacion.categoria}</h6>
        <h6> Antiguedad: ${simulacion.antiguedad} años</h6>
        <h6> Titulo: ${simulacion.titulo}</h6>
        <h6 class="p-2 text-bg-secondary"> Sueldo Bruto: $ ${simulacion.bruto}</h6>
        </div>
        `
    
        seleccionarEscalafon.append(divCard)    
    
        }))
}
