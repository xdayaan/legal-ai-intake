import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { openmic } from '@/lib/openmic'

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const { name, description, prompt, openmic_bot_id } = body

    const existingBot = await db.bot.findUnique({
      where: { id: params.id }
    })

    if (!existingBot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    // Update bot in database
    const bot = await db.bot.update({
      where: { id: params.id },
      data: {
        name,
        description,
        prompt,
        openmic_bot_id: openmic_bot_id || existingBot.openmic_bot_id,
        updated_at: new Date()
      }
    })

    // Update in OpenMic if ID exists
    if (existingBot.openmic_bot_id) {
      try {
        await openmic.updateBot(existingBot.openmic_bot_id, {
          name,
          prompt,
          webhook_urls: existingBot.webhook_urls
        })
      } catch (openmicError) {
        console.error('OpenMic API Error:', openmicError)
      }
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error('Error updating bot:', error)
    return NextResponse.json(
      { error: 'Failed to update bot' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const bot = await db.bot.findUnique({
      where: { id: params.id }
    })

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    // Delete from OpenMic first
    if (bot.openmic_bot_id) {
      try {
        await openmic.deleteBot(bot.openmic_bot_id)
      } catch (openmicError) {
        console.error('OpenMic API Error:', openmicError)
      }
    }

    // Delete from database (this will cascade delete call logs)
    await db.bot.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Bot deleted successfully' })
  } catch (error) {
    console.error('Error deleting bot:', error)
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    )
  }
}