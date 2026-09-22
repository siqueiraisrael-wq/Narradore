import { useState } from "react";
import { Users, UserPlus, Sparkles, Shield, Heart, Eye, Trash2, Swords, Compass, BookOpen } from "lucide-react";
import { Personagem } from "../types";

interface LobbyMesaProps {
  personagens: Personagem[];
  onOpenCreator: () => void;
  onOpenSheet: (personagem: Personagem) => void;
  onRemoveCharacter: (index: number) => void;
  onStartAdventure: (tema?: string) => Promise<void>;
  isProcessing: boolean;
}

const TEMAS_AVENTURA = [
  {
    titulo: "Os Rumores da Taverna do Javali Saltitante",
    desc: "Ao redor da lareira com cerveja e hidromel, o taverneiro e viajantes feridos relatam demônios atacando o santuário ao norte.",
    icone: "🍺",
  },
  {
    titulo: "O Gabinete do Alcaide em Porto Tempestade",
    desc: "O prefeito convoca os heróis com urgência para organizar a defesa da cidade contra um ataque iminente de piratas.",
    icone: "🏛️",
  },
  {
    titulo: "A Audiência Real no Castelo de Pedra Alta",
    desc: "Perante o trono do Rei Aldus, os heróis recebem a missão da coroa para deter um mal despertando nas criptas.",
    icone: "👑",
  },
  {
    titulo: "A Estalagem da Colina & As Minas de Phandelver",
    desc: "O anão minerador Gundren Rockseeker divide pão e canecos na estalagem e propõe o contrato de escolta da expedição.",
    icone: "⛏️",
  },
];

export function LobbyMesa({
  personagens,
  onOpenCreator,
  onOpenSheet,
  onRemoveCharacter,
  onStartAdventure,
  isProcessing,
}: LobbyMesaProps) {
  const [temaCustom, setTemaCustom] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState(TEMAS_AVENTURA[0].titulo);

  const handleStart = () => {
    const temaFinal = temaCustom.trim() || temaSelecionado;
    onStartAdventure(temaFinal);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Banner Principal de Boas-vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/40 border border-amber-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Livro do Jogador • 5ª Edição</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 leading-tight">
            Preparação da Mesa de Aventura
          </h1>

          <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
            Antes de adentrar a masmorra, cada jogador participante deve criar a sua ficha de forma dinâmica. Escolha nome, raça e classe com todas as suas vantagens e desvantagens, descreva os arquétipos e deixe a IA tecer uma biografia exclusiva para o seu herói!
          </p>
        </div>
      </div>

      {/* Seção dos Jogadores da Mesa */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-serif text-amber-100">
              Jogadores na Mesa ({personagens.length})
            </h2>
          </div>

          <button
            type="button"
            id="btn-add-player-lobby"
            onClick={onOpenCreator}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Criar Ficha de Novo Jogador</span>
          </button>
        </div>

        {/* Lista de Fichas Criadas */}
        {personagens.length === 0 ? (
          <div className="p-8 rounded-2xl bg-stone-900/60 border border-dashed border-stone-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-200">Nenhum aventureiro na mesa ainda</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Cada jogador participante deve criar sua ficha dinâmica antes de iniciar a campanha.
              </p>
            </div>
            <button
              type="button"
              id="btn-first-player-create"
              onClick={onOpenCreator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Ficha do 1º Jogador</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personagens.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-700/50 transition-all shadow-md flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-lg shrink-0">
                      {p.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-100 text-base font-serif">
                          {p.nome}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                          {p.jogadorNome || `Jogador ${idx + 1}`}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400/90 font-medium">
                        {p.raca} • {p.classe} (Nível {p.nivel})
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-400" />
                          <span>{p.pvAtual}/{p.pvMax} PV</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span>CA {p.ca}</span>
                        </span>
                        <span>{p.tendencia}</span>
                      </div>
                    </div>
                  </div>

                  {personagens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveCharacter(idx)}
                      title="Remover personagem da mesa"
                      className="text-stone-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Resumo da História Gerada pela IA */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-300">
                  <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                    História do Personagem (Gerada pela IA):
                  </span>
                  <p className="line-clamp-2 italic text-stone-400 text-[11px] leading-relaxed">
                    "{p.historia}"
                  </p>
                </div>

                {/* Botões do Card */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                  <button
                    type="button"
                    onClick={() => onOpenSheet(p)}
                    className="text-xs text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1.5 py-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Ficha Completa</span>
                  </button>

                  <span className="text-[10px] text-stone-500">
                    Livro do Jogador D&D 5e
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escolha do Tema e Início da Aventura */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/80 border border-amber-900/30 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold font-serif text-amber-100">
            Cenário da Aventura
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMAS_AVENTURA.map((t) => (
            <button
              key={t.titulo}
              type="button"
              onClick={() => {
                setTemaSelecionado(t.titulo);
                setTemaCustom("");
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                temaSelecionado === t.titulo && !temaCustom
                  ? "bg-amber-600/15 border-amber-500 text-stone-100 ring-1 ring-amber-500/30"
                  : "bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700"
              }`}
            >
              <span className="text-2xl shrink-0">{t.icone}</span>
              <div>
                <div className="font-bold text-xs text-amber-200">{t.titulo}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-400 mb-1.5">
            Ou defina um tema personalizado para a narração do Mestre:
          </label>
          <input
            type="text"
            value={temaCustom}
            onChange={(e) => setTemaCustom(e.target.value)}
            placeholder="Ex: Uma expedição para resgatar uma princesa elfa nas Ruínas de Myth Drannor..."
            className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-xs text-stone-100 placeholder-stone-600 outline-hidden"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            id="btn-start-adventure-ready"
            onClick={handleStart}
            disabled={personagens.length === 0 || isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>O Mestre está tecendo a introdução da campanha...</span>
              </>
            ) : (
              <>
                <Swords className="w-5 h-5" />
                <span>
                  Iniciar Aventura com o Grupo ({personagens.length}{" "}
                  {personagens.length === 1 ? "Personagem" : "Personagens"})
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
