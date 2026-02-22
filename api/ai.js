import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const anthropic = new Anthropic()
const MODEL = 'claude-sonnet-4-20250514'

function sseStream(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  return {
    send(text) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`)
    },
    error(msg) {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`)
      res.write('data: [DONE]\n\n')
      res.end()
    },
    done() {
      res.write('data: [DONE]\n\n')
      res.end()
    },
  }
}

function blocksToContext(blocks) {
  if (!blocks) return 'Canvas je prázdný.'
  const entries = Object.entries(blocks).filter(([, v]) => v && v.trim())
  if (entries.length === 0) return 'Canvas je prázdný.'
  return entries.map(([k, v]) => `**${k}**: ${v}`).join('\n')
}

// Generate full canvas from idea
router.post('/generate', async (req, res) => {
  const sse = sseStream(res)
  const { idea } = req.body

  if (!idea) return sse.error('Zadejte prosím podnikatelský nápad.')

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Jsi expert na Lean Canvas. Na základě následujícího podnikatelského nápadu vygeneruj kompletní Lean Canvas. Odpovídej ČESKY.

Podnikatelský nápad: ${idea}

Vrať POUZE validní JSON objekt s přesně těmito klíči (žádný markdown, žádné code blocky, pouze čistý JSON):
{
  "problem": "...",
  "solution": "...",
  "key-metrics": "...",
  "unique-value": "...",
  "unfair-advantage": "...",
  "channels": "...",
  "customer-segments": "...",
  "cost-structure": "...",
  "revenue-streams": "..."
}

Každá hodnota by měla být stručné odrážky (použij \\n pro nové řádky). Buď konkrétní a akční.`,
        },
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Suggest improvements for a specific block
router.post('/suggest', async (req, res) => {
  const sse = sseStream(res)
  const { blockId, blocks, format } = req.body

  if (!blockId) return sse.error('ID bloku je vyžadováno.')

  const canvasContext = blocksToContext(blocks)
  const currentValue = blocks?.[blockId] || '(prázdný)'

  const prompt = format === 'replace'
    ? `Jsi expert na Lean Canvas. Odpovídej ČESKY. Zde je aktuální canvas:

${canvasContext}

Přepiš obsah bloku "${blockId}" na vylepšenou verzi. Aktuální obsah:
${currentValue}

Vrať POUZE vylepšený text vhodný k přímému vložení do bloku. Použij odrážky s • na začátku řádku. Žádný markdown, žádné nadpisy, žádná vysvětlení – pouze čistý vylepšený obsah bloku.`
    : `Jsi expert na Lean Canvas. Odpovídej ČESKY. Zde je aktuální canvas:

${canvasContext}

Uživatel chce vylepšit blok "${blockId}". Aktuální obsah:
${currentValue}

Poskytni 3 konkrétní, akční návrhy na vylepšení tohoto bloku. Zvaž kontext celého canvasu. Formátuj jako markdown s číslovanými návrhy, každý s krátkým vysvětlením proč je lepší.`

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Score a specific block
router.post('/block-score', async (req, res) => {
  const sse = sseStream(res)
  const { blockId, blocks } = req.body

  if (!blockId) return sse.error('ID bloku je vyžadováno.')
  const canvasContext = blocksToContext(blocks)
  const currentValue = blocks?.[blockId] || '(prázdný)'

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Jsi expert na Lean Canvas. Ohodnoť kvalitu bloku "${blockId}" v kontextu celého canvasu skóre 0–10 (jedno desetinné místo). Odpovídej ČESKY.

Canvas:
${canvasContext}

Obsah hodnoceného bloku "${blockId}":
${currentValue}

Vrať POUZE validní JSON (žádný markdown):
{"score": 7.5, "summary": "Krátké zdůvodnění..."}`,
        },
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Validate canvas consistency
router.post('/validate', async (req, res) => {
  const sse = sseStream(res)
  const { blocks } = req.body

  const canvasContext = blocksToContext(blocks)
  if (canvasContext === 'Canvas je prázdný.') return sse.error('Canvas je prázdný. Nejprve vyplňte nějaké bloky.')

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 3072,
      messages: [
        {
          role: 'user',
          content: `Jsi expert na Lean Canvas a startup poradce. Odpovídej ČESKY. Analyzuj následující Lean Canvas z hlediska konzistence, kompletnosti a kvality:

${canvasContext}

Poskytni strukturovaný validační report v markdownu s těmito sekcemi:

## Silné stránky
Co je zpracováno dobře (2–3 body)

## Slabé stránky
Co je potřeba zlepšit (2–3 body)

## Mezery
Chybějící nebo neúplné prvky

## Kontrola konzistence
Jsou bloky vzájemně provázané? Řeší řešení skutečně problém? Odpovídají zdroje příjmů zákaznickým segmentům?

## Doporučení
Top 3 akční kroky pro zlepšení tohoto canvasu

Buď konkrétní a konstruktivní.`,
        },
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// AI Score
router.post('/score', async (req, res) => {
  const sse = sseStream(res)
  const { blocks } = req.body

  const canvasContext = blocksToContext(blocks)
  if (canvasContext === 'Canvas je prázdný.') return sse.error('Canvas je prázdný.')

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Jsi expert na Lean Canvas. Ohodnoť následující Lean Canvas celkovým skóre 1–10 a jednou větou zdůvodni. Odpovídej ČESKY.

${canvasContext}

Vrať POUZE validní JSON (žádný markdown):
{"score": 7, "summary": "Krátké zdůvodnění..."}`,
        },
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Contextual chat
router.post('/chat', async (req, res) => {
  const sse = sseStream(res)
  const { messages, blocks } = req.body

  if (!messages?.length) return sse.error('Nebyly poskytnuty žádné zprávy.')

  const canvasContext = blocksToContext(blocks)

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      system: `Jsi expertní startup poradce a Lean Canvas konzultant. Odpovídej ČESKY. Máš přístup k aktuálnímu Lean Canvasu uživatele:

${canvasContext}

Pomoz uživateli vylepšit jeho business model, odpovídej na otázky o lean metodologii a poskytuj akční rady. Buď stručný a konkrétní. Používej markdown pro formátování.`,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Follow-up generation
const FOLLOWUP_PROMPTS = {
  mvp: `Na základě tohoto Lean Canvasu definuj MVP (Minimum Viable Product). Odpovídej ČESKY:

## Klíčové funkce
Vyjmenuj absolutní minimum funkcí potřebných k otestování klíčové hypotézy (max 5)

## Prioritizace funkcí
Použij metodu MoSCoW (Musí být / Mělo by být / Mohlo by být / Nebude)

## Časový plán MVP
Navrhni realistický časový plán pro vytvoření tohoto MVP (v týdnech)

## Kritéria úspěchu
Jaké metriky určí, zda je MVP úspěšné?

## Technické požadavky
Stručný přehled potřebného tech stacku a infrastruktury`,

  interviews: `Na základě tohoto Lean Canvasu vygeneruj otázky pro customer discovery rozhovory. Odpovídej ČESKY:

## Screeningové otázky
3–4 otázky pro kvalifikaci respondentů

## Validace problému
5–6 otevřených otázek o problému

## Průzkum řešení
4–5 otázek o tom, jak momentálně problém řeší

## Hodnota a cena
3–4 otázky o ochotě platit

## Tipy pro rozhovory
Osvědčené postupy pro vedení těchto rozhovorů

Otázky by měly být otevřené, nesměřující a zaměřené na chování, nikoli na názory.`,

  gtm: `Na základě tohoto Lean Canvasu vytvoř Go-To-Market strategii. Odpovídej ČESKY:

## Cílový trh
Definuj počáteční beachhead market

## Positioning
Jedno jasné sdělení o tom, jak je produkt pozicován

## Kanály pro launch
Top 3 kanály s konkrétními taktikami pro každý

## Cenová strategie
Doporučený cenový model s odůvodněním

## Časový plán launche
Fáze 1 (pre-launch), Fáze 2 (launch), Fáze 3 (růst)

## Klíčová partnerství
Strategická partnerství, která mohou urychlit růst`,

  experiments: `Na základě tohoto Lean Canvasu navrhni lean experimenty. Odpovídej ČESKY:

## Klíčové hypotézy
Vyjmenuj 3 nejrizikovější předpoklady, které je potřeba validovat

## Design experimentů
Pro každou hypotézu:
- **Typ experimentu** (landing page, rozhovor, prototyp, atd.)
- **Metrika úspěchu** a hranice
- **Časový plán** a rozpočet
- **Očekávaný výsledek**

## Priorita experimentů
Seřaď podle míry rizika a snadnosti provedení

## Dashboard metrik
Klíčové metriky ke sledování napříč všemi experimenty`,

  actionplan: `Na základě tohoto Lean Canvasu vytvoř 90denní akční plán. Odpovídej ČESKY:

## Týden 1–2: Základy
Klíčové přípravné úkoly a počáteční průzkum

## Týden 3–4: Validace
Customer discovery a validace problému

## Týden 5–8: Vývoj MVP
Tvorba a iterace MVP

## Týden 9–10: Launch
Strategie launche a počáteční trakce

## Týden 11–12: Měření a učení
Analýza výsledků a plánování další iterace

## Klíčové milníky
Vyjmenuj 5–6 konkrétních milníků s termíny

## Potřebné zdroje
Tým, rozpočet a potřebné nástroje

Používej konkrétní, akční úkoly pro každý týden.`,
}

router.post('/followup', async (req, res) => {
  const sse = sseStream(res)
  const { blocks, type } = req.body

  if (!type || !FOLLOWUP_PROMPTS[type]) return sse.error('Neplatný typ follow-up.')

  const canvasContext = blocksToContext(blocks)
  if (canvasContext === 'Canvas je prázdný.') return sse.error('Canvas je prázdný. Nejprve vyplňte nějaké bloky.')

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Jsi expertní startup poradce. Odpovídej ČESKY. Zde je Lean Canvas uživatele:

${canvasContext}

${FOLLOWUP_PROMPTS[type]}

Buď konkrétní, akční a přizpůsobený tomuto konkrétnímu byznysu. Používej markdown formátování.`,
        },
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sse.send(event.delta.text)
      }
    }
    sse.done()
  } catch (err) {
    sse.error(err.message)
  }
})

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', ai: !!process.env.ANTHROPIC_API_KEY })
})

export default router
