'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Phone } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function BotCard({ bot }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bot?')) return

    try {
      const response = await fetch(`/api/bots/${bot.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to delete bot:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{bot.name}</CardTitle>
          <Badge variant={bot.openmic_bot_id ? 'default' : 'secondary'}>
            {bot.openmic_bot_id ? 'Active' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {bot.description || 'No description'}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {bot._count?.call_logs || 0} calls
            </span>
            <span>Created {formatDate(bot.created_at)}</span>
          </div>

          <div className="flex space-x-2 pt-2">
            <Link href={`/bots/${bot.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}