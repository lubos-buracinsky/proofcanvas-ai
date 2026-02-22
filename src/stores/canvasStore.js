import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEmptyCanvas } from '../utils/canvasHelpers'

const DEMO_CANVASES = [
  {
    name: 'Online kurzy vegetariánského vaření',
    author: 'David',
    blocks: {
      'problem': '• Nedostatek kvalitních online kurzů vegetariánského vaření\n• Existující obsah není dostatečně vizuální a praktický\n• Lidé chtějí jíst zdravěji, ale nevědí jak na to s rostlinnými surovinami',
      'solution': '• Vizuální online kurzy vaření – krátké formáty s obrazy, krátkými klipy a recepty\n• Živé vaření (live cooking sessions) pro interaktivní učení\n• Dvě formy: rychlé vizuální recepty + hloubkové kurzy s výkladem',
      'key-metrics': '• Návštěvnost a engagement na sociálních sítích\n• Počet prodaných kurzů / konverze\n• Jak daleko se uživatelé dostanou v kurzu (completion rate)\n• Oslovení a reakce cílové skupiny',
      'unique-value': 'Online kurzy vegetariánského vaření od odborníka s 33 lety zkušeností a certifikací výživového poradce. Důraz na vaření ze surovin, zdraví a udržitelnost.',
      'unfair-advantage': '• 33 let zkušeností s vegetariánským vařením\n• Certifikace výživového poradce\n• Existující kontakty na influencery a spolupráce s firmami\n• Přesah do výživového poradenství a udržitelnosti',
      'channels': '• Instagram – ukázky, krátká videa, reels\n• Spolupráce s influencery (existující kontakty)\n• Sociální sítě (vlastní profil)\n• Kontakty přes kolegy z oboru',
      'customer-segments': '• Mladí lidé zajímající se o zdravé stravování\n• Sportovci\n• Vegetariáni a lidé přecházející na rostlinnou stravu\n• Lidé, kteří chtějí jíst lehčeji',
      'cost-structure': '• Pronájem kuchyně (nebo spolupráce výměnou za propagaci)\n• Suroviny na vaření\n• Kameraman a střihač videí\n• Platforma pro hostování kurzů\n• Čas na přípravu a natáčení',
      'revenue-streams': '• Prodej online kurzů na platformě\n• Product placement v videích (nádobí, potraviny)\n• Spolupráce s firmami (dovozci surovin, výrobci nádobí)\n• Prémiové živé sessions',
    },
  },
  {
    name: 'AI katastr pro realitní makléře',
    author: 'Lukáš',
    blocks: {
      'problem': '• Špatné UX katastru nemovitostí\n• Chybějící funkce (sousední parcely, věcná břemena, plomby)\n• Těžkopádné vyhledávání a vyhodnocování kvality pozemků',
      'existing-alternatives': '• Web katastru nemovitostí\n• Mapy.cz\n• Cenová mapa\n• e-katastr (nefunkční)\n• PZMK (mladý startup)',
      'solution': '• Webová/mobilní aplikace s přívětivým UX napojená na katastr\n• Agregace dat z více zdrojů (katastr, Mapy.cz, cenová mapa)\n• AI dotazování nad parcelami',
      'key-metrics': '• Počet registrovaných uživatelů\n• Počet platících uživatelů\n• Počet vyhledaných parcel\n• Počet AI dotazů',
      'unique-value': 'AI katastr pro realitáky – agregace všech dat (sousedi sousedů, délky hran, věcná břemena, blízkost občanské vybavenosti) do jedné aplikace s AI dotazováním',
      'unfair-advantage': '• Know-how API katastru nemovitostí\n• Znalost fungování registru a jeho služeb\n• Programátorské schopnosti a zkušenost s AI',
      'channels': '• Přímý prodej přes osobní kontakty (peer-to-peer doporučení)\n• Sociální sítě (Facebook, Instagram)',
      'customer-segments': '• Realitní makléři',
      'early-adopters': '',
      'cost-structure': '• Variabilní náklady za AI (LLM dotazy)\n• Poplatky za dotazy do katastru (100 Kč/list vlastnictví)\n• Vývoj softwaru\n• Minimální marketing',
      'revenue-streams': '• Freemium model – základní funkce zdarma, prémiové za předplatné',
    },
  },
  {
    name: 'Biofeedback na zvládání stresu',
    author: 'Honza',
    blocks: {
      'problem': '• Lidé trpí stresem, úzkostmi a ADHD\n• Nejsou schopni regulovat svůj nervový systém (autoregulace parasympatiku)',
      'existing-alternatives': '• HRV wearables (hodinky, prsteny) – nejsou real-time\n• Sportovní hrudní pásy – měří tep, ale nemají dechová cvičení\n• Mobilní aplikace na dech – chybí zpětná vazba',
      'solution': '• Hardware (hrudní pás) měřící dech i tep současně s real-time biofeedbackem\n• Aplikace s gamifikací učící ovládat dech a zklidnit nervový systém\n• Výpočet RSA (Respiratory Sinus Arrhythmia) z korelace dechu a tepu',
      'key-metrics': '• Snižování klidové tepové frekvence (HRV baseline)\n• Zlepšování RSA hodnoty\n• Dlouhodobé trendy zklidnění uživatelů',
      'unique-value': 'Systém na zklidnění nervového systému – propojení dvou senzorů (dech + tep) s výpočtem RSA, personalizovaný coaching ideálního dechu v reálném čase',
      'unfair-advantage': '',
      'channels': '• B2B přes kliniky řešící problémy se stresem\n• Koučové (meditace, držení těla, core) jako distributoři',
      'customer-segments': '• Lidé s problémy se stresem a úzkostmi, kteří aktivně hledají řešení',
      'early-adopters': '• Klienti koučů a klinik\n• Koučové sami (projevili zájem o device)',
      'cost-structure': '• Vývoj a výroba hardware (hrudní pás)\n• Vývoj softwaru (aplikace)\n• Eventy, veletrhy a prezentace\n• Sales (obcházení klinik)',
      'revenue-streams': '• Marže na prodeji hardware (hrudní pásy)\n• Předplatné (subscription) pro nemocnice a hospice',
    },
  },
  {
    name: 'Psychohygienický hub pro sociální služby',
    author: 'Jirka',
    blocks: {
      'problem': '• Pracovníci sociálních služeb jsou dlouhodobě mentálně vyčerpaní a hrozí jim vyhoření\n• Nemají dostupné a finančně přijatelné místo na psychické dobití',
      'existing-alternatives': '• Existující služby jsou drahé nebo geograficky nedostupné (Praha, Brno, Ostrava)\n• Ústecký kraj je v tomto zanedbaný\n• Zaměstnavatelé občas platí jednorázový kurz',
      'solution': '• Fyzické místo (pronajatý prostor, ideálně od města) fungující jako neziskovka\n• Vedené meditace, mindfulness, případně masáže za symbolický poplatek (cca 30 Kč)\n• Lektoři dojíždějí do Ústeckého kraje, zbytek dotován z grantů',
      'key-metrics': '• Obsazenost (kolik % pečovatelek z kraje dochází)\n• Retence (jak dlouho zůstávají a opakovaně chodí)',
      'unique-value': 'Vypnutí pro lidi ze sociálních služeb – cenově dostupná psychohygiena přímo v Ústeckém kraji, kde nic podobného neexistuje',
      'unfair-advantage': '• Spoluzakladatel pochází z regionu a věnuje se vědomé práci\n• Nikdo jiný nepřišel s konceptem dotované psychohygieny pro sociální pracovníky',
      'channels': '• Osobní kontakty v regionu\n• Obcházení zařízení sociálních služeb',
      'customer-segments': '• Pracovníci sociálních služeb – pečovatelky, sestřičky v domovech důchodců, nemocnicích\n• Případně úřednice (sekundární segment)',
      'early-adopters': '',
      'cost-structure': '• Lektoři (největší variabilní náklad)\n• Osoba na správu, dotace a organizaci\n• Prostory (ideálně od města zdarma/levně)\n• Provozní náklady',
      'revenue-streams': '• Dotace a granty (nadace, firemní dárci, Ústecký kraj, EU fondy)\n• Symbolický poplatek od účastníků (cca 30 Kč) – neziskový model',
    },
  },
  {
    name: 'Bylinkové čaje ze Šumavy',
    author: 'Martin',
    blocks: {
      'problem': '• Lidé dbající na zdravý životní styl chtějí kvalitní bylinky s dohledatelným původem\n• Nechtějí bylinky cestující přes půl světa bez známé kvality',
      'existing-alternatives': '• Bylinky od jiných pěstitelů z ČR\n• Běžně dostupné bylinkové čaje v obchodech (bez důrazu na lokální původ)',
      'solution': '• Pěstování bio bylinek na Šumavě\n• Zpracování do čajových směsí (vlastní míchání)\n• Případně prodej sušených bylinek zpracovatelům',
      'key-metrics': '• Prodej celé úrody (základní indikátor úspěchu)',
      'unique-value': 'Šumavský původ bylinek – české bylinky z konkrétní lokality s příběhem, rodinná firma, dělané s láskou',
      'unfair-advantage': '• Vlastnictví pozemků na Šumavě',
      'channels': '• Přímý prodej na farmářských trzích',
      'customer-segments': '• Lidé, kteří chtějí žít zdravý život a vědomě dbají na kvalitu a původ potravin',
      'early-adopters': '',
      'cost-structure': '• Mechanizace (zemědělské stroje)\n• Osivo a zemědělské potřeby\n• Operativní náklady (péče o pozemky, zalévání, údržba)',
      'revenue-streams': '• Přímý prodej koncovým zákazníkům\n• Prodej zpracovatelům (B2B)',
    },
  },
]

