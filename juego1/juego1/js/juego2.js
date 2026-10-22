// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
// Pantallas y Secciones
const seccionInicio = document.getElementById("primeraparte");
const seccionJuego = document.getElementById("juego");
const seccionGameOver = document.getElementById("gameover");
const seccionExito = document.getElementById("resultados")

// Botones principales
const botonJugar = document.getElementById("jugar");
const botonReiniciar = document.getElementById("reinicio");
const btonPuntaje = document.getElementById("btonPuntaje");

// Botones de dificultad
const botonFacil = document.getElementById("facil");
const botonNormal = document.getElementById("normal");
const botonDificil = document.getElementById("dificil");

// Entradas de usuario
const inputNombre = document.getElementById("nombre");
const inputNumeroUser = document.getElementById("numerouser");

// Elementos de UI / Mensajes
const txtContador = document.getElementById("contador");
const txtMensajeInicio = document.querySelector(".mensaje");
const txtMensaje = document.querySelector(".mensaje1");
const txtPista = document.querySelector(".pista");
const txtIntentos = document.querySelector(".intentos");
const txtNivel = document.getElementById("pregunta")


// Historial y Puntajes
const hiNombreUI = document.querySelectorAll(".hi_nombreUI");
const hiTiempoUI = document.querySelectorAll(".hi_tiempoUI");
const hiPuntosUI = document.querySelectorAll(".hi_puntosUI");
const hiNivelUI = document.querySelectorAll(".hi_nivelUI");

// ==========================================
// 2. ESTADO GLOBAL DEL JUEGO
// ==========================================
let dificultad;
let tiempo = 0;
let intervalo = null;
let numeroSuerte = 0;
let numeroIntentos = 0;

// ==========================================
// 3. FUNCIONES DE LÓGICA Y CONTROL
// ==========================================

function ocultarP1(){
    let nombre = inputNombre.value.trim();

    if (!nombre) {
        txtMensajeInicio.innerText = "Por favor, escribe tu nombre...";
        return;
    }

    seccionInicio.style.display = "none";
    seccionJuego.style.display = "block";
}

function iniciarTiempo() {
    clearInterval(intervalo); // Evita acumulación de intervalos
    intervalo = setInterval(() => {
        txtContador.innerText = tiempo;
        tiempo++;
    }, 1000);
}

function detenerTiempo() {
    clearInterval(intervalo);
}

function iniciarJuego() {
    detenerTiempo();
    tiempo = 0;
    txtContador.innerText = tiempo;
    numeroIntentos = 0;
    txtIntentos.innerText = "";
    ocultarP1();
    
    
    // Generar número secreto
    switch (dificultad){
        case "facil":
            numeroSuerte = Math.floor(Math.random() * 10) + 1;
            txtNivel.innerText = "adivina un numero del 1 al 10, tienes 10 intentos"

            break;
        case "normal":
            numeroSuerte = Math.floor(Math.random() * 100) + 1;
            txtNivel.innerText = "adivina un numero del 1 al 100, tienes 7 intentos"
            break;
        case "dificil":
            numeroSuerte = Math.floor(Math.random() * 1000) + 1;
            txtNivel.innerText = "adivina un numero del 1 al 1000, tienes 5 intentos"
            break;
    }
    console.log("Número secreto (Debug): " + numeroSuerte);

    inputNumeroUser.value = "";
    txtMensaje.innerText = "";
    txtPista.innerText = "";
    
    iniciarTiempo();
}

function verificarLimiteIntentos() {
    let limiteMaximo = 10; // Fácil

    if (dificultad === "normal") limiteMaximo = 7;
    if (dificultad === "dificil") limiteMaximo = 5;

    if (numeroIntentos > limiteMaximo) {
        detenerTiempo();
        seccionGameOver.style.display = "block";
        seccionJuego.style.display = "none";
        return true;
    }
    return false;
}

function verificarIntento() {
    let nombre = inputNombre.value.trim();
    let valorUser = parseInt(inputNumeroUser.value);

    if (isNaN(valorUser)) {
        txtMensaje.innerText = "Ingresa un número válido.";
        return;
    }

    numeroIntentos++;
    txtIntentos.innerText = `Número de intentos: ${numeroIntentos}`;

    // Validar si superó los intentos permitidos
    if (verificarLimiteIntentos()) return;

    // Comprobar acierto o pista
    if (valorUser === numeroSuerte) {
        detenerTiempo();
        txtMensaje.innerText = "¡GANASTE!";
        txtPista.innerText = "";
        
        // Guardar partida en localStorage
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("tiempo", tiempo);
        localStorage.setItem("intentos", numeroIntentos);
        localStorage.setItem("nivel", dificultad);
        MostrarPuntaje()
    } else {
        txtMensaje.innerText = "No es el número...";
        txtPista.innerText = valorUser > numeroSuerte ? "Es menor" : "Es mayor";
    }
}

function MostrarPuntaje(){
    let hiNombre = localStorage.getItem("nombre");
    let hiTiempo = localStorage.getItem("tiempo");
    let hiPuntos = localStorage.getItem("intentos");
    let hiNivel = localStorage.getItem("nivel");

    if(seccionInicio.style.display === "none"){
        seccionExito.style.display= "block";
    }

    if (hiNombre) {
        hiNombreUI.forEach(el => el.innerText = `Último jugador: ${hiNombre}`);
        hiTiempoUI.forEach(el => el.innerText = `Tiempo:  ${hiTiempo}s`);
        hiPuntosUI.forEach(el => el.innerText = `Intentos:  ${hiPuntos}`);
        hiNivelUI.forEach(el => el.innerText = `Dificultad:  ${hiNivel}`);
    } else {
        hiNombreUI.innerText = "No hay registros guardados.";
    }
    seccionJuego.style.display = "none";
}

// ==========================================
// 4. EVENT LISTENERS (INTERACCIONES)
// ==========================================

// Selección de dificultad
botonFacil.addEventListener("click", () => {
    dificultad = "facil";
    iniciarJuego();
    
});

botonNormal.addEventListener("click", () => {
    dificultad = "normal";
    iniciarJuego();
});

botonDificil.addEventListener("click", () => {
    dificultad = "dificil";
    iniciarJuego();
});

// Botón principal para adivinar
botonJugar.addEventListener("click", () => {
    verificarIntento();
});

// Mostrar último puntaje guardado
btonPuntaje.addEventListener("click", () => {
    MostrarPuntaje();
});

// Botón de reinicio manual
botonReiniciar.addEventListener("click", () => {
    iniciarJuego();
    seccionExito.style.display = "none"
    seccionJuego.style.display = "block"
});

window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-audio');
  
  // Intentar reproducir automáticamente
  audio.play().catch(error => {
    console.warn("El navegador bloqueó el autoplay. Esperando interacción del usuario...");
    
    // Solución elegante: reproducir al primer clic que el usuario haga en la página
    const playOnInteract = () => {
      audio.play();
      // Remover el evento para que solo ocurra una vez
      document.body.removeEventListener('click', playOnInteract);
    };
    
    document.body.addEventListener('click', playOnInteract);
  });
});