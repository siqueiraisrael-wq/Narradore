import { useState } from "react";
import {
  X,
  Sparkles,
  User,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  AlertTriangle,
  Heart,
  Dices,
  BookOpen,
  Feather
} from "lucide-react";
import { CLASSES_DND, RACAS_DND, ANTECEDENTES_DND } from "../data/livroDoJogadorData";

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharacter: (dados: {
    nome: string;
    jogadorNome?: string;
    classe: string;
    raca: string;
    antecedente?: string;
    tendencia?: string;
    detalhes?: string;
  }) => Promise<void>;
  isCreating: boolean;
  jogadorNumero?: number;
}

const TENDENCIAS = [
  { id: "Leal e Bom", desc: "Honrado, protege os indefesos e respeita as leis." },
  { id: "Neutro e Bom", desc: "Movido pela compaixão e pelo bem do próximo." },
  { id: "Caótico e Bom", desc: "Luta pela liberdade e justiça segundo sua própria consciência." },
  { id: "Leal e Neutro", desc: "Segue rigidamente a ordem, tradição ou código pessoal." },
  { id: "Neutro", desc: "Busca o equilíbrio e evita extremismos morais." },
  { id: "Caótico e Neutro", desc: "Espírito livre, valoriza sua autonomia acima de tudo." },
  { id: "Leal e Mau", desc: "Metódico, utiliza leis e poder para subjugar outros." },
  { id: "Neutro e Mau", desc: "Pragmático e implacável na busca de interesses próprios." },
  { id: "Caótico e Mau", desc: "Impulsivo, movido por vingança, crueldade ou anarquia." },
];

const EXEMPLOS_ARQUETIPOS = [
  "Veterano austero atormentado por batalhas passadas, protege seus companheiros a qualquer custo.",
  "Estudioso curioso e sarcástico, obcecado por relíquias arcanas perdidas e charadas antigas.",
  "Trapaceiro carismático e acrobata que furta apenas dos tiranos para sustentar orfanatos.",
  "Curandeiro devoto e compassivo que jurou jamais deixar um inocente perecer diante de seus olhos.",
  "Guerreiro selvagem das estepes geladas, desconfia da nobreza urbana mas valoriza juramentos de sangue.",
  "Nobre proscrito em busca de redimir a honra manchada de sua linhagem ancestral."
];

