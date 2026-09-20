import { useState } from "react";
import {
  X,
  BookOpen,
  Shield,
  Sparkles,
  Swords,
  Scroll,
  Users,
  Compass,
  Flame,
  AlertCircle,
  Dice5,
  Search,
  CheckCircle2,
  Trophy,
  Star,
  Award
} from "lucide-react";
import {
  CLASSES_DND,
  RACAS_DND,
  ANTECEDENTES_DND,
  CONDICOES_DND,
  REGRAS_ESSENCIAIS_DND,
  TABELA_XP_DND,
} from "../data/livroDoJogadorData";

interface LivroDoJogadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPresetAdventure?: (tema: string) => void;
}

export function LivroDoJogadorModal({
  isOpen,
  onClose,
  onSelectPresetAdventure,
}: LivroDoJogadorModalProps) {
  const [tabAtiva, setTabAtiva] = useState<
    "visao-geral" | "classes" | "racas" | "antecedentes" | "regras" | "condicoes"
  >("visao-geral");

  const [busca, setBusca] = useState("");
  const [classeSelecionada, setClasseSelecionada] = useState(CLASSES_DND[0]);
  const [racaSelecionada, setRacaSelecionada] = useState(RACAS_DND[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-stone-900 border border-amber-800/40 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-stone-200 overflow-hidden font-sans">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-700 via-red-900 to-amber-900 border border-amber-500/40 flex items-center justify-center text-amber-200 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100 tracking-wide">
                  D&D • Livro do Jogador
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  5ª Edição
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Compêndio e guia de regras oficial em português do Brasil
              </p>
            </div>
          </div>
          <button
            id="btn-close-livro-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Fechar compêndio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Navegação de Capítulos / Abas */}
        <div className="px-6 py-2.5 bg-stone-950/50 border-b border-stone-800 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-medium scrollbar-thin">
          {[
            { id: "visao-geral", label: "Visão Geral", icon: Compass },
            { id: "classes", label: "12 Classes (Cap. 3)", icon: Swords },
            { id: "racas", label: "9 Raças (Cap. 2)", icon: Users },
            { id: "antecedentes", label: "Antecedentes (Cap. 4)", icon: Scroll },
            { id: "regras", label: "Regras & d20 (Cap. 7-9)", icon: Dice5 },
            { id: "condicoes", label: "Condições (Apêndice A)", icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const ativa = tabAtiva === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setTabAtiva(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  ativa
                    ? "bg-amber-600 text-stone-950 font-bold shadow-sm"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ABA 1: VISÃO GERAL */}
          {tabAtiva === "visao-geral" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/20 border border-amber-800/30 rounded-xl p-5">
                <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
                  Dungeons & Dragons 5ª Edição
                </span>
                <h3 className="text-xl font-serif font-bold text-amber-100 mt-1 mb-2">
                  O Livro do Jogador: O Coração das Aventuras
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  "O jogo de Dungeons & Dragons é sobre contar histórias em mundos de espadas e magia...
                  O Mestre descreve o ambiente, os jogadores dizem o que desejam fazer, e o Mestre narra os resultados. 
                  O d20 dá estrutura ao destino com perícia, sorte e heroísmo."
                </p>
                <div className="mt-4 pt-3 border-t border-stone-800/60 flex flex-wrap gap-2 text-xs text-stone-400">
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700">
                    📖 Parte 1: Criação de Personagens (Cap. 1 a 6)
                  </span>
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700">
                    🎲 Parte 2: Jogando o Jogo (Cap. 7 a 9)
                  </span>
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700">
                    ✨ Parte 3: As Regras da Magia (Cap. 10 e 11)
                  </span>
                </div>
              </div>

              {/* Os Três Pilares da Aventura */}
              <div>
                <h4 className="text-base font-serif font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Os Três Pilares da Aventura (Capítulo 8 e 9)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {REGRAS_ESSENCIAIS_DND.tresPilares.map((p, i) => (
                    <div
                      key={i}
                      className="bg-stone-950/40 p-4 rounded-lg border border-stone-800 hover:border-amber-700/40 transition-colors"
                    >
                      <h5 className="font-bold text-amber-300 text-sm mb-1">{p.titulo}</h5>
                      <p className="text-xs text-stone-400 leading-relaxed">{p.texto}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Princípios de Ouro do Livro */}
              <div>
                <h4 className="text-base font-serif font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Princípios de Ouro do Livro do Jogador
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REGRAS_ESSENCIAIS_DND.regrasOuro.map((r, i) => (
                    <div key={i} className="bg-stone-950/40 p-3.5 rounded-lg border border-stone-800">
                      <div className="text-xs font-bold text-amber-400 mb-1">{r.titulo}</div>
                      <div className="text-xs text-stone-400 leading-relaxed">{r.texto}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sementes Canônicas para Iniciar */}
              {onSelectPresetAdventure && (
                <div>
                  <h4 className="text-base font-serif font-bold text-amber-200 mb-2">
                    Iniciar Aventura Inspirada no Livro:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        titulo: "Os Portões do Castelo Ravenloft",
                        desc: "Aproximação clássica da introdução (pág. 5) com ponte levadiça e gárgulas vigilantes.",
                      },
                      {
                        titulo: "A Busca pelo Salão de Mitral",
                        desc: "A jornada ancestral de Bruenor Martelo de Batalha (Cap. 1 e 4) contra o dragão das sombras.",
                      },
                      {
                        titulo: "A Floresta do Manto e o Círculo Druídico",
                        desc: "Monólitos primordiais da Crença Antiga e corrupção na natureza de Faerûn.",
                      },
                      {
                        titulo: "O Enigma do Pináculo de Sigil",
                        desc: "A Cidade das Portas, as Terras Exteriores e a Grande Roda do Multiverso (Apêndice C).",
                      },
                    ].map((seed, idx) => (
                      <button
                        key={idx}
                        id={`btn-preset-adventure-${idx}`}
                        onClick={() => {
                          onSelectPresetAdventure(seed.titulo);
                          onClose();
                        }}
                        className="text-left p-3 rounded-lg bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800 hover:border-amber-600/50 transition-all group"
                      >
                        <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                          {seed.titulo}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">{seed.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: CLASSES (12 CLASSES) */}
          {tabAtiva === "classes" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
              {/* Lista lateral das 12 classes */}
              <div className="md:col-span-4 space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {CLASSES_DND.map((cls) => {
                  const ativa = classeSelecionada.nome === cls.nome;
                  return (
                    <button
                      key={cls.nome}
                      id={`btn-select-class-${cls.nome}`}
                      onClick={() => setClasseSelecionada(cls)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        ativa
                          ? "bg-amber-600/20 border-amber-500 text-amber-200 font-bold"
                          : "bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cls.icone}</span>
                        <span>{cls.nome}</span>
                      </div>
                      <span className="text-[11px] font-mono opacity-70">{cls.dadoVida}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detalhes da classe selecionada */}
              <div className="md:col-span-8 bg-stone-950/50 border border-stone-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{classeSelecionada.icone}</span>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-amber-100">
                      {classeSelecionada.nome}
                    </h3>
                    <p className="text-xs text-stone-400">{classeSelecionada.descricao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Dado de Vida:</span>
                    <span className="font-bold text-amber-300 font-mono text-sm">
                      {classeSelecionada.dadoVida}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Habilidade Primária:</span>
                    <span className="font-bold text-stone-200">
                      {classeSelecionada.habilidadesPrimarias.join(", ")}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Resistências Proficientes:</span>
                    <span className="font-bold text-stone-200">
                      {classeSelecionada.resistencia.join(", ")}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Bônus de Proficiência Inicial:</span>
                    <span className="font-bold text-amber-400 font-mono text-sm">+2 (Nível 1)</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-stone-400">Armas e Armaduras:</span>
                  <p className="text-stone-300 bg-stone-900/70 p-2 rounded border border-stone-800/80">
                    {classeSelecionada.armasArmaduras}
                  </p>
                </div>

                <div className="text-xs space-y-1.5">
                  <span className="font-semibold text-amber-300">Características de 1º Nível:</span>
                  <ul className="list-disc list-inside text-stone-300 space-y-1 bg-stone-900/50 p-3 rounded-lg border border-stone-800/60">
                    {classeSelecionada.habilidadesNivel1.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-stone-400">Arquétipos / Especializações (Cap. 3):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {classeSelecionada.subclassesExemplo.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-amber-950/40 text-amber-300 rounded border border-amber-800/40 text-[11px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: RAÇAS (9 RAÇAS) */}
          {tabAtiva === "racas" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
              {/* Lista lateral de raças */}
              <div className="md:col-span-4 space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {RACAS_DND.map((rc) => {
                  const ativa = racaSelecionada.nome === rc.nome;
                  return (
                    <button
                      key={rc.nome}
                      id={`btn-select-race-${rc.nome}`}
                      onClick={() => setRacaSelecionada(rc)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        ativa
                          ? "bg-amber-600/20 border-amber-500 text-amber-200 font-bold"
                          : "bg-stone-950/40 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{rc.icone}</span>
                        <span>{rc.nome}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 truncate max-w-[80px]">
                        {rc.deslocamento}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detalhes da raça selecionada */}
              <div className="md:col-span-8 bg-stone-950/50 border border-stone-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{racaSelecionada.icone}</span>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-amber-100">
                      {racaSelecionada.nome}
                    </h3>
                    <p className="text-xs text-stone-400">{racaSelecionada.descricao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Aumento de Habilidade:</span>
                    <span className="font-bold text-amber-300">
                      {racaSelecionada.aumentosAtributo}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                    <span className="text-stone-500 block mb-0.5">Deslocamento Base:</span>
                    <span className="font-bold text-stone-200">{racaSelecionada.deslocamento}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5">
                  <span className="font-semibold text-amber-300">Traços Raciais Notáveis:</span>
                  <ul className="list-disc list-inside text-stone-300 space-y-1 bg-stone-900/50 p-3 rounded-lg border border-stone-800/60">
                    {racaSelecionada.tracosPrincipais.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-stone-400">Sub-raças do Livro:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {racaSelecionada.subracas.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: ANTECEDENTES (CAPÍTULO 4) */}
          {tabAtiva === "antecedentes" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-stone-400">
                  Os 13 antecedentes oficiais do Capítulo 4 fornecem perícias, equipamentos e características narrativas exclusivas.
                </p>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {ANTECEDENTES_DND.filter(
                  (a) =>
                    !busca ||
                    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    a.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                    a.pericias.some((p) => p.toLowerCase().includes(busca.toLowerCase()))
                ).map((ant) => (
                  <div
                    key={ant.nome}
                    className="p-4 rounded-xl bg-stone-950/50 border border-stone-800 hover:border-amber-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-amber-200 text-sm">{ant.nome}</h4>
                      <div className="flex gap-1">
                        {ant.pericias.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 text-[10px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">{ant.descricao}</p>
                    <div className="pt-2 border-t border-stone-800/60 text-[11px] text-stone-300">
                      <span className="text-amber-400 font-semibold block">{ant.caracteristica}</span>
                      <span className="text-stone-500 block mt-0.5">Equipamento: {ant.equipamento}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 5: REGRAS & D20 (CAPÍTULO 7 E 9) */}
          {tabAtiva === "regras" && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* Tabela de Classes de Dificuldade */}
              <div>
                <h4 className="text-base font-serif font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Dice5 className="w-4 h-4 text-amber-400" />
                  Tabela Oficial de Classes de Dificuldade (CD - pág. 176)
                </h4>
                <div className="overflow-x-auto rounded-lg border border-stone-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-950 text-stone-400 border-b border-stone-800">
                        <th className="p-2.5 font-semibold">Dificuldade da Tarefa</th>
                        <th className="p-2.5 font-semibold font-mono">CD Alvo</th>
                        <th className="p-2.5 font-semibold">Aplicação no Jogo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {REGRAS_ESSENCIAIS_DND.escalaCD.map((row) => (
                        <tr key={row.nivel} className="hover:bg-stone-800/30">
                          <td className="p-2.5 font-bold text-amber-300">{row.nivel}</td>
                          <td className="p-2.5 font-mono font-bold text-stone-100">{row.cd}</td>
                          <td className="p-2.5 text-stone-400">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vantagem, Desvantagem e Críticos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 space-y-2">
                  <h5 className="font-bold text-amber-300 text-sm">Vantagem & Desvantagem (Cap. 7)</h5>
                  <p className="text-stone-400 leading-relaxed">
                    Role <strong className="text-stone-200">2d20</strong>. Com <em>vantagem</em>, use o maior resultado. Com <em>desvantagem</em>, use o menor. Se houver circunstâncias de vantagem e desvantagem simultâneas, elas se anulam e rola-se apenas 1d20.
                  </p>
                </div>
                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 space-y-2">
                  <h5 className="font-bold text-amber-300 text-sm">Acerto e Falha Crítica (Cap. 9)</h5>
                  <p className="text-stone-400 leading-relaxed">
                    Um <strong className="text-emerald-400">20 natural</strong> no d20 sempre atinge o alvo, independente da CA, e dobra todos os dados de dano da jogada. Um <strong className="text-red-400">1 natural</strong> é uma falha automática sem importar bônus.
                  </p>
                </div>
              </div>

              {/* Ações em Combate */}
              <div>
                <h4 className="text-base font-serif font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Ações em Combate (Capítulo 9, pág. 194)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { nome: "Atacar", desc: "Golpe corpo a corpo ou tiro à distância." },
                    { nome: "Conjurar Magia", desc: "Tempo de conjuração de 1 ação." },
                    { nome: "Disparada", desc: "Dobra o deslocamento no turno." },
                    { nome: "Desengajar", desc: "Movimento não provoca ataques de oportunidade." },
                    { nome: "Esquivar", desc: "Ataques contra você têm desvantagem." },
                    { nome: "Ajudar", desc: "Concede vantagem ao teste de um aliado." },
                    { nome: "Esconder", desc: "Teste de Furtividade para ficar oculto." },
                    { nome: "Preparar", desc: "Define um gatilho de reação para agir fora do turno." },
                  ].map((act, i) => (
                    <div key={i} className="bg-stone-950/40 p-2.5 rounded-lg border border-stone-800">
                      <div className="font-bold text-amber-400">{act.nome}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{act.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela Oficial de Progressão de Nível & XP (Livro do Jogador - Capítulo 1, pág. 15) */}
              <div>
                <h4 className="text-base font-serif font-bold text-amber-200 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Progressão de Personagem & Pontos de Experiência (XP - Cap. 1)
                </h4>
                <div className="bg-stone-950/60 p-3.5 rounded-xl border border-amber-900/40 mb-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Regra da Mesa: Bonificação Periódica de XP por Interpretação (Roleplay)
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    Jogadores que desempenharem fielmente seus papéis ganham mais XP! Exemplo canônico: um guerreiro anão rústico que senta no chão, bebe canecos de cerveja, arrota e come com a mão; um ladino sorrateiro nas sombras ou um sábio consultando seu grimório. Quanto mais você entra no personagem, mais rápido alcança o próximo nível.
                  </p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-stone-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-950 text-stone-400 border-b border-stone-800">
                        <th className="p-2 font-semibold">Nível</th>
                        <th className="p-2 font-semibold font-mono">XP Acumulado Necessário</th>
                        <th className="p-2 font-semibold font-mono">Bônus de Proficiência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {TABELA_XP_DND.slice(0, 10).map((t) => (
                        <tr key={t.nivel} className="hover:bg-stone-800/30">
                          <td className="p-2 font-bold text-amber-300">Nível {t.nivel}</td>
                          <td className="p-2 font-mono text-stone-200">{t.xpNecessario.toLocaleString("pt-BR")} XP</td>
                          <td className="p-2 font-mono text-amber-400 font-bold">+{t.bonusProf}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABA 6: CONDIÇÕES (APÊNDICE A) */}
          {tabAtiva === "condicoes" && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <p className="text-stone-400">
                Condições do Apêndice A do Livro do Jogador (pág. 291-293) alteram capacidades e aplicam efeitos rigorosos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {CONDICOES_DND.map((c) => (
                  <div
                    key={c.nome}
                    className="p-3.5 rounded-xl bg-stone-950/50 border border-stone-800 hover:border-red-900/40 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-amber-200 text-sm">{c.nome}</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed text-xs">{c.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-500">
          <span>D&D 5ª Edição • Livro do Jogador • Regras Canônicas</span>
          <button
            id="btn-close-compendium-footer"
            onClick={onClose}
            className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
