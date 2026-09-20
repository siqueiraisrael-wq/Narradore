import { GoogleGenAI } from "@google/genai";

// Atributos de D&D 5e e mapeamento de palavras-chave para testes (de dice.py)
export const TESTES: Record<string, string> = {
  // Combate
  "ataque": "Força",
  "atacar": "Força",
  "luta": "Força",
  "lutar": "Força",
  "força": "Força",
  "forca": "Força",
  "empurrar": "Força",
  "derrubar": "Força",
  "quebrar": "Força",
  "golpe": "Força",
  "espada": "Força",
  "machado": "Força",

  // Furtividade / Destreza
  "furtividade": "Destreza",
  "furtivo": "Destreza",
  "esconder": "Destreza",
  "roubo": "Destreza",
  "furto": "Destreza",
  "esquivar": "Destreza",
  "desviar": "Destreza",
  "acrobacia": "Destreza",
  "reflexo": "Destreza",
  "iniciativa": "Destreza",
  "destreza": "Destreza",
  "arco": "Destreza",
  "flecha": "Destreza",
  "gazua": "Destreza",
  "trancar": "Destreza",
  "destrancar": "Destreza",

  // Resistência / Constituição
  "resistência": "Constituição",
  "resistencia": "Constituição",
  "concentração": "Constituição",
  "concentracao": "Constituição",
  "constituição": "Constituição",
  "constituicao": "Constituição",
  "veneno": "Constituição",
  "suportar": "Constituição",
  "vigor": "Constituição",

  // Magia / Conhecimento
  "magia": "Inteligência",
  "conjurar": "Inteligência",
  "inteligência": "Inteligência",
  "inteligencia": "Inteligência",
  "arcano": "Inteligência",
  "arcanismo": "Inteligência",
  "investigação": "Inteligência",
  "investigacao": "Inteligência",
  "história": "Inteligência",
  "historia": "Inteligência",
  "analisar": "Inteligência",
  "decifrar": "Inteligência",
  "desvendar": "Inteligência",
  "símbolo": "Inteligência",
  "simbolo": "Inteligência",
  "símbolos": "Inteligência",
  "simbolos": "Inteligência",
  "ritual": "Inteligência",
  "ritualístico": "Inteligência",
  "ritualistico": "Inteligência",
  "runa": "Inteligência",
  "runas": "Inteligência",
  "glifo": "Inteligência",
  "glifos": "Inteligência",
  "altar": "Inteligência",
  "religião": "Inteligência",
  "religiao": "Inteligência",

  // Percepção / Sobrevivência
  "percepção": "Sabedoria",
  "percepcao": "Sabedoria",
  "olhar": "Sabedoria",
  "observar": "Sabedoria",
  "escutar": "Sabedoria",
  "ouvir": "Sabedoria",
  "sabedoria": "Sabedoria",
  "sobrevivência": "Sabedoria",
  "sobrevivencia": "Sabedoria",
  "medicina": "Sabedoria",
  "curar": "Sabedoria",
  "insight": "Sabedoria",
  "intuição": "Sabedoria",
  "intuiçao": "Sabedoria",
  "rastrear": "Sabedoria",

  // Social / Carisma
  "persuasão": "Carisma",
  "persuasao": "Carisma",
  "convencer": "Carisma",
  "intimidação": "Carisma",
  "intimidacao": "Carisma",
  "ameaçar": "Carisma",
  "carisma": "Carisma",
  "enganação": "Carisma",
  "enganacao": "Carisma",
  "mentir": "Carisma",
  "atuação": "Carisma",
  "atuacao": "Carisma",
  "cantar": "Carisma",
  "negociar": "Carisma",
};

export const ATTR_EMOJI: Record<string, string> = {
  "Força": "💪",
  "Destreza": "🏃",
  "Constituição": "❤️",
  "Inteligência": "🧠",
  "Sabedoria": "👁️",
  "Carisma": "✨"
};

export function modificador(valor: number): number {
  return Math.floor((valor - 10) / 2);
}

export function rolarDado(lados: number): number {
  return Math.floor(Math.random() * lados) + 1;
}

