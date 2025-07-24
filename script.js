// Premios con emojis para que sean más visuales
let premios = [
    "🍬 Caramelos",
    "🍿 Pochoclos",
    "🧸 Juguete sorpresa",
    "🎟️ Acceso VIP",
    "🥤 Vale por bebida",
    "🍔 Vale por comida",
    "✨ Sticker exclusivo",
    "🎉 Pulsera de fiesta"
];

// Si el archivo premios.json existe, puedes cargarlo así:
fetch('premios.json')
    .then(response => response.json())
    .then(data => { premios = data; dibujarRuleta(); })
    .catch(() => dibujarRuleta());

const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const girarBtn = document.getElementById('girarBtn');
const premioDiv = document.getElementById('premio');
const colores = ["#ffe14d", "#f47aff", "#58e4e7", "#ff476f", "#6fff6f", "#ffb347", "#8b7aff", "#ff6fff"];

let anguloActual = 0;
let girando = false;
let premioIndex = 0;
const N_FOQUITOS = 32;
let foquitosEncendidos = 0;
let foquitosAnimInterval;

// Dibuja la ruleta con los premios y los foquitos
function dibujarRuleta() {
    const n = premios.length;
    const radio = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja los sectores de la ruleta
    for (let i = 0; i < n; i++) {
        const anguloInicio = anguloActual + (i * 2 * Math.PI / n);
        const anguloFin = anguloActual + ((i + 1) * 2 * Math.PI / n);
        ctx.beginPath();
        ctx.moveTo(radio, radio);
        ctx.arc(radio, radio, radio - 24, anguloInicio, anguloFin, false);
        ctx.closePath();
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();

        // Dibuja el texto del premio (más pequeño, centrado)
        ctx.save();
        ctx.translate(radio, radio);
        ctx.rotate(anguloInicio + (anguloFin - anguloInicio) / 2);
        ctx.textAlign = "center";
        ctx.font = "bold 1.08em 'Luckiest Guy', cursive, Arial";
        ctx.fillStyle = "#2e085b";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 3;
        ctx.fillText(premios[i], (radio - 85), 0);
        ctx.restore();
    }

    // Dibuja los foquitos
    for (let i = 0; i < N_FOQUITOS; i++) {
        const angulo = (2 * Math.PI / N_FOQUITOS) * i;
        const focoX = radio + (radio - 9) * Math.cos(angulo);
        const focoY = radio + (radio - 9) * Math.sin(angulo);

        ctx.beginPath();
        ctx.arc(focoX, focoY, 8, 0, 2 * Math.PI);
        let encendido = ((foquitosEncendidos + i) % 2 === 0);
        ctx.fillStyle = encendido ? "#ffe14d" : "#fff";
        ctx.shadowColor = encendido ? "#ffe14d" : "#fff";
        ctx.shadowBlur = encendido ? 18 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Indicador: Triángulo abajo, apuntando hacia arriba
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radio, canvas.height - 40);           // Punta del triángulo (abajo, centro)
    ctx.lineTo(radio - 24, canvas.height - 20);      // Esquina izquierda arriba
    ctx.lineTo(radio + 24, canvas.height - 20);      // Esquina derecha arriba
    ctx.closePath();
    ctx.fillStyle = "#ffe14d";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
}

// Animación de los foquitos
function animarFoquitos() {
    foquitosAnimInterval = setInterval(() => {
        foquitosEncendidos = (foquitosEncendidos + 1) % 2;
        dibujarRuleta();
    }, 350);
}

// Detiene la animación de foquitos
function detenerFoquitos() {
    clearInterval(foquitosAnimInterval);
}

// Animación y giro de la ruleta con efecto de rebote
function girarRuleta() {
    if (girando) return;
    premioDiv.style.display = "none";
    girando = true;
    girarBtn.disabled = true;
    detenerFoquitos();

    // Elige el premio al azar
    premioIndex = Math.floor(Math.random() * premios.length);
    // Calcula el ángulo final para que el indicador de abajo apunte al premio
    const n = premios.length;
    const anguloPorPremio = 2 * Math.PI / n;
    // El indicador está abajo (270°, 3PI/2), así que ese debe apuntar al premio
    const anguloFinal = (3 * Math.PI / 2) - (premioIndex * anguloPorPremio) - (anguloPorPremio / 2);

    let vueltas = 10;
    let tiempo = 5200; // ms
    let inicio = null;

    function animarRuleta(ts) {
        if (!inicio) inicio = ts;
        let progreso = (ts - inicio) / tiempo;
        if (progreso > 1) progreso = 1;

        // Ease out con rebote al final
        let easeOut = 1 - Math.pow(1 - progreso, 4); // Frenado suave

        if (progreso === 1) {
            // Cuando termina, hace el rebote
            const reboteDuracion = 400; // ms
            const reboteAngulo = (Math.PI / 16); // amplitud del rebote
            let reboteInicio = ts;
            function animarRebote(ts2) {
                let t = (ts2 - reboteInicio) / reboteDuracion;
                if (t > 1) t = 1;
                let offset = reboteAngulo * Math.sin(Math.PI * t);
                anguloActual = anguloFinal + offset;
                dibujarRuleta();
                if (t < 1) {
                    requestAnimationFrame(animarRebote);
                } else {
                    anguloActual = anguloFinal;
                    dibujarRuleta();
                    girando = false;
                    girarBtn.disabled = false;
                    mostrarPremio();
                    animarFoquitos();
                }
            }
            animarRebote(ts);
            return;
        }

        // Giro principal
        let angulo = anguloActual + vueltas * 2 * Math.PI * easeOut + (anguloFinal - anguloActual) * easeOut;
        anguloActual = angulo;
        dibujarRuleta();

        if (progreso < 1) {
            requestAnimationFrame(animarRuleta);
        }
    }
    requestAnimationFrame(animarRuleta);
}

function mostrarPremio() {
    premioDiv.textContent = `¡Ganaste: ${premios[premioIndex]}! 🎉`;
    premioDiv.style.display = "block";
}

girarBtn.addEventListener('click', girarRuleta);

// Inicializa todo
dibujarRuleta();
animarFoquitos();
