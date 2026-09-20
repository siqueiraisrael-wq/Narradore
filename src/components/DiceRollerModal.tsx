import { useState } from "react";
import { X, Dices, Award, Zap, Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { Personagem, AtributoDnd, TesteResultado } from "../types";

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  personagem: Personagem | null;
  onSendRollToStory?: (teste: TesteResultado, acaoCustom?: string) => void;
}

const DICE_TYPES = [
  { lados: 20, nome: "d20", icone: "⚔️", desc: "Ataques, testes de perícia e resistência" },
  { lados: 12, nome: "d12", icone: "🟣", desc: "Dano de machados grandes e fúria" },
  { lados: 10, nome: "d10", icone: "🔵", desc: "Dano de alabardas e magias pesadas" },
  { lados: 8, nome: "d8", icone: "🔶", desc: "Dano de espadas longas e curas" },
  { lados: 6, nome: "d6", icone: "🎲", desc: "Ataques furtivos e bolas de fogo" },
  { lados: 4, nome: "d4", icone: "🔷", desc: "Adagas, bênçãos e dardos arcanos" },
];

const CDS = [
  { cd: 10, label: "Fácil (CD 10)" },
  { cd: 12, label: "Moderado (CD 12)" },
  { cd: 15, label: "Difícil (CD 15)" },
  { cd: 18, label: "Muito Difícil (CD 18)" },
  { cd: 20, label: "Heroico (CD 20)" },
];