export function detectarAtributo(acao: string): string | null {
  const acaoLower = (acao || "").toLowerCase();
  for (const [palavra, atributo] of Object.entries(TESTES)) {
    if (acaoLower.includes(palavra)) {
      return atributo;
    }
  }
  return null;
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

export function realizarTeste(
  atributos: Record<string, number>,
  atributo: string = "Destreza",
  dificuldade: number = 12,
  vantagem: boolean = false,
  desvantagem: boolean = false
): TesteResultado {
  let dados_rolados: number[] = [];
  let resultado_bruto = 0;
  let tipo_rolagem: "normal" | "vantagem" | "desvantagem" = "normal";

  if (vantagem) {
    const d1 = rolarDado(20);
    const d2 = rolarDado(20);
    dados_rolados = [d1, d2];
    resultado_bruto = Math.max(d1, d2);
    tipo_rolagem = "vantagem";
  } else if (desvantagem) {
    const d1 = rolarDado(20);
    const d2 = rolarDado(20);
    dados_rolados = [d1, d2];
    resultado_bruto = Math.min(d1, d2);
    tipo_rolagem = "desvantagem";
  } else {
    resultado_bruto = rolarDado(20);
    dados_rolados = [resultado_bruto];
    tipo_rolagem = "normal";
  }

  const valor_atributo = atributos[atributo] ?? 10;
  const mod = modificador(valor_atributo);
  const total = resultado_bruto + mod;

  const critico_sucesso = resultado_bruto === 20;
  const falha_critica = resultado_bruto === 1;
  const sucesso = critico_sucesso || (!falha_critica && total >= dificuldade);

  const res: TesteResultado = {
    atributo,
    valor_atributo,
    modificador: mod,
    dados_rolados,
    resultado_bruto,
    total,
    dificuldade,
    tipo_rolagem,
    critico_sucesso,
    falha_critica,
    sucesso,
  };

  res.telegram_format = formatarResultadoTelegram(res, "Herói");
  return res;
}

export function formatarResultadoTelegram(teste: TesteResultado, nomePersonagem: string): string {
  const attr = teste.atributo;
  const attr_emoji = ATTR_EMOJI[attr] || "🎲";
  const mod = teste.modificador;
  const mod_str = mod >= 0 ? `+${mod}` : `${mod}`;
  const bruto = teste.resultado_bruto;
  const total = teste.total;
  const cd = teste.dificuldade;
  const dados = teste.dados_rolados;

  let linha_dado = "";
  if (dados.length === 2) {
    const [d1, d2] = dados;
    const escolhido = teste.tipo_rolagem === "vantagem" ? Math.max(d1, d2) : Math.min(d1, d2);
    const tipo_label = teste.tipo_rolagem === "vantagem" ? "vantagem ↑" : "desvantagem ↓";
    linha_dado = `🎲 d20 (${tipo_label}): [${d1}, ${d2}] → usa ${escolhido}`;
  } else {
    linha_dado = `🎲 d20: ${bruto}`;
  }

  let icone_resultado = "";
  if (teste.critico_sucesso) {
    icone_resultado = "🌟 SUCESSO CRÍTICO!";
  } else if (teste.falha_critica) {
    icone_resultado = "💀 FALHA CRÍTICA!";
  } else if (teste.sucesso) {
    icone_resultado = "✅ Sucesso";
  } else {
    icone_resultado = "❌ Falha";
  }

  return [
    `╔═══ 🎲 ROLAGEM DE DADOS ═══╗`,
    `👤 ${nomePersonagem}`,
    `${attr_emoji} Teste de ${attr} (valor: ${teste.valor_atributo})`,
    `─────────────────────`,
    `${linha_dado}`,
    `${mod_str} modificador de ${attr}`,
    `─────────────────────`,
    `📊 Total: ${total} vs CD ${cd}`,
    `╚══ ${icone_resultado} ══╝`
  ].join("\n");
}

// Tabela oficial de progressão de XP D&D 5e (Livro do Jogador - Capítulo 1)
export const TABELA_XP_DND = [
  { nivel: 1, xpNecessario: 0, bonusProf: 2 },
  { nivel: 2, xpNecessario: 300, bonusProf: 2 },
  { nivel: 3, xpNecessario: 900, bonusProf: 2 },
  { nivel: 4, xpNecessario: 2700, bonusProf: 2 },
  { nivel: 5, xpNecessario: 6500, bonusProf: 3 },
  { nivel: 6, xpNecessario: 14000, bonusProf: 3 },
  { nivel: 7, xpNecessario: 23000, bonusProf: 3 },
  { nivel: 8, xpNecessario: 34000, bonusProf: 3 },
  { nivel: 9, xpNecessario: 48000, bonusProf: 4 },
  { nivel: 10, xpNecessario: 64000, bonusProf: 4 },
  { nivel: 11, xpNecessario: 85000, bonusProf: 4 },
  { nivel: 12, xpNecessario: 100000, bonusProf: 4 },
  { nivel: 13, xpNecessario: 120000, bonusProf: 5 },
  { nivel: 14, xpNecessario: 140000, bonusProf: 5 },
  { nivel: 15, xpNecessario: 165000, bonusProf: 5 },
  { nivel: 16, xpNecessario: 195000, bonusProf: 5 },
  { nivel: 17, xpNecessario: 225000, bonusProf: 6 },
  { nivel: 18, xpNecessario: 265000, bonusProf: 6 },
  { nivel: 19, xpNecessario: 305000, bonusProf: 6 },
  { nivel: 20, xpNecessario: 355000, bonusProf: 6 },
];

export function calcularXpProximoNivel(nivelAtual: number): number {
  const proximo = TABELA_XP_DND.find((t) => t.nivel === nivelAtual + 1);
  return proximo ? proximo.xpNecessario : 355000;
}

export function verificarSubidaNivel(xpTotal: number, nivelAtual: number): { subiu: boolean; novoNivel: number; bonusProf: number } {
  let novoNivel = nivelAtual;
  let bonusProf = 2;
  for (const t of TABELA_XP_DND) {
    if (xpTotal >= t.xpNecessario) {
      novoNivel = Math.max(novoNivel, t.nivel);
      bonusProf = t.bonusProf;
    }
  }
  return {
    subiu: novoNivel > nivelAtual,
    novoNivel,
    bonusProf,
  };
}

// Avaliação de interpretação e roleplay offline resiliente (Ex: anão que senta no chão, come com a mão, bebe e arrota)
export function calcularXpRoleplayOffline(personagem: any, acao: string): { xp: number; desempenho: "Excepcional" | "Bom" | "Padrão"; motivo: string } {
  const acaoL = (acao || "").toLowerCase();
  const racaL = (personagem?.raca || "").toLowerCase();
  const classeL = (personagem?.classe || "").toLowerCase();

  let pontosRoleplay = 0;
  let motivos: string[] = [];

  // Anão / Guerreiro / Bárbaro
  if (racaL.includes("anão") || racaL.includes("anao")) {
    if (acaoL.includes("beber") || acaoL.includes("cerveja") || acaoL.includes("caneco") || acaoL.includes("arrota") || acaoL.includes("comer com a mão") || acaoL.includes("chão") || acaoL.includes("machado") || acaoL.includes("ouro") || acaoL.includes("forja") || acaoL.includes("pedra")) {
      pontosRoleplay += 2;
      motivos.push("Entrou com vigor na essência rústica, apetite e costumes obstinados de um verdadeiro Anão!");
    }
  }

  // Ladino / Trapaceiro / Furtivo
  if (classeL.includes("ladino")) {
    if (acaoL.includes("sombra") || acaoL.includes("bolso") || acaoL.includes("furto") || acaoL.includes("esgueirar") || acaoL.includes("gazua") || acaoL.includes("sorrateiro") || acaoL.includes("esconder")) {
      pontosRoleplay += 2;
      motivos.push("Demonstrou postura astuta e oportunista condizente com a maestria de um Ladino!");
    }
  }

  // Mago / Conjurador / Erudito
  if (classeL.includes("mago") || classeL.includes("bruxo") || classeL.includes("feiticeiro")) {
    if (acaoL.includes("grimório") || acaoL.includes("arcano") || acaoL.includes("estudar") || acaoL.includes("componente") || acaoL.includes("gesto") || acaoL.includes("encantamento")) {
      pontosRoleplay += 2;
      motivos.push("Interpretou a sagacidade, erudição e postura ritualística de um estudioso das artes arcanas!");
    }
  }

  // Paladino / Clérigo
  if (classeL.includes("paladino") || classeL.includes("clérigo") || classeL.includes("clerigo")) {
    if (acaoL.includes("deus") || acaoL.includes("divino") || acaoL.includes("honra") || acaoL.includes("justiça") || acaoL.includes("oração") || acaoL.includes("juramento") || acaoL.includes("proteger")) {
      pontosRoleplay += 2;
      motivos.push("Manteve fervorosa fidelidade aos dogmas, honra e juramentos de sua fé divina!");
    }
  }

  // Bárbaro
  if (classeL.includes("bárbaro") || classeL.includes("barbaro")) {
    if (acaoL.includes("fúria") || acaoL.includes("grito") || acaoL.includes("rasgar") || acaoL.includes("esmagar") || acaoL.includes("instinto") || acaoL.includes("selvagem")) {
      pontosRoleplay += 2;
      motivos.push("Incorporou os instintos primais e a impetuosidade indomável de um Bárbaro!");
    }
  }

  // Riqueza e expressividade descritiva da ação
  if (acao.length > 50) {
    pontosRoleplay += 1;
  }
  if (acao.includes('"') || acao.includes("—") || acao.includes("falo:") || acao.includes("digo:")) {
    pontosRoleplay += 1;
    motivos.push("Diálogo e fala direta de interpretação na primeira pessoa.");
  }

  if (pontosRoleplay >= 3) {
    return {
      xp: 75,
      desempenho: "Excepcional",
      motivo: motivos.join(" ") || "Interpretação e fidelidade absoluta aos traços do personagem!",
    };
  } else if (pontosRoleplay >= 1) {
    return {
      xp: 50,
      desempenho: "Bom",
      motivo: motivos.join(" ") || "Boa imersão e ação condizente com a identidade do aventureiro.",
    };
  } else {
    return {
      xp: 25,
      desempenho: "Padrão",
      motivo: "Ação básica de aventura executada na mesa.",
    };
  }
}

// Model & System Prompt grounded in official D&D 5e "LIVRO DO JOGADOR" (Player's Handbook)
export const SYSTEM_PROMPT = `Você é o Mestre de RPG (Dungeon Master) experiente e envolvente narrando uma campanha de Dungeons & Dragons 5ª Edição (D&D 5e), estritamente fundamentado no "LIVRO DO JOGADOR" oficial.

DIRETRIZES FUNDAMENTAIS DO LIVRO DO JOGADOR:
1. OS TRÊS PILARES DA AVENTURA (Capítulo 8 e 9):
   - Exploração: Descreva cenários táteis e atmosféricos (luz plena, penumbra, escuridão, terreno difícil, sons, cheiros de enxofre ou umidade).
   - Interação Social: Dê vida a PdMs amigáveis, indiferentes ou hostis com maneirismos e motivações reais.
   - Combate: Conduza combates estruturados em rodadas de 6 segundos, respeitando iniciativa, ações, ações bônus, reações e posicionamento.

2. O CICLO DE JOGO (Introdução & Capítulo 0):
   - Passo 1: O Mestre descreve o ambiente e os desafios imediatos.
   - Passo 2: O jogador declara o que quer fazer.
   - Passo 3: O Mestre narra as consequências e os desdobramentos lógicos.

3. ESCALA OFICIAL DE DIFICULDADE (CD - Capítulo 7):
   - CD 5: Muito fácil | CD 10: Fácil | CD 15: Moderada | CD 20: Difícil | CD 25: Muito difícil | CD 30: Quase impossível.
   - Sempre utilize o modificador de habilidade correto e aplique bônus de proficiência (+2 no 1º nível) quando a perícia ou ferramenta for aplicável.

4. CONDIÇÕES DO APÊNDICE A:
   - Utilize as condições oficiais quando relevante (Caído, Cego, Amedrontado, Enfeitiçado, Envenenado, Impedido, Incapacitado, Inconsciente, Paralisado, Atordoado, Exaustão).

5. O ESPECÍFICO VENCE O GERAL (Capítulo 0):
   - Respeite as características raciais (Resiliência Anã, Visão no Escuro, Ancestral Feérico, Sortudo, etc.) e de classe (Fúria do Bárbaro, Retomar o Fôlego do Guerreiro, Ataque Furtivo do Ladino, etc.).

Retorne sempre JSON estrito válido em português do Brasil com descrições literárias ricas, sem floreios desnecessários fora do JSON.`;

// Sementes clássicas inspiradas diretamente em passagens do Livro do Jogador (Cap. 0, 1, 4 e Apêndice C)
export const OFFLINE_SCENE_SEEDS = [
  {
    titulo: "Os Portões do Castelo Ravenloft",
    narrativa: "Depois de passar pelos picos escarpados da terra enevoada, a estrada dá uma guinada repentina para o leste e o Castelo Ravenloft surge adiante. Torres em ruínas mantêm uma vigília silenciosa sob o céu tempestuoso. Uma ponte levadiça de madeira apodrecida e aço corroído pela ferrugem atravessa o abismo sombrio, onde correntes rangem ao vento. Do alto da forte muralha, gárgulas de pedra encaram vocês com órbitas vazias e sorrisos petrificados, enquanto uma luz âmbar e quente escapa pelo arco do jardim interno.",
    contexto: "Localização: Entrada do Castelo Ravenloft sobre o abismo. Ameaça: gárgulas vigilantes e a ponte levadiça instável. Objetivo: inspecionar as gárgulas e cruzar o abismo em segurança rumo ao pátio principal.",
    livroReferencia: "Livro do Jogador, Introdução (pág. 5) - O Exemplo de Gareth e Riva em Ravenloft"
  },
  {
    titulo: "A Marcha para o Salão de Mitral",
    narrativa: "Nas encostas geladas do Vale do Vento Gélido, ventos uivantes castigam os penhascos de pedra cinzenta. Diante de vocês, oculta sob um manto de neve perpétua e runas anãs há séculos esquecidas, repousa uma fenda esculpida na rocha viva: a entrada secreta para o lendário Salão de Mitral. Ecos distantes de ferro martelado e o rugido abafado do dragão das sombras ressoam nas profundezas, convocando os bravos a retomar a honra de seus clãs.",
    contexto: "Localização: Montanhas do Vale do Vento Gélido. Ameaça: batedores goblins e a presença do dragão das sombras. Objetivo: abrir os portões rúnicos e reaver o bastião dos anões.",
    livroReferencia: "Livro do Jogador, Capítulos 1 e 4 (pág. 14, 18, 126) - A Saga de Bruenor Martelo de Batalha"
  },
  {
    titulo: "A Clareira da Crença Antiga na Floresta do Manto",
    narrativa: "A floresta ancestral de Faerûn fecha-se em um teto verdejante que filtra a luz em feixes dourados de penumbra. Entre freixos e carvalhos sagrados, uma clareira circular revela um monólito druídico cravado com hieróglifos em Druídico. Pegadas de feras selvagens misturam-se a marcas calcinadas deixadas por cultistas corruptores. O ar cheira a azevinho fresco e ozônio pré-tormenta.",
    contexto: "Localização: Floresta do Manto (Círculo da Terra). Ameaça: cultistas elementais corrompendo a seiva primordial. Objetivo: decifrar os avisos do monólito e proteger o bosque sagrado.",
    livroReferencia: "Livro do Jogador, Capítulos 3 e 8 (pág. 71, 75, 187) - A Sabedoria dos Círculos Druídicos"
  },
  {
    titulo: "O Enigma do Pináculo de Sigil",
    narrativa: "No coração das Terras Exteriores, sobre um pináculo de pedra colossal que desafia as alturas celestes, flutua a metrópole em forma de anel de Sigil, a lendária Cidade das Portas. Arcos de pedra cintilam com portais interdimensionais para o Plano Elemental e os Nove Infernos. Mensageiros encapuzados e mercadores de todos os planos negociam chaves mágicas em sussurros cautelosos sob a névoa luminosa.",
    contexto: "Localização: Sigil, a Cidade das Portas (Terras Exteriores). Ameaça: agentes planares e chaves de portais instáveis. Objetivo: decifrar o código de um portal antes que mercenários rivais o atravessem.",
    livroReferencia: "Livro do Jogador, Apêndice C: Os Planos de Existência (pág. 301-303)"
  }
];

export function calcularPersonagemOffline(
  nome: string,
  classe: string,
  raca: string,
  detalhes: string = ""
) {
  // Ajustes raciais canônicos do Capítulo 2 do Livro do Jogador
  const racasBonus: Record<string, Record<string, number>> = {
    "Humano": { "Força": 1, "Destreza": 1, "Constituição": 1, "Inteligência": 1, "Sabedoria": 1, "Carisma": 1 },
    "Elfo": { "Destreza": 2, "Inteligência": 1 },
    "Alto Elfo": { "Destreza": 2, "Inteligência": 1 },
    "Elfo da Floresta": { "Destreza": 2, "Sabedoria": 1 },
    "Drow": { "Destreza": 2, "Carisma": 1 },
    "Anão": { "Constituição": 2, "Força": 1 },
    "Anão da Montanha": { "Constituição": 2, "Força": 2 },
    "Anão da Colina": { "Constituição": 2, "Sabedoria": 1 },
    "Halfling": { "Destreza": 2, "Carisma": 1 },
    "Halfling Pés-Leves": { "Destreza": 2, "Carisma": 1 },
    "Halfling Robusto": { "Destreza": 2, "Constituição": 1 },
    "Tiefling": { "Carisma": 2, "Inteligência": 1 },
    "Meio-Orc": { "Força": 2, "Constituição": 1 },
    "Draconato": { "Força": 2, "Carisma": 1 },
    "Gnomo": { "Inteligência": 2, "Constituição": 1 },
    "Gnomo das Rochas": { "Inteligência": 2, "Constituição": 1 },
    "Gnomo da Floresta": { "Inteligência": 2, "Destreza": 1 },
    "Meio-Elfo": { "Carisma": 2, "Destreza": 1, "Constituição": 1 }
  };

  // Conjunto padrão inicial (15, 14, 13, 12, 10, 8) distribuído por vocação da classe (Cap. 1)
  const basesPorClasse: Record<string, Record<string, number>> = {
    "Bárbaro": { "Força": 15, "Constituição": 14, "Destreza": 13, "Sabedoria": 12, "Carisma": 10, "Inteligência": 8 },
    "Bardo": { "Carisma": 15, "Destreza": 14, "Constituição": 13, "Inteligência": 12, "Sabedoria": 10, "Força": 8 },
    "Bruxo": { "Carisma": 15, "Constituição": 14, "Destreza": 13, "Inteligência": 12, "Sabedoria": 10, "Força": 8 },
    "Clérigo": { "Sabedoria": 15, "Constituição": 14, "Força": 13, "Carisma": 12, "Inteligência": 10, "Destreza": 8 },
    "Druida": { "Sabedoria": 15, "Constituição": 14, "Destreza": 13, "Inteligência": 12, "Força": 10, "Carisma": 8 },
    "Feiticeiro": { "Carisma": 15, "Constituição": 14, "Destreza": 13, "Inteligência": 12, "Sabedoria": 10, "Força": 8 },
    "Guerreiro": { "Força": 15, "Constituição": 14, "Destreza": 13, "Sabedoria": 12, "Carisma": 10, "Inteligência": 8 },
    "Ladino": { "Destreza": 15, "Inteligência": 14, "Constituição": 13, "Carisma": 12, "Sabedoria": 10, "Força": 8 },
    "Mago": { "Inteligência": 15, "Constituição": 14, "Destreza": 13, "Sabedoria": 12, "Carisma": 10, "Força": 8 },
    "Monge": { "Destreza": 15, "Sabedoria": 14, "Constituição": 13, "Força": 12, "Carisma": 10, "Inteligência": 8 },
    "Paladino": { "Força": 15, "Carisma": 14, "Constituição": 13, "Sabedoria": 12, "Inteligência": 10, "Destreza": 8 },
    "Patrulheiro": { "Destreza": 15, "Sabedoria": 14, "Constituição": 13, "Força": 12, "Inteligência": 10, "Carisma": 8 },
  };

  const base = { ...(basesPorClasse[classe] || basesPorClasse["Guerreiro"]) };

  // Aplica bônus de raça do Livro do Jogador
  const bonusRaca = racasBonus[raca] || { "Constituição": 1, "Destreza": 1 };
  for (const [attr, b] of Object.entries(bonusRaca)) {
    base[attr] = (base[attr] || 10) + b;
  }

  const modCon = modificador(base["Constituição"]);
  const modDes = modificador(base["Destreza"]);
  const modSab = modificador(base["Sabedoria"]);

  // PV Inicial do Nível 1: Valor Máximo do Dado de Vida + mod Constituição (Cap. 1 pág. 12)
  let pvBase = 10;
  if (classe === "Bárbaro") pvBase = 12;
  else if (classe === "Guerreiro" || classe === "Paladino" || classe === "Patrulheiro") pvBase = 10;
  else if (classe === "Bardo" || classe === "Clérigo" || classe === "Druida" || classe === "Ladino" || classe === "Bruxo" || classe === "Monge") pvBase = 8;
  else if (classe === "Mago" || classe === "Feiticeiro") pvBase = 6;

  // Anão da colina ganha +1 PV inicial (Tenacidade Anã)
  const pvExtraRaca = raca.includes("Colina") ? 1 : 0;
  const pvMax = Math.max(pvBase + modCon + pvExtraRaca, 4);

  // Classe de Armadura (CA) - Regras dos Capítulos 1, 3 e 5
  let ca = 10 + modDes;
  if (classe === "Bárbaro") {
    // Defesa sem Armadura: 10 + Des + Con
    ca = 10 + modDes + modCon;
  } else if (classe === "Monge") {
    // Defesa sem Armadura de Monge: 10 + Des + Sab
    ca = 10 + modDes + modSab;
  } else if (classe === "Guerreiro") {
    // Cota de malha (CA 16) + Escudo (+2) = 18 ou Brunea (14 + min(Des,2))
    ca = 16 + 2; // Cota de Malha + Escudo padrão do Bruenor
  } else if (classe === "Paladino") {
    ca = 16 + 2; // Cota de Malha + Escudo
  } else if (classe === "Clérigo") {
    ca = 14 + Math.min(modDes, 2) + 2; // Brunea + Escudo
  } else if (classe === "Ladino" || classe === "Bardo" || classe === "Bruxo") {
    ca = 11 + modDes; // Armadura de Couro
  } else if (classe === "Patrulheiro") {
    ca = 14 + Math.min(modDes, 2); // Brunea
  } else if (classe === "Druida") {
    ca = 11 + modDes + 2; // Couro + Escudo de Madeira
  }

  // Deslocamento por raça (Capítulo 2)
  let deslocamento = "9 metros";
  if (raca.includes("Anão") || raca.includes("Halfling") || raca.includes("Gnomo")) {
    deslocamento = "7,5 metros";
  } else if (raca.includes("Floresta") && raca.includes("Elfo")) {
    deslocamento = "10,5 metros";
  }

  // Equipamentos iniciais de classe e antecedentes do Livro do Jogador (Cap. 3, 4 e 5)
  const equipamentosPorClasse: Record<string, string[]> = {
    "Bárbaro": ["Machado Grande (1d12 cortante)", "2x Machadinhas de arremesso (1d6)", "4x Azagaias", "Pacote de Explorador", "10 PO"],
    "Bardo": ["Rapieira (1d8 perfurante)", "Armadura de Couro (CA 11)", "Alaúde de madeira de lei", "Pacote de Artista", "15 PO"],
    "Bruxo": ["Adaga de prata (1d4)", "Foco Arcano (Orbe místico)", "Armadura de Couro", "Pacote de Estudioso", "15 PO"],
    "Clérigo": ["Maça de ferro trabalhado (1d6)", "Brunea com manoplas", "Escudo com Símbolo Sagrado (+2 CA)", "Pacote de Sacerdote", "15 PO"],
    "Druida": ["Bordão de carvalho (1d6)", "Escudo de madeira (+2 CA)", "Foco Druídico (ramo de visco)", "Pacote de Explorador", "10 PO"],
    "Feiticeiro": ["Adaga afiada", "Bolsa de componentes arcanos", "Foco Arcano (Cristal)", "Pacote de Aventureiro", "10 PO"],
    "Guerreiro": ["Machado de Batalha (1d8 versátil 1d10)", "Cota de Malha (CA 16)", "Escudo reforçado (+2 CA)", "2x Machadinhas", "Pacote de Aventureiro", "10 PO"],
    "Ladino": ["Rapieira de acuidade (1d8)", "Arco Curto com aljava de 20 flechas", "Armadura de Couro", "Ferramentas de Ladrão", "Pacote de Assaltante", "15 PO"],
    "Mago": ["Grimório encadernado em couro", "Bordão com runas arcanas", "Bolsa de componentes", "Pacote de Estudioso", "10 PO"],
    "Monge": ["Espada Curta (1d6)", "10x Dardos afiados", "Roupas simples de monastério", "Pacote de Explorador", "5 PO"],
    "Paladino": ["Espada Longa de aço brilhante (1d8)", "Cota de Malha (CA 16)", "Escudo brasonado (+2 CA)", "Símbolo Sagrado", "Pacote de Sacerdote", "10 PO"],
    "Patrulheiro": ["Arco Longo com aljava de 20 flechas", "2x Espadas Curtas", "Brunea", "Pacote de Explorador", "10 PO"],
  };

  // Salvaguardas proficientes por classe (Capítulo 3)
  const salvaguardasPorClasse: Record<string, string[]> = {
    "Bárbaro": ["Força", "Constituição"],
    "Bardo": ["Destreza", "Carisma"],
    "Bruxo": ["Sabedoria", "Carisma"],
    "Clérigo": ["Sabedoria", "Carisma"],
    "Druida": ["Inteligência", "Sabedoria"],
    "Feiticeiro": ["Constituição", "Carisma"],
    "Guerreiro": ["Força", "Constituição"],
    "Ladino": ["Destreza", "Inteligência"],
    "Mago": ["Inteligência", "Sabedoria"],
    "Monge": ["Força", "Destreza"],
    "Paladino": ["Sabedoria", "Carisma"],
    "Patrulheiro": ["Força", "Destreza"],
  };

  // Perícias sugeridas da classe
  const periciasSugeridas: Record<string, string[]> = {
    "Bárbaro": ["Atletismo", "Sobrevivência"],
    "Bardo": ["Atuação", "Persuasão", "Enganação"],
    "Bruxo": ["Arcanismo", "Enganação"],
    "Clérigo": ["Religião", "Intuição"],
    "Druida": ["Natureza", "Sobrevivência"],
    "Feiticeiro": ["Arcanismo", "Intimidação"],
    "Guerreiro": ["Atletismo", "Percepção"],
    "Ladino": ["Furtividade", "Prestidigitação", "Acrobacia", "Investigação"],
    "Mago": ["Arcanismo", "História"],
    "Monge": ["Acrobacia", "Intuição"],
    "Paladino": ["Atletismo", "Persuasão"],
    "Patrulheiro": ["Sobrevivência", "Percepção", "Furtividade"],
  };

  let hist = `${nome} é um ${classe.toLowerCase()} ${raca.toLowerCase()} moldado pelas tradições do Livro do Jogador de D&D 5e.`;
  if (detalhes && detalhes.trim().toLowerCase() !== "pular" && detalhes.trim().length > 0) {
    hist += ` Antecedentes e jornada: ${detalhes.trim()}.`;
  }
  hist += " Pronto para desbravar masmorras, negociar com aliados e enfrentar os perigos do multiverso com honra e dados d20 em mãos.";

  return {
    atributos: base,
    antecedente: "Soldado",
    tendencia: "Leal e Bom",
    historia: hist,
    pvMax,
    pvAtual: pvMax,
    ca,
    nivel: 1,
    xp: 0,
    bonusProficiencia: 2,
    deslocamento,
    iniciativa: modDes,
    salvaguardasProficientes: salvaguardasPorClasse[classe] || ["Força", "Constituição"],
    periciasProficientes: periciasSugeridas[classe] || ["Atletismo", "Percepção"],
    equipamento: equipamentosPorClasse[classe] || ["Arma inicial", "Mochila", "10 PO"],
    moedas: { po: 15, pp: 5, pc: 10 },
    tracosPersonalidade: "Sempre alerta aos perigos; avalia cada situação com serenidade e coragem.",
    ideais: "Honra e Lealdade: Proteger os companheiros e cumprir juramentos até o fim.",
    vinculos: "Minha honra é meu nome, e minhas armas são o legado de meus ancestrais.",
    defeitos: "Orgulho inflexível; reluto em recuar diante de um desafio declarado.",
    tracos: [
      `Bônus de Proficiência +2`,
      `${classe}: Características do 1º Nível (Livro do Jogador, Cap. 3)`,
      `${raca}: Traços Raciais e Visão no Escuro (Livro do Jogador, Cap. 2)`
    ]
  };
}


export function sugerirAcoesOffline(contexto: string = ""): Array<{ acao: string; atributo: string; cd: number; risco: string }> {
  const ctx = (contexto || "").toLowerCase();
  const sugestoes = [
    { acao: "Investigar a área em busca de símbolos ocultos ou rastros", atributo: "Inteligência", cd: 12, risco: "baixo" },
    { acao: "Avançar com a arma empunhada mantendo postura defensiva", atributo: "Força", cd: 13, risco: "médio" },
    { acao: "Mover-se pelas sombras para flanquear a ameaça sem ser notado", atributo: "Destreza", cd: 13, risco: "alto" }
  ];

  if (ctx.includes("porta") || ctx.includes("torre") || ctx.includes("farol")) {
    sugestoes[0] = { acao: "Forçar a abertura da pesada porta de ferro", atributo: "Força", cd: 14, risco: "médio" };
  } else if (ctx.includes("floresta") || ctx.includes("altar") || ctx.includes("runa")) {
    sugestoes[0] = { acao: "Tocar as runas antigas entoando um sussurro arcano", atributo: "Inteligência", cd: 13, risco: "alto" };
  } else if (ctx.includes("cripta") || ctx.includes("sarcófago")) {
    sugestoes[0] = { acao: "Decifrar as inscrições fúnebres no túmulo central", atributo: "Sabedoria", cd: 12, risco: "baixo" };
  }

  return sugestoes;
}

// Inicializador seguro do Gemini SDK
let genaiClient: GoogleGenAI | null = null;
export function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genaiClient;
}

