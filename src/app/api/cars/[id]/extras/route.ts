import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM extras WHERE carId = ? ORDER BY fitted DESC, price DESC').all(params.id)
  return NextResponse.json(rows.map((r: any) => ({ ...r, fitted: Boolean(r.fitted) })))
}
