import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Function call webhook received:', body)

    let function_name = 'fetchCaseDetails'
    let parameters = {}

    if (body.function_call) {
      const functionData = body.function_call
      function_name = functionData.name || functionData.function_name
      parameters = functionData.parameters || {}
    } else if (body.function_name) {
      function_name = body.function_name
      parameters = body.parameters || {}
    } else if (body.message) {
      function_name = 'fetchCaseDetails'

      // Extract case ID from various formats (with space or colon)
      const caseIdMatch = body.message.match(/Case ID[:\s]+(\d+)/)
      if (caseIdMatch) {
        parameters.case_id = caseIdMatch[1]
        console.log('Extracted case_id:', parameters.case_id)
      } else {
        console.log('No case ID found in message:', body.message)
      }

      // Extract client name from various formats
      const clientNameMatch = body.message.match(/name[:\s]+([^.,]+)/)
      if (clientNameMatch) {
        parameters.client_name = clientNameMatch[1].trim()
        console.log('Extracted client_name:', parameters.client_name)
      } else {
        console.log('No client name found in message:', body.message)
      }
    }

    console.log('Extracted function_name:', function_name)
    console.log('Extracted parameters:', parameters)

    if (function_name === 'fetchCaseDetails') {
      const { case_id } = parameters

      console.log('Processing fetchCaseDetails for case_id:', case_id)

      if (!case_id) {
        return NextResponse.json({
          success: false,
          error: 'Case ID is required'
        }, { status: 400 })
      }

      try {
        // Try to find the case in database
        let caseData = await db.legalCase.findUnique({
          where: { case_id: case_id }
        })

        // If not found, return mock data or create a new case
        if (!caseData) {
          // Create mock case data
          caseData = {
            case_id: case_id,
            client_name: "John Smith",
            case_type: "Personal Injury",
            attorney: "Sarah Williams",
            notes: "Motor vehicle accident on Highway 101. Client sustained minor injuries.",
            status: "active",
            created_at: new Date(),
            timeline: [
              {
                date: "2024-01-10",
                event: "Initial consultation",
                description: "Client reported accident details"
              },
              {
                date: "2024-01-15",
                event: "Medical records requested",
                description: "Sent request to hospital for medical documentation"
              }
            ],
            next_hearing: "2024-02-15",
            case_value: "$25,000 - $50,000"
          }

          // Optionally save to database
          await db.legalCase.create({
            data: {
              case_id: caseData.case_id,
              client_name: caseData.client_name,
              case_type: caseData.case_type,
              attorney: caseData.attorney,
              notes: caseData.notes,
              status: caseData.status
            }
          })
        }

        // Also get client information
        let clientData = await db.client.findFirst({
          where: { client_id: case_id }
        })

        if (!clientData) {
          clientData = {
            client_id: case_id,
            name: caseData.client_name,
            email: "john.smith@email.com",
            phone: "(555) 123-4567",
            address: "123 Main St, Anytown, CA 90210"
          }

          await db.client.create({
            data: clientData
          })
        }

        const response = {
          success: true,
          case_details: {
            case_id: caseData.case_id,
            client_name: caseData.client_name,
            case_type: caseData.case_type,
            attorney: caseData.attorney,
            status: caseData.status,
            notes: caseData.notes,
            timeline: caseData.timeline || [],
            next_hearing: caseData.next_hearing,
            case_value: caseData.case_value
          },
          client_information: {
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            address: clientData.address
          },
          message: `Case details retrieved for ${case_id}`
        }

        return NextResponse.json(response, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        })

      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({
          success: false,
          error: 'Failed to retrieve case details'
        }, { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown function name'
    }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Function call webhook error:', error)
    return NextResponse.json({
      success: false,
      error: 'Function call webhook failed'
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
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