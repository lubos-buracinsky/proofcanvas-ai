import { useMemo, useEffect } from 'react'
import useCanvasStore from '../stores/canvasStore'
import { getFilledBlocksCount, isCanvasEmpty } from '../utils/canvasHelpers'

export default function useCanvas() {
  const store = useCanvasStore()

  useEffect(() => {
    store.initialize()
  }, [])

  const activeCanvas = useMemo(
    () => store.canvases.find(c => c.id === store.activeCanvasId),
    [store.canvases, store.activeCanvasId]
  )

  const filledCount = useMemo(
    () => getFilledBlocksCount(activeCanvas?.blocks),
    [activeCanvas?.blocks]
  )

  const isEmpty = useMemo(
    () => isCanvasEmpty(activeCanvas?.blocks),
    [activeCanvas?.blocks]
  )

  const followUp = useMemo(
    () => store.followUpData[store.activeCanvasId] || {},
    [store.followUpData, store.activeCanvasId]
  )

  const validation = useMemo(
    () => store.validationData[store.activeCanvasId] || '',
    [store.validationData, store.activeCanvasId]
  )

  const suggestions = useMemo(
    () => store.suggestionsData[store.activeCanvasId] || {},
    [store.suggestionsData, store.activeCanvasId]
  )

  return {
    ...store,
    activeCanvas,
    filledCount,
    isEmpty,
    followUp,
    validation,
    suggestions,
  }
}
