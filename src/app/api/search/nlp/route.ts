import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { query } = await req.json()
  const db = getDb()
  const cars = db.prepare('SELECT * FROM cars').all()
  const q = (query || '').toLowerCase()
  const results = cars.filter((c: any) => {
    const text = `${c.name} ${c.engine} ${c.color} ${c.verdict}`.toLowerCase()
    return q.split(' ').some((word: string) => word.length > 2 && text.includes(word))
  })
  return NextResponse.json({ results, query })
}
