import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM costs WHERE carId = ? ORDER BY value DESC').all(params.id)
  return NextResponse.json(rows)
}