// Limpeza de resposta JSON de LLM
function cleanJsonResponse(rawText: string): any {
  if (!rawText) throw new Error("Resposta vazia da IA");
  let text = rawText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/i, "");
  }
  text = text.trim();
  try {
    return JSON.parse(text);
  } catch (err) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw err;
  }
}

// Iniciar Aventura via Gemini ou Fallback
export async function iniciarAventuraAI(promptCustom?: string): Promise<{ titulo: string; narrativa: string; contexto: string; source: "gemini" | "offline" }> {
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Crie uma introdução de aventura de RPG D&D 5e em português do Brasil com atmosfera imersiva, fantasia clássica, mistério ou perigo iminente.
${promptCustom ? `Tema ou inspiração solicitada: ${promptCustom}` : ""}
Retorne estritamente um JSON com a seguinte estrutura:
{
  "titulo": "Nome épico da aventura",
  "narrativa": "Descrição imersiva da cena inicial (2 a 3 parágrafos ricos em detalhes sensoriais, sons, clima e um dilema imediato)",
  "contexto": "Localização, ameaça presente e objetivo inicial claro"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.85,
        },
      });

      const parsed = cleanJsonResponse(response.text || "");
      if (parsed.titulo && parsed.narrativa && parsed.contexto) {
        return { ...parsed, source: "gemini" };
      }
    } catch (e) {
      console.warn("Gemini indisponível para iniciar aventura, acionando fallback offline resiliente:", e);
    }
  }

  // Fallback determinístico
  const seed = OFFLINE_SCENE_SEEDS[Math.floor(Math.random() * OFFLINE_SCENE_SEEDS.length)];
  return { ...seed, source: "offline" };
}

