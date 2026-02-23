import fs from 'node:fs/promises'
import path from 'node:path'
import { SNAPSHOT_STALE_DAYS, validateSnapshot } from './snapshot-schema.mjs'

const ROOT = process.cwd()
const SNAPSHOT_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.generated.json')
const SOURCES_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.sources.json')
const META_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.meta.json')

function daysBetween(dateIso) {
  const ts = Date.parse(dateIso)
  if (Number.isNaN(ts)) return Number.POSITIVE_INFINITY
  return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
}

async function main() {
  const [snapshotRaw, sourcesRaw, metaRaw] = await Promise.all([
    fs.readFile(SNAPSHOT_PATH, 'utf8'),
    fs.readFile(SOURCES_PATH, 'utf8'),
    fs.readFile(META_PATH, 'utf8'),
  ])

  const snapshot = JSON.parse(snapshotRaw)
  const sources = JSON.parse(sourcesRaw)
  const meta = JSON.parse(metaRaw)

  const sourceIds = Array.isArray(sources.sources) ? sources.sources.map((source) => source.id) : []
  const validation = validateSnapshot(snapshot, sourceIds)

  if (!validation.valid) {
    console.error('Snapshot schema validation failed:')
    validation.errors.forEach((error) => console.error(`- ${error}`))
    process.exit(1)
  }

  const ageDays = daysBetween(snapshot.generatedAt)
  const staleAfter = Number(snapshot.snapshotDaysValid) || SNAPSHOT_STALE_DAYS

  console.log('Snapshot schema: OK')
  console.log(`Sources in manifest: ${sourceIds.length}`)
  console.log(`Snapshot age: ${ageDays} day(s)`)
  console.log(`Stale threshold: ${staleAfter} day(s)`)

  if (ageDays > staleAfter) {
    console.warn(`Snapshot is stale (older than ${staleAfter} days).`) 
  }

  if (!meta.checksum) {
    console.warn('Meta checksum is missing.')
  }
}

main().catch((err) => {
  console.error('Snapshot check failed:')
  console.error(err.message)
  process.exit(1)
})
