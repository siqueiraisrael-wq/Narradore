import React, { useState } from "react";
import { X, Swords, Dices, Trophy, Zap, UserCheck, Shield, Crown, CheckCircle2, RotateCcw } from "lucide-react";
import { Personagem } from "../types";

interface IniciativaModalProps {
  isOpen: boolean;
  onClose: () => void;
  personagens: Personagem[];
  onAplicarNovaOrdem: (
    novaOrdemPersonagens: Personagem[],
    mensagemNarrativa: string,
    vencedorNome: string
  ) => void;
}

interface ResultadoDisputa {
  personagem: Personagem;
  dadoBruto: number;
  modificador: number;
  total: number;
  critico: boolean;
}

export function IniciativaModal({
  isOpen,
  onClose,
  personagens,
  onAplicarNovaOrdem,
}: IniciativaModalProps) {
  // IDs dos jogadores que apertaram o botão de reivindicar iniciativa
  const [jogadoresIniciativaIds, setJogadoresIniciativaIds] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [resultados, setResultados] = useState<ResultadoDisputa[] | null>(null);

  if (!isOpen) return null;

  const totalDisputantes = jogadoresIniciativaIds.length;

  // Alternar reivindicação de iniciativa de um jogador específico
  const handleToggleJogador = (id: string) => {
    if (isRolling || resultados) return;
    setJogadoresIniciativaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Botão rápido: todos os jogadores da mesa querem disputar
  const handleSelecionarTodos = () => {
    if (isRolling || resultados) return;
    setJogadoresIniciativaIds(personagens.map((p, idx) => p.id || `char-${idx}`));
  };

  // Limpar seleção
  const handleLimparSelecao = () => {
    if (isRolling) return;
    setJogadoresIniciativaIds([]);
    setResultados(null);
  };

  // CASO 1: Apenas 1 jogador apertou -> Ganha iniciativa garantida imediatamente
  const handleGarantirIniciativaUnico = () => {
    if (totalDisputantes !== 1) return;
    const jogadorId = jogadoresIniciativaIds[0];
    const jogadorUnico = personagens.find(
      (p, idx) => (p.id || `char-${idx}`) === jogadorId
    );

    if (!jogadorUnico) return;

    // Coloca o jogador único no topo da fila de iniciativa
    const outros = personagens.filter(
      (p, idx) => (p.id || `char-${idx}`) !== jogadorId
    );
    const novaOrdem = [jogadorUnico, ...outros];

    const nomeFormatado = jogadorUnico.jogadorNome
      ? `${jogadorUnico.jogadorNome} (${jogadorUnico.nome})`
      : jogadorUnico.nome;

    const mensagem = `⚡ Iniciativa Garantida na Sala! ${nomeFormatado} foi o único a reivindicar a iniciativa e assume a primeira jogada imediatamente, sem necessidade de rolagem de dados.`;

    onAplicarNovaOrdem(novaOrdem, mensagem, jogadorUnico.nome);
    onClose();
  };

  // CASO 2: Mais de 1 jogador apertou -> Disputa no d20 + Modificador de Destreza
  const handleRolarDisputa = () => {
    if (totalDisputantes <= 1) return;
    setIsRolling(true);

    setTimeout(() => {
      const disputantes = personagens.filter((p, idx) =>
        jogadoresIniciativaIds.includes(p.id || `char-${idx}`)
      );

      const resultadosRolados: ResultadoDisputa[] = disputantes.map((p) => {
        const dadoBruto = Math.floor(Math.random() * 20) + 1;
        // Modificador canônico de iniciativa = Modificador de Destreza
        const destreza = p.atributos?.Destreza ?? 10;
        const modDestreza = Math.floor((destreza - 10) / 2);
        const modificador = p.iniciativa !== undefined ? p.iniciativa : modDestreza;
        const total = dadoBruto + modificador;

        return {
          personagem: p,
          dadoBruto,
          modificador,
          total,
          critico: dadoBruto === 20,
        };
      });

      // Ordena por maior total decrescente (desempate por maior Destreza/modificador)
      resultadosRolados.sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return b.modificador - a.modificador;
      });

      setResultados(resultadosRolados);
      setIsRolling(false);
    }, 800);
  };

  // Confirmar e aplicar a ordem resultante da disputa de dados
  const handleAplicarOrdemDados = () => {
    if (!resultados || resultados.length === 0) return;

    const disputantesOrdenados = resultados.map((r) => r.personagem);
    const disputantesIds = disputantesOrdenados.map((p, idx) => p.id || `char-${idx}`);

    // Os que não disputaram entram na sequência
    const naoDisputantes = personagens.filter(
      (p, idx) => !disputantesIds.includes(p.id || `char-${idx}`)
    );

    const novaOrdem = [...disputantesOrdenados, ...naoDisputantes];
    const vencedor = resultados[0];
    const vencedorNome = vencedor.personagem.jogadorNome
      ? `${vencedor.personagem.jogadorNome} (${vencedor.personagem.nome})`
      : vencedor.personagem.nome;

    const detalhesRolagens = resultados
      .map(
        (r, idx) =>
          `#${idx + 1} ${r.personagem.nome}: Total ${r.total} [d20: ${r.dadoBruto} ${r.modificador >= 0 ? `+${r.modificador}` : r.modificador} Des]`
      )
      .join(" • ");

    const mensagem = `⚔️ Disputa de Iniciativa na Sala! Vencedor da primeira jogada: 👑 ${vencedorNome} com Total ${vencedor.total} no d20! (${detalhesRolagens}). A ordem de ações da sala foi redefinida.`;

    onAplicarNovaOrdem(novaOrdem, mensagem, vencedor.personagem.nome);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Swords className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif text-amber-100">
                  Disputa de Iniciativa da Sala
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold uppercase border border-amber-500/30">
                  D&D 5e
                </span>
              </div>
              <p className="text-xs text-stone-400">
                O grupo adentrou um novo recinto ou cena. Quem deseja agir primeiro?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-stone-800">
          {/* Instrução com Regras Claras da Iniciativa */}
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Como funciona a Reivindicação de Iniciativa:</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              • Se <strong>apenas 1 jogador</strong> apertar o botão, ele tem a <strong>iniciativa garantida</strong> sem precisar rolar dados.
              <br />
              • Se <strong>mais de um jogador</strong> apertar, todos na fila rolam <strong>d20 + Modificador de Destreza</strong>. Quem tiver o maior total assume a primeira jogada, e a ordem segue em ordem decrescente!
            </p>
          </div>

          {/* Lista de Jogadores e Botão "Eu Quero a Iniciativa!" */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Aventureiros na Mesa ({totalDisputantes}/{personagens.length} na fila)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelecionarTodos}
                  disabled={isRolling || !!resultados}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer disabled:opacity-50"
                >
                  Selecionar Todos
                </button>
                <span className="text-stone-700">•</span>
                <button
                  type="button"
                  onClick={handleLimparSelecao}
                  disabled={isRolling || totalDisputantes === 0}
                  className="text-xs text-stone-400 hover:text-stone-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {personagens.map((p, index) => {
                const charId = p.id || `char-${index}`;
                const reivindicou = jogadoresIniciativaIds.includes(charId);
                const modDes = Math.floor(((p.atributos?.Destreza ?? 10) - 10) / 2);
                const modInic = p.iniciativa !== undefined ? p.iniciativa : modDes;

                return (
                  <div
                    key={charId}
                    onClick={() => handleToggleJogador(charId)}
                    className={`p-3 rounded-xl border transition-all select-none cursor-pointer flex items-center justify-between gap-3 ${
                      reivindicou
                        ? "bg-gradient-to-r from-amber-950/80 to-stone-900 border-amber-500 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/40"
                        : "bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          reivindicou
                            ? "bg-amber-500 text-stone-950 shadow-inner font-black"
                            : "bg-stone-800 text-stone-400 border border-stone-700"
                        }`}
                      >
                        {reivindicou ? <CheckCircle2 className="w-4 h-4" /> : `#${index + 1}`}
                      </div>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${reivindicou ? "text-amber-100" : "text-stone-200"}`}>
                            {p.nome}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                          <span>{p.jogadorNome || p.classe}</span>
                          <span>•</span>
                          <span className="font-mono text-amber-400/90 font-semibold">
                            Inic: {modInic >= 0 ? `+${modInic}` : modInic}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 pointer-events-none ${
                        reivindicou
                          ? "bg-amber-500 text-stone-950 shadow-sm"
                          : "bg-stone-900 border border-stone-700 text-stone-300"
                      }`}
                    >
                      {reivindicou ? "Na Fila ✓" : "Quero Agir"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Painel Dinâmico de Resolução de Acordo com os Participantes */}
          <div className="pt-2">
            {/* Estado 0: Ninguém na fila */}
            {totalDisputantes === 0 && (
              <div className="p-4 rounded-xl bg-stone-950/40 border border-dashed border-stone-800 text-center text-xs text-stone-400">
                Toque em <strong>"Quero Agir"</strong> no herói correspondente para entrar na fila da primeira jogada.
              </div>
            )}

            {/* Estado 1: APENAS 1 JOGADOR APERTOU -> INICIATIVA GARANTIDA */}
            {totalDisputantes === 1 && !resultados && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/70 via-stone-950 to-stone-900 border-2 border-amber-500/70 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2.5 text-amber-300">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif text-amber-100">
                      Iniciativa Garantida!
                    </h4>
                    <span className="text-[11px] text-amber-300/80">
                      Apenas 1 aventureiro reivindicou a primeira jogada.
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-200">
                  Como nenhum outro membro da mesa disputou o momento, a ação inicial é concedida automaticamente sem necessidade de rolagem de dados.
                </p>

                <button
                  type="button"
                  id="btn-confirmar-iniciativa-unica"
                  onClick={handleGarantirIniciativaUnico}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span>Garantir 1ª Jogada & Iniciar Rodada</span>
                </button>
              </div>
            )}

            {/* Estado 2: MAIS DE 1 JOGADOR APERTOU -> DISPUTA NOS DADOS */}
            {totalDisputantes > 1 && !resultados && (
              <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-700/50 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Swords className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold font-serif">
                      Disputa Acirrada ({totalDisputantes} jogadores querem agir primeiro)
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    d20 + Destreza
                  </span>
                </div>

                <p className="text-xs text-stone-300">
                  Vários aventureiros desejam a primeira iniciativa nesta sala. Role os dados para determinar quem reage com maior velocidade!
                </p>

                <button
                  type="button"
                  id="btn-rolar-iniciativa-disputa"
                  onClick={handleRolarDisputa}
                  disabled={isRolling}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Dices className={`w-4 h-4 ${isRolling ? "animate-spin" : ""}`} />
                  <span>{isRolling ? "Rolando d20 para Todos..." : "Rolar Dados de Iniciativa (d20)"}</span>
                </button>
              </div>
            )}

            {/* Resultados da Rolagem da Disputa */}
            {resultados && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                      Ordem Conquistada nos Dados
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRolarDisputa}
                    className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Rolar novamente
                  </button>
                </div>

                <div className="space-y-2">
                  {resultados.map((res, rank) => {
                    const ehVencedor = rank === 0;
                    return (
                      <div
                        key={res.personagem.id || `res-${rank}`}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          ehVencedor
                            ? "bg-gradient-to-r from-amber-950/90 via-stone-900 to-stone-950 border-amber-400 shadow-md ring-1 ring-amber-400/40"
                            : "bg-stone-950/60 border-stone-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                              ehVencedor
                                ? "bg-amber-500 text-stone-950 shadow-inner"
                                : "bg-stone-800 text-stone-400"
                            }`}
                          >
                            {ehVencedor ? <Crown className="w-4 h-4 text-stone-950" /> : `#${rank + 1}`}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${ehVencedor ? "text-amber-100" : "text-stone-300"}`}>
                                {res.personagem.nome}
                              </span>
                              {ehVencedor && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
                                  1ª Jogada
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">
                              {res.personagem.jogadorNome || res.personagem.classe}
                            </span>
                          </div>
                        </div>

                        {/* Detalhes do Dado e Total */}
                        <div className="flex items-center gap-3">
                          <div className="text-right text-[11px] text-stone-400 font-mono">
                            <span>d20: </span>
                            <span className="font-bold text-stone-200">{res.dadoBruto}</span>
                            <span> {res.modificador >= 0 ? `+ ${res.modificador}` : `- ${Math.abs(res.modificador)}`} Des</span>
                          </div>
                          <div
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-black border ${
                              ehVencedor
                                ? "bg-amber-500/20 border-amber-500 text-amber-200 text-sm shadow-inner"
                                : "bg-stone-900 border-stone-800 text-stone-300 text-xs"
                            }`}
                          >
                            <span className="leading-none">{res.total}</span>
                            <span className="text-[8px] font-sans font-normal text-stone-400 leading-none mt-0.5">Total</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  id="btn-aplicar-ordem-iniciativa"
                  onClick={handleAplicarOrdemDados}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Swords className="w-4 h-4" />
                  <span>Aplicar Nova Ordem de Ações & Começar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-3 bg-stone-950/90 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span>
            {totalDisputantes === 0
              ? "Nenhum jogador na disputa."
              : totalDisputantes === 1
              ? "1 jogador pronto (iniciativa garantida)."
              : `${totalDisputantes} jogadores na disputa (resolução por d20).`}
          </span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 transition-colors font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
