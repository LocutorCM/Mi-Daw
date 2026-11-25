let ctx, stream, source, monitorGain, eqFilters = [], comp;
const freqs = [60, 120, 250, 500, 1000, 2000, 4000, 8000];
const eqEl = document.getElementById('eq');

freqs.forEach((f,i)=>{
  const d=document.createElement('div');
  d.innerHTML=`<label>${f} Hz <input type="range" min="-12" max="12" value="0" data-i="${i}"> <span>0dB</span></label><br>`;
  eqEl.appendChild(d);
});

async function init(){
  ctx = new (window.AudioContext||window.webkitAudioContext)();
  stream = await navigator.mediaDevices.getUserMedia({audio:true});
  source = ctx.createMediaStreamSource(stream);

  // EQ 8 bandas
  let last = source;
  freqs.forEach(f=>{
    const filter = ctx.createBiquadFilter();
    filter.type='peaking'; filter.frequency.value=f; filter.Q.value=1; filter.gain.value=0;
    last.connect(filter); last=filter; eqFilters.push(filter);
  });

  // Compresor
  comp = ctx.createDynamicsCompressor();
  comp.threshold.value=-20; comp.ratio.value=4; comp.attack.value=0.01; comp.release.value=0.2;
  last.connect(comp);

  monitorGain = ctx.createGain(); monitorGain.gain.value=0;
  comp.connect(monitorGain); monitorGain.connect(ctx.destination);
}

document.querySelectorAll('#eq input').forEach(inp=>{
  inp.oninput = e=>{
    const i = e.target.dataset.i;
    if(eqFilters[i]) eqFilters[i].gain.value = e.target.value;
    e.target.nextElementSibling.textContent = e.target.value+'dB';
  };
});

function bind(id, valId, fn, suffix=''){
  document.getElementById(id).oninput = e=>{
    document.getElementById(valId).textContent = e.target.value+suffix;
    if(comp) fn(parseFloat(e.target.value));
  };
}
bind('th','thVal', v=>comp.threshold.value=v);
bind('ratio','ratioVal', v=>comp.ratio.value=v);
bind('att','attVal', v=>comp.attack.value=v/1000, 'ms');
bind('rel','relVal', v=>comp.release.value=v/1000, 'ms');

document.getElementById('monitor').onclick = async (e)=>{
  if(!ctx) await init(); await ctx.resume();
  const on = e.target.classList.toggle('on');
  monitorGain.gain.value = on ? 1 : 0;
};
document.getElementById('rec').onclick = ()=>alert('Rec listo - con el botón I te escuchas con EQ y Compresor');
document.getElementById('play').onclick = ()=>alert('Play listo');
