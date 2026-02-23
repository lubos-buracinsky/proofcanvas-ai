export const komfiCanvasBlocks = {
  problem: [
    'Stárnoucí populace bez integrované domácí péče',
    'Roztříštěné služby — jídlo, diagnostika, komunita řešeny odděleně',
    'Chybějící prevence a datová návaznost mezi službami',
  ],
  'existing-alternatives': [
    'Rozvozy jídla bez zdravotní vazby',
    'Klinická diagnostika (nutnost návštěvy)',
    'Obecní sociální služby (fragmentované)',
  ],
  solution: [
    'Bistro — kvalitní domácí stravování s pravidelným kontaktem',
    'Vitalita — domácí krevní odběry + AI interpretace výsledků',
    'Komunita — obecní partnerství pro integrovaný model péče',
  ],
  'key-metrics': [
    '250 aktivních klientů Bistro',
    'Cíl 100+ zapojených obcí do konce 2026',
    'Retence klientů a pilot konverze',
    'Unit economics na klienta',
  ],
  'unique-value': [
    'První integrovaný model domácí péče v ČR',
    'Domácí krevní odběry bez návštěvy kliniky',
    'AI interpretace zdravotních dat',
    'Propojení výživy, prevence a komunity',
  ],
  'unfair-advantage': [
    'First-mover v integrované domácí péči',
    'Infrastruktura domácích odběrů',
    'Síť obcí a obecních partnerství',
    'Regulatorní positioning (screening, ne léčba)',
  ],
  channels: [
    'Obecní GTM (starostové, sociální odbory)',
    'Přímý zákaznický kanál',
    'Zdravotnická partnerství',
    'PR / earned media strategie',
  ],
  'customer-segments': [
    'Senioři 65+ (primární)',
    'Sandwich generace (pečující na dálku)',
    'Obce a komunální správa',
    'Wellness early adopters',
  ],
  'early-adopters': [
    'Senioři v pilotních obcích',
    'Rodiny pečující na dálku',
    'Proaktivní obce hledající sociální inovace',
  ],
  'cost-structure': [
    'Supply chain a logistika (Bistro)',
    'Laboratorní zpracování (Vitalita)',
    'Team operations a headcount',
    'AI infrastruktura a vývoj',
    'Obecní onboarding a podpora',
  ],
  'revenue-streams': [
    'Členství 199–299 Kč/měs',
    'Jídla 59–99 Kč / porce',
    'Vitalita testy (premium)',
    'Obecní kontrakty a partnerství',
  ],
  // ── ProofLoop proprietary blocks ──
  'ai-lever': [
    'Scoring obcí a prioritizace outreach — vyšší throughput kvalifikace',
    'Interpretace Vitalita výsledků — zkrácení času od měření k doporučení',
    'Ops automation v terénních procesech — násobení kapacity bez lineárního růstu headcountu',
    'Model risk v zdravotním jazyce — nutná striktní claim governance (screening vs. léčba)',
  ],
  'expansion-triggers': [
    '100+ zapojených obcí do konce 2026',
    '1 000+ aktivních Bistro klientů do konce 2026',
    'Vitalita rollout po pilotu s pravidelným 6měsíčním retestem',
    'Pojišťovnová / externí partnerství pro širší dostupnost',
    'Stabilní retention při multi-service orchestration',
  ],
  'evidence-gap': [
    'Core směr dobře popsaný a částečně ověřený trakcí',
    'Vitalita v plném měřítku zatím v pilotní fázi',
    'Partnerství s pojišťovnami v přípravě, nevalidováno',
    'Unit economics Bistro ověřeno, Komunita a Vitalita předpokládáno',
  ],
}

export const komfiCompanyMeta = {
  name: 'Komfi',
  thesis: 'Membership-driven domácí péče propojující výživu, prevenci a navazující služby pro stárnoucí populaci.',
  stage: 'ACT I → II',
  proofScore: 68,
  evidenceGap: 39,
}

