import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, Phone, FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import CallLogTable from '@/components/CallLogTable'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [totalBots, totalCalls, casesThisMonth] = await Promise.all([
      db.bot.count(),
      db.callLog.count(),
      db.legalCase.count({
        where: {
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return { totalBots, totalCalls, casesThisMonth }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { totalBots: 0, totalCalls: 0, casesThisMonth: 0 }
  }
}

async function getRecentCalls() {
  try {
    return await db.callLog.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        bot: {
          select: { name: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching recent calls:', error)
    return []
  }
}

export default async function Dashboard() {
  const stats = await getStats()
  const recentCalls = await getRecentCalls()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Link href="/bots/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Bot
            </Button>
          </Link>
          <Link href="/calls">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              View All Calls
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBots}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.casesThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Call Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <CallLogTable calls={recentCalls} />
        </CardContent>
      </Card>
    </div>
  )
}