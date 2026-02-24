const state = {
  data: null,
  activeTab: "historia"
};

const heroEl = document.getElementById("hero");
const tabsEl = document.getElementById("tabs");
const panelEl = document.getElementById("panel");

const TAB_LABELS = {
  historia: "Mi Historia",
  logros: "Logros",
  certificados: "Certificados",
  herramientas: "Herramientas"
};

async function loadData() {
  const response = await fetch("data.json", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo cargar data.json");
  return response.json();
}

function renderHero(data) {
  heroEl.innerHTML = `
    <img class="avatar" src="${data.perfil.foto}" alt="Foto de ${data.perfil.nombre}">
    <div>
      <h1>${data.perfil.nombre}</h1>
      <p class="subtitle">${data.perfil.carrera}</p>
      <p>${data.perfil.resumen}</p>
      <div class="badges">
        ${data.perfil.estudios.map((item) => `<span class="badge">${item}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderTabs() {
  const keys = Object.keys(TAB_LABELS);
  tabsEl.innerHTML = keys
    .map(
      (key) => `
      <button class="tab-btn ${state.activeTab === key ? "active" : ""}" data-tab="${key}" aria-pressed="${state.activeTab === key}">
        ${TAB_LABELS[key]}
      </button>`
    )
    .join("");
}

function renderHistoria() {
  const items = state.data.historia
    .map(
      (step) => `
      <article class="card">
        <small>${step.periodo}</small>
        <h3>${step.titulo}</h3>
        <p>${step.detalle}</p>
      </article>
    `
    )
    .join("");

  panelEl.innerHTML = `
    <h2>Mi Historia</h2>
    <p>${state.data.secciones.historiaIntro}</p>
    <div class="timeline">${items}</div>
  `;
}

function renderLogros() {
  const items = state.data.logros
    .map(
      (item) => `
      <article class="card">
        <h3>${item.titulo}</h3>
        <p>${item.detalle}</p>
      </article>
    `
    )
    .join("");

  panelEl.innerHTML = `
    <h2>Logros</h2>
    <p>${state.data.secciones.logrosIntro}</p>
    <div class="achievements">${items}</div>
  `;
}

function renderCertificados() {
  const items = state.data.certificados
    .map(
      (cert) => `
      <article class="card">
        <h3>${cert.titulo}</h3>
        <small>${cert.fecha}</small>
        <p>${cert.detalle}</p>
        <a class="file-link" href="${encodeURI(cert.archivo)}" target="_blank" rel="noopener noreferrer">Ver archivo</a>
      </article>
    `
    )
    .join("");

  panelEl.innerHTML = `
    <h2>Certificados</h2>
    <p>${state.data.secciones.certificadosIntro}</p>
    <div class="certificates">${items}</div>
  `;
}

function renderHerramientas() {
  const tools = state.data.herramientas.map((tool) => `<span class="tool-chip">${tool}</span>`).join("");
  panelEl.innerHTML = `
    <h2>Herramientas que he usado</h2>
    <p>${state.data.secciones.herramientasIntro}</p>
    <div class="tools">
      <div class="tool-grid">${tools}</div>
    </div>
  `;
}

function renderPanel() {
  const renderByTab = {
    historia: renderHistoria,
    logros: renderLogros,
    certificados: renderCertificados,
    herramientas: renderHerramientas
  };

  renderByTab[state.activeTab]();
}

function setTab(tab) {
  state.activeTab = tab;
  window.history.replaceState(null, "", `#${tab}`);
  renderTabs();
  renderPanel();
}

function initEvents() {
  tabsEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-tab]");
    if (!btn) return;
    setTab(btn.dataset.tab);
  });
}

function resolveInitialTab() {
  const hash = window.location.hash.replace("#", "").trim();
  if (TAB_LABELS[hash]) state.activeTab = hash;
}

async function init() {
  try {
    state.data = await loadData();
    resolveInitialTab();
    renderHero(state.data);
    renderTabs();
    renderPanel();
    initEvents();
  } catch (error) {
    panelEl.innerHTML = `<p>No se pudo cargar el portafolio. Verifica que <strong>data.json</strong> exista y tenga formato válido.</p>`;
    console.error(error);
  }
}

init();
