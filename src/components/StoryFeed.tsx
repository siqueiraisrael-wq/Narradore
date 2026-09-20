import { useRef, useEffect } from "react";
import { Sparkles, User, Shield, Dices, ChevronRight, AlertTriangle, CheckCircle2, Bookmark, Lightbulb, Compass, AlertOctagon, Skull, Hourglass, Award, Trophy, Star } from "lucide-react";
import { MensagemNarrativa, Personagem, Campanha, AcaoSugestao, OrientacaoDesfecho } from "../types";

interface StoryFeedProps {
  mensagens: MensagemNarrativa[];
  personagem: Personagem | null;
  campanha: Campanha | null;
  isProcessing: boolean;
  onSelectSuggestion: (sugestao: { acao: string; cd?: number }) => void;
  onPedirOrientacao: () => Promise<void>;
}

export function StoryFeed({
  mensagens,
  personagem,
  campanha,
  isProcessing,
  onSelectSuggestion,
  onPedirOrientacao,
}: StoryFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Campaign Header banner */}
      {campanha && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/30 border border-amber-900/30 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Aventura em Andamento</span>
            {campanha.source === "gemini" && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Gemini 3.8 Flash
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-amber-100">
            {campanha.titulo}
          </h2>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2 italic">
            {campanha.contexto}
          </p>
        </div>
      )}

      {/* Messages Timeline */}
      {mensagens.map((msg) => {
        // Mensagem de Jogador
        if (msg.tipo === "jogador") {
          return (
            <div key={msg.id} className="flex justify-end animate-fadeIn">
              <div className="max-w-xl p-4 rounded-2xl rounded-tr-xs bg-stone-800 border border-stone-700 text-stone-100 shadow-md">
                <div className="flex items-center justify-between text-xs text-amber-300/80 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{msg.titulo || personagem?.nome || "Jogador"}</span>
                    {personagem && (
                      <span className="text-[11px] text-stone-400 font-normal">
                        ({personagem.classe})
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.conteudo}</p>
              </div>
            </div>
          );
        }

        // Rolagem de Dados de D&D
        if (msg.tipo === "dado" && msg.teste) {
          const t = msg.teste;
          return (
            <div key={msg.id} className="flex justify-center animate-fadeIn my-2">
              <div
                className={`max-w-lg w-full p-4 rounded-xl border shadow-lg transition-all ${
                  t.critico_sucesso
                    ? "bg-amber-950/40 border-amber-400/80 ring-2 ring-amber-400/30"
                    : t.falha_critica
                    ? "bg-red-950/40 border-red-500/80 ring-2 ring-red-500/30"
                    : t.sucesso
                    ? "bg-stone-900 border-emerald-600/50"
                    : "bg-stone-900 border-stone-700"
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-300 font-serif">
                    <Dices className="w-4 h-4 text-amber-400" />
                    <span>Rolagem de D&D 5e: Teste de {t.atributo}</span>
                  </div>
                  <span className="text-[10px] text-stone-500">{msg.timestamp}</span>
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <div className="text-xs text-stone-400">
                      Dado: <strong className="text-stone-200">d20 ({t.dados_rolados.join(", ")})</strong>{" "}
                      → Base {t.resultado_bruto}
                    </div>
                    <div className="text-xs text-stone-400">
                      Modificador de {t.atributo}:{" "}
                      <strong className="text-amber-300 font-mono">
                        {t.modificador >= 0 ? `+${t.modificador}` : t.modificador}
                      </strong>
                    </div>
                    <div className="text-xs text-stone-400">
                      Dificuldade: <strong className="text-stone-300">CD {t.dificuldade}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold font-mono text-stone-100">
                      {t.total}
                    </div>
                    <div className="mt-0.5">
                      {t.critico_sucesso ? (
                        <span className="text-xs font-bold text-amber-300 flex items-center justify-end gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Sucesso Crítico!
                        </span>
                      ) : t.falha_critica ? (
                        <span className="text-xs font-bold text-red-400 flex items-center justify-end gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Falha Crítica!
                        </span>
                      ) : t.sucesso ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sucesso!
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-stone-400">Falha</span>
                      )}
                    </div>
                  </div>
                </div>

                {t.telegram_format && (
                  <details className="mt-2 text-[11px] text-stone-500">
                    <summary className="cursor-pointer hover:text-stone-400">
                      Ver formato Telegram Markdown
                    </summary>
                    <pre className="mt-1 p-2 rounded bg-stone-950 font-mono text-[10px] text-stone-400 whitespace-pre-wrap">
                      {t.telegram_format}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          );
        }

        // Orientação Especial Solicitada quando os jogadores estão com dificuldades
        const isOrientacao = msg.tipo === "sugestoes" || msg.titulo?.includes("Orientação") || msg.titulo?.includes("Desfecho");
        if (isOrientacao) {
          return (
            <div key={msg.id} className="flex justify-start animate-fadeIn">
              <div className="max-w-2xl p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/50 text-stone-200 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-amber-800/40 pb-2">
                  <div className="flex items-center gap-2 font-serif">
                    <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    <span>{msg.titulo || "Orientação do Mestre: Rumo ao Desfecho"}</span>
                  </div>
                  <span className="text-[10px] text-stone-500">{msg.timestamp}</span>
                </div>

                <div className="text-sm leading-relaxed text-amber-100/90 whitespace-pre-line">
                  {msg.conteudo}
                </div>

                {/* Caminhos Sugeridos para o Desfecho */}
                {msg.sugestoes && msg.sugestoes.length > 0 && (
                  <div className="pt-2 border-t border-amber-800/40 space-y-2">
                    <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>Caminhos sugeridos para destravar o clímax da aventura:</span>
                    </div>
                    <div className="space-y-2">
                      {msg.sugestoes.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onSelectSuggestion({ acao: sug.acao, cd: sug.cd })}
                          className="w-full text-left p-3 rounded-xl bg-stone-950/80 hover:bg-stone-950 border border-amber-700/40 hover:border-amber-500 transition-all flex items-start justify-between gap-3 group cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-amber-200 group-hover:text-amber-100 flex items-center gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                              <span>{sug.risco || `Caminho ${idx + 1}`}</span>
                            </div>
                            <p className="text-xs text-stone-300 pl-5">
                              {sug.acao}
                            </p>
                          </div>
                          {sug.cd && (
                            <span className="text-[10px] px-2 py-1 rounded bg-stone-900 border border-stone-800 text-amber-300 font-mono shrink-0">
                              CD {sug.cd} {sug.atributo ? `(${sug.atributo.slice(0, 3)})` : ""}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Narrativa Normal do Mestre da Masmorra (Ações Livres)
        return (
          <div key={msg.id} className="flex justify-start animate-fadeIn">
            <div className="max-w-2xl p-5 rounded-2xl rounded-tl-xs bg-stone-900/90 border border-amber-900/30 text-stone-200 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-stone-800/80 pb-2">
                <div className="flex items-center gap-2 font-serif">
                  <div className="w-6 h-6 rounded-md bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-xs">
                    ⚔️
                  </div>
                  <span>{msg.titulo || "Mestre da Masmorra"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {msg.source && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        msg.source === "gemini"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                          : "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                      }`}
                    >
                      {msg.source === "gemini" ? "Gemini AI" : "Offline"}
                    </span>
                  )}
                  <span className="text-[10px] text-stone-500">{msg.timestamp}</span>
                </div>
              </div>

              {/* Narrativa sem sugestões intrusivas, deixando a ação livre */}
              <div className="text-sm leading-relaxed text-stone-200 whitespace-pre-line space-y-2">
                {msg.conteudo}
              </div>

              {/* Bonificação / Revelação do Caminho Conquistada por Sucesso */}
              {msg.bonificacao && (
                <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-amber-950/70 via-stone-950 to-stone-900 border-2 border-amber-500/60 shadow-lg shadow-amber-950/40 space-y-2.5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/40 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-sm shadow-inner">
                        {msg.bonificacao.tipo === "revelacao_caminho" ? (
                          <Compass className="w-4 h-4 text-amber-400" />
                        ) : msg.bonificacao.tipo === "segredo_desvendado" ? (
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {msg.bonificacao.tipo === "revelacao_caminho"
                            ? "Caminho Correto Revelado"
                            : msg.bonificacao.tipo === "vantagem_tatica"
                            ? "Vantagem Tática Desbloqueada"
                            : msg.bonificacao.tipo === "segredo_desvendado"
                            ? "Segredo Desvendado com Sucesso"
                            : "Bonificação Conquistada"}
                        </span>
                        <h4 className="text-sm font-bold font-serif text-amber-100">
                          {msg.bonificacao.titulo}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-200 border border-amber-600/50 font-medium">
                      🎁 Bonificação por Sucesso
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                    {msg.bonificacao.descricao}
                  </p>

                  {msg.bonificacao.efeitoMecanico && (
                    <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 px-3 py-2 rounded-lg border border-amber-800/60">
                      <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong className="text-amber-200 font-semibold">Efeito / Vantagem Mecânica:</strong>{" "}
                        {msg.bonificacao.efeitoMecanico}
                      </span>
                    </div>
                  )}

                  {msg.bonificacao.caminhoSugerido && (
                    <button
                      type="button"
                      onClick={() => onSelectSuggestion({ acao: msg.bonificacao!.caminhoSugerido! })}
                      className="w-full mt-1 flex items-center justify-between p-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-xs font-semibold text-amber-200 hover:text-white transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                        <span>Seguir o caminho revelado: "{msg.bonificacao.caminhoSugerido}"</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              )}

              {/* Penalidade por Falha & Perda de Turno (Algo Ruim Aconteceu) */}
              {msg.penalidadeFalha && (
                <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-red-950/80 via-stone-950 to-stone-900 border-2 border-red-600/70 shadow-lg shadow-red-950/50 space-y-2.5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-800/40 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 text-sm shadow-inner">
                        <AlertOctagon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                          <Skull className="w-3 h-3 text-red-400" />
                          Falha no Teste • Consequência Negativa
                        </span>
                        <h4 className="text-sm font-bold font-serif text-red-100">
                          {msg.penalidadeFalha.titulo}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-900/60 text-red-200 border border-red-600/50 font-bold uppercase tracking-wide">
                      ⏳ Turno Perdido
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                    {msg.penalidadeFalha.descricao}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {msg.penalidadeFalha.danoSofrido !== undefined && msg.penalidadeFalha.danoSofrido > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-red-300 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-700/60 font-semibold">
                        <span>💥 -{msg.penalidadeFalha.danoSofrido} PV Perdidos</span>
                      </div>
                    )}
                    {msg.penalidadeFalha.condicao && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/60 font-medium">
                        <span>⚠️ Condição: {msg.penalidadeFalha.condicao}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800 font-medium">
                      <Hourglass className="w-3 h-3 text-amber-400" />
                      <span>
                        {msg.penalidadeFalha.proximoJogadorNome
                          ? `Ação anulada • Vez de ${msg.penalidadeFalha.proximoJogadorNome}`
                          : "Ação anulada • A vez passa para o próximo jogador"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recompensa de XP por Interpretação / Roleplay (Entrou no Personagem) */}
              {msg.recompensaXP && (
                <div className={`mt-3 p-3.5 rounded-xl border shadow-md space-y-2 animate-fadeIn ${
                  msg.recompensaXP.subiuDeNivel
                    ? "bg-gradient-to-r from-amber-950 via-yellow-950/70 to-stone-900 border-yellow-500 ring-2 ring-yellow-400/40"
                    : msg.recompensaXP.desempenhoRoleplay === "Excepcional"
                    ? "bg-gradient-to-r from-purple-950/60 via-stone-950 to-stone-900 border-purple-500/60"
                    : "bg-stone-950/70 border-amber-600/30"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-inner ${
                        msg.recompensaXP.subiuDeNivel
                          ? "bg-yellow-500 text-stone-950 font-black animate-bounce"
                          : msg.recompensaXP.desempenhoRoleplay === "Excepcional"
                          ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                          : "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {msg.recompensaXP.subiuDeNivel ? (
                          <Trophy className="w-3.5 h-3.5" />
                        ) : (
                          <Award className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Recompensa de Interpretação • Roleplay
                        </span>
                        <h4 className="text-xs font-bold font-serif text-stone-200">
                          {msg.recompensaXP.desempenhoRoleplay === "Excepcional"
                            ? "🎭 Interpretação Excepcional do Personagem!"
                            : msg.recompensaXP.desempenhoRoleplay === "Bom"
                            ? "✨ Boa Imersão & Postura de Aventureiro"
                            : "🎲 Experiência de Aventura Adquirida"}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs">
                        +{msg.recompensaXP.xpGanho} XP
                      </span>
                      {msg.recompensaXP.subiuDeNivel && (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-stone-950 font-black text-[10px] tracking-wide animate-pulse">
                          🎉 NÍVEL {msg.recompensaXP.novoNivel}!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Motivo do Roleplay */}
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    "{msg.recompensaXP.motivoRoleplay}"
                  </p>

                  {/* Progresso de XP na Régua */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <span>Total: {msg.recompensaXP.xpTotal} XP</span>
                      <span>Próximo Nível: {msg.recompensaXP.xpProximoNivel} XP</span>
                    </div>
                    <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden mt-1 border border-stone-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all"
                        style={{
                          width: `${Math.min(100, Math.round((msg.recompensaXP.xpTotal / (msg.recompensaXP.xpProximoNivel || 300)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator */}
      {isProcessing && (
        <div className="flex justify-start animate-fadeIn">
          <div className="p-4 rounded-xl bg-stone-900/80 border border-amber-900/30 text-xs text-amber-300 flex items-center gap-3">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>O Mestre está consultando os deuses e orquestrando o destino...</span>
          </div>
        </div>
      )}

      <div ref={feedEndRef} />
    </div>
  );
}
