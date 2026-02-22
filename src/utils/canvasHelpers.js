import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import BarChartIcon from '@mui/icons-material/BarChart'
import DiamondIcon from '@mui/icons-material/Diamond'
import ShieldIcon from '@mui/icons-material/Shield'
import ShareIcon from '@mui/icons-material/Share'
import GroupsIcon from '@mui/icons-material/Groups'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

export const BLOCKS = [
  {
    id: 'problem',
    icon: WarningAmberIcon,
    gridColumn: '1 / 3',
    gridRow: '1 / 3',
    colorClass: 'block-problem',
    color: '#ef4444',
    subsection: {
      id: 'existing-alternatives',
    },
  },
  {
    id: 'solution',
    icon: LightbulbIcon,
    gridColumn: '3 / 5',
    gridRow: '1 / 2',
    colorClass: 'block-solution',
    color: '#22c55e',
  },
  {
    id: 'key-metrics',
    icon: BarChartIcon,
    gridColumn: '3 / 5',
    gridRow: '2 / 3',
    colorClass: 'block-key-metrics',
    color: '#f59e0b',
  },
  {
    id: 'unique-value',
    icon: DiamondIcon,
    gridColumn: '5 / 7',
    gridRow: '1 / 4',
    colorClass: 'block-unique-value',
    color: '#6366f1',
  },
  {
    id: 'unfair-advantage',
    icon: ShieldIcon,
    gridColumn: '7 / 9',
    gridRow: '1 / 2',
    colorClass: 'block-unfair-advantage',
    color: '#ec4899',
  },
  {
    id: 'channels',
    icon: ShareIcon,
    gridColumn: '7 / 9',
    gridRow: '2 / 3',
    colorClass: 'block-channels',
    color: '#14b8a6',
  },
  {
    id: 'customer-segments',
    icon: GroupsIcon,
    gridColumn: '9 / 11',
    gridRow: '1 / 3',
    colorClass: 'block-customer-segments',
    color: '#3b82f6',
    subsection: {
      id: 'early-adopters',
    },
  },
  {
    id: 'cost-structure',
    icon: AccountBalanceIcon,
    gridColumn: '1 / 5',
    gridRow: '3 / 4',
    colorClass: 'block-cost-structure',
    color: '#8b5cf6',
  },
  {
    id: 'revenue-streams',
    icon: TrendingUpIcon,
    gridColumn: '7 / 11',
    gridRow: '3 / 4',
    colorClass: 'block-revenue-streams',
    color: '#f97316',
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
