import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { carId } = await req.json()
  const db = getDb()
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(carId) as any
  if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })
  const predictions = [
    { month: 'Now', price: car.price },
    { month: '+3m', price: Math.round(car.price * 0.97) },
    { month: '+6m', price: Math.round(car.price * 0.94) },
    { month: '+9m', price: Math.round(car.price * 0.92) },
    { month: '+12m', price: Math.round(car.price * 0.90) },
  ]
  return NextResponse.json({
    carId,
    currentPrice: car.price,
    predictions,
    depreciationRate: car.depreciationYear,
  })
}
