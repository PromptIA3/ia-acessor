/* ═══════════════════════════════════════════════════════════════
   TikTok AI Assistant — script.js
   Integração com API compatível com OpenAI (ex: Claude, OpenAI, Groq…)
   Projeto educacional — Vanilla JS puro, sem dependências.
═══════════════════════════════════════════════════════════════ */


/* ── 1. CONFIGURAÇÃO DA API ─────────────────────────────────────
   ➤ Substitua os valores abaixo pelas suas credenciais.
   ➤ ATENÇÃO: nunca publique uma API Key real em repositório público.
      Use variáveis de ambiente ou um backend para produção real.
─────────────────────────────────────────────────────────────── */

// Sua chave de API (ex: "sk-ant-api03-..." para Claude, "sk-..." para OpenAI)
const API_KEY = "";

// URL do endpoint compatível com OpenAI
// Exemplos:
//   OpenAI  → "https://api.openai.com/v1/chat/completions"
//   Claude  → "https://api.anthropic.com/v1/messages"  (requer header diferente)
//   Groq    → "https://api.groq.com/openai/v1/chat/completions"
//   Ollama  → "http://localhost:11434/v1/chat/completions"
const API_URL = "";

// Modelo a ser usado (ajuste conforme o provedor)
// Exemplos: "gpt-4o-mini", "claude-sonnet-4-6", "llama3-8b-8192"
const MODEL = "gpt-4o-mini";


/* ── 2. PROMPT DO SISTEMA ───────────────────────────────────────
   Define o comportamento e a especialidade da IA.
   Altere este texto para mudar a "personalidade" do assistente.
─────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `Você é um especialista em criação de conteúdo para TikTok.
Seu objetivo é ajudar criadores a crescer na plataforma com estratégias práticas.

Você é capaz de:
- Criar ideias de vídeos virais com base em tendências
- Escrever roteiros curtos e diretos (30s, 60s, 3min)
- Melhorar ganchos (os primeiros 3 segundos do vídeo)
- Criar chamadas para ação (CTA) eficientes
- Sugerir títulos e legendas otimizados
- Criar séries de vídeos temáticas
- Adaptar tendências para o nicho do criador
- Dar dicas para melhorar a retenção do vídeo

Padrão de resposta:
- Seja objetivo e direto
- Use listas quando listar itens
- Separe seções com linha em branco
- Não use markdown complexo (sem **negrito** ou # títulos)
- Escreva em português do Brasil`;


/* ── 3. HISTÓRICO DE MENSAGENS ──────────────────────────────────
   Armazena a conversa para enviar contexto à API a cada mensagem.
   Isso permite que a IA "lembre" do que foi dito antes.
─────────────────────────────────────────────────────────────── */
const historico = []; // [ { role: "user"|"assistant", content: "..." } ]


/* ── 4. REFERÊNCIAS AOS ELEMENTOS DO HTML ──────────────────────── */
const chatEl  = document.getElementById("chat");    // área de mensagens
const inputEl = document.getElementById("input");   // textarea
const btnEl   = document.getElementById("sendBtn"); // botão Enviar


