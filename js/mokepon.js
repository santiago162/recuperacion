// --- VARIABLES DE ELEMENTOS DEL DOM ---
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota');
const botonMascotaJugador = document.getElementById('boton-mascota');

const spanMascotaJugador = document.getElementById('mascota-jugador');
const emojiJugador = document.getElementById('emoji-jugador');
const spanMascotaEnemigo = document.getElementById('mascota-enemigo');
const emojiEnemigo = document.getElementById('emoji-enemigo');

const spanVidasJugador = document.getElementById('vidas-jugador');
const spanVidasEnemigo = document.getElementById('vidas-enemigo');

const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const contenedorAtaques = document.getElementById('contenedor-ataques');

const resultadoCombate = document.getElementById('resultado-combate');
const detalleAtaques = document.getElementById('detalle-ataques');
const sectionReiniciar = document.getElementById('reiniciar');
const botonReiniciar = document.getElementById('boton-reiniciar');

// --- ESTADO DEL JUEGO ---
let mokepones = [];
let mokeponJugadorObjeto;
let mokeponEnemigoObjeto;
let vidasJugador = 3;
let vidasEnemigo = 3;

// --- CLASE MOKEPON ---
class Mokepon {
    constructor(nombre, emoji, tipo, claseTipo) {
        this.nombre = nombre;
        this.emoji = emoji;
        this.tipo = tipo;
        this.claseTipo = claseTipo;
        this.ataques = [];
    }
}

// CREACIÓN DE PERSONAJES Y ATAQUES
const hipodoge = new Mokepon('Hipodoge', '🦛', 'Agua', 'tipo-agua');
const capipepo = new Mokepon('Capipepo', '🦫', 'Tierra', 'tipo-tierra');
const ratigueya = new Mokepon('Ratigueya', '🐀', 'Fuego', 'tipo-fuego');

hipodoge.ataques.push(
    { nombre: '💧 Agua', tipo: 'AGUA' },
    { nombre: '💧 Chorro Agua', tipo: 'AGUA' },
    { nombre: '🌱 Hoja Afilada', tipo: 'TIERRA' },
    { nombre: '🔥 Llama', tipo: 'FUEGO' }
);

capipepo.ataques.push(
    { nombre: '🌱 Tierra', tipo: 'TIERRA' },
    { nombre: '🌱 Roca', tipo: 'TIERRA' },
    { nombre: '💧 Burbuja', tipo: 'AGUA' },
    { nombre: '🔥 Fuego', tipo: 'FUEGO' }
);

ratigueya.ataques.push(
    { nombre: '🔥 Fuego', tipo: 'FUEGO' },
    { nombre: '🔥 Lanzallamas', tipo: 'FUEGO' },
    { nombre: '🌱 Embestida', tipo: 'TIERRA' },
    { nombre: '💧 Salpicadura', tipo: 'AGUA' }
);

mokepones.push(hipodoge, capipepo, ratigueya);

// INICIALIZACIÓN
function iniciarJuego() {
    // Renderizar tarjetas de selección de mascotas
    mokepones.forEach((mokepon) => {
        const tarjetaHtml = `
        <label class="tarjeta-label">
            <input type="radio" name="mascota" value="${mokepon.nombre}" />
            <div class="tarjeta-card">
                <span class="avatar-emoji">${mokepon.emoji}</span>
                <span class="nombre-mokepon">${mokepon.nombre}</span>
                <span class="tipo-badge ${mokepon.claseTipo}">${mokepon.tipo}</span>
            </div>
        </label>
        `;
        contenedorTarjetas.innerHTML += tarjetaHtml;
    });

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador);
    botonReiniciar.addEventListener('click', () => location.reload());
}

