'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import { useState } from 'react'

export default function CallLogTable({ calls, showPagination = false }) {
  const [selectedCall, setSelectedCall] = useState(null)

  const renderTranscript = (transcript) => {
    if (!transcript) return 'No transcript available'

    try {
      let transcriptData
      if (typeof transcript === 'string') {
        transcriptData = JSON.parse(transcript)
      } else {
        transcriptData = transcript
      }

      if (!Array.isArray(transcriptData)) {
        return transcript
      }

      return (
        <div className="space-y-3">
          {transcriptData.map((turn, index) => {
            if (!Array.isArray(turn) || turn.length !== 2) return null

            const [speaker, message] = turn

            // Skip empty turns
            if (!speaker && !message) return null

            return (
              <div key={index} className="flex gap-3">
                <div className={`flex-shrink-0 w-16 text-xs font-medium ${
                  speaker === 'user' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {speaker === 'user' ? 'User:' : 'Assistant:'}
                </div>
                <div className="flex-1 text-sm leading-relaxed">
                  {message || '(no message)'}
                </div>
              </div>
            )
          })}
        </div>
      )
    } catch (error) {
      console.error('Error parsing transcript:', error)
      return transcript
    }
  }

  const viewTranscript = (call) => {
    setSelectedCall(call)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getCaseType = (clientInfo) => {
    try {
      const info = typeof clientInfo === 'string' ? JSON.parse(clientInfo) : clientInfo
      return info?.case_type || 'General'
    } catch {
      return 'General'
    }
  }

  const getClientName = (clientInfo) => {
    try {
      const info = typeof clientInfo === 'string' ? JSON.parse(clientInfo) : clientInfo
      return info?.client_name || 'Unknown'
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Bot Used</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Case Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{formatDate(call.created_at)}</TableCell>
              <TableCell>{getClientName(call.client_info)}</TableCell>
              <TableCell>{call.bot.name}</TableCell>
              <TableCell>{formatDuration(call.duration)}</TableCell>
              <TableCell>{getCaseType(call.client_info)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(call.status)}>
                  {call.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => viewTranscript(call)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Call Transcript</h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedCall(null)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Call ID:</strong> {selectedCall.call_id}</p>
              <p><strong>Date:</strong> {formatDate(selectedCall.created_at)}</p>
              <p><strong>Duration:</strong> {formatDuration(selectedCall.duration)}</p>
            </div>
            <div className="mt-4">
              <strong>Transcript:</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded border max-h-48 overflow-y-auto">
                {renderTranscript(selectedCall.transcript)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}