// Criar Personagem com Gemini ou Fallback
export async function criarPersonagemAI(
  nome: string,
  classe: string,
  raca: string,
  detalhes: string = "",
  antecedenteSugerido: string = "",
  tendenciaSugerida: string = ""
) {
  const offline = calcularPersonagemOffline(nome, classe, raca, detalhes);
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Você é o Mestre da Masmorra de D&D 5ª Edição. Crie a ficha canônica e uma HISTÓRIA EXCLUSIVA para este personagem com base estrita no LIVRO DO JOGADOR e NAS CARACTERÍSTICAS/ARQUÉTIPOS fornecidos pelo jogador:

Nome: ${nome}
Classe: ${classe} (Capítulo 3 do Livro do Jogador)
Raça: ${raca} (Capítulo 2 do Livro do Jogador)
Antecedente preferido: ${antecedenteSugerido || "Escolha o mais compatível do Capítulo 4 (ex: Soldado, Acólito, Herói do Povo, Charlatão, Criminoso, Sábio, etc.)"}
Tendência preferida: ${tendenciaSugerida || "Escolha a mais adequada entre as 9 tendências oficiais"}
Arquétipo e características descritas pelo jogador:
"${detalhes || "Aventureiro destemido em busca de glória e superação"}"

Instruções cruciais para a História:
- Crie uma história de origem imersiva (2 parágrafos vívidos) tecendo DIRETAMENTE os arquétipos, a personalidade e as particularidades descritas pelo jogador.
- Explique como ele adquiriu suas habilidades de ${classe} e como suas características raciais de ${raca} se manifestam.
- Conecte suas motivações pessoais aos seus Ideais, Vínculos e Defeitos.

Distribua valores para os 6 atributos usando o conjunto padrão (15, 14, 13, 12, 10, 8) somados aos bônus raciais do Livro do Jogador:
Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma.
Inclua Traços de Personalidade, Ideais, Vínculos e Defeitos (Capítulo 4).
Liste equipamentos iniciais compatíveis com o Capítulo 5.

Retorne estritamente o JSON:
{
  "atributos": {
    "Força": 16,
    "Destreza": 12,
    "Constituição": 15,
    "Inteligência": 10,
    "Sabedoria": 12,
    "Carisma": 11
  },
  "antecedente": "Nome do Antecedente do Cap 4",
  "tendencia": "Leal e Bom",
  "historia": "História rica e envolvente de 2 parágrafos baseada nos arquétipos do jogador...",
  "tracosPersonalidade": "Dois traços de personalidade...",
  "ideais": "Ideal ético/moral que o guia...",
  "vinculos": "Vínculo com pessoas, lugares ou relíquias...",
  "defeitos": "Defeito que pode ser explorado...",
  "equipamento": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "moedas": { "po": 15, "pp": 5, "pc": 10 },
  "tracos": ["Habilidade chave 1", "Traço racial 1"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = cleanJsonResponse(response.text || "");
      if (parsed.atributos && typeof parsed.atributos === "object") {
        const attrSanitizados: Record<string, number> = {};
        for (const [k, v] of Object.entries(parsed.atributos)) {
          attrSanitizados[k] = Number(v) || 10;
        }

        const modCon = modificador(attrSanitizados["Constituição"] || 10);
        let pvBase = 10;
        if (classe === "Bárbaro") pvBase = 12;
        else if (classe === "Guerreiro" || classe === "Paladino" || classe === "Patrulheiro") pvBase = 10;
        else if (classe === "Bardo" || classe === "Clérigo" || classe === "Druida" || classe === "Ladino" || classe === "Bruxo" || classe === "Monge") pvBase = 8;
        else if (classe === "Mago" || classe === "Feiticeiro") pvBase = 6;

        const pvExtraRaca = raca.includes("Colina") ? 1 : 0;
        const pvMax = Math.max(pvBase + modCon + pvExtraRaca, 4);

        const modDes = modificador(attrSanitizados["Destreza"] || 10);
        const modSab = modificador(attrSanitizados["Sabedoria"] || 10);
        let ca = 10 + modDes;
        if (classe === "Bárbaro") ca = 10 + modDes + modCon;
        else if (classe === "Monge") ca = 10 + modDes + modSab;
        else if (classe === "Guerreiro" || classe === "Paladino") ca = 16 + 2;
        else if (classe === "Clérigo") ca = 14 + Math.min(modDes, 2) + 2;
        else if (classe === "Ladino" || classe === "Bardo" || classe === "Bruxo") ca = 11 + modDes;
        else if (classe === "Druida") ca = 11 + modDes + 2;
        else if (classe === "Patrulheiro") ca = 14 + Math.min(modDes, 2);

        return {
          atributos: attrSanitizados,
          antecedente: parsed.antecedente || offline.antecedente,
          tendencia: parsed.tendencia || offline.tendencia,
          historia: parsed.historia || offline.historia,
          tracosPersonalidade: parsed.tracosPersonalidade || offline.tracosPersonalidade,
          ideais: parsed.ideais || offline.ideais,
          vinculos: parsed.vinculos || offline.vinculos,
          defeitos: parsed.defeitos || offline.defeitos,
          equipamento: Array.isArray(parsed.equipamento) && parsed.equipamento.length > 0 ? parsed.equipamento : offline.equipamento,
          moedas: parsed.moedas || offline.moedas,
          tracos: Array.isArray(parsed.tracos) && parsed.tracos.length > 0 ? parsed.tracos : offline.tracos,
          salvaguardasProficientes: offline.salvaguardasProficientes,
          periciasProficientes: offline.periciasProficientes,
          deslocamento: offline.deslocamento,
          iniciativa: modDes,
          bonusProficiencia: 2,
          pvMax,
          pvAtual: pvMax,
          ca,
          nivel: 1,
          xp: 0,
          source: "gemini" as const,
        };
      }
    } catch (e) {
      console.warn("Gemini falhou na criação de personagem, usando offline:", e);
    }
  }

  return {
    ...offline,
    source: "offline" as const,
  };
}


