import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TurnTracker } from "./components/TurnTracker";
import { IniciativaModal } from "./components/IniciativaModal";
import { StoryFeed } from "./components/StoryFeed";
import { ActionInputBar } from "./components/ActionInputBar";
import { LobbyMesa } from "./components/LobbyMesa";
import { CharacterSheetModal } from "./components/CharacterSheetModal";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { DiceRollerModal } from "./components/DiceRollerModal";
import { TelegramBotConsole } from "./components/TelegramBotConsole";
import { LivroDoJogadorModal } from "./components/LivroDoJogadorModal";
import { calcularXpProximoNivel, verificarSubidaNivel } from "./data/livroDoJogadorData";
import {
  Personagem,
  Campanha,
  MensagemNarrativa,
  AtributoDnd,
  TesteResultado,
  RecompensaXP,
} from "./types";

const LOCAL_STORAGE_PLAYERS_KEY = "dnd_narrator_mesa_players";
const LOCAL_STORAGE_CAMPAIGN_KEY = "dnd_narrator_active_campaign";
const LOCAL_STORAGE_MESSAGES_KEY = "dnd_narrator_messages";
const LOCAL_STORAGE_EM_AVENTURA_KEY = "dnd_narrator_em_aventura";

export default function App() {
  // Lista de personagens dos jogadores participantes (suporta múltiplos jogadores simultâneos)
  const [personagens, setPersonagens] = useState<Personagem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Personagens canônicos da 5e para suportar múltiplos jogadores simultâneos de imediato
    return [
      {
        id: "char-1",
        nome: "Thorin Quebra-Escudo",
        jogadorNome: "Jogador 1",
        classe: "Guerreiro",
        raca: "Anão",
        antecedente: "Soldado",
        tendencia: "Leal e Bom",
        detalhes: "Guerreiro veterano das montanhas de ferro, destemido e honrado, com armadura pesada e machado de guerra.",
        atributos: {
          Força: 16,
          Destreza: 12,
          Constituição: 15,
          Inteligência: 10,
          Sabedoria: 13,
          Carisma: 11,
        },
        salvaguardasProficientes: ["Força", "Constituição"],
        periciasProficientes: ["Atletismo", "Intimidação", "Percepção", "Sobrevivência"],
        deslocamento: "7,5m (25 pés)",
        iniciativa: 1,
        bonusProficiencia: 2,
        moedas: { po: 15, pp: 5, pc: 10 },
        tracosPersonalidade: "Sempre alerta aos perigos; avalia cada situação com serenidade e coragem militar.",
        ideais: "Responsabilidade e Honra: Faço o que deve ser feito para resguardar o grupo e os indefesos.",
        vinculos: "Aqueles com quem combato ombro a ombro são os únicos a quem concedo minha vida.",
        defeitos: "Orgulho inflexível; reluto em recuar de um combate que considero justo.",
        historia: "Thorin nasceu nas minas profundas das Colinas de Ferro. Forjado em batalhas e cercos, carrega um machado ancestral herdado de seu clã e um juramento inabalável de proteger seus aliados e erradicar as trevas.",
        pvMax: 14,
        pvAtual: 14,
        ca: 18,
        nivel: 1,
        equipamento: ["Machado de Guerra", "Escudo de Aço (+2 CA)", "Cota de Malha (CA 16)", "Kit de Exploração de Masmorras", "Algibeira com 15 PO"],
        tracos: [
          "Retomar o Fôlego (Segunda Ação - Livro do Jogador pág. 72)",
          "Estilo de Luta: Defesa (+1 CA)",
          "Resiliência dos Anões (Vantagem contra Veneno)",
          "Visão no Escuro (18 metros)"
        ],
        source: "gemini",
      },
      {
        id: "char-2",
        nome: "Lyra Passofirme",
        jogadorNome: "Jogador 2",
        classe: "Ladino",
        raca: "Elfo",
        antecedente: "Criminoso",
        tendencia: "Caótico e Bom",
        detalhes: "Especialista ágil em desarmar armadilhas mecânicas, decifrar mecanismos e esgueirar-se nas sombras.",
        atributos: {
          Força: 10,
          Destreza: 16,
          Constituição: 12,
          Inteligência: 14,
          Sabedoria: 13,
          Carisma: 12,
        },
        salvaguardasProficientes: ["Destreza", "Inteligência"],
        periciasProficientes: ["Furtividade", "Prestidigitação", "Acrobacia", "Investigação", "Percepção"],
        deslocamento: "9m (30 pés)",
        iniciativa: 3,
        bonusProficiencia: 2,
        moedas: { po: 20, pp: 10, pc: 5 },
        tracosPersonalidade: "Curiosa e sagaz; prefere resolver conflitos pelas sombras e pelo intelecto rápido.",
        ideais: "Liberdade e Lealdade: Ninguém deve ser aprisionado por tiranos.",
        vinculos: "Minhas adagas e meus companheiros de aventura são minha única família.",
        defeitos: "Não resisto ao brilho de uma relíquia bem guardada em um pedestal suspeito.",
        historia: "Criada nas vielas labirínticas de Águas Profundas, Lyra aprendeu a decifrar runas arcanas e abrir fechaduras antes mesmo de segurar um arco curto.",
        pvMax: 9,
        pvAtual: 9,
        ca: 14,
        nivel: 1,
        equipamento: ["Rapieira Elegante", "Arco Curto e 20 Flechas", "Armadura de Couro", "Ferramentas de Ladrão", "Kit de Assaltante"],
        tracos: [
          "Ataque Furtivo (1d6)",
          "Gíria de Ladrão",
          "Ancestralidade Feérica (Vantagem contra Encantamento)",
          "Visão no Escuro (18 metros)"
        ],
        source: "gemini",
      },
      {
        id: "char-3",
        nome: "Eldrin Brilhoestelar",
        jogadorNome: "Jogador 3",
        classe: "Mago",
        raca: "Humano",
        antecedente: "Erudito",
        tendencia: "Neutro e Bom",
        detalhes: "Estudioso dos mistérios do multiverso, versado em rituais arcanos, línguas antigas e decifração de glifos.",
        atributos: {
          Força: 9,
          Destreza: 13,
          Constituição: 14,
          Inteligência: 16,
          Sabedoria: 13,
          Carisma: 11,
        },
        salvaguardasProficientes: ["Inteligência", "Sabedoria"],
        periciasProficientes: ["Arcanismo", "História", "Investigação", "Religião"],
        deslocamento: "9m (30 pés)",
        iniciativa: 1,
        bonusProficiencia: 2,
        moedas: { po: 25, pp: 0, pc: 0 },
        tracosPersonalidade: "Costumo anotar tudo em meu grimório e analisar padrões antes de agir.",
        ideais: "Conhecimento: Os mistérios do mundo foram feitos para serem compreendidos e protegidos.",
        vinculos: "Busco desvendar os segredos dos templos esquecidos antes que caiam em mãos nefastas.",
        defeitos: "Fico tão fascinado por inscrições antigas que às vezes ignoro o perigo imediato.",
        historia: "Eldrin dedicou anos aos arquivos da biblioteca de Candlekeep antes de partir em campo para estudar artefatos e rituais perdidos.",
        pvMax: 8,
        pvAtual: 8,
        ca: 11,
        nivel: 1,
        equipamento: ["Bordão de Freixo", "Grimório Arcano", "Bolsa de Componentes de Magia", "Mochila de Estudioso", "Foco Arcano (Cristal)"],
        tracos: [
          "Conjuração de Magias (Inteligência CD 13)",
          "Recuperação Arcana",
          "Magias Preparadas: Mísseis Mágicos, Escudo Arcano, Detectar Magia"
        ],
        source: "gemini",
      }
    ];
  });

  const [personagemAtivoIndex, setPersonagemAtivoIndex] = useState<number>(0);
  const [personagemVisualizadoFicha, setPersonagemVisualizadoFicha] = useState<Personagem | null>(null);
  const [sheetInitialTab, setSheetInitialTab] = useState<"combate" | "pericias" | "interpretacao" | "equipamento">("combate");

  // Marcador Ativo de Turnos para Jogadores Simultâneos
  const [rodada, setRodada] = useState<number>(() => {
    const saved = localStorage.getItem("dnd_rodada_atual");
    return saved ? Number(saved) : 1;
  });
  const [jogadoresQueAgiramIds, setJogadoresQueAgiramIds] = useState<string[]>([]);

  // Estado da Campanha e Histórico
  const [campanha, setCampanha] = useState<Campanha | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CAMPAIGN_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [mensagens, setMensagens] = useState<MensagemNarrativa[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Modo: Tela de Aventura (true) ou Tela da Mesa de Criação/Lobby (false)
  const [emAventura, setEmAventura] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_EM_AVENTURA_KEY);
    return saved ? JSON.parse(saved) : true;
  });

  const [aiStatus, setAiStatus] = useState<{ provider: string; hasKey: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals state
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);
  const [isTelegramConsoleOpen, setIsTelegramConsoleOpen] = useState(false);
  const [isLivroModalOpen, setIsLivroModalOpen] = useState(false);
  const [isIniciativaModalOpen, setIsIniciativaModalOpen] = useState(false);

  // Personagem ativo no momento
  const personagemAtivo = personagens[personagemAtivoIndex] || personagens[0] || null;

  // Sincroniza status do servidor na montagem
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({ provider: data.provider, hasKey: data.hasKey });
      })
      .catch((err) => {
        console.warn("Status offline:", err);
        setAiStatus({ provider: "offline-local", hasKey: false });
      });
  }, []);

  // Persistência local
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(personagens));
  }, [personagens]);

  useEffect(() => {
    if (campanha) {
      localStorage.setItem(LOCAL_STORAGE_CAMPAIGN_KEY, JSON.stringify(campanha));
    }
  }, [campanha]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(mensagens));
  }, [mensagens]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EM_AVENTURA_KEY, JSON.stringify(emAventura));
  }, [emAventura]);

  // Se não houver campanha inicial, inicia uma para primeira experiência
  useEffect(() => {
    if (!campanha && mensagens.length === 0) {
      handleStartAdventure();
    }
  }, []);

  // 1. Iniciar ou Reiniciar Aventura com o Grupo de Jogadores
  const handleStartAdventure = async (tema?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/campaign/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });
      const data = await res.json();
      if (data.success && data.aventura) {
        const novaCampanha: Campanha = {
          id: Math.random().toString(36).substring(2, 9),
          titulo: data.aventura.titulo,
          narrativa: data.aventura.narrativa,
          contexto: data.aventura.contexto,
          source: data.aventura.source,
          dataCriacao: new Date().toISOString(),
        };
        setCampanha(novaCampanha);

        const welcomeMsg: MensagemNarrativa = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tipo: "mestre",
          titulo: `Cena I: ${novaCampanha.titulo}`,
          conteudo: novaCampanha.narrativa,
          source: novaCampanha.source,
        };

        setMensagens([welcomeMsg]);
        setEmAventura(true);
      }
    } catch (err) {
      console.error("Erro ao iniciar campanha:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Criação Dinâmica de Ficha: Nome ➔ Raça ➔ Classe ➔ Arquétipos ➔ IA gera História ➔ Mostra Ficha
  const handleCreateCharacter = async (dados: {
    nome: string;
    jogadorNome?: string;
    classe: string;
    raca: string;
    antecedente?: string;
    tendencia?: string;
    detalhes?: string;
  }) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/character/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const data = await res.json();
      if (data.success && data.personagem) {
        const novoChar: Personagem = {
          ...data.personagem,
          id: Math.random().toString(36).substring(2, 9),
          jogadorNome: dados.jogadorNome || `Jogador ${personagens.length + 1}`,
        };

        setPersonagens((prev) => [...prev, novoChar]);
        setPersonagemAtivoIndex(personagens.length);

        // Notifica na timeline da aventura
        const notif: MensagemNarrativa = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tipo: "mestre",
          titulo: `Novo Herói na Mesa: ${novoChar.nome}!`,
          conteudo: `O aventureiro **${novoChar.nome}** (${novoChar.raca} ${novoChar.classe}, nível 1), controlado por **${novoChar.jogadorNome}**, entra na partida!\n\n*"${novoChar.historia}"*`,
        };
        setMensagens((prev) => [...prev, notif]);

        // Abre IMEDIATAMENTE a Ficha do Personagem com a História gerada pela IA
        setPersonagemVisualizadoFicha(novoChar);
        setSheetInitialTab("interpretacao");
        setIsCharacterSheetOpen(true);
      }
    } catch (err) {
      console.error("Erro ao criar personagem com IA:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para avançar o turno de forma sequencial entre jogadores simultâneos
  const avancarParaProximoTurno = (motivo?: "falha" | "sucesso" | "passou") => {
    if (personagens.length === 0) return;

    const charAtual = personagens[personagemAtivoIndex];
    const charId = charAtual?.id || `char-${personagemAtivoIndex}`;

    // Registra que este personagem agiu nesta rodada
    setJogadoresQueAgiramIds((prevAgiram) => {
      const updated = prevAgiram.includes(charId) ? prevAgiram : [...prevAgiram, charId];
      // Se todos os personagens da mesa agiram, inicia a nova rodada!
      if (updated.length >= personagens.length) {
        setRodada((r) => {
          const nextR = r + 1;
          localStorage.setItem("dnd_rodada_atual", String(nextR));
          return nextR;
        });
        return [];
      }
      return updated;
    });

    // Passa a vez para o próximo jogador da fila
    const nextIndex = (personagemAtivoIndex + 1) % personagens.length;
    setPersonagemAtivoIndex(nextIndex);
  };

  const handlePassarTurno = () => {
    if (personagens.length === 0) return;
    const atual = personagens[personagemAtivoIndex];
    const proximo = personagens[(personagemAtivoIndex + 1) % personagens.length];

    const msgPassar: MensagemNarrativa = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tipo: "sistema",
      conteudo: `⏳ ${atual.nome} (${atual.jogadorNome || "Jogador"}) aguarda em postura defensiva e passa o turno para ${proximo.nome} (${proximo.jogadorNome || "Jogador"}).`,
    };
    setMensagens((prev) => [...prev, msgPassar]);
    avancarParaProximoTurno("passou");
  };

  const handleNovaRodada = () => {
    setRodada((r) => {
      const nextR = r + 1;
      localStorage.setItem("dnd_rodada_atual", String(nextR));
      return nextR;
    });
    setJogadoresQueAgiramIds([]);
    const msgRodada: MensagemNarrativa = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tipo: "sistema",
      conteudo: `⚔️ A Rodada ${rodada + 1} se inicia! Todos os aventureiros recuperam sua oportunidade de agir.`,
    };
    setMensagens((prev) => [...prev, msgRodada]);
  };

  // Reorganiza a ordem dos jogadores na mesa baseado na disputa de iniciativa (garantida ou rolada no d20)
  const handleAplicarNovaOrdemIniciativa = (
    novaOrdem: Personagem[],
    mensagemNarrativa: string,
    _vencedorNome: string
  ) => {
    setPersonagens(novaOrdem);
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(novaOrdem));
    setPersonagemAtivoIndex(0); // O vencedor da iniciativa assume imediatamente a 1ª jogada!
    setJogadoresQueAgiramIds([]); // Reseta as ações para esta nova rodada/disputa

    const novaMsg: MensagemNarrativa = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tipo: "sistema",
      conteudo: mensagemNarrativa,
    };
    setMensagens((prev) => [...prev, novaMsg]);
  };

  // 3. Executar Ação Livre do Jogador Ativo
  const handleExecuteAcao = async (
    acao: string,
    opts?: { vantagem?: boolean; desvantagem?: boolean; personagemIndex?: number }
  ) => {
    const atorIndex = opts?.personagemIndex ?? personagemAtivoIndex;
    const ator = personagens[atorIndex] || personagemAtivo;

    if (!ator) {
      setIsCharacterCreatorOpen(true);
      return;
    }

    const playerMsg: MensagemNarrativa = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tipo: "jogador",
      titulo: `${ator.nome} (${ator.jogadorNome || "Jogador"})`,
      conteudo: acao,
    };

    setMensagens((prev) => [...prev, playerMsg]);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessaoContexto: campanha?.contexto || "Aventura nas terras de Faerûn",
          personagem: ator,
          acao,
          vantagem: opts?.vantagem,
          desvantagem: opts?.desvantagem,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const novasMensagens: MensagemNarrativa[] = [];

        // Se houve teste de dados do D&D, insere o card de rolagem
        if (data.teste) {
          novasMensagens.push({
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tipo: "dado",
            conteudo: `Teste de ${data.teste.atributo}: Total ${data.teste.total} vs CD ${data.teste.dificuldade}`,
            teste: data.teste,
          });
        }

        const teste = data.teste;
        const falhou = teste && !teste.sucesso;
        const penalidade = data.penalidadeFalha;

        // Processamento de XP e Interpretação (Roleplay)
        let recompensaProcessada: RecompensaXP | null = null;
        if (data.recompensaXP && typeof data.recompensaXP.xpGanho === "number") {
          const xpGanho = data.recompensaXP.xpGanho;
          const xpAnterior = ator.xp || 0;
          const nivelAnterior = ator.nivel || 1;
          const novoXpTotal = xpAnterior + xpGanho;
          const { subiu, novoNivel, bonusProf } = verificarSubidaNivel(novoXpTotal, nivelAnterior);
          const xpProx = calcularXpProximoNivel(novoNivel);

          recompensaProcessada = {
            xpGanho,
            desempenhoRoleplay: data.recompensaXP.desempenhoRoleplay || "Bom",
            motivoRoleplay: data.recompensaXP.motivoRoleplay || "Boa interpretação e postura de aventureiro.",
            subiuDeNivel: subiu,
            novoNivel: subiu ? novoNivel : undefined,
            xpTotal: novoXpTotal,
            xpProximoNivel: xpProx,
          };

          // Atualiza ficha do personagem na mesa
          setPersonagens((prev) =>
            prev.map((p, idx) => {
              if (idx === atorIndex) {
                const pvExtra = subiu ? (novoNivel - nivelAnterior) * 6 : 0;
                return {
                  ...p,
                  xp: novoXpTotal,
                  nivel: novoNivel,
                  bonusProficiencia: bonusProf,
                  pvMax: p.pvMax + pvExtra,
                  pvAtual: p.pvAtual + pvExtra,
                };
              }
              return p;
            })
          );
        }

        // NO CASO DE FALHA: Algo RUIM acontece e o jogador PERDE O TURNO!
        if (falhou) {
          // Desconta PV do personagem atual caso haja dano sofrido
          if (penalidade?.danoSofrido && penalidade.danoSofrido > 0) {
            setPersonagens((prev) =>
              prev.map((p, idx) => {
                if (idx === atorIndex) {
                  const novoPv = Math.max(0, p.pvAtual - penalidade.danoSofrido!);
                  return { ...p, pvAtual: novoPv };
                }
                return p;
              })
            );
          }

          const proximoJogador = personagens[(atorIndex + 1) % personagens.length];
          const penalidadeFormatada = penalidade
            ? {
                ...penalidade,
                proximoJogadorNome: proximoJogador?.jogadorNome
                  ? `${proximoJogador.jogadorNome} (${proximoJogador.nome})`
                  : proximoJogador?.nome,
                perdeuTurno: true,
              }
            : {
                titulo: "Falha no Teste: Consequência Hostil & Turno Perdido",
                descricao: `A ação de ${ator.nome} falhou contra a CD ${teste.dificuldade}. As forças do ambiente reagem contra você e seu turno é perdido!`,
                danoSofrido: 2,
                perdeuTurno: true,
                proximoJogadorNome: proximoJogador?.nome,
              };

          novasMensagens.push({
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tipo: "mestre",
            titulo: "⚠️ Ação Falhou & Turno Perdido!",
            conteudo: data.narrativa,
            penalidadeFalha: penalidadeFormatada,
            recompensaXP: recompensaProcessada || undefined,
            source: data.source,
          });

          // O jogador perde o turno: avança imediatamente para o próximo jogador
          avancarParaProximoTurno("falha");
        } else {
          // SUCESSO: Concede Bonificação por Sucesso e passa a vez para o próximo jogador
          novasMensagens.push({
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tipo: "mestre",
            titulo: "O Mestre da Masmorra Narra:",
            conteudo: data.narrativa,
            bonificacao: data.bonificacao || null,
            recompensaXP: recompensaProcessada || undefined,
            source: data.source,
          });

          // Sucesso conclui a vez do jogador nesta rodada e avança a iniciativa
          avancarParaProximoTurno("sucesso");
        }

        // Atualiza contexto da campanha
        if (data.novo_contexto && campanha) {
          setCampanha({
            ...campanha,
            contexto: data.novo_contexto,
          });
        }

        setMensagens((prev) => [...prev, ...novasMensagens]);
      }
    } catch (err) {
      console.error("Erro ao executar ação:", err);
      const errMsg: MensagemNarrativa = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tipo: "mestre",
        titulo: "Intervenção do Destino",
        conteudo: `As forças do destino se ajustam. A ação ecoa na câmara.`,
      };
      setMensagens((prev) => [...prev, errMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Solicitar Orientação do Mestre para o Desfecho da Aventura (quando em dificuldades)
  const handlePedirOrientacaoDesfecho = async () => {
    if (!personagemAtivo) return;
    setIsProcessing(true);

    try {
      const ultimasMensagens = mensagens.slice(-3).map((m) => m.conteudo).join(" | ");
      const res = await fetch("/api/action/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contexto: campanha?.contexto || "Exploração da masmorra",
          personagem: personagemAtivo,
          historicoRecente: ultimasMensagens,
        }),
      });

      const data = await res.json();
      if (data.success && data.orientacao) {
        const orientacaoMsg: MensagemNarrativa = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tipo: "sugestoes",
          titulo: "💡 Orientação do Mestre: Rumo ao Desfecho",
          conteudo: data.orientacao.dicaMestre,
          sugestoes: data.orientacao.caminhosDesfecho?.map((c: any) => ({
            acao: c.acao,
            cd: c.cd,
            risco: c.titulo,
            atributo: c.atributo,
          })),
          source: data.orientacao.source,
        };

        setMensagens((prev) => [...prev, orientacaoMsg]);
      }
    } catch (err) {
      console.error("Erro ao obter orientação:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Rolar atributo na ficha e enviar para a mesa
  const handleRollAttribute = async (atributo: AtributoDnd, valor: number) => {
    const alvo = personagemVisualizadoFicha || personagemAtivo;
    if (!alvo) return;
    try {
      const res = await fetch("/api/dice/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atributo,
          valorAtributo: valor,
          cd: 12,
          nomePersonagem: alvo.nome,
        }),
      });
      const data = await res.json();
      if (data.success && data.teste) {
        const msg: MensagemNarrativa = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tipo: "dado",
          conteudo: `Teste manual de ${atributo} (${alvo.nome})`,
          teste: data.teste,
        };
        setMensagens((prev) => [...prev, msg]);
        setIsCharacterSheetOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. Atualizar HP
  const handleUpdateHp = (novoPv: number) => {
    const alvo = personagemVisualizadoFicha || personagemAtivo;
    if (!alvo) return;
    setPersonagens((prev) =>
      prev.map((p) => (p.nome === alvo.nome ? { ...p, pvAtual: novoPv } : p))
    );
    if (personagemVisualizadoFicha && personagemVisualizadoFicha.nome === alvo.nome) {
      setPersonagemVisualizadoFicha({ ...personagemVisualizadoFicha, pvAtual: novoPv });
    }
  };

  // 7. Enviar rolagem avulsa do modal de dados para a história
  const handleSendRollToStory = (teste: TesteResultado, acaoCustom?: string) => {
    const msg: MensagemNarrativa = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      tipo: "dado",
      conteudo: acaoCustom || `Teste de ${teste.atributo}: Total ${teste.total} vs CD ${teste.dificuldade}`,
      teste,
    };
    setMensagens((prev) => [...prev, msg]);
    setIsDiceRollerOpen(false);
  };

  // 8. Remover personagem da mesa
  const handleRemoveCharacter = (index: number) => {
    setPersonagens((prev) => prev.filter((_, i) => i !== index));
    if (personagemAtivoIndex >= index && personagemAtivoIndex > 0) {
      setPersonagemAtivoIndex((prev) => prev - 1);
    }
  };

  // 9. Abrir Ficha de um Personagem específico
  const handleOpenSheetOf = (p: Personagem) => {
    setPersonagemVisualizadoFicha(p);
    setSheetInitialTab("combate");
    setIsCharacterSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 overflow-hidden">
      
      {/* Header com Navegação e Controles de Mesa */}
      <Header
        personagem={personagemAtivo}
        personagensCount={personagens.length}
        campanha={campanha}
        aiStatus={aiStatus}
        emAventura={emAventura}
        onAlternarModoVisualizacao={() => setEmAventura(!emAventura)}
        onOpenCharacterCreator={() => setIsCharacterCreatorOpen(true)}
        onOpenCharacterSheet={() => {
          setPersonagemVisualizadoFicha(personagemAtivo);
          setSheetInitialTab("combate");
          setIsCharacterSheetOpen(true);
        }}
        onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
        onOpenTelegramConsole={() => setIsTelegramConsoleOpen(true)}
        onOpenLivroDoJogador={() => setIsLivroModalOpen(true)}
        onNewCampaign={() => {
          setEmAventura(false);
        }}
        isProcessing={isProcessing}
      />

      {/* Palco Principal: Lobby de Criação da Mesa OU Aventura Ativa */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {!emAventura ? (
          <LobbyMesa
            personagens={personagens}
            onOpenCreator={() => setIsCharacterCreatorOpen(true)}
            onOpenSheet={handleOpenSheetOf}
            onRemoveCharacter={handleRemoveCharacter}
            onStartAdventure={handleStartAdventure}
            isProcessing={isProcessing}
          />
        ) : (
          <>
            {/* Marcador Ativo de Turno e Ordem de Iniciativa para Jogadores Simultâneos */}
            <TurnTracker
              personagens={personagens}
              turnoIndex={personagemAtivoIndex}
              rodada={rodada}
              jogadoresQueAgiramIds={jogadoresQueAgiramIds}
              onSelecionarTurno={(idx) => setPersonagemAtivoIndex(idx)}
              onPassarTurno={handlePassarTurno}
              onNovaRodada={handleNovaRodada}
              onAbrirCriadorJogador={() => setIsCharacterCreatorOpen(true)}
              onAbrirFicha={handleOpenSheetOf}
              onAbrirIniciativa={() => setIsIniciativaModalOpen(true)}
              disabled={isProcessing}
            />

            <StoryFeed
              mensagens={mensagens}
              personagem={personagemAtivo}
              campanha={campanha}
              isProcessing={isProcessing}
              onSelectSuggestion={(sug) => handleExecuteAcao(sug.acao)}
              onPedirOrientacao={handlePedirOrientacaoDesfecho}
            />

            {/* Input Bar com Ações Livres e Botão de Dica para o Desfecho */}
            <ActionInputBar
              onExecuteAcao={handleExecuteAcao}
              onPedirOrientacao={handlePedirOrientacaoDesfecho}
              isProcessing={isProcessing}
              disabled={!personagemAtivo}
              personagens={personagens}
              personagemAtivoIndex={personagemAtivoIndex}
              onMudarPersonagemAtivo={(idx) => setPersonagemAtivoIndex(idx)}
              onAbrirIniciativa={() => setIsIniciativaModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Modais */}
      <LivroDoJogadorModal
        isOpen={isLivroModalOpen}
        onClose={() => setIsLivroModalOpen(false)}
        onSelectPresetAdventure={(tema) => handleStartAdventure(tema)}
      />

      {personagemVisualizadoFicha && (
        <CharacterSheetModal
          personagem={personagemVisualizadoFicha}
          isOpen={isCharacterSheetOpen}
          onClose={() => setIsCharacterSheetOpen(false)}
          onRollAttribute={handleRollAttribute}
          onUpdateHp={handleUpdateHp}
          initialTab={sheetInitialTab}
        />
      )}

      <CharacterCreatorModal
        isOpen={isCharacterCreatorOpen}
        onClose={() => setIsCharacterCreatorOpen(false)}
        onCreateCharacter={handleCreateCharacter}
        isCreating={isProcessing}
        jogadorNumero={personagens.length + 1}
      />

      <DiceRollerModal
        isOpen={isDiceRollerOpen}
        onClose={() => setIsDiceRollerOpen(false)}
        personagem={personagemAtivo}
        onSendRollToStory={handleSendRollToStory}
      />

      <IniciativaModal
        isOpen={isIniciativaModalOpen}
        onClose={() => setIsIniciativaModalOpen(false)}
        personagens={personagens}
        onAplicarNovaOrdem={handleAplicarNovaOrdemIniciativa}
      />

      <TelegramBotConsole
        isOpen={isTelegramConsoleOpen}
        onClose={() => setIsTelegramConsoleOpen(false)}
        personagem={personagemAtivo}
        campanha={campanha}
        onExecuteAcao={(acao) => handleExecuteAcao(acao)}
        onStartCampaign={() => handleStartAdventure()}
        onOpenCharacterCreator={() => {
          setIsTelegramConsoleOpen(false);
          setIsCharacterCreatorOpen(true);
        }}
      />

    </div>
  );
}
