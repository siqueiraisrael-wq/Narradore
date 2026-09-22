// Compêndio oficial D&D 5ª Edição: LIVRO DO JOGADOR
// Dados canônicos do livro em português

export interface DndClasseInfo {
  nome: string;
  descricao: string;
  dadoVida: string;
  habilidadesPrimarias: string[];
  resistencia: string[];
  armasArmaduras: string;
  habilidadesNivel1: string[];
  subclassesExemplo: string[];
  vantagens: string[];
  desvantagens: string[];
  icone: string;
}

export interface DndRacaInfo {
  nome: string;
  descricao: string;
  aumentosAtributo: string;
  deslocamento: string;
  tamanho: string;
  tracosPrincipais: string[];
  subracas: string[];
  vantagens: string[];
  desvantagens: string[];
  icone: string;
}

export interface DndAntecedenteInfo {
  nome: string;
  descricao: string;
  pericias: string[];
  ferramentas: string;
  idiomas: string;
  equipamento: string;
  caracteristica: string;
}

export interface DndCondicaoInfo {
  nome: string;
  descricao: string;
}

export const CLASSES_DND: DndClasseInfo[] = [
  {
    nome: "Bárbaro",
    descricao: "Um feroz guerreiro de origem primitiva que pode entrar em fúria durante uma batalha.",
    dadoVida: "d12",
    habilidadesPrimarias: ["Força"],
    resistencia: ["Força", "Constituição"],
    armasArmaduras: "Armaduras leves e médias, escudos, armas simples e marciais",
    habilidadesNivel1: ["Fúria", "Defesa sem Armadura (10 + Des + Con)"],
    subclassesExemplo: ["Caminho do Furioso", "Caminho do Guerreiro Totêmico"],
    vantagens: [
      "Maior dado de vida de todo o jogo (d12)",
      "Fúria: Vantagem em testes de Força, bônus de dano corpo a corpo e resistência a corte, perfuração e concussão",
      "Defesa sem Armadura excelente com Constituição e Destreza"
    ],
    desvantagens: [
      "Não pode conjurar feitiços nem se concentrar em magias enquanto estiver em Fúria",
      "Alcance limitado: pouco eficaz em combates puramente à distância",
      "Salvaguardas mentais (Inteligência/Sabedoria/Carisma) vulneráveis"
    ],
    icone: "🪓"
  },
  {
    nome: "Bardo",
    descricao: "Um místico inspirador que possui poderes que ecoam a música da criação.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Carisma"],
    resistencia: ["Destreza", "Carisma"],
    armasArmaduras: "Armaduras leves, armas simples, bestas de mão, espadas longas, rapieiras, espadas curtas",
    habilidadesNivel1: ["Conjuração (Carisma)", "Inspiração de Bardo (d6)"],
    subclassesExemplo: ["Colégio do Conhecimento", "Colégio da Bravura"],
    vantagens: [
      "Inspiração de Bardo para apoiar aliados com dados adicionais em testes e ataques",
      "Conjurador pleno com acesso a magias de cura, encanto, ilusão e controle",
      "Pau pra Toda Obra: adiciona metade da proficiência em qualquer teste sem proficiência"
    ],
    desvantagens: [
      "Dado de vida mediano (d8)",
      "Proficiência apenas com armaduras leves",
      "Dano direto reduzido sem gastar espaços de magia"
    ],
    icone: "🪕"
  },
  {
    nome: "Bruxo",
    descricao: "Um portador de magia derivada de barganha com uma entidade planar transcendental.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Carisma"],
    resistencia: ["Sabedoria", "Carisma"],
    armasArmaduras: "Armaduras leves, armas simples",
    habilidadesNivel1: ["Patrono Transcendental (Arquifada, Corruptor, Grande Antigo)", "Magia de Pacto"],
    subclassesExemplo: ["Pacto da Corrente", "Pacto da Lâmina", "Pacto do Tomo"],
    vantagens: [
      "Magias recarregam em Descanso Curto (1 hora) em vez de descanso longo",
      "Rajada Mística: o truque ofensivo mais poderoso e confiável do D&D 5e",
      "Invocações Místicas para habilidades sobrenaturais passivas infinitas"
    ],
    desvantagens: [
      "Espaços de magia extremamente limitados (geralmente apenas 2 por encontro)",
      "Pouca proteção física (apenas armaduras leves e d8 de vida)",
      "Dependente de seu patrono sobrenatural e barganhas narrativas"
    ],
    icone: "👁️‍🗨️"
  },
  {
    nome: "Clérigo",
    descricao: "Um campeão sacerdotal que empunha magia divina a serviço de uma divindade maior.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Sabedoria"],
    resistencia: ["Sabedoria", "Carisma"],
    armasArmaduras: "Armaduras leves e médias, escudos, armas simples (e pesadas em certos domínios)",
    habilidadesNivel1: ["Conjuração (Sabedoria)", "Domínio Divino (Vida, Luz, Guerra, Tempestade, etc.)"],
    subclassesExemplo: ["Domínio da Vida", "Domínio da Guerra", "Domínio da Luz", "Domínio do Conhecimento"],
    vantagens: [
      "Grande variedade de feitiços divinos: curas essenciais, bênçãos, remoção de maldições e dano radiante",
      "Excelente classe de armadura (CA) com armaduras médias/pesadas e escudos",
      "Pode trocar todas as suas magias preparadas a cada descanso longo"
    ],
    desvantagens: [
      "Depende de Sabedoria alta e símbolo sagrado em mãos para conjurar",
      "Ataques com armas físicas ficam para trás em níveis mais altos",
      "Papel de suporte frequentemente cobrado pelos aliados"
    ],
    icone: "✨"
  },
  {
    nome: "Druida",
    descricao: "Um sacerdote da Crença Antiga, detentor dos poderes da natureza e metamorfose animal.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Sabedoria"],
    resistencia: ["Inteligência", "Sabedoria"],
    armasArmaduras: "Armaduras leves e médias (não-metálicas), escudos (não-metálicos), armas simples selecionadas",
    habilidadesNivel1: ["Druídico", "Conjuração (Sabedoria)"],
    subclassesExemplo: ["Círculo da Terra", "Círculo da Lua (Forma Selvagem de Combate)"],
    vantagens: [
      "Forma Selvagem: transforma-se em animais ganhando a vida e sentidos da fera",
      "Excelente controle de campo com magias de terreno, espinhos, névoas e tempestades",
      "Acesso a magias de cura e comunicação com animais e plantas"
    ],
    desvantagens: [
      "Tabu rígido contra o uso de armaduras e escudos feitos de metal",
      "Não pode conjurar feitiços enquanto estiver na Forma Selvagem nos níveis iniciais",
      "Muitas magias cruciais exigem Concentração contínua"
    ],
    icone: "🌿"
  },
  {
    nome: "Feiticeiro",
    descricao: "Um conjurador que possui magia latente advinda de sangue, bênção cósmica ou linhagem dracônica.",
    dadoVida: "d6",
    habilidadesPrimarias: ["Carisma"],
    resistencia: ["Constituição", "Carisma"],
    armasArmaduras: "Adagas, dardos, fundas, bordões, bestas leves (sem armaduras)",
    habilidadesNivel1: ["Conjuração (Carisma)", "Origem de Feitiçaria (Linhagem Dracônica / Magia Selvagem)"],
    subclassesExemplo: ["Linhagem Dracônica", "Magia Selvagem"],
    vantagens: [
      "Metamagia: pode dobrar alcance, conjurar feitiço como ação bônus ou afetar múltiplos alvos",
      "Proficiência nativa em salvaguardas de Constituição (ótimo para manter Concentração)",
      "Carisma elevado facilita interações sociais e persuasão"
    ],
    desvantagens: [
      "Menor dado de vida do jogo (d6)",
      "Nenhuma proficiência em armaduras (muito frágil defensivamente)",
      "Número pequeno de magias conhecidas em comparação com o Mago"
    ],
    icone: "🔥"
  },
  {
    nome: "Guerreiro",
    descricao: "Um mestre do combate, perito em uma vasta gama de armas, armaduras e manobras táticas.",
    dadoVida: "d10",
    habilidadesPrimarias: ["Força", "Destreza"],
    resistencia: ["Força", "Constituição"],
    armasArmaduras: "Todas as armaduras, escudos, armas simples e marciais",
    habilidadesNivel1: ["Estilo de Luta", "Retomar o Fôlego (1d10 + nível)"],
    subclassesExemplo: ["Campeão", "Cavaleiro Arcano", "Mestre de Batalha"],
    vantagens: [
      "Retomar o Fôlego: recupera vida como ação bônus em combate",
      "Surto de Ação: ganha uma ação inteira extra no mesmo turno",
      "Domínio total de todas as armaduras e armas do jogo, além de maior número de ataques"
    ],
    desvantagens: [
      "Sem habilidades mágicas inatas ou suporte curativo a aliados",
      "Vulnerável a salvaguardas de Inteligência, Sabedoria e Carisma",
      "Dependente de equipamento físico para manter alta eficácia"
    ],
    icone: "⚔️"
  },
  {
    nome: "Ladino",
    descricao: "Um especialista em furtividade, agilidade e golpes críticos calculados.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Destreza"],
    resistencia: ["Destreza", "Inteligência"],
    armasArmaduras: "Armaduras leves, armas simples, bestas de mão, espadas longas, rapieiras, espadas curtas",
    habilidadesNivel1: ["Especialização", "Ataque Furtivo (1d6)", "Gíria de Ladrão"],
    subclassesExemplo: ["Ladrão", "Assassino", "Trapaceiro Arcano"],
    vantagens: [
      "Ataque Furtivo: causa dano adicional massivo com vantagem ou aliado adjacente",
      "Especialização: dobra o bônus de proficiência em testes de perícias cruciais",
      "Ação Ardilosa: correr, desengajar ou esconder-se como ação bônus a cada turno"
    ],
    desvantagens: [
      "Vida moderada (d8) e apenas armaduras leves (não resiste a cerco prolongado)",
      "Dano depende estritamente das condições de Ataque Furtivo",
      "Poucas defesas contra múltiplos inimigos ao mesmo tempo"
    ],
    icone: "🗡️"
  },
  {
    nome: "Mago",
    descricao: "Um usuário de magia escolado, capaz de manipular a trama arcana através de estudo rigoroso.",
    dadoVida: "d6",
    habilidadesPrimarias: ["Inteligência"],
    resistencia: ["Inteligência", "Sabedoria"],
    armasArmaduras: "Adagas, dardos, fundas, bastões, bestas leves (sem armaduras)",
    habilidadesNivel1: ["Conjuração (Inteligência)", "Recuperação Arcana", "Grimório"],
    subclassesExemplo: ["Escola de Evocação", "Abjuração", "Adivinhação", "Ilusão", "Necromancia"],
    vantagens: [
      "O maior e mais flexível repertório de magias do D&D 5e",
      "Conjuração de Rituais direto do grimório sem gastar espaços de magia",
      "Recuperação Arcana recupera espaços de magia durante um descanso curto"
    ],
    desvantagens: [
      "Menor vida do jogo (d6) e nenhuma proficiência com armaduras",
      "Extremamente vulnerável se encurralado em combate corpo a corpo",
      "Perder ou ter o grimório destruído compromete a preparação de novas magias"
    ],
    icone: "🔮"
  },
  {
    nome: "Monge",
    descricao: "Um mestre das artes marciais desarmadas, canalizando o Chi para velocidade e golpes estonteantes.",
    dadoVida: "d8",
    habilidadesPrimarias: ["Destreza", "Sabedoria"],
    resistencia: ["Força", "Destreza"],
    armasArmaduras: "Armas simples, espadas curtas (sem armaduras)",
    habilidadesNivel1: ["Defesa sem Armadura (10 + Des + Sab)", "Artes Marciais (d4)"],
    subclassesExemplo: ["Caminho da Mão Aberta", "Caminho da Sombra", "Caminho dos Quatro Elementos"],
    vantagens: [
      "Artes Marciais: desfere ataques desarmados adicionais como ação bônus sem armas",
      "Defesa sem Armadura calculada com Destreza e Sabedoria",
      "Velocidade de movimento superior e capacidade de atordoar inimigos com Chi"
    ],
    desvantagens: [
      "Muito dependente de múltiplos atributos altos (Destreza, Sabedoria e Constituição)",
      "Vida d8 em combate de linha de frente exige cautela",
      "Poucas opções efetivas de combate à longa distância"
    ],
    icone: "🥋"
  },
  {
    nome: "Paladino",
    descricao: "Um guerreiro sagrado que combina poderio marcial com magia divina radiante e curas.",
    dadoVida: "d10",
    habilidadesPrimarias: ["Força", "Carisma"],
    resistencia: ["Sabedoria", "Carisma"],
    armasArmaduras: "Todas as armaduras, escudos, armas simples e marciais",
    habilidadesNivel1: ["Sentido Divino", "Cura pelas Mãos (nível x 5 PV)"],
    subclassesExemplo: ["Juramento de Devoção", "Juramento dos Anciões", "Juramento de Vingança"],
    vantagens: [
      "Destruição Divina: converte espaços de magia em dano radiante devastador",
      "Cura pelas Mãos: reserva fixa de cura e cura de venenos/doenças",
      "Armaduras pesadas e auras que concedem grandes bônus de salvaguarda ao grupo"
    ],
    desvantagens: [
      "Meio-conjurador: poucos espaços de magia por dia",
      "Preso a um juramento moral rigoroso que pode gerar conflitos narrativos",
      "Mobilidade limitada contra oponentes rápidos ou voadores"
    ],
    icone: "🛡️"
  },
  {
    nome: "Patrulheiro",
    descricao: "Um caçador e rastreador místico dos ermos, mestre do combate com arco e magia natural.",
    dadoVida: "d10",
    habilidadesPrimarias: ["Destreza", "Sabedoria"],
    resistencia: ["Força", "Destreza"],
    armasArmaduras: "Armaduras leves e médias, escudos, armas simples e marciais",
    habilidadesNivel1: ["Inimigo Favorito", "Explorador Natural"],
    subclassesExemplo: ["Conclave do Caçador", "Conclave da Besta", "Conclave do Rastreador Subterrâneo"],
    vantagens: [
      "Excelente combate à distância e precisão com arcos e bestas",
      "Inimigo Favorito e Explorador Natural concedem vantagens em rastreamento e navegação",
      "Vida sólida d10 com acesso a magias da natureza (Marca do Caçador, curas)"
    ],
    desvantagens: [
      "Algumas características são situacionais e dependem do tipo de terreno ou inimigo",
      "Depende de múltiplos atributos (Destreza, Sabedoria e Constituição)",
      "Espaços de magia limitados"
    ],
    icone: "🏹"
  }
];