// Avaliar Ação
export async function avaliarAcaoAI(contexto: string, acao: string): Promise<{ precisa_teste: boolean; atributo: string; cd: number; motivo: string }> {
  const atributoDetectado = detectarAtributo(acao) || "Destreza";
  const acaoLower = acao.toLowerCase();

  const acoesSimples = ["olhar", "andar", "avançar", "caminhar", "falar", "perguntar", "ouvir", "sentar", "esperar", "respirar"];
  const ehSimples = acoesSimples.some(s => acaoLower.startsWith(s) || acaoLower.includes(`apenas ${s}`));

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Avalie se a ação do jogador no D&D 5e requer uma rolagem de dados (teste de atributo / CD) ou se é uma ação rotineira/simples sem risco.
Contexto da cena: ${contexto}
Ação declarada pelo jogador: ${acao}

Retorne estritamente o JSON:
{
  "precisa_teste": boolean,
  "atributo": "Força" | "Destreza" | "Constituição" | "Inteligência" | "Sabedoria" | "Carisma",
  "cd": número de 10 a 20,
  "motivo": "Breve justificativa técnica em 1 frase"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = cleanJsonResponse(response.text || "");
      if (typeof parsed.precisa_teste === "boolean") {
        return {
          precisa_teste: parsed.precisa_teste,
          atributo: parsed.atributo || atributoDetectado,
          cd: parsed.cd || 12,
          motivo: parsed.motivo || "Avaliação do Mestre",
        };
      }
    } catch (e) {
      console.warn("Gemini offline para avaliar ação:", e);
    }
  }

  return {
    precisa_teste: !ehSimples,
    atributo: atributoDetectado,
    cd: 12,
    motivo: ehSimples ? "Ação simples sem oposição imediata." : "Ação arriscada que desafia o ambiente ou adversários.",
  };
}

