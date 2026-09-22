import { X, Shield, Scroll, Terminal, PlusCircle, RefreshCw, Heart, Users, Dice5, BookOpen, Bot } from "lucide-react";
import { Personagem, Campanha } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  personagem: Personagem | null;
  personagensCount: number;
  campanha: Campanha | null;
  aiStatus: { provider: string; hasKey: boolean } | null;
  emAventura: boolean;
  onAlternarModoVisualizacao: () => void;
  onOpenCharacterCreator: () => void;
  onOpenCharacterSheet: () => void;
  onOpenDiceRoller: () => void;
  onOpenTelegramConsole: () => void;
  onOpenLivroDoJogador: () => void;
  onNewCampaign: () => void;
  isProcessing: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  personagem,
  personagensCount,
  campanha,
  aiStatus,
  emAventura,
  onAlternarModoVisualizacao,
  onOpenCharacterCreator,
  onOpenCharacterSheet,
  onOpenDiceRoller,
  onOpenTelegramConsole,
  onOpenLivroDoJogador,
  onNewCampaign,
  isProcessing,
}: SidebarProps) {
  if (!isOpen) return null;

  const isAiActive = aiStatus?.hasKey;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-81 max-w-[85vw] bg-stone-900 border-r border-amber-950/40 text-stone-100 h-full flex flex-col shadow-2xl z-10 animate-slideRight">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-red-800 flex items-center justify-center text-amber-100 shadow-inner">
              <Shield className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-amber-100">D&D Narrator Bot</h2>
              <p className="text-[10px] text-stone-400">Livro do Jogador 5ª Edição</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Status da IA & Aventura */}
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Motor de IA:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <span className={`w-2 h-2 rounded-full ${isAiActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {isAiActive ? "Gemini 3.8 Flash" : "Fallback Offline"}
              </span>
            </div>
            {campanha && emAventura && (
              <div className="text-xs pt-1 border-t border-stone-800/80">
                <span className="text-stone-400">Campanha:</span>
                <p className="font-serif font-bold text-amber-200 truncate mt-0.5">{campanha.titulo}</p>
              </div>
            )}
          </div>

          {/* Ficha Ativa / Personagens */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500/90 px-1">
              Personagens da Mesa ({personagensCount})
            </div>
            {personagem ? (
              <div className="p-3 rounded-xl bg-stone-950/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-amber-100 font-serif">{personagem.nome}</div>
                    <div className="text-xs text-stone-400">{personagem.raca} {personagem.classe} (Nível {personagem.nivel})</div>
                  </div>
                  <div className="text-right text-xs font-semibold text-red-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-red-400" />
                    <span>{personagem.pvAtual}/{personagem.pvMax} PV</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCharacterSheet();
                  }}
                  className="w-full mt-1 py-1.5 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver Ficha Completa</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenCharacterCreator();
                }}
                className="w-full p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Criar Novo Personagem</span>
              </button>
            )}
          </div>

          {/* Opções de Menu e Ações */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500/90 px-1">
              Menu de Opções & Ferramentas
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onClose();
                  onAlternarModoVisualizacao();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium border border-stone-700/80 transition-colors"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>{emAventura ? "Ver Lobby da Mesa" : "Voltar para Aventura Ativa"}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLivroDoJogador();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium border border-stone-700/80 transition-colors"
              >
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>Compêndio Livro do Jogador 5e</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDiceRoller();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium border border-stone-700/80 transition-colors"
              >
                <Dice5 className="w-4 h-4 text-amber-400" />
                <span>Torre de Rolagem de Dados</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTelegramConsole();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 text-sky-200 text-xs font-medium border border-sky-800/40 transition-colors"
              >
                <Bot className="w-4 h-4 text-sky-400" />
                <span>Terminal Bot do Telegram</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNewCampaign();
                }}
                disabled={isProcessing}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-medium border border-stone-700/80 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 text-stone-400" />
                <span>Nova Mesa / Reiniciar Aventura</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 text-[11px] text-stone-500 text-center bg-stone-950/40">
          D&D 5ª Edição • Narrador Baseado em IA
        </div>
      </div>
    </div>
  );
}
