// bancoDeDados.js

const bancoDeDadosOlho = [
  {
    id: "orbita",
    nome: "Órbita",
    categoria: "Estruturas Anexas",
    descricao: "Arcabouço ósseo que contém e protege o globo ocular.",
    funcao: "Proteção e sustentação do globo ocular e seus anexos.",
    detalhesAnatomicos: [
      "Teto: ossos frontal e asas do esfenóide",
      "Assoalho: ossos maxilar, palatino e malar/zigomático",
      "Medial: ossos lacrimal e etmoidal",
      "Lateral: osso malar/zigomático",
      "Vascularização: Artéria oftálmica; Veias orbitárias sup e inf",
      "Forames: canal óptico, fissura orbitária superior e inferior"
    ],
    notasClinicas: [
      "Celulite orbitária: muitas vezes evolui de uma celulite palpebral. Causa febre e pode evoluir para encefalite ou meningite."
    ]
  },
  {
    id: "palpebra_sistema_lacrimal",
    nome: "Pálpebra e Sistema Lacrimal",
    categoria: "Estruturas Anexas",
    descricao: "Estruturas de proteção e lubrificação. Piscamos a cada 3 a 4 segundos.",
    funcao: "Proteção mecânica e lubrificação do olho (distribuição e drenagem da lágrima).",
    detalhesAnatomicos: [
      "Músculos: Orbicular (fecha - N. facial VII), Elevador da pálpebra (levanta - N. trigêmeo) e Tarsais.",
      "Sistema de escoamento: Pontos lacrimais -> canalículos -> saco lacrimal -> canal lácrimo-nasal (meato inferior).",
      "Glândulas Tarsais (Meibomius): produzem a parte lipídica da lágrima."
    ],
    notasClinicas: [
      "Ptose palpebral (queda da pálpebra).",
      "Hordéolo (terçol): inflamação das glândulas na margem palpebral.",
      "Dacriocistite: inflamação do saco lacrimal, pode ser causada por rinites ou sinusites etmoidais."
    ]
  },
  {
    id: "musculos_extraoculares",
    nome: "Músculos Extraoculares",
    categoria: "Estruturas Anexas",
    descricao: "Conjunto de 6 músculos responsáveis pela movimentação do globo ocular. Todos passam pela fissura orbitária superior (exceto oblíquo inferior).",
    funcao: "Movimentação ocular coordenada.",
    detalhesAnatomicos: [
      "Reto Superior: Elevação",
      "Reto Inferior: Depressão",
      "Reto Medial: Adução (N. oculomotor - III)",
      "Reto Lateral: Abdução (N. abducente - VI)",
      "Oblíquo Superior: Rotação (N. troclear - IV, insere na tróclea)",
      "Oblíquo Inferior: Rotação (N. oculomotor - III)"
    ],
    notasClinicas: []
  },
  {
    id: "conjuntiva",
    nome: "Conjuntiva",
    categoria: "Camada Externa",
    descricao: "Membrana mucosa fina e transparente que recobre desde a face interna das pálpebras (tarsal) até o epitélio corneano no limbo.",
    funcao: "Proteção e lubrificação (produz parte da lágrima).",
    detalhesAnatomicos: [
      "Nutrição: arco arterial marginal e artérias ciliares.",
      "Inervação: N. ciliares longos, frontal, lacrimal e infraorbitário (Trigêmeo)."
    ],
    notasClinicas: [
      "Conjuntivite viral: cursa com aumento de linfonodo.",
      "Hemorragia subconjuntival / Hiperemia conjuntival (olho vermelho)."
    ]
  },
  {
    id: "esclera",
    nome: "Esclera (Esclerocórnea)",
    categoria: "Camada Externa",
    descricao: "A famosa 'parte branca do olho'. Composta por fibras colágenas e é vascularizada.",
    funcao: "Dar forma e proteção mecânica ao globo ocular.",
    detalhesAnatomicos: [
      "Limbo esclerocorneano: junção de transição entre a córnea e a esclera (importante marco cirúrgico)."
    ],
    notasClinicas: [
      "Hifema: hemorragia de câmara anterior (relacionada ao trauma ocular que acomete essas estruturas externas e médias)."
    ]
  },
  {
    id: "cornea",
    nome: "Córnea",
    categoria: "Camada Externa",
    descricao: "Estrutura asférica, totalmente transparente e avascular, que cobre a íris. Possui 5 camadas.",
    funcao: "Proteção e principal meio de refração da luz para formação da imagem.",
    detalhesAnatomicos: [
      "Não é coberta por conjuntiva.",
      "Nutrição: depende da glicose do humor aquoso e do oxigênio da lágrima.",
      "Inervação: nervos ciliares longos."
    ],
    notasClinicas: []
  },
  {
    id: "iris",
    nome: "Íris",
    categoria: "Camada Média (Uveal)",
    descricao: "Estrutura colorida do olho, localizada atrás da córnea. Possui músculos e pigmentos.",
    funcao: "Controlar a entrada de luz através da abertura e fechamento da pupila.",
    detalhesAnatomicos: [
      "O seu ângulo é responsável por drenar o humor aquoso.",
      "Nutrição pelo círculo maior da íris e inervação pelos nervos ciliares longos."
    ],
    notasClinicas: [
      "Midríase: dilatação da pupila.",
      "Miose: contração da pupila."
    ]
  },
  {
    id: "corpo_ciliar",
    nome: "Corpo Ciliar",
    categoria: "Camada Média (Uveal)",
    descricao: "Estrutura triangular que vai da raiz da íris até a coróide.",
    funcao: "Produção de humor aquoso e acomodação visual.",
    detalhesAnatomicos: [
      "Processo ciliar: produz o humor aquoso.",
      "Músculo ciliar: liga-se ao suspensor do cristalino, alterando sua forma para focar distâncias diferentes."
    ],
    notasClinicas: []
  },
  {
    id: "coroide",
    nome: "Coróide",
    categoria: "Camada Média (Uveal)",
    descricao: "Porção posterior do trato uveal, localizada entre a esclera e a retina.",
    funcao: "Nutrição do globo ocular (camada riquíssima em vasos sanguíneos - coriocapilar).",
    detalhesAnatomicos: [
      "Limitada internamente pela membrana de Bruch e externamente pela supracoróide.",
      "Drenagem venosa feita pelas veias verticosas."
    ],
    notasClinicas: []
  },
  {
    id: "cristalino",
    nome: "Cristalino",
    categoria: "Meios Refringentes",
    descricao: "Lente natural do olho: biconvexa, avascular e transparente. Separa o segmento anterior do posterior.",
    funcao: "Focar os raios luminosos sobre a retina (acomodação visual).",
    detalhesAnatomicos: [
      "Visão de perto: músculo ciliar contrai e cristalino fica mais esférico.",
      "Visão de longe: músculo ciliar relaxa e cristalino reduz o diâmetro.",
      "À sua frente está o humor aquoso, atrás está o humor vítreo."
    ],
    notasClinicas: [
      "Catarata: opacidade do cristalino. Sinal patognomônico é a Leucocoria (pupila branca)."
    ]
  },
  {
    id: "humor_aquoso",
    nome: "Humor Aquoso",
    categoria: "Meios Refringentes",
    descricao: "Líquido transparente produzido pelos processos ciliares, escoado continuamente.",
    funcao: "Nutrição da córnea e do cristalino; manutenção da Pressão Intraocular (PIO).",
    detalhesAnatomicos: [
      "Passa da câmara posterior para a anterior (separadas pela íris).",
      "Drenado pelo seio camerular (ângulo do segmento anterior)."
    ],
    notasClinicas: [
      "Glaucoma: desbalanço na produção ou drenagem gera hipertensão intraocular, podendo afetar o nervo óptico."
    ]
  },
  {
    id: "vitreo",
    nome: "Humor Vítreo",
    categoria: "Meios Refringentes",
    descricao: "Corpo gelatinoso (rico em ácido hialurônico) que preenche a cavidade posterior.",
    funcao: "Manutenção da forma e transparência do olho; nutrição da retina interna.",
    detalhesAnatomicos: [
      "Envolvido pela membrana hialóide.",
      "Fica em contato e limitado pelo cristalino (anteriormente) e retina (posteriormente)."
    ],
    notasClinicas: []
  },
  {
    id: "retina",
    nome: "Retina",
    categoria: "Camada Interna (Neural)",
    descricao: "Múltiplas camadas de tecido neural localizada no segmento posterior. Onde a imagem se forma.",
    funcao: "Perceber a luz, analisar parcialmente e transferir o impulso nervoso para o cérebro.",
    detalhesAnatomicos: [
      "Fotorreceptores: Cones (visão de cores) e Bastonetes (visão noturna, penumbra e periférica).",
      "Mapeamento: fóvea, ora serrata (porção mais anterior) e pólo posterior (nervo óptico, mácula e arcadas vasculares)."
    ],
    notasClinicas: [
      "Retinopatia hipertensiva ou diabética: lesões vasculares observadas no exame de fundo de olho (oftalmoscopia ou OCT)."
    ]
  },
  {
    id: "nervo_optico",
    nome: "Nervo Óptico (Disco Óptico)",
    categoria: "Camada Interna (Neural)",
    descricao: "Tronco neural formado por cerca de um milhão de axônios das células ganglionares da retina. Início visualizado como 'Disco Óptico'.",
    funcao: "Transmissão da informação visual do olho para o córtex visual no cérebro.",
    detalhesAnatomicos: [
      "O disco óptico tem contorno bem definido e coloração amarelada.",
      "Trajeto: Sai da órbita pelo buraco óptico, penetra a cavidade craniana, sofre cruzamento (quiasma óptico), passa pelos corpos geniculados laterais e faz sinapse no córtex visual primário (lobos occipitais)."
    ],
    notasClinicas: [
      "Glaucoma avançado: o disco óptico pode ficar branco (atrofia peridiscal e escavação do nervo)."
    ]
  }
];

export default bancoDeDadosOlho;