// Narrar Ação com o Resultado do Dado
export async function narrarAcaoAI(params: {
  sessaoContexto: string;
  personagem: any;
  acao: string;
  teste?: TesteResultado | null;
}) {
  const { sessaoContexto, personagem, acao, teste } = params;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Você é o Mestre da Masmorra (Dungeon Master) de D&D 5ª Edição narrando o resultado da AÇÃO LIVRE declarada pelo jogador.

Contexto atual da aventura: ${sessaoContexto}
Personagem ativo: ${personagem.nome} (${personagem.classe} ${personagem.raca}, nível ${personagem.nivel || 1})
Ação livre executada pelo jogador: "${acao}"
${teste ? `Teste de D&D 5e realizado: Atributo ${teste.atributo} (Modificador: ${teste.modificador >= 0 ? '+' : ''}${teste.modificador}). Dado bruto rolado: ${teste.resultado_bruto}, Total final: ${teste.total} vs Dificuldade CD ${teste.dificuldade}.
Resultado mecânico do dado: ${teste.critico_sucesso ? "SUCESSO CRÍTICO (Natural 20)!" : teste.falha_critica ? "FALHA CRÍTICA (Natural 1)!" : teste.sucesso ? "SUCESSO!" : "FALHA!"}.` : "Nenhum teste de dado foi necessário (ação automática ou sem risco)."}

DIRETRIZES FUNDAMENTAIS PARA A NARRATIVA, BONIFICAÇÃO E PENALIDADE DE TURNO:
1. AÇÃO LIVRE DO JOGADOR: Responda diretamente e com fidelidade ao que o jogador tentou fazer (ex: decifrar símbolos ritualísticos, inspecionar um altar, desarmar uma armadilha, encontrar passagens secretas, interrogar um inimigo, usar magia ou o cenário).
2. REGRA MANDATÓRIA DE BONIFICAÇÃO POR SUCESSO:
   - Se o teste foi SUCESSO ou SUCESSO CRÍTICO: Você DEVE conceder uma BONIFICAÇÃO CONCRETA ao jogador ("bonificacao")!
   - Exemplo clássico: Se o jogador tenta decifrar símbolos ritualísticos, runas, glifos ou línguas antigas e PASSOU no teste: a bonificação DEVE revelar o significado do ritual e DIZER EXATAMENTE O CAMINHO CERTO OU SEGURO A FAZER (ex: qual passagem seguir, qual alavanca puxar, qual ordem de tochas acender para evitar a armadilha ou como abrir a porta sem despertar os monstros)!
   - Outros exemplos: rotas seguras, fraquezas descobertas, itens encontrados.
   - Nesse caso, "penalidadeFalha": null.
3. REGRA MANDATÓRIA DE FALHA (ALGO RUIM ACONTECE E O JOGADOR PERDE O TURNO):
   - Se o teste de d20 resultar em FALHA ou FALHA CRÍTICA:
     a) ALGO RUIM ACONTECE IMEDIATAMENTE (uma consequência desfavorável direta):
        - Ex: se tentou decifrar símbolos ritualísticos e falhou, as runas entram em sobrecarga emitindo um choque arcano ardente (causando dano de 2 a 5 PV) ou disparam um alarme estridente que ecoa pelas masmorras alertando patrulhas!
        - Se tentou arrombar/desarmar, a agulha envenenada dispara na mão do personagem causando dano e quebrando a gazua.
        - Se atacou ou manobrou, sofre um contra-ataque doloroso ou é derrubado no chão.
     b) O JOGADOR PERDE O TURNO! A ação é interrompida pela falha, ele perde o restante da sua vez na rodada e a vez passa para o próximo jogador.
     c) Preencha obrigatoriamente o objeto "penalidadeFalha":
        {
          "titulo": "Falha no Teste: Consequência Hostil & Turno Perdido",
          "descricao": "Explicação detalhada do evento adverso que atingiu o personagem e por que seu turno foi perdido...",
          "danoSofrido": 3, // número de 1 a 6 de PV perdidos (ou 0 se for alerta/desarme),
          "condicao": "Choque Arcano / Desarmado / Alarme Acionado",
          "perdeuTurno": true
        }
     d) Nesse caso, "bonificacao": null.
