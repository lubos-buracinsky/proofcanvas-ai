import generatePdf, { Margin } from 'react-to-pdf'

export function exportCanvasPdf(targetRef, canvasName = 'lean-canvas') {
  return generatePdf(targetRef, {
    filename: `${canvasName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    page: {
      margin: Margin.SMALL,
      format: 'A4',
      orientation: 'landscape',
    },
  })
}