export const komfiCompanyProfile = {
  founded: '2023',
  location: 'Česká republika',
  stage: 'Pre-Seed',
  funding: 'Bootstrapped + angel',
  market: 'Home care & preventive health',
  model: 'B2C membership + B2G municipal contracts',
  tam: 'CZ senior home care — 2.1M osob 65+, rostoucí 3 % ročně',
  team: [
    { initials: 'JN', name: 'Jan Novák', role: 'CEO / Founder', color: '#dbeafe', textColor: '#1e40af', bio: '10+ let v healthtech a municipální strategii. Propojuje byznys vizi s terénním execution.', bioFull: 'Předtím vedl expanzi domácí péče v regionálním řetězci se 40+ pobočkami. Založil Komfi na průsečíku tří trendů — stárnoucí populace, decentralizace péče a AI-driven prevence. Zodpovědný za celkovou strategii, klíčová partnerství s obcemi a fundraising.', linkedin: 'https://linkedin.com/in/' },
    { initials: 'PK', name: 'Petr Kovář', role: 'COO', color: '#fef3c7', textColor: '#92400e', bio: 'Operační pozadí v logistice a food delivery. Vybudoval supply chain Bistro od nuly.', bioFull: 'Předchozí zkušenost v operations u Dáme jídlo a v logistickém startupu. Navrhl celý provozní model Bistro — od centrální kuchyně po last-mile delivery optimalizaci. Řeší škálovatelnost rozvozu, procesní efektivitu a unit economics při rychlé expanzi do nových regionů.', linkedin: 'https://linkedin.com/in/' },
    { initials: 'EV', name: 'Eva Veselá', role: 'Head of Vitalita', color: '#dcfce7', textColor: '#166534', bio: 'Biochemistka s praxí v diagnostických laboratořích. Navrhla Vitalita flow od odběru po AI interpretaci.', bioFull: 'Ph.D. v klinické biochemii, 6 let v laboratorní diagnostice. Vyvinula proprietární protokol domácích odběrů s důrazem na bezpečnost a uživatelský komfort. Spolupracuje s AI týmem na interpretační vrstvě, která překládá výsledky do srozumitelných doporučení — vždy v rámci screening framingu bez léčebných claimů.', linkedin: 'https://linkedin.com/in/' },
    { initials: 'MH', name: 'Marie Horáková', role: 'Brand & Growth', color: '#fce7f3', textColor: '#9d174d', bio: 'PR a brand strategie pro zdravotnické startupy. Buduje trust-driven acquisition.', bioFull: 'Předtím brand lead v health-tech agentuře, kde řídila komunikaci pro 3 startupy od pre-seedu po Series A. V Komfi zodpovědná za earned media strategii, PR sprinty navázané na milníky a budování důvěry v cílovém segmentu bez vysokého paid spendu. Měří vliv na inbound a brand search.', linkedin: 'https://linkedin.com/in/' },
    { initials: 'TŠ', name: 'Tomáš Šťastný', role: 'Tech Lead', color: '#ede9fe', textColor: '#5b21b6', bio: 'Full-stack engineer, AI/ML pipelines. Zodpovědný za platformu a scoring modely.', bioFull: 'Background v datovém inženýrství a ML modelech. Předtím senior engineer v analytics startupu. V Komfi vybudoval celou technickou infrastrukturu — od municipality scoring modelů přes Vitalita data pipeline po interní dashboardy. Řeší AI governance a compliance-safe language layer pro zdravotnické výstupy.', linkedin: 'https://linkedin.com/in/' },
  ],
  teamSize: '8–12 FTE + externisti',
}

export const komfiStrategyTimeline = [
  {
    act: 'ACT I',
    title: 'Bistro Wedge',
    description: 'Vstup přes kvalitní stravování — budování klientské báze a důvěry.',
    status: 'active',
  },
  {
    act: 'ACT II',
    title: 'Vitalita Prevence',
    description: 'Rozšíření o zdravotní screening — domácí odběry + AI interpretace.',
    status: 'next',
  },
  {
    act: 'ACT III',
    title: 'Platforma',
    description: 'Plně integrovaný model — partnerství, data, navazující služby.',
    status: 'future',
  },
]

export const canvasConfidence = {
  problem: 78,
  'existing-alternatives': 72,
  solution: 74,
  'key-metrics': 68,
  'unique-value': 71,
  'unfair-advantage': 65,
  channels: 67,
  'customer-segments': 76,
  'early-adopters': 70,
  'cost-structure': 63,
  'revenue-streams': 66,
  'ai-lever': 66,
  'expansion-triggers': 64,
  'evidence-gap': 69,
}