4. SISTEMA DE RECOMPENSA DE XP POR ROLEPLAY E INTERPRETAÇÃO:
   - Bonifique SEMPRE o jogador com ganho de XP nesta rodada.
   - REGRA DO PAPEL DO PERSONAGEM: Aqueles que desempenharem melhor seu papel ganham mais XP!
     * Exemplo: se o cara tá jogando de anão guerreiro e chega num banquete, senta no chão, come com a mão, bebe todas, arrota e dorme ali mesmo; ou se o ladino age sorrateiro e vigarista; ou se o mago fala em termos arcanos e consulta seu grimório; ou se o paladino coloca seus votos sagrados à frente.
     * Desempenho "Excepcional" (75 a 100 XP): Entrou totalmente no personagem, encenou trejeitos, manias, defeitos cômicos ou rústicos da raça/classe, fala em 1ª pessoa ou fez algo memorável condizente com a ficha.
     * Desempenho "Bom" (40 a 60 XP): Ação coerente com a raça/classe e contexto da aventura.
     * Desempenho "Padrão" (20 a 30 XP): Ação genérica de jogo sem interpretação profunda.
   - Preencha o objeto "recompensaXP":
     {
       "xpGanho": 75,
       "desempenhoRoleplay": "Excepcional" | "Bom" | "Padrão",
       "motivoRoleplay": "Ex: Entrou com perfeição na pele de um anão rústico que bebe sem pudores e arrota no banquete real!"
     }
5. NOVO CONTEXTO:
   - Atualize a cena no "novo_contexto", registrando o que mudou, o dano sofrido ou o caminho aberto para manter a continuidade da aventura.

Retorne estritamente o JSON:
{
  "narrativa": "Narração literária e cinematográfica de 1 a 2 parágrafos com o desfecho da ação e a cena atual...",
  "novo_contexto": "Resumo conciso do novo estado da aventura após essa ação...",
  "bonificacao": {
    "tipo": "revelacao_caminho" | "vantagem_tatica" | "segredo_desvendado" | "fraqueza_descoberta" | "item_ou_recurso",
    "titulo": "Título da Bonificação",
    "descricao": "O que foi desvendado e qual é o caminho certo/seguro a fazer...",
    "efeitoMecanico": "Efeito prático em regras...",
    "caminhoSugerido": "Ação recomendada a seguir"
  } | null,
  "penalidadeFalha": {
    "titulo": "Título da Consequência Negativa (ex: Choque de Glifos Arcanos & Turno Perdido)",
    "descricao": "Explicação do que aconteceu de ruim e a perda do turno...",
    "danoSofrido": 3,
    "condicao": "Choque Arcano",
    "perdeuTurno": true
  } | null,
  "recompensaXP": {
    "xpGanho": 75,
    "desempenhoRoleplay": "Excepcional",
    "motivoRoleplay": "Explicação do porquê a interpretação do arquétipo/personagem foi recompensada com esse montante de XP..."
  },
  "dano_ou_efeito": "Ex: 3 de dano sofrido e turno perdido, ou Caminho seguro revelado",
  "sugestoes": [
    { "acao": "Texto da próxima ação recomendada pelo Mestre", "atributo": "Inteligência", "cd": 12, "risco": "baixo" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.8,
        },
      });

      const parsed = cleanJsonResponse(response.text || "");
      if (parsed.narrativa) {
        let recompensa = parsed.recompensaXP;
        if (!recompensa || typeof recompensa.xpGanho !== "number") {
          recompensa = calcularXpRoleplayOffline(personagem, acao);
        }
        return {
          narrativa: parsed.narrativa,
          novo_contexto: parsed.novo_contexto || sessaoContexto,
          bonificacao: parsed.bonificacao && parsed.bonificacao.titulo ? parsed.bonificacao : null,
          penalidadeFalha: parsed.penalidadeFalha && parsed.penalidadeFalha.titulo ? parsed.penalidadeFalha : null,
          recompensaXP: recompensa,
          dano_ou_efeito: parsed.dano_ou_efeito || null,
          sugestoes: Array.isArray(parsed.sugestoes) ? parsed.sugestoes : sugerirAcoesOffline(sessaoContexto),
          source: "gemini" as const,
        };
      }
    } catch (e) {
      console.warn("Gemini offline para narrar ação, usando fallback local:", e);
    }
  }

  // Offline fallback resiliente com suporte a bonificações e penalidade de falha
  const recompensaOffline = calcularXpRoleplayOffline(personagem, acao);
  let desfecho = "";
  let bonificacaoOffline: any = null;
  let penalidadeOffline: any = null;
  const acaoLower = (acao || "").toLowerCase();

  if (teste) {
    if (teste.critico_sucesso) {
      desfecho = `Com precisão heroica e um vislumbre de genialidade digno das lendas, ${personagem.nome} obtém um SUCESSO CRÍTICO (20 Natural) ao executar: "${acao}"! As engrenagens do destino revelam segredos absolutos da câmara.`;
    } else if (teste.falha_critica) {
      desfecho = `Em um instante de azar catastrófico, ${personagem.nome} sofre uma FALHA CRÍTICA ao tentar "${acao}"! Algo terrível acontece: uma reação violenta é desencadeada no cenário, desferindo dano direto e custando imediatamente o seu turno!`;
    } else if (teste.sucesso) {
      desfecho = `${personagem.nome} executa a ação com firmeza e perícia calculada. O teste de ${teste.atributo} totaliza ${teste.total} contra a CD ${teste.dificuldade}, superando o desafio e desvendando elementos cruciais no cenário.`;
    } else {
      desfecho = `A tentativa de ${personagem.nome} falha contra a CD ${teste.dificuldade} (Total: ${teste.total}). Algo ruim acontece: a armadilha do ambiente se manifesta contra você, desferindo uma complicação dolorosa e custando o seu turno!`;
    }

    // Se houve sucesso, concede a Bonificação contextual
    if (teste.sucesso) {
      if (
        acaoLower.includes("simbolo") ||
        acaoLower.includes("símbolo") ||
        acaoLower.includes("ritual") ||
        acaoLower.includes("runa") ||
        acaoLower.includes("glifo") ||
        acaoLower.includes("altar") ||
        acaoLower.includes("decifrar")
      ) {
        bonificacaoOffline = {
          tipo: "revelacao_caminho",
          titulo: "Revelação dos Símbolos Ritualísticos: O Caminho Seguro",
          descricao: `Ao decifrar com sucesso as inscrições e os símbolos gravados na pedra, ${personagem.nome} desvenda o segredo do ritual: as chamas arcanas indicam que a passagem central está protegida por uma armadilha de foice mágica, enquanto o arco leste — marcado pela runa do falcão — é o CAMINHO SEGURO E CORRETO para avançar direto ao santuário sem sofrer dano!`,
          efeitoMecanico: "Caminho seguro desvendado: o grupo contorna a armadilha e ganha Vantagem no próximo teste de iniciativa ou resistência.",
          caminhoSugerido: "Avanço com segurança pela passagem leste sob a proteção dos símbolos decifrados",
        };
      } else if (
        acaoLower.includes("procurar") ||
        acaoLower.includes("investigar") ||
        acaoLower.includes("examinar") ||
        acaoLower.includes("olhar") ||
        acaoLower.includes("passagem")
      ) {
        bonificacaoOffline = {
          tipo: "segredo_desvendado",
          titulo: "Mecanismo Oculto & Rota Segura Revelada",
          descricao: `Sua inspeção minuciosa detecta uma junta oca e um leve fluxo de ar na parede de cantaria. Você descobre a alavanca de pedra oculta que destranca um atalho seguro, contornando a patrulha e os perigos da câmara principal.`,
          efeitoMecanico: "Atalho seguro desvendado: você ganha Vantagem para surpreender qualquer sentinela à frente.",
          caminhoSugerido: "Aciono a alavanca oculta e avanço furtivamente pelo atalho desvendado",
        };
      } else if (
        acaoLower.includes("atacar") ||
        acaoLower.includes("golpear") ||
        acaoLower.includes("lutar") ||
        acaoLower.includes("combate")
      ) {
        bonificacaoOffline = {
          tipo: "vantagem_tatica",
          titulo: "Abertura Tática & Quebra de Postura",
          descricao: `Com o sucesso de sua manobra, você expõe a vulnerabilidade na defesa do adversário, forçando-o a um recuo desajeitado.`,
          efeitoMecanico: "Vantagem no próximo ataque contra este inimigo ou +2 na CA até o início da próxima rodada.",
          caminhoSugerido: "Aproveito a brecha tática para desferir um golpe concentrado",
        };
      } else {
        bonificacaoOffline = {
          tipo: "revelacao_caminho",
          titulo: "Êxito Tático & Pista Revelada",
          descricao: `Sua ação é coroada de sucesso: você compreende a dinâmica do ambiente e identifica a direção ideal a seguir para avançar na missão.`,
          efeitoMecanico: "Bônus de sucesso: caminho desimpedido e moral elevado para o grupo.",
          caminhoSugerido: "Avanço com determinação seguindo a pista recém-descoberta",
        };
      }
    } else {
      // FALHA: ALGO RUIM ACONTECE E PERDE O TURNO!
      const dano = teste.falha_critica ? 4 : 2;
      if (
        acaoLower.includes("simbolo") ||
        acaoLower.includes("símbolo") ||
        acaoLower.includes("ritual") ||
        acaoLower.includes("runa") ||
        acaoLower.includes("altar") ||
        acaoLower.includes("decifrar")
      ) {
        penalidadeOffline = {
          titulo: "Choque dos Símbolos Arcanos: Turno Perdido!",
          descricao: `Ao tocar equivocadamente no glifo sem compreender sua sequência mágica, uma descarga elétrica de cor azulada irrompe da pedra atingindo ${personagem.nome}! O impacto queima suas mãos causando ${dano} de dano e interrompe bruscamente sua ação. Seu turno é perdido!`,
          danoSofrido: dano,
          condicao: "Choque Mágico de Runas",
          perdeuTurno: true,
        };
      } else if (
        acaoLower.includes("atacar") ||
        acaoLower.includes("lutar") ||
        acaoLower.includes("combate")
      ) {
        penalidadeOffline = {
          titulo: "Contra-Ataque Brutal: Turno Perdido!",
          descricao: `Sua tentativa de golpe deixa a guarda vulnerável. O adversário deflete sua arma com violência, atingindo-lhe de raspão e causando ${dano} de dano. Desequilibrado, você perde o restante do seu turno!`,
          danoSofrido: dano,
          condicao: "Desequilibrado em Combate",
          perdeuTurno: true,
        };
      } else {
        penalidadeOffline = {
          titulo: "Complicação Hostil: Turno Perdido!",
          descricao: `A tentativa falha em um momento crítico. As armadilhas ou a instabilidade do terreno reagem contra ${personagem.nome}, provocando ${dano} de dano por detritos e forçando um recuo desajeitado. Seu turno foi perdido!`,
          danoSofrido: dano,
          condicao: "Recuo Forçado",
          perdeuTurno: true,
        };
      }
    }
  } else {
    desfecho = `${personagem.nome} avança com cuidado: "${acao}". A manobra transcorre sem percalços imediatos, revelando novos ângulos da câmara sob o silêncio tenso.`;
  }

  const novoCtx = `${sessaoContexto} Última ação de ${personagem.nome}: ${acao}. ${bonificacaoOffline ? `Bonificação: ${bonificacaoOffline.titulo}.` : ''} ${penalidadeOffline ? `Penalidade: ${penalidadeOffline.titulo}.` : ''} Desfecho registrado.`;
  return {
    narrativa: desfecho,
    novo_contexto: novoCtx,
    bonificacao: bonificacaoOffline,
    penalidadeFalha: penalidadeOffline,
    recompensaXP: recompensaOffline,
    dano_ou_efeito: penalidadeOffline ? `${penalidadeOffline.descricao} (Perdeu o turno)` : bonificacaoOffline ? bonificacaoOffline.efeitoMecanico : null,
    sugestoes: sugerirAcoesOffline(novoCtx),
    source: "offline" as const,
  };
}

