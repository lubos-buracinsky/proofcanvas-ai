import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-20250514'

function blocksToContext(blocks) {
  if (!blocks) return 'Canvas je prázdný.'
  const entries = Object.entries(blocks).filter(([, v]) => v && v.trim())
  if (entries.length === 0) return 'Canvas je prázdný.'
  return entries.map(([k, v]) => `**${k}**: ${v}`).join('\n')
}

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

function getPrompt(action, body) {
  const { idea, blockId, blocks, messages, type } = body
  const canvasContext = blocksToContext(blocks)

  switch (action) {
    case 'generate':
      if (!idea) throw new Error('Zadejte prosím podnikatelský nápad.')
      return {
        max_tokens: 4096,
        messages: [{
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
        }],
      }

    case 'suggest': {
      if (!blockId) throw new Error('ID bloku je vyžadováno.')
      const currentValue = blocks?.[blockId] || '(prázdný)'
      const { format } = body
      const suggestPrompt = format === 'replace'
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
      return {
        max_tokens: 2048,
        messages: [{ role: 'user', content: suggestPrompt }],
      }
    }

    case 'block-score': {
      if (!blockId) throw new Error('ID bloku je vyžadováno.')
      const blockValue = blocks?.[blockId] || '(prázdný)'
      return {
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: `Jsi expert na Lean Canvas. Ohodnoť kvalitu bloku "${blockId}" v kontextu celého canvasu skóre 0–10 (jedno desetinné místo). Odpovídej ČESKY.

Canvas:
${canvasContext}

Obsah hodnoceného bloku "${blockId}":
${blockValue}

Vrať POUZE validní JSON (žádný markdown):
{"score": 7.5, "summary": "Krátké zdůvodnění..."}`,
        }],
      }
    }

    case 'validate':
      if (canvasContext === 'Canvas je prázdný.') throw new Error('Canvas je prázdný. Nejprve vyplňte nějaké bloky.')
      return {
        max_tokens: 3072,
        messages: [{
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
        }],
      }

    case 'chat':
      if (!messages?.length) throw new Error('Nebyly poskytnuty žádné zprávy.')
      return {
        max_tokens: 2048,
        system: `Jsi expertní startup poradce a Lean Canvas konzultant. Odpovídej ČESKY. Máš přístup k aktuálnímu Lean Canvasu uživatele:

${canvasContext}

Pomoz uživateli vylepšit jeho business model, odpovídej na otázky o lean metodologii a poskytuj akční rady. Buď stručný a konkrétní. Používej markdown pro formátování.`,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }

    case 'score':
      if (canvasContext === 'Canvas je prázdný.') throw new Error('Canvas je prázdný.')
      return {
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: `Jsi expert na Lean Canvas. Ohodnoť následující Lean Canvas celkovým skóre 0–10 (jedno desetinné místo) a jednou větou zdůvodni. Odpovídej ČESKY.

${canvasContext}

Vrať POUZE validní JSON (žádný markdown):
{"score": 7.5, "summary": "Krátké zdůvodnění..."}`,
        }],
      }

    case 'followup':
      if (!type || !FOLLOWUP_PROMPTS[type]) throw new Error('Neplatný typ follow-up.')
      if (canvasContext === 'Canvas je prázdný.') throw new Error('Canvas je prázdný. Nejprve vyplňte nějaké bloky.')
      return {
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Jsi expertní startup poradce. Odpovídej ČESKY. Zde je Lean Canvas uživatele:

${canvasContext}

${FOLLOWUP_PROMPTS[type]}

Buď konkrétní, akční a přizpůsobený tomuto konkrétnímu byznysu. Používej markdown formátování.`,
        }],
      }

    default:
      throw new Error('Neznámá akce.')
  }
}

export default async (req) => {
  // Handle health check
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/.netlify\/functions\/ai\/?/, '').replace(/^\/api\/ai\/?/, '')

  if (req.method === 'GET' && (path === 'health' || path === '')) {
    return new Response(JSON.stringify({ status: 'ok', ai: !!process.env.ANTHROPIC_API_KEY }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const body = await req.json()
  const action = path

  let promptConfig
  try {
    promptConfig = getPrompt(action, body)
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const anthropic = new Anthropic()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: promptConfig.max_tokens,
          ...(promptConfig.system ? { system: promptConfig.system } : {}),
          messages: promptConfig.messages,
        })

        for await (const event of aiStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export const config = {
  path: ['/api/ai/*'],
}
