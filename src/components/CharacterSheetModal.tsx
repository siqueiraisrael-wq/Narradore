import { useState } from "react";
import {
  X,
  Shield,
  Heart,
  Zap,
  Eye,
  Backpack,
  BookOpen,
  Dices,
  Award,
  Coins,
  CheckCircle2,
  Compass,
  Footprints,
  Sparkles,
  Trophy,
  Star
} from "lucide-react";
import { Personagem, AtributoDnd } from "../types";
import { calcularXpProximoNivel, TABELA_XP_DND } from "../data/livroDoJogadorData";

interface CharacterSheetModalProps {
  personagem: Personagem;
  isOpen: boolean;
  onClose: () => void;
  onRollAttribute: (atributo: AtributoDnd, valor: number) => void;
  onUpdateHp: (novoPv: number) => void;
  initialTab?: "combate" | "pericias" | "interpretacao" | "equipamento";
}

const ATTR_ICONS: Record<string, string> = {
  Força: "💪",
  Destreza: "🏃",
  Constituição: "❤️",
  Inteligência: "🧠",
  Sabedoria: "👁️",
  Carisma: "✨",
};

export function CharacterSheetModal({
  personagem,
  isOpen,
  onClose,
  onRollAttribute,
  onUpdateHp,
  initialTab = "combate",
}: CharacterSheetModalProps) {
  const [tabAtiva, setTabAtiva] = useState<"combate" | "pericias" | "interpretacao" | "equipamento">(initialTab);

  if (!isOpen) return null;

  const getModNumber = (val: number) => Math.floor((val - 10) / 2);
  const getMod = (val: number) => {
    const mod = getModNumber(val);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const desMod = getModNumber(personagem.atributos.Destreza || 10);
  const sabMod = getModNumber(personagem.atributos.Sabedoria || 10);
  const bonusProf = personagem.bonusProficiencia || 2;
  const percepcaoPassiva = 10 + sabMod + (personagem.periciasProficientes?.includes("Percepção") ? bonusProf : 0);

  const atributosList: AtributoDnd[] = [
    "Força",
    "Destreza",
    "Constituição",
    "Inteligência",
    "Sabedoria",
    "Carisma",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-stone-900 border border-amber-800/40 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col text-stone-200 overflow-hidden">
        
        {/* Modal Header com Cabeçalho Oficial do Livro do Jogador */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-200 font-serif font-bold text-xl shadow-inner">
                {personagem.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif text-amber-100">{personagem.nome}</h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Nível {personagem.nivel || 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-purple-300" />
                    {personagem.xp || 0} XP
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {personagem.raca} • {personagem.classe} • {personagem.antecedente || "Aventureiro"} • {personagem.tendencia || "Neutro"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs font-mono">
                <span className="text-stone-400 text-[10px]">Próximo Nível ({ (personagem.nivel || 1) + 1 })</span>
                <span className="text-amber-300 font-bold">{personagem.xp || 0} / {calcularXpProximoNivel(personagem.nivel || 1)} XP</span>
              </div>
              <button
                id="btn-close-sheet"
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Fechar ficha"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Barra de Progresso de XP */}
          <div className="mt-3">
            <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800/80">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((personagem.xp || 0) / calcularXpProximoNivel(personagem.nivel || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Abas Internas da Ficha */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-stone-800/80 text-xs">
            {[
              { id: "combate", label: "Atributos & Combate" },
              { id: "pericias", label: "Perícias & Salvaguardas" },
              { id: "interpretacao", label: "Personalidade & História" },
              { id: "equipamento", label: "Inventário & Moedas" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabAtiva(tab.id as any)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  tabAtiva === tab.id
                    ? "bg-amber-600 text-stone-950 font-bold"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ABA 1: ATRIBUTOS & COMBATE */}
          {tabAtiva === "combate" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Vitals Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* PV Card */}
                <div className="bg-stone-950/60 p-3 rounded-xl border border-red-900/40 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mb-1">
                    <Heart className="w-3.5 h-3.5 fill-red-400" />
                    Pontos de Vida
                  </div>
                  <div className="text-2xl font-bold text-stone-100 flex items-baseline gap-1">
                    <span>{personagem.pvAtual}</span>
                    <span className="text-xs text-stone-500 font-normal">/ {personagem.pvMax}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <button
                      id="btn-hp-minus"
                      onClick={() => onUpdateHp(Math.max(0, personagem.pvAtual - 1))}
                      className="px-2.5 py-0.5 rounded bg-stone-800 hover:bg-red-900/50 text-red-300 text-xs font-bold transition-colors border border-stone-700"
                    >
                      -1
                    </button>
                    <button
                      id="btn-hp-plus"
                      onClick={() => onUpdateHp(Math.min(personagem.pvMax, personagem.pvAtual + 1))}
                      className="px-2.5 py-0.5 rounded bg-stone-800 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold transition-colors border border-stone-700"
                    >
                      +1
                    </button>
                  </div>
                </div>

                {/* CA Card */}
                <div className="bg-stone-950/60 p-3 rounded-xl border border-amber-900/40 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    Classe de Armadura
                  </div>
                  <div className="text-2xl font-bold text-stone-100">{personagem.ca}</div>
                  <span className="text-[10px] text-stone-400 mt-1">Armadura + Destreza</span>
                </div>

                {/* Iniciativa & Deslocamento */}
                <div className="bg-stone-950/60 p-3 rounded-xl border border-sky-900/40 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    Iniciativa
                  </div>
                  <div className="text-2xl font-bold text-stone-100 font-mono">
                    {desMod >= 0 ? `+${desMod}` : desMod}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1">
                    Desloc: {personagem.deslocamento || "9m (30ft)"}
                  </span>
                </div>

                {/* Bônus de Proficiência */}
                <div className="bg-stone-950/60 p-3 rounded-xl border border-purple-900/40 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
                    <Award className="w-3.5 h-3.5" />
                    Bônus de Proficiência
                  </div>
                  <div className="text-2xl font-bold text-amber-400 font-mono">
                    +{bonusProf}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1">
                    Percepção Passiva: {percepcaoPassiva}
                  </span>
                </div>
              </div>

              {/* Painel de Experiência & Progressão de Nível D&D 5e */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-stone-950 via-purple-950/20 to-stone-900 border border-purple-900/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        Progressão de Nível & Pontos de Experiência (XP)
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Regra oficial do Livro do Jogador (D&D 5e): XP bonificado periodicamente por interpretação e roleplay fiel.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-stone-900/90 px-3 py-1 rounded-lg border border-stone-800">
                      XP Atual: {personagem.xp || 0} / {calcularXpProximoNivel(personagem.nivel || 1)}
                    </span>
                  </div>
                </div>

                {/* Régua visual */}
                <div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-yellow-400"
                      style={{
                        width: `${Math.min(100, Math.round(((personagem.xp || 0) / calcularXpProximoNivel(personagem.nivel || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                    <span>Nível Atual ({personagem.nivel || 1})</span>
                    <span>
                      Faltam {Math.max(0, calcularXpProximoNivel(personagem.nivel || 1) - (personagem.xp || 0))} XP para o Nível {(personagem.nivel || 1) + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Atributos D&D 5e */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Os 6 Atributos Clássicos (Clique para rolar teste)
                  </h3>
                  <span className="text-xs text-stone-400">1d20 + Modificador</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {atributosList.map((attr) => {
                    const valor = personagem.atributos[attr] || 10;
                    const modStr = getMod(valor);
                    return (
                      <button
                        key={attr}
                        id={`btn-roll-attr-${attr.toLowerCase()}`}
                        onClick={() => onRollAttribute(attr, valor)}
                        className="p-3.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800 hover:border-amber-500/50 transition-all text-left flex items-center justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-stone-400 group-hover:text-amber-300 transition-colors">
                            <span>{ATTR_ICONS[attr] || "🎲"}</span>
                            <span>{attr}</span>
                          </div>
                          <div className="text-xl font-bold text-stone-100 mt-0.5">{valor}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                            {modStr}
                          </span>
                          <Dices className="w-3.5 h-3.5 text-stone-500 mt-1 group-hover:text-amber-400 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: PERÍCIAS & SALVAGUARDAS */}
          {tabAtiva === "pericias" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Salvaguardas */}
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Salvaguardas / Testes de Resistência:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {atributosList.map((attr) => {
                    const prof = personagem.salvaguardasProficientes?.includes(attr);
                    const baseMod = getModNumber(personagem.atributos[attr] || 10);
                    const totalMod = prof ? baseMod + bonusProf : baseMod;
                    const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;
                    return (
                      <div
                        key={attr}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                          prof
                            ? "bg-amber-950/30 border-amber-600/50 text-amber-200"
                            : "bg-stone-950/40 border-stone-800 text-stone-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${prof ? "bg-amber-400 ring-2 ring-amber-400/30" : "bg-stone-700"}`} />
                          <span className="font-semibold">{attr}</span>
                        </div>
                        <span className="font-mono font-bold">{modStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Perícias do Livro do Jogador */}
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Perícias Proficientes (Livro do Jogador, Cap. 7):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(personagem.periciasProficientes && personagem.periciasProficientes.length > 0
                    ? personagem.periciasProficientes
                    : ["Atletismo", "Percepção", "Sobrevivência"]
                  ).map((per, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-stone-950/60 border border-amber-700/50 text-amber-200 text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      {per} <span className="text-[10px] text-stone-400">(+{bonusProf})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: PERSONALIDADE & HISTÓRIA (CAPÍTULO 4) */}
          {tabAtiva === "interpretacao" && (
            <div className="space-y-4 animate-fadeIn text-xs">
              {/* História */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 space-y-1.5">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Biografia & Origem
                </span>
                <p className="text-stone-300 leading-relaxed italic text-xs sm:text-sm">
                  "{personagem.historia}"
                </p>
              </div>

              {/* Os 4 Pilares da Personalidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-stone-950/40 border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-semibold block text-[11px]">
                    🎭 Traços de Personalidade:
                  </span>
                  <p className="text-stone-300">
                    {personagem.tracosPersonalidade || "Resoluto e destemido perante as adversidades."}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-950/40 border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-semibold block text-[11px]">
                    🌟 Ideais:
                  </span>
                  <p className="text-stone-300">
                    {personagem.ideais || "Honra e Proteção dos inocentes que cruzam meu caminho."}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-950/40 border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-semibold block text-[11px]">
                    🔗 Vínculos:
                  </span>
                  <p className="text-stone-300">
                    {personagem.vinculos || "Minha honra familiar e lealdade aos meus companheiros de armas."}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-950/40 border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-semibold block text-[11px]">
                    ⚠️ Defeitos:
                  </span>
                  <p className="text-stone-300">
                    {personagem.defeitos || "Orgulho relutante em pedir ajuda em momentos de apuro."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: EQUIPAMENTO & MOEDAS */}
          {tabAtiva === "equipamento" && (
            <div className="space-y-4 animate-fadeIn text-xs">
              {/* Algibeira de Moedas (Cap. 5) */}
              <div className="p-4 rounded-xl bg-stone-950/50 border border-amber-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Algibeira do Aventureiro:</span>
                </div>
                <div className="flex gap-3 text-xs font-mono font-bold">
                  <span className="text-amber-300">{personagem.moedas?.po || 15} PO</span>
                  <span className="text-stone-300">{personagem.moedas?.pp || 5} PP</span>
                  <span className="text-amber-600">{personagem.moedas?.pc || 10} PC</span>
                </div>
              </div>

              {/* Lista de Equipamentos */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 space-y-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Backpack className="w-3.5 h-3.5" />
                  Itens & Armas Iniciais (Capítulo 5)
                </span>
                <ul className="divide-y divide-stone-800/60 text-stone-300">
                  {(personagem.equipamento && personagem.equipamento.length > 0
                    ? personagem.equipamento
                    : ["Arma principal da classe", "Armadura inicial", "Kit de exploração", "Algibeira com 10 PO"]
                  ).map((item, idx) => (
                    <li key={idx} className="py-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-400">
          <span>D&D 5ª Edição • Livro do Jogador</span>
          <button
            id="btn-close-sheet-bottom"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
