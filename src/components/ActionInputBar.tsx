import { useState } from "react";
import { Send, Sparkles, Lightbulb, Compass, ChevronDown, User, Swords, Star } from "lucide-react";
import { Personagem } from "../types";

interface ActionInputBarProps {
  onExecuteAcao: (acao: string, opts?: { vantagem?: boolean; desvantagem?: boolean; personagemIndex?: number }) => Promise<void>;
  onPedirOrientacao: () => Promise<void>;
  isProcessing: boolean;
  disabled?: boolean;
  personagens?: Personagem[];
  personagemAtivoIndex?: number;
  onMudarPersonagemAtivo?: (idx: number) => void;
  onAbrirIniciativa?: () => void;
}

export function ActionInputBar({
  onExecuteAcao,
  onPedirOrientacao,
  isProcessing,
  disabled,
  personagens = [],
  personagemAtivoIndex = 0,
  onMudarPersonagemAtivo,
  onAbrirIniciativa,
}: ActionInputBarProps) {
  const [text, setText] = useState("");
  const [vantagem, setVantagem] = useState(false);
  const [desvantagem, setDesvantagem] = useState(false);
  const [pedindoOrientacao, setPedindoOrientacao] = useState(false);

  const personagemAtual = personagens[personagemAtivoIndex] || personagens[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean || isProcessing || disabled) return;

    setText("");
    await onExecuteAcao(clean, {
      vantagem,
      desvantagem,
      personagemIndex: personagemAtivoIndex,
    });
    setVantagem(false);
    setDesvantagem(false);
  };

  const handleSolicitarOrientacao = async () => {
    if (pedindoOrientacao || isProcessing || disabled) return;
    setPedindoOrientacao(true);
    try {
      await onPedirOrientacao();
    } finally {
      setPedindoOrientacao(false);
    }
  };

  return (
    <div className="border-t border-amber-950/20 bg-stone-900/95 p-3 sm:p-4 text-stone-200">
      <div className="max-w-4xl mx-auto space-y-2.5">
        
        {/* Barra Superior: Seletor de Personagem Ativo + Botão de Socorro para Desfecho */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Seletor de Personagem Ativo se houver múltiplos */}
          {personagens.length > 1 ? (
            <div className="flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-stone-400">Agindo como:</span>
              <select
                id="select-active-actor"
                value={personagemAtivoIndex}
                onChange={(e) => onMudarPersonagemAtivo?.(Number(e.target.value))}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-hidden cursor-pointer"
              >
                {personagens.map((p, idx) => (
                  <option key={idx} value={idx} className="bg-stone-900 text-stone-200">
                    {p.nome} ({p.classe})
                  </option>
                ))}
              </select>
            </div>
          ) : personagemAtual ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  Turno ativo: <strong className="text-amber-200 font-bold">{personagemAtual.nome}</strong>
                  {personagemAtual.jogadorNome && <span className="text-amber-400/80 ml-1">({personagemAtual.jogadorNome})</span>}
                </span>
              </div>
              <span className="hidden md:inline text-[11px] text-stone-500">
                • Falhar em um teste ativa consequências e perde o turno
              </span>
            </div>
          ) : (
            <span className="text-stone-500 text-xs">Aguardando personagem</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Botão de Disputar Iniciativa da Sala / Cena */}
            {onAbrirIniciativa && (
              <button
                type="button"
                id="btn-iniciativa-inputbar"
                onClick={onAbrirIniciativa}
                disabled={isProcessing || disabled}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Quem age primeiro na nova sala? Disputar ou reivindicar a iniciativa"
              >
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ter a Iniciativa</span>
              </button>
            )}

            {/* Botão de Dica/Orientação para o Desfecho quando estiver com dificuldades */}
            <button
              type="button"
              id="btn-ask-narrator-guidance"
              onClick={handleSolicitarOrientacao}
              disabled={isProcessing || pedindoOrientacao || disabled}
              className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40 hover:border-amber-500 text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Peça uma dica ou rota caso esteja com dificuldades para caminhar em direção ao desfecho da aventura"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {pedindoOrientacao ? "Consultando Mestre..." : "💡 Dificuldades? Peça dica de desfecho"}
              </span>
            </button>
          </div>
        </div>

        {/* Formulário de Ação Totalmente Livre */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          <div className="relative flex-1">
            <input
              id="input-player-action"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isProcessing || disabled}
              placeholder={
                disabled
                  ? "Crie sua ficha e inicie a aventura para interagir..."
                  : "Ação livre (ex: 'Examino e decifro os símbolos ritualísticos no altar para achar o caminho seguro')..."
              }
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm shadow-inner transition-colors disabled:opacity-60"
            />
          </div>

          {/* Vantagem / Desvantagem */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                id="btn-toggle-advantage"
                onClick={() => {
                  setVantagem(!vantagem);
                  if (!vantagem) setDesvantagem(false);
                }}
                className={`px-2.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
                  vantagem
                    ? "bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-500/50"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Rolar com Vantagem (pega o maior d20 do Livro do Jogador)"
              >
                Vantagem ↑
              </button>
              <button
                type="button"
                id="btn-toggle-disadvantage"
                onClick={() => {
                  setDesvantagem(!desvantagem);
                  if (!desvantagem) setVantagem(false);
                }}
                className={`px-2.5 py-1.5 rounded transition-colors text-[11px] font-medium cursor-pointer ${
                  desvantagem
                    ? "bg-red-900/60 text-red-300 font-bold border border-red-500/50"
                    : "text-stone-400 hover:text-stone-200"
                }`}
                title="Rolar com Desvantagem (pega o menor d20)"
              >
                Desvantagem ↓
              </button>
            </div>

            {/* Botão de Agir */}
            <button
              id="btn-submit-player-action"
              type="submit"
              disabled={!text.trim() || isProcessing || disabled}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Narrando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Agir</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Dica de Roleplay & Ganho de XP periódico */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 pt-0.5">
          <span className="flex items-center gap-1 text-amber-400/90 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>
              <strong>Dica de Roleplay:</strong> Entre no personagem! Ações fiéis aos trejeitos, raça e classe rendem <strong>+XP periódico</strong> para subir de nível.
            </span>
          </span>
          {personagemAtual && (
            <span className="hidden sm:inline font-mono text-[10px] text-stone-400">
              {personagemAtual.nome}: {personagemAtual.xp || 0} XP (Nível {personagemAtual.nivel || 1})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
