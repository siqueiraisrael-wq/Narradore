import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  iniciarAventuraAI,
  criarPersonagemAI,
  avaliarAcaoAI,
  realizarTeste,
  narrarAcaoAI,
  obterOrientacaoDesfechoAI,
  formatarResultadoTelegram,
  rolarDado,
  modificador,
  detectarAtributo,
  TESTES,
  ATTR_EMOJI
} from "./server/dndService.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      aiAvailable: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.8-flash",
      offlineFallbackReady: true,
    });
  });

  // Status & Provider info (like narrator.py's status)
  app.get("/api/status", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      provider: hasKey ? "gemini:gemini-3.8-flash" : "offline-deterministico",
      hasKey,
      model: "gemini-3.8-flash",
      features: [
        "Criação guiada de personagens D&D 5e",
        "Motor de dados d20 com modificadores oficiais",
        "Vantagem, desvantagem e acertos/falhas críticas",
        "Narrador inteligente com contexto contínuo",
        "Fallback offline com sementes épicas",
        "Compatibilidade completa com comandos Telegram (/start, /acao, /ficha, /rolar)",
      ],
    });
  });

  // Iniciar nova aventura
  app.post("/api/campaign/start", async (req, res) => {
    try {
      const { tema } = req.body;
      const aventura = await iniciarAventuraAI(tema);
      res.json({ success: true, aventura });
    } catch (err: any) {
      console.error("Erro ao iniciar aventura:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Criar personagem com bônus de raça e classe D&D 5e (Livro do Jogador)
  app.post("/api/character/create", async (req, res) => {
    try {
      const { nome, classe, raca, detalhes, antecedente, tendencia } = req.body;
      if (!nome || !classe || !raca) {
        return res.status(400).json({ success: false, error: "Nome, classe e raça são obrigatórios" });
      }
      const personagem = await criarPersonagemAI(nome, classe, raca, detalhes, antecedente, tendencia);
      res.json({
        success: true,
        personagem: {
          ...personagem,
          nome,
          classe,
          raca,
          antecedente: antecedente || personagem.antecedente,
          tendencia: tendencia || personagem.tendencia,
          detalhes,
        },
      });
    } catch (err: any) {
      console.error("Erro ao criar personagem:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Avaliar ação
  app.post("/api/action/evaluate", async (req, res) => {
    try {
      const { contexto, acao } = req.body;
      const avaliacao = await avaliarAcaoAI(contexto || "", acao || "");
      res.json({ success: true, avaliacao });
    } catch (err: any) {
      console.error("Erro ao avaliar ação:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Executar Ação (com rolagem se necessário)
  app.post("/api/action/execute", async (req, res) => {
    try {
      const {
        sessaoContexto,
        personagem,
        acao,
        forcarTeste,
        atributoTeste,
        cdCustom,
        vantagem,
        desvantagem,
      } = req.body;

      if (!personagem || !acao) {
        return res.status(400).json({ success: false, error: "Personagem e ação são obrigatórios" });
      }

      // 1. Avalia se precisa de teste
      let precisaTeste = Boolean(forcarTeste);
      let atributo = atributoTeste || detectarAtributo(acao) || "Destreza";
      let cd = Number(cdCustom) || 12;
      let motivo = "Ação declarada pelo jogador";

      if (!forcarTeste) {
        const avaliacao = await avaliarAcaoAI(sessaoContexto || "", acao);
        precisaTeste = avaliacao.precisa_teste;
        atributo = avaliacao.atributo || atributo;
        cd = avaliacao.cd || cd;
        motivo = avaliacao.motivo;
      }

      // 2. Se precisa de teste, rola dados D&D 5e
      let testeResultado = null;
      if (precisaTeste) {
        const atributosChar = personagem.atributos || {
          Força: 12,
          Destreza: 12,
          Constituição: 12,
          Inteligência: 12,
          Sabedoria: 12,
          Carisma: 12,
        };
        testeResultado = realizarTeste(atributosChar, atributo, cd, Boolean(vantagem), Boolean(desvantagem));
        testeResultado.telegram_format = formatarResultadoTelegram(testeResultado, personagem.nome);
      }

      // 3. Narra com Gemini ou fallback
      const narracao = await narrarAcaoAI({
        sessaoContexto: sessaoContexto || "",
        personagem,
        acao,
        teste: testeResultado,
      });

      res.json({
        success: true,
        precisaTeste,
        atributo,
        cd,
        motivo,
        teste: testeResultado,
        narrativa: narracao.narrativa,
        novo_contexto: narracao.novo_contexto,
        bonificacao: narracao.bonificacao || null,
        penalidadeFalha: narracao.penalidadeFalha || null,
        recompensaXP: narracao.recompensaXP || null,
        sugestoes: narracao.sugestoes,
        source: narracao.source,
      });
    } catch (err: any) {
      console.error("Erro ao executar ação:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Rolar dado avulso ou teste de atributo
  app.post("/api/dice/roll", (req, res) => {
    try {
      const { lados = 20, quantidade = 1, mod = 0, atributo, valorAtributo, cd, vantagem, desvantagem, nomePersonagem = "Herói" } = req.body;

      if (atributo && valorAtributo !== undefined) {
        const atributosObj: Record<string, number> = { [atributo]: Number(valorAtributo) };
        const resultado = realizarTeste(atributosObj, atributo, Number(cd) || 12, Boolean(vantagem), Boolean(desvantagem));
        const telegramFormat = formatarResultadoTelegram(resultado, nomePersonagem);
        return res.json({ success: true, teste: { ...resultado, telegram_format: telegramFormat } });
      }

      const rolados: number[] = [];
      for (let i = 0; i < Math.min(Math.max(Number(quantidade) || 1, 1), 20); i++) {
        rolados.push(rolarDado(Number(lados) || 20));
      }
      const soma = rolados.reduce((a, b) => a + b, 0);
      const total = soma + (Number(mod) || 0);

      res.json({
        success: true,
        lados: Number(lados),
        quantidade: Number(quantidade),
        rolados,
        modificador: Number(mod),
        total,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Pedir Orientação / Dica para o desfecho da aventura (quando em apuros)
  app.post("/api/action/guidance", async (req, res) => {
    try {
      const { contexto, personagem, historicoRecente } = req.body;
      const orientacao = await obterOrientacaoDesfechoAI({
        contexto: contexto || "",
        personagem: personagem || null,
        historicoRecente: historicoRecente || "",
      });
      res.json({ success: true, orientacao });
    } catch (err: any) {
      console.error("Erro ao obter orientação:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`D&D Narrator Bot server running on http://localhost:${PORT}`);
  });
}

startServer();
