import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Post-call webhook received:', body)

    // Handle both nested and flat payload structures
    let callData;
    if (body.call) {
      // Nested structure: { event: 'call_ended', call: { ... } }
      callData = body.call;
    } else {
      // Flat structure: { call_id, bot_id, ... }
      callData = body;
    }

    const {
      id: call_id,
      bot_id,
      transcript,
      duration,
      client_info,
      case_details
    } = callData;

    // Find the bot by OpenMic bot ID
    const bot = await db.bot.findFirst({
      where: { openmic_bot_id: bot_id }
    })

    if (!bot) {
      console.error('Bot not found for OpenMic ID:', bot_id)
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    // Store call log
    const callLog = await db.callLog.create({
      data: {
        bot_id: bot.id,
        call_id: call_id || `call_${Date.now()}`,
        transcript: transcript ? JSON.stringify(transcript) : null,
        duration: duration || 0,
        client_info: client_info ? JSON.stringify(client_info) : null,
        case_details: case_details ? JSON.stringify(case_details) : null,
        status: 'completed'
      }
    })

    console.log('Call log stored successfully:', callLog.id)

    // Extract case information and update case if needed
    if (case_details && case_details.case_id) {
      try {
        await db.legalCase.upsert({
          where: { case_id: case_details.case_id },
          update: {
            notes: `Call on ${new Date().toISOString()}: ${case_details.summary || 'Call completed'}`,
            status: case_details.status || 'active'
          },
          create: {
            case_id: case_details.case_id,
            client_name: client_info?.client_name || 'Unknown',
            case_type: case_details.case_type || 'General',
            attorney: case_details.attorney || 'Unassigned',
            notes: `Initial call: ${case_details.summary || 'Case opened'}`,
            status: 'active'
          }
        })
      } catch (caseError) {
        console.error('Error updating case:', caseError)
      }
    }

    console.log('Call log stored:', callLog.id)

    return NextResponse.json({
      success: true,
      call_log_id: callLog.id,
      message: 'Call processed successfully'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Post-call webhook error:', error)
    return NextResponse.json(
      { error: 'Post-call webhook failed' },
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