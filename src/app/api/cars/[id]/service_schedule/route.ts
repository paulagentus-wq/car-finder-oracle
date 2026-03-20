import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM service_schedule WHERE carId = ? ORDER BY urgent DESC, id').all(params.id)
  return NextResponse.json(rows.map((r: any) => ({ ...r, urgent: Boolean(r.urgent) })))
}
