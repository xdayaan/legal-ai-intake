import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Pre-call webhook received:', body)

    const { call } = body
    const botId = call?.bot_id

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID not found in webhook payload' },
        { status: 400 }
      )
    }

    // Find the bot in our database
    const bot = await db.bot.findFirst({
      where: { openmic_bot_id: botId }
    })

    if (!bot) {
      console.error('Bot not found for OpenMic ID:', botId)
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    // Return bot context for the call
    const callContext = {
      bot_name: bot.name,
      bot_description: bot.description,
      prompt: bot.prompt,
      call_direction: call.direction,
      from_number: call.from_number,
      to_number: call.to_number,
      attempt: call.attempt,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: callContext,
      message: "Bot context retrieved successfully"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Pre-call webhook error:', error)
    return NextResponse.json(
      { error: 'Pre-call webhook failed' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}