import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(params.id)
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const faults = db.prepare(`SELECT * FROM faults WHERE carId = ? ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END`).all(params.id)
    const motHistory = db.prepare('SELECT * FROM mot_history WHERE carId = ?').all(params.id)
    const priceHistory = db.prepare('SELECT * FROM price_history WHERE carId = ? ORDER BY id').all(params.id)
    const mileageHistory = db.prepare('SELECT * FROM mileage_history WHERE carId = ? ORDER BY id').all(params.id)
    const extras = db.prepare('SELECT * FROM extras WHERE carId = ? ORDER BY fitted DESC, price DESC').all(params.id)
    const specs = db.prepare('SELECT * FROM specs WHERE carId = ? ORDER BY id').all(params.id)
    const costs = db.prepare('SELECT * FROM costs WHERE carId = ? ORDER BY value DESC').all(params.id)
    const communities = db.prepare('SELECT * FROM communities WHERE carId = ? ORDER BY id').all(params.id)
    const serviceSchedule = db.prepare('SELECT * FROM service_schedule WHERE carId = ? ORDER BY urgent DESC, id').all(params.id)

    return NextResponse.json({
      ...car,
      faults,
      motHistory,
      priceHistory,
      mileageHistory,
      extras: extras.map((e: any) => ({ ...e, fitted: Boolean(e.fitted) })),
      specs,
      costs,
      communities,
      serviceSchedule: serviceSchedule.map((s: any) => ({ ...s, urgent: Boolean(s.urgent) })),
    })
  } catch (error) {
    console.error('Error fetching full car:', error)
    return NextResponse.json({ error: 'Failed to fetch car data' }, { status: 500 })
  }
}
