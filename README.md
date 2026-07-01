# TikTok AI Assistant

Painel minimalista com chat de IA para criadores de conteúdo do TikTok.  
Gere ideias, roteiros, ganchos e CTAs em segundos.

Projeto educacional em Vanilla JS — sem frameworks, sem backend, sem build tools.

---

## Como usar

### 1. Clone ou baixe o projeto

```bash
git clone https://github.com/seu-usuario/tiktok-ai-assistant.git
cd tiktok-ai-assistant
```

### 2. Abra o `script.js` e configure sua API

```js
// Linha 18 — Insira sua chave de API
const API_KEY = "sua-chave-aqui";

// Linha 26 — Insira a URL do endpoint
const API_URL = "https://api.openai.com/v1/chat/completions";

// Linha 32 — Escolha o modelo
const MODEL = "gpt-4o-mini";
```

#### Exemplos de provedores compatíveis

| Provedor | URL da API | Modelo exemplo |
|----------|-----------|---------------|
| OpenAI | `https://api.openai.com/v1/chat/completions` | `gpt-4o-mini` |
| Groq (gratuito) | `https://api.groq.com/openai/v1/chat/completions` | `llama3-8b-8192` |
| Ollama (local) | `http://localhost:11434/v1/chat/completions` | `llama3` |

> **Atenção:** Nunca publique sua API Key real em repositório público.  
> Para produção, use variáveis de ambiente ou um backend intermediário.

### 3. Abra no navegador

Abra o arquivo `index.html` diretamente no navegador. Não precisa de servidor.

```
Abrir index.html → pronto.
```

### 4. Publique no GitHub Pages

1. Faça push do projeto para um repositório no GitHub
2. Vá em **Settings → Pages**
3. Em **Source**, selecione a branch `main` e a pasta `/root`
4. Salve — o GitHub gera a URL pública automaticamente

---

## Estrutura de arquivos

```
/
├── index.html   → estrutura HTML da página
├── style.css    → estilos (tema dark, layout, chat)
├── script.js    → lógica do chat e integração com API
└── README.md    → este arquivo
```

---

## Tecnologias

- HTML5
- CSS3
- JavaScript Vanilla (ES2020+)
- Google Fonts (Inter)

Sem React, sem Node.js, sem dependências externas.

---

## O que o assistente sabe fazer

- Criar ideias de vídeos virais
- Escrever roteiros curtos (30s, 60s, 3min)
- Melhorar ganchos (primeiros 3 segundos)
- Criar chamadas para ação (CTA)
- Sugerir títulos e legendas
- Montar séries de conteúdo
- Adaptar tendências para seu nicho
- Dar dicas de retenção

---

## Licença

MIT — livre para estudos e uso pessoal.
