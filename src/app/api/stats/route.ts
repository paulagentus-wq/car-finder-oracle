import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = getDb()
  const cars = db.prepare('SELECT * FROM cars').all()
  return NextResponse.json({
    totalCars: cars.length,
    activeCampaigns: 3,
    alerts: 7,
    avgDealScore: 7.7,
  })
}