export function CharacterCreatorModal({
  isOpen,
  onClose,
  onCreateCharacter,
  isCreating,
  jogadorNumero = 1,
}: CharacterCreatorModalProps) {
  // Etapas:
  // 1: Nome do Personagem
  // 2: Raça (Menu e Vantagens/Desvantagens)
  // 3: Classe (Menu e Vantagens/Desvantagens)
  // 4: Descrição dos Arquétipos e Características
  const [etapa, setEtapa] = useState<number>(1);
  const [nome, setNome] = useState("");
  const [jogadorNome, setJogadorNome] = useState("");
  const [raca, setRaca] = useState("Anão");
  const [classe, setClasse] = useState("Guerreiro");
  const [antecedente, setAntecedente] = useState("Soldado");
  const [tendencia, setTendencia] = useState("Leal e Bom");
  const [detalhes, setDetalhes] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRace = RACAS_DND.find((r) => r.nome === raca) || RACAS_DND[0];
  const currentClass = CLASSES_DND.find((c) => c.nome === classe) || CLASSES_DND[6];

  const handleNext = () => {
    if (etapa === 1) {
      if (!nome.trim()) {
        setErro("Por favor, digite o nome do seu aventureiro.");
        return;
      }
    }
    setErro(null);
    setEtapa((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setErro(null);
    setEtapa((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro("O nome do herói é obrigatório.");
      setEtapa(1);
      return;
    }
    setErro(null);
    try {
      await onCreateCharacter({
        nome: nome.trim(),
        jogadorNome: jogadorNome.trim() || `Jogador ${jogadorNumero}`,
        raca,
        classe,
        antecedente,
        tendencia,
        detalhes: detalhes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErro(err.message || "Erro ao criar ficha com a IA.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-stone-900 border border-amber-800/50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col text-stone-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              {jogadorNumero}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-amber-100 flex items-center gap-2">
                <span>Criação Dinâmica de Ficha</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans">
                  Jogador {jogadorNumero}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Regras oficiais do Livro do Jogador de D&D 5ª Edição
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="px-5 sm:px-6 py-2.5 bg-stone-950/50 border-b border-stone-800/80 flex items-center justify-between text-xs">
          {[
            { step: 1, label: "1. Nome" },
            { step: 2, label: "2. Raça" },
            { step: 3, label: "3. Classe" },
            { step: 4, label: "4. Arquétipos & IA" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step < etapa || (item.step === 2 && nome.trim())) {
                  setEtapa(item.step);
                }
              }}
              disabled={isCreating}
              className={`flex items-center gap-1.5 transition-colors font-medium ${
                etapa === item.step
                  ? "text-amber-400 font-bold"
                  : etapa > item.step
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 cursor-not-allowed"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  etapa === item.step
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : etapa > item.step
                    ? "bg-emerald-900/60 text-emerald-300 border border-emerald-600/40"
                    : "bg-stone-800 text-stone-500"
                }`}
              >
                {etapa > item.step ? "✓" : item.step}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {erro && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-red-950/60 border border-red-700/60 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {/* PASSO 1: NOME */}
          {etapa === 1 && (
            <div className="space-y-5 animate-fadeIn max-w-xl mx-auto">
              <div className="text-center space-y-1 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                  <Feather className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-amber-100">
                  Como se chama o seu aventureiro?
                </h3>
                <p className="text-xs text-stone-400">
                  O primeiro passo para forjar sua lenda no mundo de D&D.
                </p>
              </div>

              <div className="space-y-4 bg-stone-950/60 p-5 rounded-xl border border-stone-800">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1.5">
                    Nome do Personagem (Herói) *
                  </label>
                  <input
                    id="input-char-name"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Thorin Quebra-Escudo, Lyra Vento-Frio, Varis..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 focus:border-amber-500 text-stone-100 placeholder-stone-500 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">
                    Nome do Jogador / Apelido (Opcional)
                  </label>
                  <input
                    id="input-player-alias"
                    type="text"
                    value={jogadorNome}
                    onChange={(e) => setJogadorNome(e.target.value)}
                    placeholder={`Ex: Israel, Jogador ${jogadorNumero}...`}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 placeholder-stone-600 text-sm outline-hidden"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Ajuda o Mestre a identificar quem controla este personagem na mesa.
                  </p>
                </div>
              </div>

              {/* Nomes Rápidos de Inspiração */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 font-medium block mb-2">
                  Sugestões rápidas de nomes de D&D:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Bruenor", "Drizzt", "Catti-brie", "Elminster", "Mordenkainen", "Valeros", "Seoni", "Kyra"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNome(sug)}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700 hover:border-amber-500/40 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: RAÇA COM VANTAGENS E DESVANTAGENS */}
          {etapa === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold font-serif text-amber-100 flex items-center gap-2">
                    <span>Escolha a Raça</span>
                    <span className="text-xs font-sans text-stone-400">
                      (Capítulo 2 do Livro do Jogador)
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Selecione no menu e avalie as vantagens e desvantagens de cada linhagem.
                  </p>
                </div>

                {/* Dropdown Menu para seleção rápida */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-amber-300 font-medium whitespace-nowrap">Menu:</label>
                  <select
                    id="select-raca"
                    value={raca}
                    onChange={(e) => setRaca(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-stone-950 border border-amber-600/40 text-amber-200 text-xs font-medium focus:outline-hidden"
                  >
                    {RACAS_DND.map((r) => (
                      <option key={r.nome} value={r.nome}>
                        {r.icone} {r.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid de Seleção Visual de Raças */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                {RACAS_DND.map((r) => (
                  <button
                    key={r.nome}
                    type="button"
                    onClick={() => setRaca(r.nome)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      raca === r.nome
                        ? "bg-amber-600/20 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                    }`}
                  >
                    <span className="text-xl">{r.icone}</span>
                    <span className="text-[11px] font-bold truncate w-full">{r.nome}</span>
                  </button>
                ))}
              </div>

              {/* Detalhes da Raça Selecionada: Vantagens e Desvantagens */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-amber-900/40 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                      {currentRace.icone}
                    </div>
                    <div>
                      <h4 className="text-base font-bold font-serif text-amber-100 flex items-center gap-2">
                        <span>{currentRace.nome}</span>
                        <span className="text-xs font-sans px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-normal">
                          {currentRace.tamanho} • {currentRace.deslocamento}
                        </span>
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                        {currentRace.descricao}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-xs flex items-center gap-2 text-stone-300">
                  <span className="text-amber-400 font-bold">Aumentos de Atributos:</span>
                  <span>{currentRace.aumentosAtributo}</span>
                </div>

                {/* Vantagens e Desvantagens Comparativas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  
                  {/* Vantagens */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <ThumbsUp className="w-4 h-4 text-emerald-400" />
                      <span>Vantagens Raciais ({currentRace.nome})</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-100/90">
                      {currentRace.vantagens.map((v, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Desvantagens / Limitações */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Desvantagens / Limitações</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-100/90">
                      {currentRace.desvantagens.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-400 font-bold mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: CLASSE COM VANTAGENS E DESVANTAGENS */}
          {etapa === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold font-serif text-amber-100 flex items-center gap-2">
                    <span>Escolha a Classe</span>
                    <span className="text-xs font-sans text-stone-400">
                      (Capítulo 3 do Livro do Jogador)
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Sua vocação primordial, poder em combate e habilidades heróicas.
                  </p>
                </div>

                {/* Dropdown Menu para seleção rápida de classe */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-amber-300 font-medium whitespace-nowrap">Menu:</label>
                  <select
                    id="select-classe"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-stone-950 border border-amber-600/40 text-amber-200 text-xs font-medium focus:outline-hidden"
                  >
                    {CLASSES_DND.map((c) => (
                      <option key={c.nome} value={c.nome}>
                        {c.icone} {c.nome} ({c.dadoVida})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid de Seleção de Classes */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {CLASSES_DND.map((c) => (
                  <button
                    key={c.nome}
                    type="button"
                    onClick={() => setClasse(c.nome)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      classe === c.nome
                        ? "bg-amber-600/20 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                    }`}
                  >
                    <span className="text-2xl">{c.icone}</span>
                    <span className="text-xs font-bold">{c.nome}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{c.dadoVida}</span>
                  </button>
                ))}
              </div>

              {/* Detalhes da Classe: Vantagens e Desvantagens */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-amber-900/40 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                      {currentClass.icone}
                    </div>
                    <div>
                      <h4 className="text-base font-bold font-serif text-amber-100 flex items-center gap-2">
                        <span>{currentClass.nome}</span>
                        <span className="text-xs font-sans px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
                          Vida: {currentClass.dadoVida} • {currentClass.habilidadesPrimarias.join("/")}
                        </span>
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                        {currentClass.descricao}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-amber-400 font-bold block mb-0.5">Salvaguardas:</span>
                    <span className="text-stone-300">{currentClass.resistencia.join(", ")}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-amber-400 font-bold block mb-0.5">Armaduras e Armas:</span>
                    <span className="text-stone-300 truncate block">{currentClass.armasArmaduras}</span>
                  </div>
                </div>

                {/* Vantagens e Desvantagens da Classe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  
                  {/* Vantagens */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <ThumbsUp className="w-4 h-4 text-emerald-400" />
                      <span>Vantagens da Classe ({currentClass.nome})</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-100/90">
                      {currentClass.vantagens.map((v, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Desvantagens / Limitações */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Desvantagens / Limitações</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-100/90">
                      {currentClass.desvantagens.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-400 font-bold mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* PASSO 4: ARQUÉTIPOS DO PERSONAGEM & GERAÇÃO DE HISTÓRIA COM IA */}
          {etapa === 4 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="text-base font-bold font-serif text-amber-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Descreva os Arquétipos e Características</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Descreva como é o seu personagem. A IA criará uma história exclusiva com base nas suas palavras e gerará a ficha completa!
                </p>
              </div>

              {/* Resumo das Escolhas */}
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currentRace.icone}</span>
                  <div>
                    <span className="font-bold text-stone-100">{nome}</span>
                    <span className="text-stone-400 block text-[11px]">
                      {currentRace.nome} • {currentClass.nome}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Alterar base
                </button>
              </div>

              {/* Campo Livre de Arquétipos */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-300">
                  Arquétipo, Personalidade e Características Especiais:
                </label>
                <textarea
                  id="textarea-char-archetype"
                  rows={4}
                  value={detalhes}
                  onChange={(e) => setDetalhes(e.target.value)}
                  placeholder="Descreva o arquétipo do herói: personalidade, motivações, estilo de combate, maneirismos, segredos ou código de conduta... (Ex: Um ladino cavalheiro que recusa derramar sangue inocente; um guerreiro silencioso marcado por uma jura aos ancestrais...)"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 placeholder-stone-500 text-sm leading-relaxed outline-hidden"
                />
              </div>

              {/* Sugestões de Inspiração de Arquétipo */}
              <div>
                <span className="text-[11px] text-stone-400 font-medium block mb-2">
                  Inspirações de arquétipos prontas (clique para aplicar):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXEMPLOS_ARQUETIPOS.map((arq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDetalhes(arq)}
                      className="p-2.5 rounded-lg bg-stone-950/60 hover:bg-stone-850 border border-stone-800 text-left text-xs text-stone-300 hover:text-amber-200 transition-colors"
                    >
                      <span className="line-clamp-2 italic">"{arq}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configurações Adicionais Opcionais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Antecedente (Capítulo 4)
                  </label>
                  <select
                    id="select-antecedente"
                    value={antecedente}
                    onChange={(e) => setAntecedente(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-hidden"
                  >
                    {ANTECEDENTES_DND.map((a) => (
                      <option key={a.nome} value={a.nome}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Tendência Moral (Capítulo 4)
                  </label>
                  <select
                    id="select-tendencia"
                    value={tendencia}
                    onChange={(e) => setTendencia(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-hidden"
                  >
                    {TENDENCIAS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={etapa === 1 || isCreating}
            className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {etapa < 4 ? (
            <button
              type="button"
              id="btn-next-creator-step"
              onClick={handleNext}
              disabled={isCreating}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Avançar para {etapa === 1 ? "Raça" : etapa === 2 ? "Classe" : "Arquétipos"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-submit-char-ai"
              onClick={handleSubmit}
              disabled={isCreating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>A IA está gerando a história e a ficha...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Criar História com IA & Ver Ficha</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
