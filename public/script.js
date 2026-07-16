/* =====================================================================
   CineList — script.js
   ---------------------------------------------------------------------
   Para plugar na sua API, você só deveria precisar mexer no bloco
   CONFIG abaixo (e, se o formato do JSON mudar, nas funções da seção
   "NORMALIZAÇÃO", que é onde toda a leitura do shape da resposta
   está concentrada).
   ===================================================================== */

/* =====================================================================
   1. CONFIG — troque só isto se a URL da API mudar
   ===================================================================== */
const CONFIG = {
  API_BASE_URL: "http://localhost:8080/v1/senai/locadora",
  ENDPOINTS: {
    filme: "/filme", 
    genero: "/genero",
    classificacao: "/classificacao",
    ator: "/ator",
  },
};

/* =====================================================================
   2. ESTADO
   ===================================================================== */
const state = {
  filmes: [],       // filmes já normalizados (o que a grid renderiza)
  generos: [],       // [{id, genero}]
  classificacoes: [], // [{id, classificacao}]
  atores: [],         // [{id, nome, data_nacimento}]
  filtro: { texto: "", generoId: "" },
  filmeEmEdicaoId: null, // null = criando; number = editando
  filmeParaExcluir: null,
};

/* =====================================================================
   3. REFERÊNCIAS DE DOM
   ===================================================================== */
const dom = {
  grid: document.getElementById("grid"),
  emptyState: document.getElementById("emptyState"),
  loadingState: document.getElementById("loadingState"),
  apiStatus: document.getElementById("apiStatus"),

  searchInput: document.getElementById("searchInput"),
  filterGenero: document.getElementById("filterGenero"),
  btnNovoFilme: document.getElementById("btnNovoFilme"),

  modalForm: document.getElementById("modalForm"),
  formTitle: document.getElementById("formTitle"),
  filmeForm: document.getElementById("filmeForm"),
  formError: document.getElementById("formError"),
  btnSalvar: document.getElementById("btnSalvar"),

  fNome: document.getElementById("fNome"),
  fSinopse: document.getElementById("fSinopse"),
  fCapa: document.getElementById("fCapa"),
  fDataLancamento: document.getElementById("fDataLancamento"),
  fDuracao: document.getElementById("fDuracao"),
  fValor: document.getElementById("fValor"),
  fAvaliacao: document.getElementById("fAvaliacao"),
  fClassificacao: document.getElementById("fClassificacao"),
  fGeneroList: document.getElementById("fGeneroList"),
  fAtorList: document.getElementById("fAtorList"),

  modalDetail: document.getElementById("modalDetail"),
  detailContent: document.getElementById("detailContent"),

  modalConfirm: document.getElementById("modalConfirm"),
  confirmNome: document.getElementById("confirmNome"),
  btnConfirmDelete: document.getElementById("btnConfirmDelete"),

  toast: document.getElementById("toast"),
};

/* =====================================================================
   4. CLIENTE HTTP — wrapper fino sobre fetch
   ===================================================================== */
async function apiRequest(path, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // a API sempre devolve JSON (mesmo em erro), então tentamos parsear
  // mesmo quando response.ok é falso, pra conseguir mostrar a
  // mensagem de erro real que ela retorna.
  let body = null;
  try {
    body = await response.json();
  } catch (e) {
    body = null;
  }

  if (!body) {
    throw new Error(`Sem resposta da API em ${url}. Ela está no ar?`);
  }

  if (body.status === false) {
    const campo = body.field ? ` (${body.field})` : "";
    throw new Error((body.message || "Erro não especificado pela API.") + campo);
  }

  return body;
}