export const RACAS_DND: DndRacaInfo[] = [
  {
    nome: "Anão",
    descricao: "Baixos e robustos, amantes da rocha, tradição clânica e mestres das forjas e minas.",
    aumentosAtributo: "+2 Constituição (+2 Força para Montanha ou +1 Sabedoria para Colina)",
    deslocamento: "7,5 metros",
    tamanho: "Médio (1,20m - 1,50m)",
    tracosPrincipais: ["Visão no Escuro (18m)", "Resiliência Anã", "Treinamento Anão em Combate", "Especialização em Rochas"],
    subracas: ["Anão da Colina", "Anão da Montanha", "Duergar"],
    vantagens: [
      "Resiliência Anã: Vantagem em salvaguardas contra veneno e resistência a dano de veneno",
      "Visão no Escuro de 18 metros em cavernas e masmorras",
      "Seu deslocamento não é reduzido pelo peso de armaduras pesadas"
    ],
    desvantagens: [
      "Deslocamento base reduzido de 7,5 metros (menor mobilidade tática em campo aberto)",
      "Menor alcance vertical para escaladas rápidas"
    ],
    icone: "🧔"
  },
  {
    nome: "Elfo",
    descricao: "Seres mágicos de graça sobrenatural, vivendo séculos em comunhão com florestas ancestrais ou magia.",
    aumentosAtributo: "+2 Destreza (+1 Inteligência para Alto Elfo, +1 Sabedoria para Floresta, +1 Carisma para Drow)",
    deslocamento: "9 metros (10,5m para Elfo da Floresta)",
    tamanho: "Médio (1,50m - 1,80m)",
    tracosPrincipais: ["Visão no Escuro (18m)", "Sentidos Aguçados", "Ancestral Feérico", "Transe"],
    subracas: ["Alto Elfo", "Elfo da Floresta", "Elfo Negro (Drow)"],
    vantagens: [
      "Ancestral Feérico: Vantagem contra ser enfeitiçado e magia não pode colocá-lo para dormir",
      "Sentidos Aguçados: Proficiência automática na perícia Percepção",
      "Transe: Precisa de apenas 4 horas de meditação em vez de 8 horas de sono"
    ],
    desvantagens: [
      "Constituição padrão menor sem bônus raciais diretos",
      "Drow sofre Sensibilidade à Luz Solar (desvantagem em ataques e percepção sob sol direto)"
    ],
    icone: "🧝"
  },
  {
    nome: "Halfling",
    descricao: "Pequenos, práticos e corajosos, sobrevivem aos perigos com furtividade, sorte e espírito comunitário.",
    aumentosAtributo: "+2 Destreza (+1 Carisma para Pés-Leves ou +1 Constituição para Robusto)",
    deslocamento: "7,5 metros",
    tamanho: "Pequeno (0,90m)",
    tracosPrincipais: ["Sortudo", "Bravura", "Agilidade Halfling"],
    subracas: ["Pés-Leves", "Robusto"],
    vantagens: [
      "Sortudo: Ao tirar um 1 natural em um d20 (ataque, teste ou resistência), pode rolar novamente!",
      "Bravura: Vantagem em salvaguardas contra ficar Amedrontado",
      "Agilidade Halfling: Pode mover-se pelo espaço de qualquer criatura de tamanho maior que o seu"
    ],
    desvantagens: [
      "Tamanho Pequeno: Sofre Desvantagem em jogadas de ataque com armas 'Pesadas' (machadões, espadas de 2 mãos)",
      "Deslocamento reduzido de 7,5 metros"
    ],
    icone: "👣"
  },
  {
    nome: "Humano",
    descricao: "A mais jovem e ambiciosa das raças comuns, mestres da adaptação em todos os territórios do multiverso.",
    aumentosAtributo: "+1 em todos os 6 atributos (ou +1 em dois atributos + 1 talento na variante)",
    deslocamento: "9 metros",
    tamanho: "Médio (1,50m - 1,90m)",
    tracosPrincipais: ["Adaptabilidade universal", "Idioma adicional", "Amplo espectro de culturas e etnias"],
    subracas: ["Humano Padrão", "Humano Variante"],
    vantagens: [
      "Aumento em todos os 6 atributos (+1 em Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma)",
      "Total adaptabilidade a qualquer classe, função tática ou estilo de jogo",
      "Facilidade de inserção em qualquer cidade ou sociedade"
    ],
    desvantagens: [
      "Não possui Visão no Escuro natural (necessita de tocha, luz mágica ou lâmpada nas trevas)",
      "Sem resistências inatas a tipos de dano ou venenos"
    ],
    icone: "👤"
  },
  {
    nome: "Draconato",
    descricao: "Orgulhosos guerreiros com herança direta de dragões, honram o clã e empunham sopros elementais.",
    aumentosAtributo: "+2 Força, +1 Carisma",
    deslocamento: "9 metros",
    tamanho: "Médio (1,80m - 2,00m)",
    tracosPrincipais: ["Ancestral Dracônico", "Arma de Sopro Elemental", "Resistência a Dano Elemental"],
    subracas: ["Linhagem Cromática", "Linhagem Metálica"],
    vantagens: [
      "Arma de Sopro: Causa 2d6 de dano em área (Fogo, Gelo, Relâmpago, Ácido ou Veneno)",
      "Resistência a Dano: Recebe metade do dano do tipo elemental associado ao seu ancestral",
      "Bônus substancial de +2 Força e +1 Carisma para classes marciais ou carismáticas"
    ],
    desvantagens: [
      "Não possui Visão no Escuro",
      "O sopro elemental recarrega apenas após Descanso Curto ou Longo"
    ],
    icone: "🐲"
  },
  {
    nome: "Gnomo",
    descricao: "Pequenos inventores e estudiosos entusiasmados, amantes de engenhocas mecânicas e magia ilusória.",
    aumentosAtributo: "+2 Inteligência (+1 Destreza para Floresta ou +1 Constituição para Rochas)",
    deslocamento: "7,5 metros",
    tamanho: "Pequeno (0,90m - 1,20m)",
    tracosPrincipais: ["Visão no Escuro (18m)", "Esperteza Gnômica"],
    subracas: ["Gnomo da Floresta", "Gnomo das Rochas", "Svirfneblin"],
    vantagens: [
      "Esperteza Gnômica: Vantagem em TODAS as salvaguardas de Inteligência, Sabedoria e Carisma contra magia!",
      "Visão no Escuro de 18 metros",
      "+2 Inteligência ideal para conjuradores arcanos e investigadores"
    ],
    desvantagens: [
      "Tamanho Pequeno: Desvantagem ao usar armas com propriedade Pesada",
      "Deslocamento reduzido de 7,5 metros"
    ],
    icone: "🎩"
  },
  {
    nome: "Meio-Elfo",
    descricao: "Unem a curiosidade e ambição humanas com a graça sobrenatural e sensos aguçados dos elfos.",
    aumentosAtributo: "+2 Carisma, +1 em outros dois atributos à sua escolha",
    deslocamento: "9 metros",
    tamanho: "Médio (1,50m - 1,80m)",
    tracosPrincipais: ["Visão no Escuro (18m)", "Ancestral Feérico", "Versatilidade em Perícia"],
    subracas: ["De Dois Mundos"],
    vantagens: [
      "Excelente distribuição de atributos: +2 Carisma e +1 livre em outros dois atributos",
      "Versatilidade em Perícia: ganha proficiência em 2 perícias extras livres à sua escolha",
      "Ancestral Feérico (vantagem contra encanto e imune a sono mágico) e Visão no Escuro"
    ],
    desvantagens: [
      "Não possui Transe (precisa de 8 horas normais de descanso longo como humanos)",
      "Sentimento de não pertencer completamente nem ao mundo humano nem ao élfico"
    ],
    icone: "🌟"
  },
  {
    nome: "Meio-Orc",
    descricao: "Marcados por força formidável, cicatrizes de batalha e tenacidade inquebrável herdada de Gruumsh.",
    aumentosAtributo: "+2 Força, +1 Constituição",
    deslocamento: "9 metros",
    tamanho: "Médio (1,80m - 2,10m)",
    tracosPrincipais: ["Visão no Escuro (18m)", "Ameaçador", "Resistência Implacável", "Ataques Selvagens"],
    subracas: ["Sangue da Horda"],
    vantagens: [
      "Resistência Implacável: Ao ser reduzido a 0 PV sem morrer, cai para 1 PV em vez disso (1x por descanso longo)",
      "Ataques Selvagens: Rola um dado de dano adicional na arma ao acertar um Acerto Crítico",
      "Ameaçador: Proficiência gratuita na perícia Intimidação, mais Visão no Escuro"
    ],
    desvantagens: [
      "Sem recursos mágicos ou defesas contra magias mentais",
      "Preconceito frequente em povoados civilizados"
    ],
    icone: "👹"
  },
  {
    nome: "Tiefling",
    descricao: "Portadores da linhagem infernal dos Nove Infernos, com chifres, cauda e magia sombria.",
    aumentosAtributo: "+2 Carisma, +1 Inteligência",
    deslocamento: "9 metros",
    tamanho: "Médio",
    tracosPrincipais: ["Visão no Escuro (18m)", "Resistência Infernal", "Legado Infernal"],
    subracas: ["Linhagem de Asmodeus"],
    vantagens: [
      "Resistência Infernal: Resistência a dano de Fogo (recebe metade do dano de fogo)",
      "Legado Infernal: Magias inatas gratuitas (Taumaturgia, Repreensão Infernal e Escuridão)",
      "Visão no Escuro de 18 metros e +2 Carisma"
    ],
    desvantagens: [
      "Estigma social severo em vilarejos temerosos de forças demoníacas",
      "Magias de legado têm recargas diárias fixas"
    ],
    icone: "😈"
  }
];