const useCanvasStore = create(
  persist(
    (set, get) => ({
      canvases: [],
      activeCanvasId: null,
      followUpData: {},
      validationData: {},
      suggestionsData: {},

      // Initialize with demo canvases
      initialize: () => {
        const { canvases } = get()
        const existingNames = new Set(canvases.map(c => c.name))
        const newCanvases = DEMO_CANVASES
          .filter(demo => !existingNames.has(demo.name))
          .map(demo => {
            const canvas = createEmptyCanvas(demo.name)
            canvas.blocks = { ...canvas.blocks, ...demo.blocks }
            if (demo.author) canvas.author = demo.author
            return canvas
          })
        if (newCanvases.length > 0) {
          set(state => ({
            canvases: [...state.canvases, ...newCanvases],
            activeCanvasId: canvases.length === 0 ? newCanvases[0].id : state.activeCanvasId,
          }))
        }
      },

      createCanvas: (name = 'New Canvas') => {
        const canvas = createEmptyCanvas(name)
        set(state => ({
          canvases: [...state.canvases, canvas],
          activeCanvasId: canvas.id,
        }))
        return canvas.id
      },

      deleteCanvas: (id) => {
        set(state => {
          const filtered = state.canvases.filter(c => c.id !== id)
          const newFollowUp = { ...state.followUpData }
          const newValidation = { ...state.validationData }
          const newSuggestions = { ...state.suggestionsData }
          delete newFollowUp[id]
          delete newValidation[id]
          delete newSuggestions[id]
          if (filtered.length === 0) {
            const canvas = createEmptyCanvas('Nový canvas')
            return {
              canvases: [canvas],
              activeCanvasId: canvas.id,
              followUpData: newFollowUp,
              validationData: newValidation,
              suggestionsData: newSuggestions,
            }
          }
          return {
            canvases: filtered,
            activeCanvasId: state.activeCanvasId === id ? filtered[0].id : state.activeCanvasId,
            followUpData: newFollowUp,
            validationData: newValidation,
            suggestionsData: newSuggestions,
          }
        })
      },

      setActiveCanvas: (id) => set({ activeCanvasId: id }),

      updateBlock: (blockId, value) => {
        set(state => ({
          canvases: state.canvases.map(c =>
            c.id === state.activeCanvasId
              ? { ...c, blocks: { ...c.blocks, [blockId]: value }, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      updateCanvasName: (name) => {
        set(state => ({
          canvases: state.canvases.map(c =>
            c.id === state.activeCanvasId
              ? { ...c, name, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      setCanvasBlocks: (blocks) => {
        set(state => ({
          canvases: state.canvases.map(c =>
            c.id === state.activeCanvasId
              ? { ...c, blocks: { ...c.blocks, ...blocks }, updatedAt: Date.now() }
              : c
          ),
        }))
      },

      setFollowUpData: (type, data) => {
        set(state => ({
          followUpData: {
            ...state.followUpData,
            [state.activeCanvasId]: {
              ...state.followUpData[state.activeCanvasId],
              [type]: data,
            },
          },
        }))
      },

      setValidationData: (data) => {
        set(state => ({
          validationData: {
            ...state.validationData,
            [state.activeCanvasId]: data,
          },
        }))
      },

      setSuggestionsData: (blockId, data) => {
        set(state => ({
          suggestionsData: {
            ...state.suggestionsData,
            [state.activeCanvasId]: {
              ...state.suggestionsData[state.activeCanvasId],
              [blockId]: data,
            },
          },
        }))
      },
    }),
    {
      name: 'leancanvas-storage',
    }
  )
)

export default useCanvasStore
