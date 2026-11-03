(() => {
  "use strict";
  const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];
  const QUAD = [500, 1000, 2000, 4000];
  const MAX_GAIN = 0.035; // Limite de amplitude digital conservador; não é calibração acústica.
  const $ = (id) => document.getElementById(id);
  const state = { ear: "right", frequency: 1000, level: 40, points: { right: {}, left: {} }, audio: null, oscillator: null, gain: null, isEmitting: false, pointerHeld: false, theme: "system" };

  const frequencySelect = $("frequencySelect");
  const levelRange = $("levelRange");
  const canvas = $("audiogram");
  const ctx = canvas.getContext("2d");
  const audioStatus = $("audioStatus");

  function applyTheme(theme) {
    state.theme = theme;
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    $("themeToggle").setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
  }
  try { state.theme = localStorage.getItem("heimdall-theme") || "system"; } catch {}
  applyTheme(state.theme);
  $("themeToggle").addEventListener("click", () => {
    const darkNow = document.documentElement.dataset.theme === "dark";
    const next = darkNow ? "light" : "dark";
    try { localStorage.setItem("heimdall-theme", next); } catch {}
    applyTheme(next);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { if (state.theme === "system") applyTheme("system"); });

  const dialog = $("startDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  $("acknowledge").addEventListener("change", e => { $("beginButton").disabled = !e.target.checked; });
  $("beginButton").addEventListener("click", () => { if (!$("acknowledge").checked) return; dialog.close?.(); dialog.removeAttribute("open"); });

  $("dismissNotice").addEventListener("click", () => $("dismissNotice").closest(".notice").remove());

  function updateControls() {
    frequencySelect.value = String(state.frequency);
    $("frequencyOutput").textContent = `${state.frequency} Hz`;
    levelRange.value = String(state.level);
    $("levelOutput").textContent = `${state.level} dB`;
    $("levelReadout").innerHTML = `${state.level} <small>dB</small>`;
    document.querySelectorAll("[data-frequency]").forEach(b => b.classList.toggle("active", Number(b.dataset.frequency) === state.frequency));
    $("rightEar").classList.toggle("selected", state.ear === "right");
    $("leftEar").classList.toggle("selected", state.ear === "left");
    $("rightEar").setAttribute("aria-pressed", String(state.ear === "right"));
    $("leftEar").setAttribute("aria-pressed", String(state.ear === "left"));
    drawAudiogram();
  }
  function setFrequency(value) { const n = Number(value); if (!FREQUENCIES.includes(n)) return; state.frequency = n; updateControls(); }
  function setLevel(value) { state.level = Math.max(0, Math.min(90, Math.round(Number(value) / 5) * 5)); updateControls(); }

  frequencySelect.addEventListener("change", e => setFrequency(e.target.value));
  $("frequencyQuick").addEventListener("click", e => { const b = e.target.closest("[data-frequency]"); if (b) setFrequency(b.dataset.frequency); });
  levelRange.addEventListener("input", e => setLevel(e.target.value));
  $("levelDown").addEventListener("click", () => setLevel(state.level - 5));
  $("levelUp").addEventListener("click", () => setLevel(state.level + 5));
  $("rightEar").addEventListener("click", () => { stopTone(); state.ear = "right"; updateControls(); });
  $("leftEar").addEventListener("click", () => { stopTone(); state.ear = "left"; updateControls(); });

  async function ensureAudio() {
    if (!state.audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error("Este navegador não oferece suporte à Web Audio API.");
      state.audio = new AudioCtx();
      state.gain = state.audio.createGain();
      state.gain.gain.value = 0;
      const panner = state.audio.createStereoPanner ? state.audio.createStereoPanner() : null;
      if (panner) {
        panner.pan.value = state.ear === "right" ? 1 : -1;
        state.gain.connect(panner).connect(state.audio.destination);
        state.panner = panner;
      } else {
        state.gain.connect(state.audio.destination);
      }
    }
    if (state.audio.state === "suspended") await state.audio.resume();
    return state.audio;
  }
  function targetAmplitude() {
    // Curva de demonstração: atenuação maior => amplitude digital menor.
    // Não corresponde a dB SPL ou dB HL e não calibra a pressão sonora.
    const relative = Math.pow(10, (state.level - 90) / 40);
    return Math.min(MAX_GAIN, MAX_GAIN * relative);
  }
  async function startTone() {
    if (state.isEmitting) return;
    try {
      const audio = await ensureAudio();
      if (state.panner) state.panner.pan.setTargetAtTime(state.ear === "right" ? 1 : -1, audio.currentTime, .015);
      const osc = audio.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(state.frequency, audio.currentTime);
      const envelope = audio.createGain();
      envelope.gain.setValueAtTime(0, audio.currentTime);
      envelope.gain.linearRampToValueAtTime(1, audio.currentTime + .025);
      osc.connect(envelope).connect(state.gain);
      state.gain.gain.cancelScheduledValues(audio.currentTime);
      state.gain.gain.setTargetAtTime(targetAmplitude(), audio.currentTime, .02);
      osc.start();
      state.oscillator = osc;
      state.envelope = envelope;
      state.isEmitting = true;
      $("emitButton").classList.add("emitting");
      $("emitState").textContent = `Emitindo ${state.frequency} Hz · ${state.ear === "right" ? "direita" : "esquerda"}`;
      audioStatus.textContent = "Áudio ativo";
    } catch (err) {
      $("emitState").textContent = err.message || "Não foi possível iniciar o áudio.";
      audioStatus.textContent = "Áudio indisponível";
    }
  }
  function stopTone() {
    if (!state.isEmitting) return;
    const audio = state.audio;
    const osc = state.oscillator;
    if (audio && state.gain) {
      const now = audio.currentTime;
      state.gain.gain.cancelScheduledValues(now);
      state.gain.gain.setTargetAtTime(0, now, .012);
      if (state.envelope) state.envelope.gain.setTargetAtTime(0, now, .008);
      try { osc?.stop(now + .07); } catch {}
    }
    state.oscillator = null;
    state.envelope = null;
    state.isEmitting = false;
    $("emitButton").classList.remove("emitting");
    $("emitState").textContent = "Pronto para emitir";
  }
  const emitButton = $("emitButton");
  emitButton.addEventListener("pointerdown", e => { if (e.button !== undefined && e.button !== 0) return; e.preventDefault(); state.pointerHeld = true; emitButton.setPointerCapture?.(e.pointerId); startTone(); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => emitButton.addEventListener(type, () => { state.pointerHeld = false; stopTone(); }));
  emitButton.addEventListener("contextmenu", e => e.preventDefault());
  window.addEventListener("blur", stopTone);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopTone(); });

  function markPoint() {
    stopTone();
    state.points[state.ear][state.frequency] = state.level;
    renderResults();
    drawAudiogram();
  }
  $("markButton").addEventListener("click", markPoint);
  $("removeMark").addEventListener("click", () => {
    const keys = Object.keys(state.points[state.ear]).map(Number).sort((a,b) => FREQUENCIES.indexOf(a)-FREQUENCIES.indexOf(b));
    if (!keys.length) return;
    delete state.points[state.ear][keys[keys.length - 1]];
    renderResults(); drawAudiogram();
  });

  function average(ear) {
    const vals = QUAD.map(f => state.points[ear][f]).filter(v => Number.isFinite(v));
    return vals.length === QUAD.length ? vals.reduce((a,b) => a+b, 0) / QUAD.length : null;
  }
  function renderResults() {
    let count = 0;
    ["right", "left"].forEach(ear => FREQUENCIES.forEach(f => {
      const value = state.points[ear][f];
      if (Number.isFinite(value)) count++;
      $( `${ear}-${f}` ).textContent = Number.isFinite(value) ? `${value} dB` : "—";
    }));
    const fmt = v => v === null ? "—" : `${Number(v.toFixed(1))} dB`;
    $("rightAverage").textContent = fmt(average("right"));
    $("leftAverage").textContent = fmt(average("left"));
    $("recordCount").textContent = `${count}/12`;
    $("progressStatus").textContent = `${count} de 12 pontos`;
  }

  function drawAudiogram() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    const pad = { left: 43, right: 18, top: 18, bottom: 38 };
    const gw = w-pad.left-pad.right, gh = h-pad.top-pad.bottom;
    const css = getComputedStyle(document.documentElement);
    const grid = css.getPropertyValue("--line").trim();
    const muted = css.getPropertyValue("--muted").trim();
    const textColor = css.getPropertyValue("--text").trim();
    const x = i => pad.left + (gw/(FREQUENCIES.length-1))*i;
    const y = v => pad.top + (v/90)*gh;
    ctx.clearRect(0,0,w,h);
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    for (let db=0; db<=90; db+=10) {
      const yy=y(db); ctx.beginPath(); ctx.strokeStyle=grid; ctx.lineWidth=1; ctx.setLineDash([]);
      ctx.moveTo(pad.left,yy); ctx.lineTo(w-pad.right,yy); ctx.stroke();
      ctx.fillStyle=muted; ctx.fillText(String(db),pad.left-9,yy+3);
    }
    FREQUENCIES.forEach((f,i) => {
      const xx=x(i); ctx.beginPath(); ctx.strokeStyle=grid; ctx.setLineDash([2,4]); ctx.moveTo(xx,pad.top); ctx.lineTo(xx,h-pad.bottom); ctx.stroke();
      ctx.fillStyle=muted; ctx.textAlign="center"; ctx.fillText(f>=1000?`${f/1000}k`:String(f),xx,h-13);
    });
    ctx.fillStyle=muted; ctx.textAlign="left"; ctx.fillText("dB*",5,11);
    const drawEar = (ear,color,symbol,dash) => {
      const pts=FREQUENCIES.map((f,i)=>({x:x(i),y:y(state.points[ear][f]),valid:Number.isFinite(state.points[ear][f])})).filter(p=>p.valid);
      if (pts.length>1) { ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.setLineDash(dash); pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.stroke(); }
      ctx.setLineDash([]);
      pts.forEach(p=>{ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.font="bold 16px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(symbol,p.x,p.y);});
    };
    drawEar("right",css.getPropertyValue("--red").trim(),"O",[]);
    drawEar("left",css.getPropertyValue("--blue").trim(),"X",[6,4]);
    const idx=FREQUENCIES.indexOf(state.frequency);
    ctx.beginPath();ctx.strokeStyle=css.getPropertyValue("--accent").trim();ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.moveTo(x(idx),pad.top);ctx.lineTo(x(idx),h-pad.bottom);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=textColor;ctx.font="9px system-ui";ctx.textAlign="center";ctx.fillText("Seleção",x(idx),pad.top-5);
  }
  window.addEventListener("resize", drawAudiogram);
  if ("ResizeObserver" in window) new ResizeObserver(drawAudiogram).observe(canvas);

  function csvCell(value) { return `"${String(value).replaceAll('"','""')}"`; }
  $("exportCsv").addEventListener("click", () => {
    const rows = [["Orelha","Frequência (Hz)","Atenuação simulada (dB)"]];
    ["right","left"].forEach(ear => FREQUENCIES.forEach(f => rows.push([ear === "right" ? "Direita" : "Esquerda",f,state.points[ear][f] ?? ""])));
    rows.push([],["Média quadritonal simulada (500, 1000, 2000, 4000 Hz)"],["Direita",average("right") ?? ""],["Esquerda",average("left") ?? ""],[],["Aviso","Valores relativos não calibrados; não representam dB HL clínicos."]);
    const blob = new Blob(["\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="heimdall-registro-audiometria.csv";a.click();URL.revokeObjectURL(url);
  });
  $("clearResults").addEventListener("click", () => {
    if (!confirm("Apagar todos os pontos registrados?")) return;
    state.points={right:{},left:{}};renderResults();drawAudiogram();
  });
  $("newTest").addEventListener("click", () => {
    if (!confirm("Iniciar um novo teste e apagar os registros atuais?")) return;
    stopTone();state.points={right:{},left:{}};state.ear="right";state.frequency=1000;state.level=40;renderResults();updateControls();
  });

  window.addEventListener("keydown", e => {
    const tag = e.target?.tagName;
    if (["INPUT","SELECT","TEXTAREA","BUTTON"].includes(tag) && e.code !== "Space") return;
    if (e.code === "Space") { e.preventDefault(); if (!e.repeat) startTone(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setLevel(state.level+5); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setLevel(state.level-5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setFrequency(FREQUENCIES[Math.max(0,FREQUENCIES.indexOf(state.frequency)-1)]); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setFrequency(FREQUENCIES[Math.min(FREQUENCIES.length-1,FREQUENCIES.indexOf(state.frequency)+1)]); }
    else if (e.key.toLowerCase() === "r") { stopTone();state.ear="right";updateControls(); }
    else if (e.key.toLowerCase() === "l") { stopTone();state.ear="left";updateControls(); }
    else if (e.key.toLowerCase() === "m") markPoint();
  });
  window.addEventListener("keyup", e => { if (e.code === "Space") stopTone(); });
  window.addEventListener("pagehide", stopTone);

  renderResults();updateControls();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").then(() => {
      $("connectionStatus").innerHTML = "<i></i> Offline pronto";
    }).catch(() => { $("connectionStatus").textContent = "Modo online"; }));
  } else {
    $("connectionStatus").textContent = "Use HTTPS para instalar";
  }
})();
