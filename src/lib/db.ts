import carsData from '@/data/cars.json'
import faultsData from '@/data/faults.json'
import motHistoryData from '@/data/mot_history.json'
import priceHistoryData from '@/data/price_history.json'
import mileageHistoryData from '@/data/mileage_history.json'
import extrasData from '@/data/extras.json'
import specsData from '@/data/specs.json'
import costsData from '@/data/costs.json'
import communitiesData from '@/data/communities.json'
import serviceScheduleData from '@/data/service_schedule.json'

// ---------------------------------------------------------------------------
// JSON-backed data layer — drop-in replacement for better-sqlite3
// Same API surface: getDb() returns an object with prepare(sql).all()/get()
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>

const SEVERITY_ORDER: Record<string, number> = { critical: 1, high: 2, medium: 3, low: 4 }

const tables: Record<string, Row[]> = {
  cars: carsData as Row[],
  faults: faultsData as Row[],
  mot_history: motHistoryData as Row[],
  price_history: priceHistoryData as Row[],
  mileage_history: mileageHistoryData as Row[],
  extras: extrasData as Row[],
  specs: specsData as Row[],
  costs: costsData as Row[],
  communities: communitiesData as Row[],
  service_schedule: serviceScheduleData as Row[],
}

function queryAll(table: string, carId?: string, sort?: string): Row[] {
  let rows = tables[table] || []
  if (carId) rows = rows.filter(r => r.carId === carId)

  if (sort === 'dealScore_desc') rows = [...rows].sort((a, b) => (b.dealScore as number) - (a.dealScore as number))
  if (sort === 'severity') rows = [...rows].sort((a, b) => (SEVERITY_ORDER[a.severity as string] ?? 9) - (SEVERITY_ORDER[b.severity as string] ?? 9))
  if (sort === 'fitted_price') rows = [...rows].sort((a, b) => {
    if ((b.fitted as number) !== (a.fitted as number)) return (b.fitted as number) - (a.fitted as number)
    return (b.price as number) - (a.price as number)
  })
  if (sort === 'value_desc') rows = [...rows].sort((a, b) => (b.value as number) - (a.value as number))
  if (sort === 'urgent_id') rows = [...rows].sort((a, b) => {
    if ((b.urgent as number) !== (a.urgent as number)) return (b.urgent as number) - (a.urgent as number)
    return (a.id as number) - (b.id as number)
  })
  if (sort === 'id') rows = [...rows].sort((a, b) => (a.id as number) - (b.id as number))

  return rows
}

function queryGet(table: string, id: string): Row | undefined {
  return tables[table]?.find(r => r.id === id)
}

// Parse minimal SQL to route to the right table + sort
function parseSql(sql: string): { table: string; whereId: boolean; sort: string } {
  const cleaned = sql.replace(/\s+/g, ' ').trim()
  const tableMatch = cleaned.match(/FROM\s+(\w+)/i)
  const table = tableMatch ? tableMatch[1] : ''
  const whereId = /WHERE\s+(?:carId|id)\s*=\s*\?/i.test(cleaned)

  let sort = ''
  if (/ORDER BY\s+dealScore\s+DESC/i.test(cleaned)) sort = 'dealScore_desc'
  else if (/CASE\s+severity/i.test(cleaned)) sort = 'severity'
  else if (/ORDER BY\s+fitted\s+DESC.*price\s+DESC/i.test(cleaned)) sort = 'fitted_price'
  else if (/ORDER BY\s+value\s+DESC/i.test(cleaned)) sort = 'value_desc'
  else if (/ORDER BY\s+urgent\s+DESC/i.test(cleaned)) sort = 'urgent_id'
  else if (/ORDER BY\s+id/i.test(cleaned)) sort = 'id'

  return { table, whereId, sort }
}

interface PreparedStatement {
  all: (...args: unknown[]) => Row[]
  get: (...args: unknown[]) => Row | undefined
}

interface DbLike {
  prepare: (sql: string) => PreparedStatement
}

export function getDb(): DbLike {
  return {
    prepare(sql: string): PreparedStatement {
      const { table, whereId, sort } = parseSql(sql)
      return {
        all(...args: unknown[]): Row[] {
          const carId = whereId && args[0] ? String(args[0]) : undefined
          return queryAll(table, carId, sort)
        },
        get(...args: unknown[]): Row | undefined {
          if (whereId && args[0]) {
            const id = String(args[0])
            if (table === 'cars') return queryGet(table, id)
            const rows = queryAll(table, id, sort)
            return rows[0]
          }
          return undefined
        },
      }
    },
  }
}