/* ── 5. FUNÇÃO PRINCIPAL: enviarMensagem ───────────────────────
   Toda a lógica de envio e recebimento está isolada aqui.
   Fácil de modificar ou substituir a API depois.
─────────────────────────────────────────────────────────────── */
async function enviarMensagem() {

  // 5a. Pega e limpa o texto do campo
  const texto = inputEl.value.trim();

  // Impede envio de mensagem vazia
  if (!texto) return;

  // Impede envio se API Key não foi configurada
  if (!API_KEY || !API_URL) {
    adicionarMensagem("ai", "⚠️ Configure a API_KEY e a API_URL no arquivo script.js antes de usar.", true);
    return;
  }

  // 5b. Exibe a mensagem do usuário na tela
  adicionarMensagem("user", texto);

  // 5c. Limpa o campo e ajusta altura
  inputEl.value = "";
  ajustarAlturaTextarea();

  // 5d. Desabilita o botão enquanto aguarda
  btnEl.disabled = true;

  // 5e. Exibe o indicador "Pensando..."
  const bolhaPensando = adicionarMensagem("ai", "Pensando", false, true);

  // 5f. Adiciona a mensagem do usuário ao histórico
  historico.push({ role: "user", content: texto });

  try {

    /* ── Chamada à API ─────────────────────────────────────────
       Formato compatível com OpenAI Chat Completions.
       Ajuste os headers se usar um provedor diferente.
    ─────────────────────────────────────────────────────────── */
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
        // Se usar Claude diretamente, troque para:
        // "x-api-key": API_KEY,
        // "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...historico   // envia todo o histórico para manter contexto
        ],
        max_tokens: 1024,
        temperature: 0.8  // 0 = mais preciso | 1 = mais criativo
      })
    });

    // Verifica se a requisição foi bem-sucedida
    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      throw new Error(erro?.error?.message || `Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    // Extrai o texto da resposta (formato OpenAI)
    const textoResposta = dados.choices?.[0]?.message?.content || "Não recebi uma resposta válida.";

    // 5g. Adiciona a resposta ao histórico
    historico.push({ role: "assistant", content: textoResposta });

    // 5h. Substitui "Pensando..." pela resposta real
    bolhaPensando.textContent = textoResposta;
    bolhaPensando.classList.remove("msg__bubble--thinking");

  } catch (erro) {

    // 5i. Em caso de erro, exibe mensagem amigável
    console.error("Erro na API:", erro);
    bolhaPensando.textContent = `Não consegui me conectar. Verifique sua API Key, URL e conexão.\n\nDetalhes: ${erro.message}`;
    bolhaPensando.classList.remove("msg__bubble--thinking");
    bolhaPensando.classList.add("msg__bubble--error");

    // Remove do histórico a mensagem que falhou
    historico.pop();

  } finally {

    // 5j. Reabilita o botão sempre ao final (com erro ou não)
    btnEl.disabled = false;
    inputEl.focus();
  }
}


/* ── 6. FUNÇÃO: adicionarMensagem ──────────────────────────────
   Cria e insere um bloco de mensagem no chat.
   Retorna a bolha de texto para que possamos atualizá-la depois.

   @param tipo     "user" | "ai"
   @param texto    Conteúdo da mensagem
   @param isError  Aplica estilo de erro (opcional)
   @param thinking Aplica estilo "Pensando..." animado (opcional)
─────────────────────────────────────────────────────────────── */
function adicionarMensagem(tipo, texto, isError = false, thinking = false) {

  // Cria o wrapper da mensagem
  const msg = document.createElement("div");
  msg.className = `msg msg--${tipo}`;

  // Cria o rótulo (Você / IA)
  const label = document.createElement("span");
  label.className = "msg__label";
  label.textContent = tipo === "user" ? "Você" : "IA";

  // Cria a bolha de texto
  const bolha = document.createElement("div");
  bolha.className = "msg__bubble";
  bolha.textContent = texto;

  // Aplica classes extras se necessário
  if (isError)   bolha.classList.add("msg__bubble--error");
  if (thinking)  bolha.classList.add("msg__bubble--thinking");

  // Monta e insere no DOM
  msg.appendChild(label);
  msg.appendChild(bolha);
  chatEl.appendChild(msg);

  // Rola o chat para a última mensagem
  rolarParaBaixo();

  // Retorna a bolha para possível atualização posterior
  return bolha;
}


/* ── 7. FUNÇÃO: rolarParaBaixo ─────────────────────────────────
   Garante que o chat sempre mostre a mensagem mais recente.
─────────────────────────────────────────────────────────────── */
function rolarParaBaixo() {
  chatEl.scrollTop = chatEl.scrollHeight;
}


/* ── 8. FUNÇÃO: ajustarAlturaTextarea ──────────────────────────
   Expande o textarea automaticamente conforme o usuário digita.
   Limita a altura máxima via CSS (max-height: 120px).
─────────────────────────────────────────────────────────────── */
function ajustarAlturaTextarea() {
  inputEl.style.height = "auto";
  inputEl.style.height = inputEl.scrollHeight + "px";
}


/* ── 9. EVENTOS ─────────────────────────────────────────────────
   Conecta as ações do usuário às funções acima.
─────────────────────────────────────────────────────────────── */

// Clique no botão "Enviar"
btnEl.addEventListener("click", enviarMensagem);

// Pressionar Enter envia | Shift+Enter quebra linha
inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // impede quebra de linha padrão
    enviarMensagem();
  }
});

// Ajusta altura do textarea enquanto o usuário digita
inputEl.addEventListener("input", ajustarAlturaTextarea);


/* ── 10. MENSAGEM DE BOAS-VINDAS ────────────────────────────────
   Aparece assim que a página carrega, guiando o usuário.
─────────────────────────────────────────────────────────────── */
adicionarMensagem(
  "ai",
  "Olá! Sou seu assistente de conteúdo para TikTok.\n\nPosso te ajudar com:\n- Ideias de vídeos virais\n- Roteiros curtos\n- Ganchos e CTAs\n- Títulos e legendas\n- Séries de conteúdo\n\nComo posso te ajudar hoje?"
);
