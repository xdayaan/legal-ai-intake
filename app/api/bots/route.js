import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { openmic } from '@/lib/openmic'

export async function GET() {
  try {
    const bots = await db.bot.findMany({
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(bots)
  } catch (error) {
    console.error('Error fetching bots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, prompt, openmic_bot_id } = body

    console.log('=== BOT CREATION STARTED ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Request body:', JSON.stringify(body, null, 2))

    // Create bot in database first
    console.log('Step 1: Creating bot in database...')
    const bot = await db.bot.create({
      data: {
        name,
        description,
        prompt,
        webhook_urls: {
          pre_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/pre-call`,
          post_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/post-call`,
          function_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/function-call`
        },
        openmic_bot_id: openmic_bot_id || null
      }
    })

    console.log('Database bot created successfully:')
    console.log('- Local bot ID:', bot.id)
    console.log('- Bot name:', bot.name)
    console.log('- Initial OpenMic bot ID:', bot.openmic_bot_id || 'null')

    // Try to create bot in OpenMic
    console.log('Step 2: Creating bot in OpenMic API...')
    const openmicRequestData = {
      name,
      prompt,
      webhook_urls: {
        pre_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/pre-call`,
        post_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/post-call`,
        function_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/function-call`
      }
    }
    console.log('OpenMic API request data:', JSON.stringify(openmicRequestData, null, 2))

    const openmicBot = await openmic.createBot(openmicRequestData)

    console.log('OpenMic bot created successfully:')
    console.log('- OpenMic bot ID:', openmicBot.uid)
    console.log('- OpenMic bot name:', openmicBot.name)
    console.log('- Full OpenMic response:', JSON.stringify(openmicBot, null, 2))

    // Update bot with OpenMic ID
    console.log('Step 3: Updating database with OpenMic bot ID...')
    const updatedBot = await db.bot.update({
      where: { id: bot.id },
      data: { openmic_bot_id: openmicBot.uid }
    })

    console.log('Database updated successfully:')
    console.log('- Local bot ID:', updatedBot.id)
    console.log('- Final OpenMic bot ID:', updatedBot.openmic_bot_id)
    console.log('=== BOT CREATION COMPLETED SUCCESSFULLY ===')

    return NextResponse.json(updatedBot, { status: 201 })
  } catch (error) {
    console.error('=== BOT CREATION FAILED ===')
    console.error('Timestamp:', new Date().toISOString())
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)

    if (error.code) {
      console.error('Error code:', error.code)
    }

    return NextResponse.json(
      { error: 'Failed to create bot' },
      { status: 500 }
    )
  }
}