export const ANTECEDENTES_DND: DndAntecedenteInfo[] = [
  {
    nome: "Acólito",
    descricao: "Viveu a serviço de um templo ou divindade, agindo como intermediário sagrado nos mistérios divinos.",
    pericias: ["Intuição", "Religião"],
    ferramentas: "Nenhuma",
    idiomas: "Dois à sua escolha",
    equipamento: "Símbolo sagrado, livro de preces/contas, 5 varetas de incenso, vestes e 15 po",
    caracteristica: "Abrigo dos Fiéis: Refúgio, cura e caridade gratuita em templos da sua fé."
  },
  {
    nome: "Artesão de Guilda",
    descricao: "Membro estabelecido de uma guilda mercantil, mestre de um ofício e conhecedor do comércio.",
    pericias: ["Intuição", "Persuasão"],
    ferramentas: "Um tipo de ferramenta de artesão",
    idiomas: "Um à sua escolha",
    equipamento: "Ferramentas de artesão, carta da guilda, roupas de viajante, 15 po",
    caracteristica: "Associados da Guilda: Hospedagem, apoio político, aliados e defesa legal da guilda."
  },
  {
    nome: "Artista",
    descricao: "Cresceu diante de audiências, fascinando multidões com poesias, canções, malabares ou teatro.",
    pericias: ["Acrobacia", "Atuação"],
    ferramentas: "Kit de disfarce, um instrumento musical",
    idiomas: "Nenhum adicional",
    equipamento: "Instrumento musical, presente de admirador, traje e 15 po",
    caracteristica: "Pela Demanda Popular: Comida e hospedagem grátis em tavernas e cortes em troca de apresentações."
  },
  {
    nome: "Charlatão",
    descricao: "Mestre em desvendar o que as pessoas desejam e vender promessas de ouro e ilusões.",
    pericias: ["Enganação", "Prestidigitação"],
    ferramentas: "Kit de disfarce, kit de falsificação",
    idiomas: "Nenhum adicional",
    equipamento: "Roupas finas, kit de disfarce, ferramentas de trapaça (dados viciados, etc.), 15 po",
    caracteristica: "Identidade Falsa: Documentos forjados oficiais e persona alternativa estabelecida."
  },
  {
    nome: "Criminoso",
    descricao: "Experiente no submundo do crime, com contatos na rede de ladrões e desprezo pelas leis rígidas.",
    pericias: ["Enganação", "Furtividade"],
    ferramentas: "Ferramentas de ladrão, um kit de jogos",
    idiomas: "Nenhum adicional",
    equipamento: "Pé de cabra, roupas escuras comuns com capuz, 15 po",
    caracteristica: "Contato Criminal: Rede segura de informantes e mensageiros ilegais."
  },
  {
    nome: "Eremita",
    descricao: "Viveu anos em reclusão contemplativa em um monastério ou ermo isolado em busca de iluminação.",
    pericias: ["Medicina", "Religião"],
    ferramentas: "Kit de herbalismo",
    idiomas: "Um à sua escolha",
    equipamento: "Estojo com estudos, cobertor de inverno, roupas comuns, kit de herbalismo, 5 po",
    caracteristica: "Descoberta: Conhecimento de um segredo primordial cósmico ou profecia esquecida."
  },
  {
    nome: "Forasteiro",
    descricao: "Cresceu nas terras selvagens indomadas, acostumado ao isolamento, sobrevivência e às intempéries.",
    pericias: ["Atletismo", "Sobrevivência"],
    ferramentas: "Um tipo de instrumento musical",
    idiomas: "Um à sua escolha",
    equipamento: "Bordão, armadilha de caça, fetiche de animal, roupas de viajante, 10 po",
    caracteristica: "Andarilho: Memória perfeita para mapas e encontra água e comida fresca para até 6 pessoas."
  },
  {
    nome: "Herói do Povo",
    descricao: "Camponês humilde cuja coragem diante da tirania ou de um monstro inspirou sua vila como defensor.",
    pericias: ["Adestrar Animais", "Sobrevivência"],
    ferramentas: "Ferramentas de artesão, veículos terrestres",
    idiomas: "Nenhum adicional",
    equipamento: "Ferramentas de artesão, pá, pote de ferro, roupas comuns, 10 po",
    caracteristica: "Hospitalidade Rústica: Camponeses fornecem abrigo, comida e proteção contra a lei."
  },
  {
    nome: "Marinheiro",
    descricao: "Passou anos nos conveses de navios enfrentando monstros das profundezas e tempestades colossais.",
    pericias: ["Atletismo", "Percepção"],
    ferramentas: "Ferramentas de navegador, veículos aquáticos",
    idiomas: "Nenhum adicional",
    equipamento: "Clava/malagueta, 15m corda de seda, amuleto da sorte, roupas comuns, 10 po",
    caracteristica: "Passagem de Navio: Viagem de graça em navios mercantes para o grupo em troca de serviço."
  },
  {
    nome: "Nobre",
    descricao: "Herdeiro de terras, riqueza e prestígio político, educado com nobres costumes e autoridade social.",
    pericias: ["História", "Persuasão"],
    ferramentas: "Um tipo de kit de jogos",
    idiomas: "Um à sua escolha",
    equipamento: "Trajes finos, anel de sinete, pergaminho de linhagem, 25 po",
    caracteristica: "Posição Privilegiada: Audiência garantida com aristocratas e alta deferência popular."
  },
  {
    nome: "Órfão",
    descricao: "Cresceu sozinho nas ruas e becos das cidades, sobrevivendo pela astúcia e agilidade cruas.",
    pericias: ["Furtividade", "Prestidigitação"],
    ferramentas: "Kit de disfarce, ferramentas de ladrão",
    idiomas: "Nenhum adicional",
    equipamento: "Faca pequena, mapa da cidade natal, rato de estimação, roupas comuns, 10 po",
    caracteristica: "Segredos da Cidade: Viagem urbana com o dobro da velocidade através de atalhos e passagens."
  },
  {
    nome: "Sábio",
    descricao: "Dedicou a vida ao estudo de tomos antigos, pergaminhos e às bibliotecas dos grandes arquimagos.",
    pericias: ["Arcanismo", "História"],
    ferramentas: "Nenhuma",
    idiomas: "Dois à sua escolha",
    equipamento: "Tinta, pena, faca pequena, carta de colega falecido com enigma, roupas comuns, 10 po",
    caracteristica: "Pesquisador: Sabe exatamente onde e com quem encontrar qualquer fragmento esquecido de conhecimento."
  },
  {
    nome: "Soldado",
    descricao: "Treinado nas táticas militares de um exército, companhia mercenária ou patrulha de guarda.",
    pericias: ["Atletismo", "Intimidação"],
    ferramentas: "Kit de jogos, veículos terrestres",
    idiomas: "Nenhum adicional",
    equipamento: "Insígnia de patente, fetiche de inimigo derrotado, dados de osso, roupas comuns, 10 po",
    caracteristica: "Patente Militar: Comandantes e soldados prestam deferência e concedem cavalos ou armas simples."
  }
];

