import { useState, useRef, useEffect } from "react";
import { X, Send, Terminal, Bot, Sparkles, HelpCircle, Copy, Check } from "lucide-react";
import { Personagem, Campanha, TesteResultado } from "../types";

interface TelegramBotConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  personagem: Personagem | null;
  campanha: Campanha | null;
  onExecuteAcao: (acao: string) => Promise<void>;
  onStartCampaign: () => Promise<void>;
  onOpenCharacterCreator: () => void;
}

interface TelegramMsg {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function TelegramBotConsole({
  isOpen,
  onClose,
  personagem,
  campanha,
  onExecuteAcao,
  onStartCampaign,
  onOpenCharacterCreator,
}: TelegramBotConsoleProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TelegramMsg[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `🎲 Bem-vindo ao D&D Narrator Bot!\n\nEste console simula os comandos exatos do bot do Telegram do repositório IsraelSiq/dnd-narrator-bot.\n\nComandos disponíveis:\n/start - Iniciar criação de personagem\n/iniciar_historia - Abrir primeira cena da aventura\n/acao <texto> - Realizar ação na aventura\n/ficha - Visualizar ficha do personagem\n/rolar d20 - Rolar dados ou testes\n/jogadores - Listar jogadores ativos\n/ajuda - Exibir guia completo`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const appendMsg = (sender: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    appendMsg("user", trimmed);
    setInput("");
    setIsProcessing(true);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    try {
      if (command === "/start") {
        appendMsg(
          "bot",
          `🎲 Iniciando criação guiada de personagem!\n\nAbriremos o assistente de 4 etapas (Nome, Classe, Raça e Detalhes).\nVocê também pode digitar seus atributos diretamente.`
        );
        onOpenCharacterCreator();
      } else if (command === "/iniciar_historia" || command === "/startcampaign") {
        appendMsg("bot", `⏳ O Mestre da Masmorra está gerando o cenário da aventura...`);
        await onStartCampaign();
        appendMsg("bot", `📜 Aventura iniciada com sucesso! Use /acao <sua ação> para interagir com o mundo.`);
      } else if (command === "/ficha" || command === "/mychar") {
        if (!personagem) {
          appendMsg("bot", `❌ Você ainda não possui um personagem ativo. Use /start para criar.`);
        } else {
          const mod = (val: number) => {
            const m = Math.floor((val - 10) / 2);
            return m >= 0 ? `+${m}` : `${m}`;
          };
          const fichaText = [
            `╔═══ 📜 FICHA DE PERSONAGEM ═══╗`,
            `👤 Nome: ${personagem.nome}`,
            `🛡️ Classe: ${personagem.classe} (Nível ${personagem.nivel || 1})`,
            `🧝 Raça: ${personagem.raca}`,
            `❤️ PV: ${personagem.pvAtual}/${personagem.pvMax} | 🛡️ CA: ${personagem.ca}`,
            `─────────────────────`,
            `💪 Força: ${personagem.atributos.Força} (${mod(personagem.atributos.Força)})`,
            `🏃 Destreza: ${personagem.atributos.Destreza} (${mod(personagem.atributos.Destreza)})`,
            `❤️ Constituição: ${personagem.atributos.Constituição} (${mod(personagem.atributos.Constituição)})`,
            `🧠 Inteligência: ${personagem.atributos.Inteligência} (${mod(personagem.atributos.Inteligência)})`,
            `👁️ Sabedoria: ${personagem.atributos.Sabedoria} (${mod(personagem.atributos.Sabedoria)})`,
            `✨ Carisma: ${personagem.atributos.Carisma} (${mod(personagem.atributos.Carisma)})`,
            `─────────────────────`,
            `📖 História: ${personagem.historia}`,
            `╚════════════════════╝`,
          ].join("\n");
          appendMsg("bot", fichaText);
        }
      } else if (command === "/acao") {
        if (!args) {
          appendMsg("bot", `⚠️ Informe a ação que deseja realizar.\nExemplo: /acao avanço com a espada para golpear o guarda`);
        } else if (!personagem) {
          appendMsg("bot", `❌ Você precisa de um personagem para agir. Use /start para criar.`);
        } else {
          appendMsg("bot", `🎲 O Mestre está avaliando sua ação e calculando os testes de D&D 5e...`);
          await onExecuteAcao(args);
          appendMsg("bot", `✅ Ação resolvida no fluxo principal da história!`);
        }
      } else if (command === "/rolar" || command === "/roll") {
        const sides = 20;
        const d1 = Math.floor(Math.random() * sides) + 1;
        let bonus = 0;
        let attrNome = "Teste Geral";

        if (args && personagem) {
          const matchAttr = Object.keys(personagem.atributos).find(
            (a) => a.toLowerCase() === args.toLowerCase()
          );
          if (matchAttr) {
            attrNome = matchAttr;
            bonus = Math.floor((personagem.atributos[matchAttr] - 10) / 2);
          }
        }

        const total = d1 + bonus;
        let status = total >= 12 ? "✅ Sucesso" : "❌ Falha";
        if (d1 === 20) status = "🌟 SUCESSO CRÍTICO!";
        if (d1 === 1) status = "💀 FALHA CRÍTICA!";

        const rollText = [
          `╔═══ 🎲 ROLAGEM DE DADOS ═══╗`,
          `👤 ${personagem?.nome || "Herói"}`,
          `🎯 ${attrNome}`,
          `─────────────────────`,
          `🎲 d20: ${d1}`,
          `${bonus >= 0 ? `+${bonus}` : bonus} modificador`,
          `─────────────────────`,
          `📊 Total: ${total} vs CD 12`,
          `╚══ ${status} ══╝`,
        ].join("\n");
        appendMsg("bot", rollText);
      } else if (command === "/jogadores") {
        if (personagem) {
          appendMsg(
            "bot",
            `👥 Grupo de Aventureiros da Sessão:\n1. ${personagem.nome} - ${personagem.classe} (${personagem.raca}) • PV: ${personagem.pvAtual}/${personagem.pvMax}`
          );
        } else {
          appendMsg("bot", `👥 Nenhum personagem registrado na sessão no momento.`);
        }
      } else if (command === "/nova_aventura") {
        appendMsg("bot", `🔄 Reiniciando aventura e abrindo nova campanha...`);
        await onStartCampaign();
        appendMsg("bot", `✨ Nova aventura pronta!`);
      } else if (command === "/ajuda" || command === "/help") {
        appendMsg(
          "bot",
          `📖 Comandos do D&D Narrator Bot:\n\n/start - Iniciar criação guiada\n/iniciar_historia - Começar campanha\n/acao <descrição> - Agir na aventura\n/ficha - Ver sua ficha de D&D 5e\n/rolar - Rolar d20 avulso\n/rolar <atributo> - Rolar teste com mod\n/jogadores - Listar o grupo\n/nova_aventura - Iniciar nova aventura`
        );
      } else {
        // Se o usuário digitou uma ação sem o comando /acao, executa como ação
        if (personagem) {
          appendMsg("bot", `Interpretando como ação do personagem: "${trimmed}"...`);
          await onExecuteAcao(trimmed);
        } else {
          appendMsg(
            "bot",
            `Comando não reconhecido: ${command}. Digite /ajuda para ver os comandos disponíveis.`
          );
        }
      }
    } catch (err: any) {
      appendMsg("bot", `⚠️ Erro ao processar comando: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyConfig = () => {
    const txt = `# Configuração do bot Telegram no servidor (Railway / VPS):
TELEGRAM_BOT_TOKEN="SEU_TOKEN_TELEGRAM_AQUI"
GEMINI_API_KEY="${process.env.GEMINI_API_KEY || "AI_STUDIO_INJECTED"}"
DATABASE_PATH="dnd.db"
python bot.py`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-stone-950 border border-sky-900/40 rounded-xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col text-stone-200 overflow-hidden font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-sky-950 bg-sky-950/40 text-xs">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sky-300">Telegram Bot Terminal</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400 font-sans text-[11px]">
              Compatível com IsraelSiq/dnd-narrator-bot
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyConfig}
              className="flex items-center gap-1 px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] border border-stone-800 transition-colors"
              title="Copiar configuração de implantação"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copiado!" : "Config .env"}</span>
            </button>
            <button
              id="btn-close-telegram-console"
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-950 text-xs leading-relaxed">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mb-0.5">
                <span>{m.sender === "user" ? "Você" : "@dnd_narrator_bot"}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`max-w-[90%] p-3 rounded-lg whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-sky-900/50 text-sky-100 border border-sky-700/50"
                    : "bg-stone-900 text-stone-200 border border-stone-800 shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sky-400 text-xs italic">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              Processando comando e consultando o Narrador...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2 bg-stone-900/60 border-t border-stone-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-stone-500 whitespace-nowrap">Comandos rápidos:</span>
          {["/start", "/iniciar_historia", "/ficha", "/rolar d20", "/jogadores", "/ajuda"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              disabled={isProcessing}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-sky-300 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="p-3 border-t border-stone-800 bg-stone-950 flex items-center gap-2"
        >
          <span className="text-sky-400 text-sm font-bold pl-1">&gt;</span>
          <input
            id="input-telegram-command"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Digite um comando (ex: /acao atacar com espada, /ficha, /rolar)..."
            className="flex-1 bg-transparent border-none text-stone-100 placeholder-stone-600 focus:outline-hidden text-xs"
            autoFocus
          />
          <button
            id="btn-send-telegram-command"
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>

      </div>
    </div>
  );
}
