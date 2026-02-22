import { forwardRef, useState, useEffect } from 'react'
import { BLOCKS } from '../../utils/canvasHelpers'
import CanvasBlock from './CanvasBlock'
import useCanvas from '../../hooks/useCanvas'

function useBreakpoint() {
  const [bp, setBp] = useState('lg')
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp(w < 640 ? 'sm' : w < 1024 ? 'md' : 'lg')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

// Mobile: single column, all blocks stacked
// Tablet: 4 columns, simplified grid
// Desktop: original 10-column Lean Canvas layout
const MOBILE_GRID = {
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto',
}

const TABLET_GRID = {
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'auto',
}

const DESKTOP_GRID = {
  gridTemplateColumns: 'repeat(10, 1fr)',
  gridTemplateRows: 'minmax(160px, 1fr) minmax(160px, 1fr) minmax(120px, auto)',
}

// Override grid positions for tablet
const TABLET_POSITIONS = {
  'problem':            { gridColumn: '1 / 3', gridRow: '1 / 2' },
  'customer-segments':  { gridColumn: '3 / 5', gridRow: '1 / 2' },
  'solution':           { gridColumn: '1 / 3', gridRow: '2 / 3' },
  'channels':           { gridColumn: '3 / 5', gridRow: '2 / 3' },
  'unique-value':       { gridColumn: '1 / 3', gridRow: '3 / 4' },
  'unfair-advantage':   { gridColumn: '3 / 5', gridRow: '3 / 4' },
  'key-metrics':        { gridColumn: '1 / 3', gridRow: '4 / 5' },
  'cost-structure':     { gridColumn: '3 / 5', gridRow: '4 / 5' },
  'revenue-streams':    { gridColumn: '1 / 5', gridRow: '5 / 6' },
}

const CanvasBoard = forwardRef(function CanvasBoard(props, ref) {
  const { activeCanvas, updateBlock } = useCanvas()
  const bp = useBreakpoint()

  if (!activeCanvas) return null

  const gridStyle = bp === 'sm' ? MOBILE_GRID : bp === 'md' ? TABLET_GRID : DESKTOP_GRID

  return (
    <div
      ref={ref}
      className="grid gap-2 sm:gap-3 p-2 sm:p-4 w-full"
      style={gridStyle}
    >
      {BLOCKS.map((block, i) => {
        const posOverride = bp === 'md' ? TABLET_POSITIONS[block.id] : bp === 'sm' ? { gridColumn: '1 / -1', gridRow: 'auto' } : undefined
        return (
          <CanvasBlock
            key={block.id}
            block={block}
            value={activeCanvas.blocks[block.id]}
            subsectionValue={block.subsection ? activeCanvas.blocks[block.subsection.id] : undefined}
            onChange={updateBlock}
            index={i}
            posOverride={posOverride}
          />
        )
      })}
    </div>
  )
})

export default CanvasBoard