// Obter Orientação do Mestre quando o grupo está com dificuldades para avançar em direção ao desfecho
export async function obterOrientacaoDesfechoAI(params: {
  contexto: string;
  personagem: any;
  historicoRecente?: string;
}) {
  const { contexto, personagem, historicoRecente } = params;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Você é o Mestre da Masmorra de D&D 5ª Edição. O jogador ou grupo está com DIFICULDADES para avançar em direção ao clímax e DESFECHO da aventura atual.
Eles solicitaram uma orientação / dica tática ou narrativa do Mestre.

Contexto da aventura: ${contexto}
Personagem ativo: ${personagem?.nome || "Herói"} (${personagem?.classe || "Aventureiro"} ${personagem?.raca || ""})
Histórico recente: ${historicoRecente || "O grupo investiga a área buscando resolver o conflito principal."}

Como um Mestre de RPG experiente e generoso:
1. Dê uma dica narrativa sutil e atmosférica destacando uma pista, vulnerabilidade ou oportunidade no cenário que eles podem ter deixado passar (1 parágrafo curto).
2. Forneça de 2 a 3 caminhos/ações possíveis e claras que os colocam diretamente no rumo do clímax/desfecho da aventura.

Retorne estritamente o JSON:
{
  "dicaMestre": "Texto explicativo com a orientação do Mestre...",
  "caminhosDesfecho": [
    {
      "titulo": "Nome do Caminho 1",
      "acao": "Descrição da ação para o jogador executar",
      "foco": "Combate / Investigação / Diálogo / Audácia",
      "cd": 12,
      "atributo": "Percepção / Atletismo / etc"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = cleanJsonResponse(response.text || "");
      if (parsed.dicaMestre) {
        return {
          dicaMestre: parsed.dicaMestre,
          caminhosDesfecho: Array.isArray(parsed.caminhosDesfecho) ? parsed.caminhosDesfecho : [],
          source: "gemini" as const,
        };
      }
    } catch (e) {
      console.warn("Gemini falhou ao gerar orientação para desfecho:", e);
    }
  }

  // Fallback offline caso o Gemini esteja sem internet/chave
  return {
    dicaMestre: `O Mestre observa seus passos: há marcas recentes no solo e uma corrente de ar sutil escapando pelas fendas que indicam a passagem para o confronto final. Você pode usar sua intuição ou inspecionar os arredores com atenção para forçar o desfecho da missão.`,
    caminhosDesfecho: [
      {
        titulo: "Investigar a passagem oculta",
        acao: "Tateio as runas nas paredes em busca do mecanismo que destranca a câmara interior",
        foco: "Investigação",
        cd: 12,
        atributo: "Inteligência"
      },
      {
        titulo: "Confrontar o guardião diretamente",
        acao: "Avanço com arma em punho desafiando a entidade que governa este lugar para encerrar a ameaça",
        foco: "Combate / Audácia",
        cd: 13,
        atributo: "Força"
      },
      {
        titulo: "Canalizar percepção aguçada",
        acao: "Fecho os olhos e sinto os ecos do ambiente para localizar o ponto vital ou fraqueza da câmara",
        foco: "Percepção",
        cd: 11,
        atributo: "Sabedoria"
      }
    ],
    source: "offline" as const,
  };
}
