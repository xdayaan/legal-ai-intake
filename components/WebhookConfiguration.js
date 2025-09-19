'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Copy, ExternalLink } from 'lucide-react'

export default function WebhookConfiguration({ bot, onContinue }) {
  const [copiedUrl, setCopiedUrl] = useState('')

  const ngrokUrl = process.env.NEXT_PUBLIC_NGROK_URL || 'http://localhost:3000'

  const webhooks = {
    preCall: `${ngrokUrl}/api/webhooks/pre-call`,
    postCall: `${ngrokUrl}/api/webhooks/post-call`,
    functionCall: `${ngrokUrl}/api/webhooks/function-call`
  }

  const copyToClipboard = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(type)
      setTimeout(() => setCopiedUrl(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Bot Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{bot.name}</h3>
              <p className="text-gray-600">{bot.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                OpenMic Bot ID: <code className="bg-gray-100 px-2 py-1 rounded">{bot.openmic_bot_id}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <p className="text-sm text-gray-600">
            These webhook URLs have been automatically configured in OpenMic. Copy them to use in your OpenMic dashboard if needed.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pre-call">Pre-Call Webhook</Label>
            <div className="flex gap-2">
              <Input
                id="pre-call"
                value={webhooks.preCall}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhooks.preCall, 'pre-call')}
                className="flex items-center gap-2"
              >
                {copiedUrl === 'pre-call' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedUrl === 'pre-call' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Called before each call starts to provide bot context
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-call">Post-Call Webhook</Label>
            <div className="flex gap-2">
              <Input
                id="post-call"
                value={webhooks.postCall}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhooks.postCall, 'post-call')}
                className="flex items-center gap-2"
              >
                {copiedUrl === 'post-call' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedUrl === 'post-call' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Called after each call ends with call summary and recording
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="function-call">Function Call Webhook</Label>
            <div className="flex gap-2">
              <Input
                id="function-call"
                value={webhooks.functionCall}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhooks.functionCall, 'function-call')}
                className="flex items-center gap-2"
              >
                {copiedUrl === 'function-call' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedUrl === 'function-call' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Called when the bot needs to execute custom functions
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onContinue} className="flex-1">
              View All Bots
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://dashboard.openmic.ai', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open OpenMic Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}