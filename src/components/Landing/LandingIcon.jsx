import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined'
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'

const iconMap = {
  risk: ShieldOutlinedIcon,
  ontology: SchemaOutlinedIcon,
  hypothesis: PsychologyAltOutlinedIcon,
  sprint: BoltOutlinedIcon,
  ai: AutoGraphOutlinedIcon,
  expansion: HubOutlinedIcon,
  evidence: QueryStatsOutlinedIcon,
  memo: DescriptionOutlinedIcon,
  growth: TrendingUpOutlinedIcon,
  time: HourglassTopOutlinedIcon,
  audience: GroupsOutlinedIcon,
  vision: LightbulbOutlinedIcon,
  focus: FlagOutlinedIcon,
  process: ScatterPlotOutlinedIcon,
  signal: StackedLineChartOutlinedIcon,
  negative: BlockOutlinedIcon,
  positive: CheckCircleOutlineOutlinedIcon,
}

export default function LandingIcon({ name, className = '', size = 18 }) {
  const Icon = iconMap[name] || ShieldOutlinedIcon

  return (
    <span className={`landing-icon ${className}`}>
      <Icon sx={{ fontSize: size }} />
    </span>
  )
}
