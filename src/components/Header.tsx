import { Shield, Scroll, Terminal, PlusCircle, RefreshCw, Heart, Users, Compass } from "lucide-react";
import { Personagem, Campanha } from "../types";

interface HeaderProps {
  personagem: Personagem | null;
  personagensCount?: number;
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

export function Header({
  personagem,
  personagensCount = 1,
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
}: HeaderProps) {
  const isAiActive = aiStatus?.hasKey;

  return (
    <header className="border-b border-amber-950/20 bg-stone-900 text-stone-100 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-red-800 flex items-center justify-center text-amber-100 shadow-inner ring-1 ring-amber-400/30">
              <Shield className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-amber-100 font-serif">
                  D&D Narrator Bot
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Livro do Jogador 5e
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAiActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  {isAiActive ? "Gemini 3.8 Flash Ativo" : "Fallback Offline Resiliente"}
                </span>
                {campanha && emAventura && (
                  <>
                    <span>•</span>
                    <span className="text-amber-200/90 truncate max-w-[200px]" title={campanha.titulo}>
                      {campanha.titulo}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Player & Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Alternar entre Lobby da Mesa e Aventura */}
            <button
              type="button"
              id="btn-toggle-lobby-adventure"
              onClick={onAlternarModoVisualizacao}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                !emAventura
                  ? "bg-amber-600/20 text-amber-300 border-amber-500/40 shadow-xs"
                  : "bg-stone-800 text-stone-300 border-stone-700 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>{emAventura ? `Mesa (${personagensCount} jogadores)` : "Aventura Ativa"}</span>
            </button>

            {/* Compêndio Livro do Jogador */}
            <button
              id="btn-open-livro-do-jogador"
              onClick={onOpenLivroDoJogador}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 text-xs font-semibold border border-amber-600/40 transition-colors shadow-xs"
              title="Consultar regras do Livro do Jogador D&D 5e"
            >
              <Scroll className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Livro do Jogador</span>
            </button>

            {/* Personagem Ativo Badge */}
            {personagem ? (
              <button
                id="btn-open-character-sheet"
                onClick={onOpenCharacterSheet}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-amber-500/30 text-xs font-medium text-amber-100 transition-colors shadow-sm"
              >
                <span className="font-semibold text-amber-200">{personagem.nome}</span>
                <span className="text-stone-400">({personagem.classe})</span>
                <span className="flex items-center gap-1 text-red-400 ml-1">
                  <Heart className="w-3 h-3 fill-red-400" />
                  {personagem.pvAtual}/{personagem.pvMax}
                </span>
              </button>
            ) : (
              <button
                id="btn-create-character-header"
                onClick={onOpenCharacterCreator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors shadow"
              >
                <PlusCircle className="w-4 h-4" />
                Criar Ficha
              </button>
            )}

            {/* Torre de Dados */}
            <button
              id="btn-open-dice-roller"
              onClick={onOpenDiceRoller}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
              title="Abrir rolador de dados D&D"
            >
              <Users className="w-4 h-4 text-amber-400 sm:hidden" />
              <span className="hidden sm:inline">Dados</span>
            </button>

            {/* Telegram Bot Console */}
            <button
              id="btn-open-telegram-console"
              onClick={onOpenTelegramConsole}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 text-xs font-medium border border-sky-800/40 transition-colors"
              title="Terminal e comandos do bot do Telegram"
            >
              <Terminal className="w-4 h-4 text-sky-400" />
              <span className="hidden md:inline">Bot Telegram</span>
            </button>

            {/* Nova Aventura / Reiniciar */}
            <button
              id="btn-new-campaign"
              onClick={onNewCampaign}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium border border-stone-700 transition-colors disabled:opacity-50"
              title="Iniciar nova campanha ou reconfigurar grupo"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-400 ${isProcessing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Nova Mesa</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
