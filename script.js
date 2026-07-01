/* ═══════════════════════════════════════════
   TikTok AI Assistant — script.js
   Gemini API (Google AI Studio)
═══════════════════════════════════════════ */

// ───────────────────────────────────────────
// 1. CONFIGURAÇÃO — edite apenas aqui
// ───────────────────────────────────────────

// Cole sua chave do Google AI Studio aqui:
// aistudio.google.com → Get API Key
const API_KEY = "AQ.Ab8RN6JU5wfZPSOUL18MvOSZkPxy2xlP-wMuaZjz0GTkSvaCgg";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const MODEL = "gemini-2.0-flash";

// ───────────────────────────────────────────
// 2. PERSONALIDADE DA IA
// ───────────────────────────────────────────
const SYSTEM_PROMPT = `Você é um especialista em criação de conteúdo para TikTok.
Ajude o usuário a criar ideias virais, roteiros curtos, ganchos, CTAs, títulos e séries de vídeos.
Seja objetivo, use listas quando necessário e escreva em português do Brasil.`;

// ───────────────────────────────────────────
// 3. VARIÁVEIS INTERNAS
// ───────────────────────────────────────────
const historico = [];
const chatEl    = document.getElementById("chat");
const inputEl   = document.getElementById("input");
const btnEl     = document.getElementById("sendBtn");

// ───────────────────────────────────────────
// 4. FUNÇÃO PRINCIPAL
// ───────────────────────────────────────────
async function enviarMensagem() {
  const texto = inputEl.value.trim();

  // Bloqueia envio vazio
  if (!texto) return;

  // Avisa se a chave não foi configurada
  if (API_KEY === "COLE_SUA_CHAVE_AQUI") {
    adicionarMensagem("ai", "⚠️ Você esqueceu de colocar sua API Key no script.js!", true);
    return;
  }

  // Mostra mensagem do usuário
  adicionarMensagem("user", texto);
  inputEl.value = "";
  ajustarAlturaTextarea();
  btnEl.disabled = true;

  // Mostra "Pensando..."
  const bolha = adicionarMensagem("ai", "Pensando", false, true);

  // Adiciona ao histórico
  historico.push({ role: "user", content: texto });

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...historico
        ],
        max_tokens: 1024,
        temperature: 0.8
      })
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      throw new Error(erro?.error?.message || `Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    const textoResposta = dados.choices?.[0]?.message?.content || "Não recebi resposta.";

    historico.push({ role: "assistant", content: textoResposta });

    bolha.textContent = textoResposta;
    bolha.classList.remove("msg__bubble--thinking");

  } catch (erro) {
    console.error(erro);
    bolha.textContent = `Erro ao conectar. Verifique sua API Key e tente novamente.\n\nDetalhes: ${erro.message}`;
    bolha.classList.remove("msg__bubble--thinking");
    bolha.classList.add("msg__bubble--error");
    historico.pop();
  } finally {
    btnEl.disabled = false;
    inputEl.focus();
  }
}

// ───────────────────────────────────────────
// 5. FUNÇÕES DE SUPORTE
// ───────────────────────────────────────────

function adicionarMensagem(tipo, texto, isError = false, thinking = false) {
  const msg   = document.createElement("div");
  msg.className = `msg msg--${tipo}`;

  const label = document.createElement("span");
  label.className = "msg__label";
  label.textContent = tipo === "user" ? "Você" : "IA";

  const bolha = document.createElement("div");
  bolha.className = "msg__bubble";
  bolha.textContent = texto;

  if (isError)  bolha.classList.add("msg__bubble--error");
  if (thinking) bolha.classList.add("msg__bubble--thinking");

  msg.appendChild(label);
  msg.appendChild(bolha);
  chatEl.appendChild(msg);
  chatEl.scrollTop = chatEl.scrollHeight;

  return bolha;
}

function ajustarAlturaTextarea() {
  inputEl.style.height = "auto";
  inputEl.style.height = inputEl.scrollHeight + "px";
}

// ───────────────────────────────────────────
// 6. EVENTOS
// ───────────────────────────────────────────
btnEl.addEventListener("click", enviarMensagem);

inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

inputEl.addEventListener("input", ajustarAlturaTextarea);

// ───────────────────────────────────────────
// 7. MENSAGEM INICIAL
// ───────────────────────────────────────────
adicionarMensagem(
  "ai",
  "Olá! Sou seu assistente de conteúdo para TikTok.\n\nPosso te ajudar com:\n- Ideias de vídeos virais\n- Roteiros curtos\n- Ganchos e CTAs\n- Títulos e legendas\n- Séries de conteúdo\n\nComo posso te ajudar hoje?"
);
