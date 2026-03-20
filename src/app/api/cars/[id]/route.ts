import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(params.id)
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    return NextResponse.json(car)
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}
