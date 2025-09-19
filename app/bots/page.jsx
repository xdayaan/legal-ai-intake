import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import BotCard from '@/components/BotCard'

export const dynamic = 'force-dynamic'

async function getBots() {
  try {
    return await db.bot.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { call_logs: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching bots:', error)
    return []
  }
}

export default async function BotsPage() {
  const bots = await getBots()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bot Management</h1>
        <Link href="/bots/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Bot
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {bots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No bots created yet</p>
          <Link href="/bots/new">
            <Button>Create Your First Bot</Button>
          </Link>
        </div>
      )}
    </div>
  )
}