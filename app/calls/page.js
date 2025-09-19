import { db } from '@/lib/db'
import CallLogTable from '@/components/CallLogTable'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getCalls() {
  try {
    return await db.callLog.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        bot: {
          select: { name: true }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching calls:', error)
    return []
  }
}

export default async function CallsPage() {
  const calls = await getCalls()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Call Logs</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <CallLogTable calls={calls} showPagination={true} />

      {calls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No call logs yet</p>
        </div>
      )}
    </div>
  )
}