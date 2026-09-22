import React from "react";
import { Swords, UserCheck, Clock, UserPlus, SkipForward, RotateCcw, Heart, Shield } from "lucide-react";
import { Personagem } from "../types";

interface TurnTrackerProps {
  personagens: Personagem[];
  turnoIndex: number;
  rodada: number;
  jogadoresQueAgiramIds: string[];
  onSelecionarTurno: (index: number) => void;
  onPassarTurno: () => void;
  onNovaRodada: () => void;
  onAbrirCriadorJogador: () => void;
  onAbrirFicha: (personagem: Personagem) => void;
  onAbrirIniciativa: () => void;
  disabled?: boolean;
}

export function TurnTracker({
  personagens,
  turnoIndex,
  rodada,
  jogadoresQueAgiramIds,
  onSelecionarTurno,
  onPassarTurno,
  onNovaRodada,
  onAbrirCriadorJogador,
  onAbrirFicha,
  onAbrirIniciativa,
  disabled = false,
}: TurnTrackerProps) {
  if (!personagens || personagens.length === 0) return null;

  const personagemAtual = personagens[turnoIndex] || personagens[0];
  const totalJogadores = personagens.length;
  const agiramCount = jogadoresQueAgiramIds.length;
  const todosAgiram = agiramCount >= totalJogadores;

  return (
    <div className="w-full bg-stone-950/90 backdrop-blur-md border-b border-amber-900/40 px-3 sm:px-5 py-2.5 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Lado Esquerdo: Rodada & Status do Turno */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-700/50 shadow-inner">
            <Swords className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold leading-none">
                Iniciativa
              </span>
              <span className="text-xs font-bold text-amber-100 font-serif">
                Rodada {rodada}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] text-stone-400 font-medium">
              Vez ativa:
            </span>
            <span className="text-xs font-bold text-amber-200 truncate max-w-[140px]">
              {personagemAtual.jogadorNome ? `${personagemAtual.jogadorNome} (${personagemAtual.nome})` : personagemAtual.nome}
            </span>
          </div>
        </div>

        {/* Centro: Fila de Jogadores Simultâneos com Indicador Ativo */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
          {personagens.map((p, index) => {
            const ehVezAtiva = index === turnoIndex;
            const jaAgiu = p.id ? jogadoresQueAgiramIds.includes(p.id) : false;
            const pvPercent = Math.max(0, Math.min(100, Math.round((p.pvAtual / (p.pvMax || 1)) * 100)));

            return (
              <div
                key={p.id || `${p.nome}-${index}`}
                onClick={() => !disabled && onSelecionarTurno(index)}
                className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none shrink-0 ${
                  ehVezAtiva
                    ? "bg-gradient-to-r from-amber-950/90 to-stone-900 border-amber-400 text-amber-100 shadow-lg shadow-amber-950/50 scale-102 ring-1 ring-amber-400/40"
                    : jaAgiu
                    ? "bg-stone-900/40 border-stone-800/80 text-stone-400 opacity-60 hover:opacity-90"
                    : "bg-stone-900/80 border-stone-700/60 text-stone-300 hover:border-stone-500 hover:text-white"
                }`}
                title={`Clique para selecionar a vez de ${p.nome}`}
              >
                {/* Indicador de Ordem / Vez */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    ehVezAtiva
                      ? "bg-amber-500 text-stone-950 shadow-inner font-black animate-pulse"
                      : jaAgiu
                      ? "bg-emerald-950 border border-emerald-700/50 text-emerald-400"
                      : "bg-stone-800 text-stone-300 border border-stone-700"
                  }`}
                >
                  {jaAgiu && !ehVezAtiva ? (
                    <UserCheck className="w-3.5 h-3.5" />
                  ) : (
                    <span>#{index + 1}</span>
                  )}
                </div>

                {/* Info do Jogador e Personagem */}
                <div className="flex flex-col min-w-[90px] max-w-[140px]">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold truncate leading-snug">
                      {p.nome}
                    </span>
                    {p.incapacitado && (
                      <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 text-[9px] font-bold border border-red-700/50 animate-pulse">
                        Incapacitado ({p.turnosIncapacitadoRestantes ?? 5}t)
                      </span>
                    )}
                    {ehVezAtiva && !p.incapacitado && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] leading-none text-stone-400">
                    <span className="truncate">
                      {p.jogadorNome || p.classe} • Nv {p.nivel || 1}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9px] font-semibold ml-1">
                      <span className="text-purple-300">{p.xp || 0} XP</span>
                      <span className="text-stone-600">|</span>
                      <span className="text-red-400 flex items-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 fill-red-500/20" />
                        {p.pvAtual}/{p.pvMax}
                      </span>
                    </span>
                  </div>

                  {/* Micro Barra de Vida */}
                  <div className="w-full bg-stone-950 h-1 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pvPercent > 50
                          ? "bg-emerald-500"
                          : pvPercent > 25
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${pvPercent}%` }}
                    />
                  </div>
                </div>

                {/* Badge de "Sua Vez" */}
                {ehVezAtiva && (
                  <span className="hidden lg:inline-block px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-wider border border-amber-500/30 shrink-0">
                    Na Vez
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Lado Direito: Ações de Turno da Mesa */}
        <div className="flex items-center gap-2 shrink-0 justify-end">
          {/* BOTÃO PARA TER A INICIATIVA (Disputa de Sala / Cena) */}
          <button
            type="button"
            id="btn-ter-iniciativa"
            onClick={onAbrirIniciativa}
            disabled={disabled}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/40 border border-amber-400/80 animate-pulse hover:animate-none disabled:opacity-50"
            title="Reivindicar ou disputar a iniciativa na sala entre os jogadores"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Ter a Iniciativa</span>
          </button>

          {/* Passar a Vez / Aguardar */}
          <button
            type="button"
            id="btn-passar-turno"
            onClick={onPassarTurno}
            disabled={disabled}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Passa a vez para o próximo jogador sem agir"
          >
            <SkipForward className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Passar Vez</span>
          </button>

          {/* Nova Rodada / Reset da Rodada */}
          <button
            type="button"
            id="btn-nova-rodada"
            onClick={onNovaRodada}
            disabled={disabled}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              todosAgiram
                ? "bg-amber-600/30 border-amber-500 text-amber-200 hover:bg-amber-600/40 animate-pulse"
                : "bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-300 hover:text-white"
            }`}
            title="Iniciar nova rodada para todos os jogadores"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Nova Rodada</span>
          </button>

          {/* Adicionar Novo Jogador à Mesa em Tempo Real */}
          <button
            type="button"
            id="btn-add-jogador-durante-aventura"
            onClick={onAbrirCriadorJogador}
            disabled={disabled}
            className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm disabled:opacity-50"
            title="Adicionar um novo jogador à aventura imediatamente"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">+ Jogador</span>
          </button>
        </div>
      </div>
    </div>
  );
}
