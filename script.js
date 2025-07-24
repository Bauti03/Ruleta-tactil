
const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
const center = { x: canvas.width/2, y: canvas.height/2 };

let segmentos = [
  { texto: 'Jugador 1', color: '#ff6f69' },
  { texto: 'Jugador 2', color: '#88d8b0' }
];

let anguloActual = 0;
let girando = false;

function dibujarRuleta() {
  const anguloPorSegmento = (2 * Math.PI) / segmentos.length;
  for (let i = 0; i < segmentos.length; i++) {
    const inicio = anguloActual + i * anguloPorSegmento;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, 200, inicio, inicio + anguloPorSegmento);
    ctx.fillStyle = segmentos[i].color;
    ctx.fill();
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(inicio + anguloPorSegmento / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Comic Sans MS";
    ctx.fillText(segmentos[i].texto, 180, 10);
    ctx.restore();
  }
}

function girarRuleta() {
  if (girando) return;
  girando = true;
  let velocidad = Math.random() * 0.2 + 0.25;
  const desaceleracion = 0.002;
  function animar() {
    if (velocidad <= 0) {
      girando = false;
      const anguloPorSegmento = (2 * Math.PI) / segmentos.length;
      const indiceGanador = Math.floor(((2 * Math.PI) - (anguloActual % (2 * Math.PI))) / anguloPorSegmento) % segmentos.length;
      document.getElementById("resultado").innerText = "Ganador: " + segmentos[indiceGanador].texto;
      return;
    }
    velocidad -= desaceleracion;
    anguloActual += velocidad;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarRuleta();
    requestAnimationFrame(animar);
  }
  animar();
}

dibujarRuleta();
document.getElementById('girar').addEventListener('click', girarRuleta);
