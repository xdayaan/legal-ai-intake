'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WebhookConfiguration from './WebhookConfiguration'

const DEFAULT_PROMPT = `You are a legal intake assistant for [Law Firm Name]. Introduce yourself professionally, ask for the client's Case ID or name, gather basic case information, and determine urgency. Be empathetic and professional. When a client provides their Case ID, use the fetchCaseDetails function to retrieve their information.

Key responsibilities:
1. Greet the client warmly and professionally
2. Ask for Case ID or client name for verification
3. Gather case details and concerns
4. Assess urgency level
5. Schedule follow-up if needed
6. Provide next steps clearly

Remember to be empathetic and maintain confidentiality at all times.`

export default function BotForm({ bot }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showWebhookConfig, setShowWebhookConfig] = useState(false)
  const [createdBot, setCreatedBot] = useState(null)
  const [formData, setFormData] = useState({
    name: bot?.name || '',
    description: bot?.description || '',
    prompt: bot?.prompt || DEFAULT_PROMPT,
    openmic_bot_id: bot?.openmic_bot_id || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = bot ? `/api/bots/${bot.id}` : '/api/bots'
      const method = bot ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const createdBotData = await response.json()
        setCreatedBot(createdBotData)
        setShowWebhookConfig(true)
      } else {
        throw new Error('Failed to save bot')
      }
    } catch (error) {
      console.error('Error saving bot:', error)
      alert('Failed to save bot. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/bots')
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  // Show webhook configuration after bot creation
  if (showWebhookConfig && createdBot) {
    return <WebhookConfiguration bot={createdBot} onContinue={handleContinue} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{bot ? 'Edit Bot' : 'Create Bot'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="e.g., Personal Injury Intake Bot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Brief description of the bot's purpose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openmic_bot_id">OpenMic Bot ID (Optional)</Label>
            <Input
              id="openmic_bot_id"
              value={formData.openmic_bot_id}
              onChange={handleChange('openmic_bot_id')}
              placeholder="Enter the bot UID from OpenMic dashboard if created manually"
            />
            <p className="text-sm text-gray-500">
              If bot creation in OpenMic fails, create the bot manually in the dashboard and enter the UID here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Bot Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={handleChange('prompt')}
              rows={10}
              placeholder="Enter the bot's instructions and behavior"
              required
            />
            <p className="text-sm text-gray-500">
              This prompt defines how your bot will interact with clients
            </p>
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : bot ? 'Update Bot' : 'Create Bot'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/bots')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}