export const CONDICOES_DND: DndCondicaoInfo[] = [
  { nome: "Agarrado", descricao: "Deslocamento se torna 0. A condição encerra se o agarrador for incapacitado ou forçado para longe." },
  { nome: "Amedrontado", descricao: "Desvantagem em testes de habilidade e jogadas de ataque enquanto a fonte do medo estiver visível. Não pode se aproximar voluntariamente." },
  { nome: "Atordoado", descricao: "Incapacitado (não realiza ações), não se move e fala hesitantemente. Falha automática em testes de Força e Destreza. Ataques contra têm vantagem." },
  { nome: "Caído", descricao: "Só pode rastejar (custa o dobro) até se levantar (custa metade do deslocamento). Ataques a 1,5m contra têm vantagem; além disso, desvantagem." },
  { nome: "Cego", descricao: "Falha automática em testes que requerem visão. Ataques do personagem têm desvantagem, e ataques contra ele têm vantagem." },
  { nome: "Enfeitiçado", descricao: "Não pode atacar quem o enfeitiçou. Quem o enfeitiçou tem vantagem em testes sociais com a criatura." },
  { nome: "Envenenado", descricao: "Sofre desvantagem em jogadas de ataque e testes de habilidade devido a toxinas no organismo." },
  { nome: "Impedido", descricao: "Deslocamento se torna 0. Ataques do personagem têm desvantagem; ataques contra têm vantagem. Desvantagem em testes de Destreza." },
  { nome: "Incapacitado", descricao: "Não pode realizar ações nem reações no seu turno ou fora dele." },
  { nome: "Inconsciente", descricao: "Incapacitado, larga o que segurava e cai no chão. Falha automática em testes de Força e Destreza. Ataques a 1,5m que atinjam são acertos críticos automáticos." },
  { nome: "Invisível", descricao: "Impossível de ser visto por visão normal. Ataques do personagem têm vantagem; ataques contra ele têm desvantagem." },
  { nome: "Paralisado", descricao: "Incapacitado e não pode se mover nem falar. Falha automática em Força e Destreza. Ataques contra têm vantagem; a 1,5m são acertos críticos automáticos." },
  { nome: "Petrificado", descricao: "Transformado em pedra. Peso x10. Incapacitado, cego para o exterior, resistência a todos os danos, imune a venenos e doenças." },
  { nome: "Surdo", descricao: "Falha automática em qualquer teste que necessite de audição." },
  { nome: "Exaustão", descricao: "Nível 1: Desvantagem em perícias; Nível 2: Deslocamento / 2; Nível 3: Desvantagem em ataques/resistências; Nível 4: PV Máximo / 2; Nível 5: Deslocamento 0; Nível 6: Morte." }
];

