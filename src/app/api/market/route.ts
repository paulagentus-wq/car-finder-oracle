import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()
  const cars = db.prepare('SELECT * FROM cars ORDER BY dealScore DESC').all()
  const avgPrice = cars.reduce((s: number, c: any) => s + c.price, 0) / cars.length
  const avgScore = cars.reduce((s: number, c: any) => s + c.dealScore, 0) / cars.length
  return NextResponse.json({
    totalCars: cars.length,
    avgPrice: Math.round(avgPrice),
    avgScore: Math.round(avgScore * 10) / 10,
    cars,
  })
}
