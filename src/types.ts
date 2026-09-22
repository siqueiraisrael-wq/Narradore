export type AtributoDnd = "Força" | "Destreza" | "Constituição" | "Inteligência" | "Sabedoria" | "Carisma";

export interface AtributosMap {
  Força: number;
  Destreza: number;
  Constituição: number;
  Inteligência: number;
  Sabedoria: number;
  Carisma: number;
  [key: string]: number;
}

export type TendenciaDnd =
  | "Leal e Bom"
  | "Neutro e Bom"
  | "Caótico e Bom"
  | "Leal e Neutro"
  | "Neutro"
  | "Caótico e Neutro"
  | "Leal e Mau"
  | "Neutro e Mau"
  | "Caótico e Mau";

export interface Personagem {
  id?: string;
  nome: string;
  jogadorNome?: string;
  classe: string;
  subclasse?: string;
  raca: string;
  subraca?: string;
  antecedente?: string;
  tendencia?: TendenciaDnd | string;
  detalhes?: string;
  atributos: AtributosMap;
  historia: string;
  pvMax: number;
  pvAtual: number;
  pvTemp?: number;
  incapacitado?: boolean;
  turnosIncapacitadoRestantes?: number;
  ca: number;
  nivel: number;
  xp?: number;
  bonusProficiencia?: number;
  deslocamento?: string;
  iniciativa?: number;
  inspiracao?: boolean;
  periciasProficientes?: string[];
  salvaguardasProficientes?: string[];
  equipamento?: string[];
  moedas?: { po: number; pp: number; pc: number };
  tracosPersonalidade?: string;
  ideais?: string;
  vinculos?: string;
  defeitos?: string;
  tracos?: string[];
  magiasConhecidas?: string[];
  source?: "gemini" | "offline";
}

export interface CaminhoDesfecho {
  titulo: string;
  acao: string;
  foco?: string;
  cd?: number;
  atributo?: string;
}

export interface OrientacaoDesfecho {
  dicaMestre: string;
  caminhosDesfecho: CaminhoDesfecho[];
  source?: "gemini" | "offline";
}

export interface TesteResultado {
  atributo: string;
  valor_atributo: number;
  modificador: number;
  dados_rolados: number[];
  resultado_bruto: number;
  total: number;
  dificuldade: number;
  tipo_rolagem: "normal" | "vantagem" | "desvantagem";
  critico_sucesso: boolean;
  falha_critica: boolean;
  sucesso: boolean;
  telegram_format?: string;
}

export interface AcaoSugestao {
  acao: string;
  atributo?: string;
  cd?: number;
  risco?: string;
}

export interface BonificacaoRecompensa {
  tipo: "revelacao_caminho" | "vantagem_tatica" | "segredo_desvendado" | "fraqueza_descoberta" | "item_ou_recurso";
  titulo: string;
  descricao: string;
  efeitoMecanico?: string;
  caminhoSugerido?: string;
}

export interface PenalidadeFalha {
  titulo: string;
  descricao: string;
  danoSofrido?: number;
  condicao?: string;
  perdeuTurno: boolean;
  proximoJogadorNome?: string;
}

export interface EstadoTurnos {
  rodada: number;
  jogadorAtivoIndex: number;
  turnosRealizadosIds: string[];
}

export interface RecompensaXP {
  xpGanho: number;
  xpTotal: number;
  xpProximoNivel: number;
  desempenhoRoleplay: "Excepcional" | "Bom" | "Padrão";
  motivoRoleplay: string;
  subiuDeNivel?: boolean;
  novoNivel?: number;
}

export interface MensagemNarrativa {
  id: string;
  timestamp: string;
  tipo: "mestre" | "jogador" | "dado" | "sistema" | "sugestoes";
  conteudo: string;
  titulo?: string;
  teste?: TesteResultado;
  bonificacao?: BonificacaoRecompensa | null;
  penalidadeFalha?: PenalidadeFalha | null;
  recompensaXP?: RecompensaXP | null;
  sugestoes?: AcaoSugestao[];
  source?: "gemini" | "offline";
}

export interface Campanha {
  id: string;
  titulo: string;
  narrativa: string;
  contexto: string;
  livroReferencia?: string;
  source?: "gemini" | "offline";
  dataCriacao: string;
}

