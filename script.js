
let config = {};
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");
let spinning = false;
let angle = 0;

async function loadConfig() {
  const res = await fetch('config.json?_=' + Date.now());
  config = await res.json();
  document.getElementById("title").textContent = config.title;
  drawWheel();
}
function drawWheel() {
  const radius = canvas.width/2;
  const num = config.options.length;
  const arc = (2*Math.PI)/num;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<num;i++){
    const opt = config.options[i];
    const start = i*arc + angle;
    ctx.beginPath();
    ctx.moveTo(radius,radius);
    ctx.arc(radius,radius,radius,start,start+arc);
    ctx.fillStyle = opt.color;
    ctx.fill();
    // Text
    ctx.save();
    ctx.translate(radius,radius);
    ctx.rotate(start+arc/2);
    ctx.textAlign="right";
    ctx.fillStyle="#000";
    ctx.font="bold 18px Arial";
    ctx.fillText(opt.text,radius-10,10);
    ctx.restore();
    // Image
    if(opt.image){
      const img = new Image();
      img.src = opt.image;
      img.onload = ()=>{
        ctx.save();
        ctx.translate(radius,radius);
        ctx.rotate(start+arc/2);
        ctx.drawImage(img,radius-60,-20,40,40);
        ctx.restore();
      }
    }
  }
}
function spinWheel() {
  if(spinning) return;
  spinning = true;
  const spins = Math.floor(Math.random()*5+5);
  const extra = Math.random()*2*Math.PI;
  const total = spins*2*Math.PI + extra;
  const duration = 4000;
  const startTime = performance.now();
  function animate(now){
    const elapsed = now - startTime;
    if(elapsed>=duration){
      angle += total;
      angle %= 2*Math.PI;
      const num = config.options.length;
      const arc = (2*Math.PI)/num;
      const index = Math.floor(num - ((angle%(2*Math.PI)) / arc)) % num;
      result.textContent = "Ganador: "+config.options[index].text;
      spinning=false;
      return;
    }
    const progress = elapsed/duration;
    const eased = 1 - Math.pow(1-progress,3);
    const current = eased * total;
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(current);
    ctx.translate(-canvas.width/2,-canvas.height/2);
    drawWheel();
    ctx.restore();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
spinBtn.addEventListener("click",spinWheel);
loadConfig();