const api = {
  listarFilmes: () => apiRequest(CONFIG.ENDPOINTS.filme),
  buscarFilme: (id) => apiRequest(`${CONFIG.ENDPOINTS.filme}/${id}`),
  criarFilme: (payload) =>
    apiRequest(CONFIG.ENDPOINTS.filme, { method: "POST", body: JSON.stringify(payload) }),
  atualizarFilme: (id, payload) =>
    apiRequest(`${CONFIG.ENDPOINTS.filme}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  excluirFilme: (id) => apiRequest(`${CONFIG.ENDPOINTS.filme}/${id}`, { method: "DELETE" }),

  listarGeneros: () => apiRequest(CONFIG.ENDPOINTS.genero),
  listarClassificacoes: () => apiRequest(CONFIG.ENDPOINTS.classificacao),
  listarAtores: () => apiRequest(CONFIG.ENDPOINTS.ator),
};

/* =====================================================================
   5. NORMALIZAÇÃO
   ---------------------------------------------------------------------
   Toda a leitura do "formato" das respostas da API mora aqui.
   Se você mudar algo no back (ex: corrigir a chave "response.filme"
   reaproveitada em /genero, /ator e /classificacao), é só ajustar
   dentro destas funções — o resto do app não precisa mudar.
   ===================================================================== */

// Hoje TODOS os endpoints de listagem (filme, genero, classificacao,
// ator) devolvem o array dentro de "response.filme" — sim, até
// /genero e /ator usam essa chave, por causa de um copy-paste no
// back (veja controller_genero.js / controller_ator.js). Centralizamos
// essa leitura aqui com alguns fallbacks, pra facilitar quando isso
// for corrigido.
function extrairLista(body) {
  const r = body?.response;
  if (!r) return [];
  return r.filme || r.genero || r.ator || r.classificacao || [];
}

function normalizarGenero(raw) {
  return { id: raw.id, nome: raw.genero };
}

function normalizarClassificacao(raw) {
  return { id: raw.id, nome: raw.classificacao };
}

function normalizarAtor(raw) {
  return { id: raw.id, nome: raw.nome, dataNascimento: raw.data_nacimento };
}

// O filme, como vem da API (GET /filme e GET /filme/:id), já chega
// enriquecido com classificacao (string), genero (array) e ator
// (array). Só que o id_classificacao é removido nesse processo, então
// para reabrir o formulário de edição a gente casa o nome da
// classificação com a lista carregada em state.classificacoes.
function normalizarFilme(raw) {
  const classificacaoEncontrada = state.classificacoes.find(
    (c) => c.nome === raw.classificacao
  );

  return {
    id: raw.id,
    nome: raw.nome,
    sinopse: raw.sinopse,
    capa: raw.capa,
    dataLancamento: raw.data_lancamento ? String(raw.data_lancamento).slice(0, 10) : "",
    duracao: raw.duracao || "",
    valor: raw.valor != null ? Number(raw.valor) : null,
    avaliacao: raw.avaliacao != null ? Number(raw.avaliacao) : null,
    classificacaoNome: raw.classificacao || "—",
    classificacaoId: classificacaoEncontrada ? classificacaoEncontrada.id : "",
    generos: Array.isArray(raw.genero)
      ? raw.genero.map((g) => ({ id: g.id, nome: g.genero }))
      : [],
    atores: Array.isArray(raw.ator)
      ? raw.ator.map((a) => ({ id: a.id, nome: a.nome }))
      : [],
  };
}

/* =====================================================================
   6. CARREGAMENTO DE DADOS
   ===================================================================== */
async function carregarListasDeApoio() {
  const [generoBody, classificacaoBody, atorBody] = await Promise.all([
    api.listarGeneros().catch(() => null),
    api.listarClassificacoes().catch(() => null),
    api.listarAtores().catch(() => null),
  ]);

  state.generos = generoBody ? extrairLista(generoBody).map(normalizarGenero) : [];
  state.classificacoes = classificacaoBody
    ? extrairLista(classificacaoBody).map(normalizarClassificacao)
    : [];
  state.atores = atorBody ? extrairLista(atorBody).map(normalizarAtor) : [];
}

async function carregarFilmes() {
  const body = await api.listarFilmes();
  // classificacoes precisa estar carregado ANTES de normalizar os
  // filmes, por causa do "casamento" de nome -> id explicado acima.
  state.filmes = extrairLista(body).map(normalizarFilme);
}

async function inicializar() {
  setLoading(true);
  setApiError(null);
  try {
    await carregarListasDeApoio();
    await carregarFilmes();
    popularFiltroGenero();
    renderizarGrid();
  } catch (erro) {
    setApiError(erro.message);
  } finally {
    setLoading(false);
  }
}

/* =====================================================================
   7. RENDER — GRID / CARDS
   ===================================================================== */
function filmesFiltrados() {
  const texto = state.filtro.texto.trim().toLowerCase();
  const generoId = state.filtro.generoId;

  return state.filmes.filter((filme) => {
    const bateTexto = !texto || filme.nome.toLowerCase().includes(texto);
    const bateGenero =
      !generoId || filme.generos.some((g) => String(g.id) === String(generoId));
    return bateTexto && bateGenero;
  });
}

function renderizarGrid() {
  const lista = filmesFiltrados();

  dom.grid.innerHTML = "";
  dom.emptyState.hidden = lista.length > 0;

  const frag = document.createDocumentFragment();
  lista.forEach((filme) => frag.appendChild(criarCard(filme)));
  dom.grid.appendChild(frag);
}

function criarCard(filme) {
  const card = document.createElement("article");
  card.className = "card";

  const duracaoFormatada = filme.duracao ? filme.duracao.slice(0, 5) : "—";
  const valorFormatado =
    filme.valor != null
      ? filme.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "—";

  const nomesAtores = filme.atores.map((a) => a.nome).join(", ");
  const nomesGeneros = filme.generos.map((g) => g.nome);

  card.innerHTML = `
    <div class="card__poster-wrap">
      ${
        filme.capa
          ? `<img class="card__poster" src="${escapeAttr(filme.capa)}" alt="Capa de ${escapeAttr(
              filme.nome
            )}" loading="lazy">`
          : posterFallbackHTML()
      }
      <span class="card__badge">${escapeHTML(filme.classificacaoNome)}</span>
    </div>
    <div class="card__perforation"></div>
    <div class="card__body">
      <h3 class="card__title">${escapeHTML(filme.nome)}</h3>
      <div class="card__meta">
        <span>⏱ ${duracaoFormatada}</span>
        <span>💰 ${valorFormatado}</span>
        <span>⭐ ${filme.avaliacao != null ? filme.avaliacao : "—"}</span>
      </div>
      ${
        nomesGeneros.length
          ? `<div class="card__meta">${nomesGeneros
              .map((g) => `<span>${escapeHTML(g)}</span>`)
              .join("")}</div>`
          : ""
      }
      <p class="card__synopsis">${escapeHTML(filme.sinopse || "Sem sinopse cadastrada.")}</p>
      ${
        nomesAtores
          ? `<p class="card__actors"><strong>Elenco:</strong> ${escapeHTML(nomesAtores)}</p>`
          : ""
      }
      <div class="card__actions">
        <button class="btn btn--ghost" data-action="detalhe" data-id="${filme.id}">Detalhes</button>
        <button class="btn btn--ghost btn--icon" data-action="editar" data-id="${filme.id}" title="Editar">✎</button>
        <button class="btn btn--danger btn--icon" data-action="excluir" data-id="${filme.id}" title="Excluir">🗑</button>
      </div>
    </div>
  `;

  return card;
}

function posterFallbackHTML() {
  return `<div class="card__poster-fallback">🎬<span>Sem imagem de capa</span></div>`;
}

dom.grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const acao = btn.dataset.action;

  if (acao === "detalhe") abrirDetalhe(id);
  if (acao === "editar") abrirFormulario(id);
  if (acao === "excluir") abrirConfirmacaoExclusao(id);
});

function popularFiltroGenero() {
  dom.filterGenero.innerHTML = `<option value="">Todos</option>`;
  state.generos.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.nome;
    dom.filterGenero.appendChild(opt);
  });
}

dom.searchInput.addEventListener("input", (e) => {
  state.filtro.texto = e.target.value;
  renderizarGrid();
});

dom.filterGenero.addEventListener("change", (e) => {
  state.filtro.generoId = e.target.value;
  renderizarGrid();
});

/* =====================================================================
   8. DETALHE (usa o GET /filme/:id, pra realmente exercitar o endpoint)
   ===================================================================== */
async function abrirDetalhe(id) {
  try {
    const body = await api.buscarFilme(id);
    const lista = extrairLista(body).map(normalizarFilme);
    const filme = lista[0];
    if (!filme) throw new Error("Filme não encontrado.");

    dom.detailContent.innerHTML = `
      ${
        filme.capa
          ? `<img src="${escapeAttr(filme.capa)}" alt="Capa de ${escapeAttr(filme.nome)}">`
          : `<div class="card__poster-fallback" style="border-radius:10px;">🎬<span>Sem imagem</span></div>`
      }
      <div>
        <h2>${escapeHTML(filme.nome)}</h2>
        <div class="detail-meta">
          <span>${escapeHTML(filme.classificacaoNome)}</span>
          <span>⏱ ${filme.duracao ? filme.duracao.slice(0, 5) : "—"}</span>
          <span>📅 ${formatarDataBR(filme.dataLancamento)}</span>
          <span>⭐ ${filme.avaliacao != null ? filme.avaliacao : "—"}</span>
          <span>💰 ${
            filme.valor != null
              ? filme.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : "—"
          }</span>
        </div>
        <div class="detail-meta">
          ${filme.generos.map((g) => `<span>${escapeHTML(g.nome)}</span>`).join("")}
        </div>
        <p class="synopsis">${escapeHTML(filme.sinopse || "Sem sinopse cadastrada.")}</p>
        ${
          filme.atores.length
            ? `<p class="detail-actors"><strong>Elenco:</strong> ${escapeHTML(
                filme.atores.map((a) => a.nome).join(", ")
              )}</p>`
            : ""
        }
      </div>
    `;
    abrirModal(dom.modalDetail);
  } catch (erro) {
    mostrarToast(erro.message, "error");
  }
}

/* =====================================================================
   9. FORMULÁRIO — criar / editar
   ===================================================================== */
dom.btnNovoFilme.addEventListener("click", () => abrirFormulario(null));

function abrirFormulario(id) {
  dom.filmeForm.reset();
  dom.formError.hidden = true;
  state.filmeEmEdicaoId = id;

  popularSelectClassificacao();
  popularChips(dom.fGeneroList, state.generos, "genero");
  popularChips(dom.fAtorList, state.atores, "ator");

  if (id == null) {
    dom.formTitle.textContent = "Novo filme";
    dom.btnSalvar.textContent = "Salvar filme";
  } else {
    const filme = state.filmes.find((f) => f.id === id);
    if (!filme) {
      mostrarToast("Não achei esse filme na lista carregada.", "error");
      return;
    }

    dom.formTitle.textContent = `Editar — ${filme.nome}`;
    dom.btnSalvar.textContent = "Salvar alterações";

    dom.fNome.value = filme.nome;
    dom.fSinopse.value = filme.sinopse;
    dom.fCapa.value = filme.capa;
    dom.fDataLancamento.value = filme.dataLancamento;
    dom.fDuracao.value = filme.duracao ? filme.duracao.slice(0, 5) : "";
    dom.fValor.value = filme.valor ?? "";
    dom.fAvaliacao.value = filme.avaliacao ?? "";
    dom.fClassificacao.value = filme.classificacaoId || "";

    marcarChipsSelecionados(dom.fGeneroList, filme.generos.map((g) => g.id));
    marcarChipsSelecionados(dom.fAtorList, filme.atores.map((a) => a.id));

    if (!filme.classificacaoId) {
      mostrarToast(
        "Não encontrei a classificação original desse filme na lista — selecione novamente.",
        "error"
      );
    }
  }

  abrirModal(dom.modalForm);
}

function popularSelectClassificacao() {
  dom.fClassificacao.innerHTML = `<option value="">Selecione...</option>`;
  state.classificacoes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nome;
    dom.fClassificacao.appendChild(opt);
  });
}

function popularChips(container, itens, prefixo) {
  if (!itens.length) {
    container.innerHTML = `<p class="chip-list__empty">Nenhum ${prefixo} cadastrado ainda na API.</p>`;
    return;
  }

  container.innerHTML = itens
    .map(
      (item) => `
      <span class="chip">
        <input type="checkbox" id="${prefixo}-${item.id}" value="${item.id}">
        <label for="${prefixo}-${item.id}">${escapeHTML(item.nome)}</label>
      </span>
    `
    )
    .join("");
}

function marcarChipsSelecionados(container, idsSelecionados) {
  const idsComoString = idsSelecionados.map(String);
  container.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = idsComoString.includes(input.value);
  });
}

function idsMarcados(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((el) =>
    Number(el.value)
  );
}

dom.filmeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  dom.formError.hidden = true;

  const generoIds = idsMarcados(dom.fGeneroList);
  if (generoIds.length === 0) {
    mostrarErroFormulario("Selecione ao menos um gênero.");
    return;
  }

  const payload = {
    nome: dom.fNome.value.trim(),
    sinopse: dom.fSinopse.value.trim(),
    capa: dom.fCapa.value.trim(),
    data_lancamento: dom.fDataLancamento.value,
    duracao: dom.fDuracao.value ? `${dom.fDuracao.value}:00` : "",
    valor: Number(dom.fValor.value),
    avaliacao: Number(dom.fAvaliacao.value),
    id_classificacao: Number(dom.fClassificacao.value),
    // a API quebra (500) se "genero"/"ator" vierem undefined no
    // corpo da requisição — por isso sempre mandamos arrays, mesmo
    // que "ator" esteja vazio.
    genero: generoIds.map((id) => ({ id })),
    ator: idsMarcados(dom.fAtorList).map((id) => ({ id })),
  };

  dom.btnSalvar.disabled = true;
  dom.btnSalvar.textContent = "Salvando...";

  try {
    if (state.filmeEmEdicaoId == null) {
      await api.criarFilme(payload);
      mostrarToast("Filme cadastrado com sucesso!", "success");
    } else {
      await api.atualizarFilme(state.filmeEmEdicaoId, payload);
      mostrarToast("Filme atualizado com sucesso!", "success");
    }

    fecharModais();
    await carregarFilmes();
    popularFiltroGenero();
    renderizarGrid();
  } catch (erro) {
    mostrarErroFormulario(erro.message);
  } finally {
    dom.btnSalvar.disabled = false;
    dom.btnSalvar.textContent =
      state.filmeEmEdicaoId == null ? "Salvar filme" : "Salvar alterações";
  }
});

function mostrarErroFormulario(msg) {
  dom.formError.textContent = msg;
  dom.formError.hidden = false;
}

/* =====================================================================
   10. EXCLUSÃO
   ===================================================================== */
function abrirConfirmacaoExclusao(id) {
  const filme = state.filmes.find((f) => f.id === id);
  if (!filme) return;

  state.filmeParaExcluir = filme;
  dom.confirmNome.textContent = filme.nome;
  abrirModal(dom.modalConfirm);
}

dom.btnConfirmDelete.addEventListener("click", async () => {
  if (!state.filmeParaExcluir) return;
  const filme = state.filmeParaExcluir;

  dom.btnConfirmDelete.disabled = true;
  try {
    await api.excluirFilme(filme.id);
    mostrarToast("Filme excluído.", "success");
    fecharModais();
    await carregarFilmes();
    popularFiltroGenero();
    renderizarGrid();
  } catch (erro) {
    // Esse endpoint costuma falhar quando o filme tem gênero/ator
    // vinculado, por causa da constraint de chave estrangeira no
    // banco (veja a análise que te passei antes de gerar o front).
    mostrarToast(erro.message, "error");
    fecharModais();
  } finally {
    dom.btnConfirmDelete.disabled = false;
    state.filmeParaExcluir = null;
  }
});

/* =====================================================================
   11. MODAIS — abrir/fechar genérico
   ===================================================================== */
function abrirModal(modalEl) {
  modalEl.hidden = false;
  document.body.style.overflow = "hidden";
}

function fecharModais() {
  [dom.modalForm, dom.modalDetail, dom.modalConfirm].forEach((m) => (m.hidden = true));
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", fecharModais);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModais();
});

/* =====================================================================
   12. TOAST / STATUS DE API / LOADING
   ===================================================================== */
let toastTimeout = null;
function mostrarToast(mensagem, tipo = "success") {
  clearTimeout(toastTimeout);
  dom.toast.textContent = "";

  const dot = document.createElement("span");
  dot.className = "toast__dot";
  const texto = document.createElement("span");
  texto.textContent = mensagem;

  dom.toast.className = `toast toast--${tipo}`;
  dom.toast.appendChild(dot);
  dom.toast.appendChild(texto);
  dom.toast.hidden = false;

  toastTimeout = setTimeout(() => {
    dom.toast.hidden = true;
  }, 4000);
}

function setLoading(isLoading) {
  dom.loadingState.hidden = !isLoading;
  if (isLoading) {
    dom.grid.innerHTML = "";
    dom.emptyState.hidden = true;
  }
}

function setApiError(mensagem) {
  if (!mensagem) {
    dom.apiStatus.hidden = true;
    return;
  }
  dom.apiStatus.hidden = false;
  dom.apiStatus.textContent = `⚠ Não consegui falar com a API: ${mensagem}. Confira se ela está rodando e se CONFIG.API_BASE_URL está correta no topo do script.js.`;
}

/* =====================================================================
   13. HELPERS
   ===================================================================== */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return escapeHTML(str).replace(/"/g, "&quot;");
}

function formatarDataBR(isoDate) {
  if (!isoDate) return "—";
  const [ano, mes, dia] = isoDate.split("-");
  if (!ano || !mes || !dia) return isoDate;
  return `${dia}/${mes}/${ano}`;
}

/* =====================================================================
   14. START
   ===================================================================== */
inicializar();