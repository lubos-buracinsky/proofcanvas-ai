export const BLOCKS = [
  {
    id: 'problem',
    title: 'Problém',
    subtitle: 'Top 3 problémy',
    gridColumn: '1 / 3',
    gridRow: '1 / 3',
    colorClass: 'block-problem',
    color: '#ef4444',
    placeholder: 'Vyjmenujte 1–3 hlavní problémy...',
    subsection: {
      id: 'existing-alternatives',
      title: 'Existující alternativy',
      placeholder: 'Jak se problém řeší dnes...',
    },
  },
  {
    id: 'solution',
    title: 'Řešení',
    subtitle: 'Top 3 funkce / vlastnosti',
    gridColumn: '3 / 5',
    gridRow: '1 / 2',
    colorClass: 'block-solution',
    color: '#22c55e',
    placeholder: 'Nastíněte možná řešení...',
  },
  {
    id: 'key-metrics',
    title: 'Klíčové metriky',
    subtitle: 'Klíčové ukazatele úspěchu',
    gridColumn: '3 / 5',
    gridRow: '2 / 3',
    colorClass: 'block-key-metrics',
    color: '#f59e0b',
    placeholder: 'Jaká čísla ukazují, že se vašemu byznysu daří...',
  },
  {
    id: 'unique-value',
    title: 'Unikátní hodnota',
    subtitle: 'Jedinečná, jasná zpráva',
    gridColumn: '5 / 7',
    gridRow: '1 / 4',
    colorClass: 'block-unique-value',
    color: '#6366f1',
    placeholder: 'Jasná a přesvědčivá zpráva, proč jste jiní a proč si zasloužíte pozornost...',
  },
  {
    id: 'unfair-advantage',
    title: 'Neférová výhoda',
    subtitle: 'Nelze snadno okopírovat',
    gridColumn: '7 / 9',
    gridRow: '1 / 2',
    colorClass: 'block-unfair-advantage',
    color: '#ec4899',
    placeholder: 'Něco, co nelze snadno koupit nebo okopírovat...',
  },
  {
    id: 'channels',
    title: 'Kanály',
    subtitle: 'Cesta k zákazníkům',
    gridColumn: '7 / 9',
    gridRow: '2 / 3',
    colorClass: 'block-channels',
    color: '#14b8a6',
    placeholder: 'Jakými kanály oslovíte zákazníky...',
  },
  {
    id: 'customer-segments',
    title: 'Zákaznické segmenty',
    subtitle: 'Cíloví zákazníci',
    gridColumn: '9 / 11',
    gridRow: '1 / 3',
    colorClass: 'block-customer-segments',
    color: '#3b82f6',
    placeholder: 'Kdo jsou vaši cíloví zákazníci a uživatelé...',
    subsection: {
      id: 'early-adopters',
      title: 'Early Adopters',
      placeholder: 'Kdo budou vaši první zákazníci...',
    },
  },
  {
    id: 'cost-structure',
    title: 'Struktura nákladů',
    subtitle: 'Akvizice zákazníků, distribuce, provoz apod.',
    gridColumn: '1 / 5',
    gridRow: '3 / 4',
    colorClass: 'block-cost-structure',
    color: '#8b5cf6',
    placeholder: 'Jaké jsou vaše fixní a variabilní náklady...',
  },
  {
    id: 'revenue-streams',
    title: 'Zdroje příjmů',
    subtitle: 'Model příjmů, lifetime value, marže',
    gridColumn: '7 / 11',
    gridRow: '3 / 4',
    colorClass: 'block-revenue-streams',
    color: '#f97316',
    placeholder: 'Z čeho budete vydělávat...',
  },
]

export function createEmptyCanvas(name = 'Nový canvas') {
  const blocks = {}
  BLOCKS.forEach(b => {
    blocks[b.id] = ''
    if (b.subsection) blocks[b.subsection.id] = ''
  })
  return {
    id: crypto.randomUUID(),
    name,
    blocks,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function getFilledBlocksCount(blocks) {
  if (!blocks) return 0
  return Object.values(blocks).filter(v => v && v.trim().length > 0).length
}

export function isCanvasEmpty(blocks) {
  return getFilledBlocksCount(blocks) === 0
}