// SELECCIÓN DE MASCOTA DEL JUGADOR
function seleccionarMascotaJugador() {
    const opcionSeleccionada = document.querySelector('input[name="mascota"]:checked');
    if (!opcionSeleccionada) {
        alert('⚠️ Por favor selecciona una mascota para continuar.');
        return;
    }

    mokeponJugadorObjeto = mokepones.find(m => m.nombre === opcionSeleccionada.value);
    if (!mokeponJugadorObjeto) {
        throw new Error(`No existe la mascota seleccionada: ${opcionSeleccionada.value}`);
    }

    // Actualizar Interfaz
    spanMascotaJugador.innerText = mokeponJugadorObjeto.nombre;
    emojiJugador.innerText = mokeponJugadorObjeto.emoji;

    sectionSeleccionarMascota.style.display = 'none';
    sectionSeleccionarAtaque.style.display = 'flex';

    seleccionarMascotaEnemigo();
    mostrarAtaques();
}

// SELECCIÓN ALEATORIA DEL ENEMIGO
function seleccionarMascotaEnemigo() {
    const indiceAleatorio = aleatorio(0, mokepones.length - 1);
    mokeponEnemigoObjeto = mokepones[indiceAleatorio];

    spanMascotaEnemigo.innerText = mokeponEnemigoObjeto.nombre;
    emojiEnemigo.innerText = mokeponEnemigoObjeto.emoji;
}

// MOSTRAR BOTONES DE ATAQUE
function mostrarAtaques() {
    contenedorAtaques.innerHTML = '';
    mokeponJugadorObjeto.ataques.forEach((ataque) => {
        const boton = document.createElement('button');
        boton.className = 'btn-ataque';
        boton.innerText = ataque.nombre;
        boton.addEventListener('click', () => ejecutarTurno(ataque.tipo));
        contenedorAtaques.appendChild(boton);
    });
}

// EJECUCIÓN DEL TURNO DE BATALLA
function ejecutarTurno(ataqueJugador) {
    if (vidasJugador <= 0 || vidasEnemigo <= 0) {
        return;
    }

    // Seleccionar ataque aleatorio para el enemigo
    const indiceAtaqueEnemigo = aleatorio(0, mokeponEnemigoObjeto.ataques.length - 1);
    const ataqueEnemigo = mokeponEnemigoObjeto.ataques[indiceAtaqueEnemigo].tipo;

    // Determinar Ganador del Turno
    if (ataqueJugador === ataqueEnemigo) {
        resultadoCombate.innerText = "¡EMPATE! 🤝";
    } else if (
        (ataqueJugador === 'FUEGO' && ataqueEnemigo === 'TIERRA') ||
        (ataqueJugador === 'AGUA' && ataqueEnemigo === 'FUEGO') ||
        (ataqueJugador === 'TIERRA' && ataqueEnemigo === 'AGUA')
    ) {
        resultadoCombate.innerText = "¡GANASTE EL TURNO! 🎉";
        vidasEnemigo--;
    } else {
        resultadoCombate.innerText = "¡PERDISTE EL TURNO! 💥";
        vidasJugador--;
    }

    // Actualizar Vidas y Detalles
    actualizarVidasUI();
    detalleAtaques.innerText = `Atacaste con ${ataqueJugador} — El enemigo atacó con ${ataqueEnemigo}`;

    // Validar Fin del Juego
    revisarVidas();
}

function actualizarVidasUI() {
    spanVidasJugador.innerText = '❤️'.repeat(Math.max(0, vidasJugador)) || '💀';
    spanVidasEnemigo.innerText = '❤️'.repeat(Math.max(0, vidasEnemigo)) || '💀';
}

function revisarVidas() {
    if (vidasJugador === 0 || vidasEnemigo === 0) {
        // Deshabilitar botones de ataque
        const botonesAtaque = document.querySelectorAll('.btn-ataque');
        botonesAtaque.forEach(b => b.disabled = true);

        if (vidasJugador === 0 && vidasEnemigo === 0) {
            resultadoCombate.innerText = "¡EMPATE FINAL EN LA BATALLA! ⚔️";
        } else if (vidasJugador > 0) {
            resultadoCombate.innerText = "🎉 ¡FELICIDADES! ¡HAS GANADO LA BATALLA! 🏆";
        } else {
            resultadoCombate.innerText = "☠️ HAS SIDO DERROTADO. ¡INTÉNTALO DE NUEVO!";
        }

        sectionReiniciar.style.display = 'block';
    }
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Cargar todo al iniciar la página
window.addEventListener('load', iniciarJuego);