export function DiceRollerModal({
  isOpen,
  onClose,
  personagem,
  onSendRollToStory,
}: DiceRollerModalProps) {
  const [selectedAttr, setSelectedAttr] = useState<AtributoDnd | "Nenhum">("Força");
  const [cd, setCd] = useState<number>(12);
  const [tipoRolagem, setTipoRolagem] = useState<"normal" | "vantagem" | "desvantagem">("normal");
  const [resultado, setResultado] = useState<TesteResultado | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [acaoDesc, setAcaoDesc] = useState("");

  // Dado Avulso
  const [dadoAvulso, setDadoAvulso] = useState<number>(20);
  const [qtdDados, setQtdDados] = useState<number>(1);
  const [modAvulso, setModAvulso] = useState<number>(0);
  const [resultadoAvulso, setResultadoAvulso] = useState<{ rolados: number[]; total: number } | null>(null);

  if (!isOpen) return null;

  const handleRolarTeste = () => {
    setIsRolling(true);
    setTimeout(() => {
      let d1 = Math.floor(Math.random() * 20) + 1;
      let d2 = Math.floor(Math.random() * 20) + 1;
      let dados_rolados = [d1];
      let resultado_bruto = d1;

      if (tipoRolagem === "vantagem") {
        dados_rolados = [d1, d2];
        resultado_bruto = Math.max(d1, d2);
      } else if (tipoRolagem === "desvantagem") {
        dados_rolados = [d1, d2];
        resultado_bruto = Math.min(d1, d2);
      }

      const valor_atributo = selectedAttr !== "Nenhum" && personagem
        ? personagem.atributos[selectedAttr] || 10
        : 10;
      const modificador = Math.floor((valor_atributo - 10) / 2);
      const total = resultado_bruto + modificador;

      const critico_sucesso = resultado_bruto === 20;
      const falha_critica = resultado_bruto === 1;
      const sucesso = critico_sucesso || (!falha_critica && total >= cd);

      setResultado({
        atributo: selectedAttr === "Nenhum" ? "Geral" : selectedAttr,
        valor_atributo,
        modificador,
        dados_rolados,
        resultado_bruto,
        total,
        dificuldade: cd,
        tipo_rolagem: tipoRolagem,
        critico_sucesso,
        falha_critica,
        sucesso,
      });
      setIsRolling(false);
    }, 350);
  };

  const handleRolarAvulso = () => {
    const rolados: number[] = [];
    for (let i = 0; i < qtdDados; i++) {
      rolados.push(Math.floor(Math.random() * dadoAvulso) + 1);
    }
    const soma = rolados.reduce((a, b) => a + b, 0);
    setResultadoAvulso({ rolados, total: soma + modAvulso });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-stone-900 border border-amber-900/40 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col text-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-amber-100">Torre de Dados D&D 5e</h2>
              <p className="text-xs text-stone-400">
                Rolador oficial de d20 com modificadores, vantagem, desvantagem e CD
              </p>
            </div>
          </div>
          <button
            id="btn-close-dice-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Seção 1: Teste de Atributo D20 (Core D&D 5e) */}
          <div className="space-y-4 p-4 rounded-xl bg-stone-950/60 border border-amber-900/30">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Teste de Atributo vs Classe de Dificuldade (CD)
            </h3>

            {/* Atributo Selector */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5 font-medium">
                Selecione o Atributo a ser Testado:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {(["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"] as AtributoDnd[]).map(
                  (attr) => {
                    const val = personagem?.atributos[attr] || 10;
                    const mod = Math.floor((val - 10) / 2);
                    const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
                    const isSelected = selectedAttr === attr;

                    return (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => setSelectedAttr(attr)}
                        className={`p-2 rounded-lg text-center border transition-all ${
                          isSelected
                            ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow"
                            : "bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300"
                        }`}
                      >
                        <div className="text-[11px] truncate">{attr.slice(0, 3).toUpperCase()}</div>
                        <div className="text-xs font-bold font-mono">{modStr}</div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Vantagem / Normal / Desvantagem */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5 font-medium">Condição da Rolagem:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoRolagem("normal")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    tipoRolagem === "normal"
                      ? "bg-stone-800 text-amber-200 border-amber-500/40"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300"
                  }`}
                >
                  Normal (1d20)
                </button>
                <button
                  type="button"
                  onClick={() => setTipoRolagem("vantagem")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    tipoRolagem === "vantagem"
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/60"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300"
                  }`}
                >
                  Vantagem ↑ (Melhor de 2)
                </button>
                <button
                  type="button"
                  onClick={() => setTipoRolagem("desvantagem")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    tipoRolagem === "desvantagem"
                      ? "bg-red-950/60 text-red-300 border-red-500/60"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300"
                  }`}
                >
                  Desvantagem ↓ (Pior de 2)
                </button>
              </div>
            </div>

            {/* Dificuldade (CD) */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                <span>Dificuldade do Desafio (CD):</span>
                <span className="font-bold text-amber-300 font-mono">CD {cd}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CDS.map((item) => (
                  <button
                    key={item.cd}
                    type="button"
                    onClick={() => setCd(item.cd)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                      cd === item.cd
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                        : "bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Rolar D20 */}
            <button
              id="btn-roll-d20-test"
              type="button"
              disabled={isRolling}
              onClick={handleRolarTeste}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Dices className={`w-5 h-5 ${isRolling ? "animate-spin" : ""}`} />
              {isRolling ? "Rolando os dados na mesa..." : `Rolar d20 + mod de ${selectedAttr}`}
            </button>

            {/* Resultado do Teste */}
            {resultado && (
              <div
                className={`p-4 rounded-xl border text-center transition-all animate-fadeIn ${
                  resultado.critico_sucesso
                    ? "bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30"
                    : resultado.falha_critica
                    ? "bg-red-950/40 border-red-500 ring-2 ring-red-500/30"
                    : resultado.sucesso
                    ? "bg-emerald-950/30 border-emerald-600/50"
                    : "bg-stone-900/90 border-stone-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm font-semibold mb-1">
                  {resultado.critico_sucesso && (
                    <span className="text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> 🌟 SUCESSO CRÍTICO (Natural 20)!
                    </span>
                  )}
                  {resultado.falha_critica && (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> 💀 FALHA CRÍTICA (Natural 1)!
                    </span>
                  )}
                  {!resultado.critico_sucesso && !resultado.falha_critica && (
                    resultado.sucesso ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ✅ Sucesso contra CD {resultado.dificuldade}
                      </span>
                    ) : (
                      <span className="text-stone-400 flex items-center gap-1">
                        ❌ Falha contra CD {resultado.dificuldade}
                      </span>
                    )
                  )}
                </div>

                <div className="text-3xl font-extrabold font-mono text-stone-100 my-1">
                  {resultado.total}
                </div>

                <div className="text-xs text-stone-400 font-mono">
                  d20 [{resultado.dados_rolados.join(", ")}] → base {resultado.resultado_bruto}{" "}
                  {resultado.modificador >= 0 ? `+${resultado.modificador}` : resultado.modificador} ({resultado.atributo}) ={" "}
                  <strong className="text-amber-200">{resultado.total}</strong>
                </div>

                {onSendRollToStory && (
                  <button
                    id="btn-apply-roll-to-story"
                    onClick={() => onSendRollToStory(resultado, acaoDesc)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-semibold border border-amber-500/30 transition-colors"
                  >
                    <span>Enviar Resultado para a História</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Seção 2: Dados Poliedros Avulsos (Dano, Magias, Armas) */}
          <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 space-y-3">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-stone-400" />
              Rolador de Dados Poliedros (Dano e Magias)
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DICE_TYPES.map((d) => (
                <button
                  key={d.lados}
                  type="button"
                  onClick={() => setDadoAvulso(d.lados)}
                  className={`p-2.5 rounded-lg text-center border transition-all ${
                    dadoAvulso === d.lados
                      ? "bg-amber-600/20 border-amber-500 text-amber-200 font-bold"
                      : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <div className="text-lg">{d.icone}</div>
                  <div className="text-xs font-bold mt-1">{d.nome}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex-1">
                <label className="block text-stone-400 mb-1">Qtd de dados:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={qtdDados}
                  onChange={(e) => setQtdDados(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100 text-xs"
                />
              </div>

              <div className="flex-1">
                <label className="block text-stone-400 mb-1">Modificador (+/-):</label>
                <input
                  type="number"
                  value={modAvulso}
                  onChange={(e) => setModAvulso(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100 text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  id="btn-roll-polyhedral"
                  type="button"
                  onClick={handleRolarAvulso}
                  className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold border border-stone-700 transition-colors"
                >
                  Rolar {qtdDados}d{dadoAvulso}
                  {modAvulso !== 0 ? (modAvulso > 0 ? `+${modAvulso}` : `${modAvulso}`) : ""}
                </button>
              </div>
            </div>

            {resultadoAvulso && (
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400">Rolados: </span>
                  <span className="font-mono text-stone-200">[{resultadoAvulso.rolados.join(", ")}]</span>
                  {modAvulso !== 0 && (
                    <span className="text-stone-400"> {modAvulso > 0 ? `+${modAvulso}` : modAvulso}</span>
                  )}
                </div>
                <div className="text-lg font-bold font-mono text-amber-300">
                  Total: {resultadoAvulso.total}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/70 flex justify-end">
          <button
            id="btn-close-dice-footer"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