export const REGRAS_ESSENCIAIS_DND = {
  tresPilares: [
    {
      titulo: "Exploração",
      texto: "A exploração envolve o movimento pelo mundo e a investigação de locais desconhecidos, ruínas e masmorras."
    },
    {
      titulo: "Interação Social",
      texto: "A interação social ocorre quando os aventureiros conversam com PNJs, negociam, persuadem ou intimidam habitantes do mundo."
    },
    {
      titulo: "Combate",
      texto: "O combate é um confronto tático estruturado em turnos utilizando iniciativa, jogadas de ataque, dano e salvaguardas."
    }
  ],
  regrasOuro: [
    {
      titulo: "Regra Específica sobre a Geral",
      texto: "Se uma regra específica contradiz uma regra geral, a regra específica vence."
    },
    {
      titulo: "Arredonde para Baixo",
      texto: "Sempre que precisar dividir um número no jogo, arredonde para baixo, mesmo se a fração for 0,5 ou maior."
    }
  ],
  escalaCD: [
    { nivel: "Muito Fácil", cd: 5, desc: "Tarefa simples sem grande resistência" },
    { nivel: "Fácil", cd: 10, desc: "Desafio básico para aventureiros iniciantes" },
    { nivel: "Moderado", cd: 15, desc: "Desafio padrão para testes de perícia" },
    { nivel: "Difícil", cd: 20, desc: "Tarefa complexa que exige especialização" },
    { nivel: "Muito Difícil", cd: 25, desc: "Feito heroico de alto nível" },
    { nivel: "Quase Impossível", cd: 30, desc: "Desafio lendário reservado a divindades ou mestres" }
  ]
};

export const TABELA_XP_DND: { nivel: number; xpNecessario: number; bonusProf: number }[] = [
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

export function verificarSubidaNivel(xpAtual: number, nivelAtual: number): { subiu: boolean; novoNivel: number; bonusProf: number } {
  let novoNivel = nivelAtual;
  let bonusProf = 2;
  for (const tab of TABELA_XP_DND) {
    if (xpAtual >= tab.xpNecessario) {
      novoNivel = Math.max(novoNivel, tab.nivel);
      bonusProf = tab.bonusProf;
    }
  }
  return {
    subiu: novoNivel > nivelAtual,
    novoNivel,
    bonusProf,
  };
}

