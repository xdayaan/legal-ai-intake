const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        client_id: 'CLI-001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, CA 90210'
      }
    }),
    prisma.client.create({
      data: {
        client_id: 'CLI-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 987-6543',
        address: '456 Oak Ave, Springfield, IL 62701'
      }
    }),
    prisma.client.create({
      data: {
        client_id: 'CLI-003',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '(555) 456-7890',
        address: '789 Pine St, Portland, OR 97201'
      }
    })
  ])

  // Create sample legal cases
  const cases = await Promise.all([
    prisma.legalCase.create({
      data: {
        case_id: 'PI-2024-001',
        client_name: 'John Smith',
        case_type: 'Personal Injury',
        attorney: 'Sarah Williams',
        notes: 'Motor vehicle accident on Highway 101. Client sustained minor injuries. Medical records pending.',
        status: 'active'
      }
    }),
    prisma.legalCase.create({
      data: {
        case_id: 'CD-2024-002',
        client_name: 'Sarah Johnson',
        case_type: 'Criminal Defense',
        attorney: 'Michael Rodriguez',
        notes: 'DUI charge. First offense. Negotiating plea agreement.',
        status: 'active'
      }
    }),
    prisma.legalCase.create({
      data: {
        case_id: 'FL-2024-003',
        client_name: 'Michael Brown',
        case_type: 'Family Law',
        attorney: 'Jennifer Davis',
        notes: 'Divorce proceedings. Child custody arrangement needed.',
        status: 'pending'
      }
    }),
    prisma.legalCase.create({
      data: {
        case_id: 'PI-2024-004',
        client_name: 'Emma Wilson',
        case_type: 'Personal Injury',
        attorney: 'Sarah Williams',
        notes: 'Slip and fall at grocery store. Seeking damages for medical expenses.',
        status: 'active'
      }
    }),
    prisma.legalCase.create({
      data: {
                case_id: 'RE-2024-005',
        client_name: 'Robert Taylor',
        case_type: 'Real Estate',
        attorney: 'David Chen',
        notes: 'Property dispute with neighbor over boundary lines. Survey completed.',
        status: 'resolved'
      }
    })
  ])

  // Create sample bots
  const bots = await Promise.all([
    prisma.bot.create({
      data: {
        name: 'Personal Injury Intake Bot',
        description: 'Handles initial intake for personal injury cases',
        prompt: `You are a legal intake assistant for Williams & Associates Law Firm specializing in Personal Injury cases. Introduce yourself professionally, ask for the client's Case ID or name, gather basic case information including details about the incident, injuries sustained, and determine urgency. Be empathetic and professional. When a client provides their Case ID, use the fetchCaseDetails function to retrieve their information.

Key responsibilities:
1. Greet the client warmly and professionally
2. Ask for Case ID or client name for verification  
3. Gather incident details, injury information, and medical treatment
4. Assess case urgency and potential claim value
5. Schedule follow-up consultation if needed
6. Provide next steps clearly

Remember to be empathetic about their injuries and maintain confidentiality at all times.`,
        webhook_urls: {
          pre_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/pre-call`,
          post_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/post-call`,
          function_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/function-call`
        }
      }
    }),
    prisma.bot.create({
      data: {
        name: 'Criminal Defense Intake Bot',
        description: 'Handles initial intake for criminal defense cases',
        prompt: `You are a legal intake assistant for Rodriguez Criminal Defense. Introduce yourself professionally, ask for the client's Case ID or name, gather basic case information including charges, court dates, and determine urgency. Be professional and reassuring. When a client provides their Case ID, use the fetchCaseDetails function to retrieve their information.

Key responsibilities:
1. Greet the client professionally and reassuringly
2. Ask for Case ID or client name for verification
3. Gather information about charges, arrest details, and court dates
4. Assess case urgency (upcoming court dates, custody status)
5. Schedule urgent consultation if needed
6. Provide clear next steps and reassurance

Remember to be supportive during a stressful time and maintain strict confidentiality.`,
        webhook_urls: {
          pre_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/pre-call`,
          post_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/post-call`,
          function_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/function-call`
        }
      }
    }),
    prisma.bot.create({
      data: {
        name: 'Family Law Intake Bot',
        description: 'Handles initial intake for family law cases',
        prompt: `You are a legal intake assistant for Davis Family Law. Introduce yourself professionally, ask for the client's Case ID or name, gather basic case information including family situation, children involved, and determine urgency. Be compassionate and professional. When a client provides their Case ID, use the fetchCaseDetails function to retrieve their information.

Key responsibilities:
1. Greet the client with warmth and professionalism
2. Ask for Case ID or client name for verification
3. Gather information about family situation, children, assets, and concerns
4. Assess case urgency (domestic violence, emergency custody issues)
5. Schedule consultation and provide resources if needed
6. Provide clear next steps with sensitivity

Remember to be especially compassionate as family matters are emotionally difficult and maintain confidentiality.`,
        webhook_urls: {
          pre_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/pre-call`,
          post_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/post-call`,
          function_call: `${process.env.NGROK_URL || 'http://localhost:3000'}/api/webhooks/function-call`
        }
      }
    })
  ])

  // Create sample call logs
  const callLogs = await Promise.all([
    prisma.callLog.create({
      data: {
        bot_id: bots[0].id,
        call_id: 'call_001',
        transcript: `Bot: Hello, this is the Personal Injury intake assistant for Williams & Associates Law Firm. I'm here to help you with your case. May I have your Case ID or name please?

Client: Hi, my name is John Smith and I think my case ID is PI-2024-001.

Bot: Thank you, John. Let me pull up your information. I can see you have an active personal injury case with us regarding a motor vehicle accident. How are you feeling today, and is there anything new you'd like to discuss about your case?

Client: I'm still having back pain and the insurance company called me directly. I wasn't sure if I should talk to them.

Bot: I'm sorry to hear you're still experiencing pain. It's very important that you don't speak directly with the insurance company without your attorney present. I'll make a note of this and have Sarah Williams, your attorney, contact you within 24 hours to discuss this insurance contact and check on your recovery progress.`,
        duration: 180,
        client_info: JSON.stringify({
          client_name: 'John Smith',
          case_type: 'Personal Injury',
          urgency: 'medium'
        }),
        case_details: JSON.stringify({
          case_id: 'PI-2024-001',
          summary: 'Client reported continued back pain and insurance company contact',
          follow_up_needed: true
        }),
        status: 'completed'
      }
    }),
    prisma.callLog.create({
      data: {
        bot_id: bots[1].id,
        call_id: 'call_002',
        transcript: `Bot: Hello, this is the Criminal Defense intake assistant for Rodriguez Criminal Defense. I understand you may be facing criminal charges. I'm here to help. May I have your name or Case ID?

Client: My name is Sarah Johnson. I was arrested last week for DUI and I have a case ID CD-2024-002.

Bot: Thank you, Sarah. I can see your case in our system. You're scheduled to work with attorney Michael Rodriguez. Do you have your court date scheduled yet, and how are you holding up?

Client: Yes, my court date is next month. I'm really worried about losing my job. This is my first offense.

Bot: I understand your concerns, Sarah. First offenses often have different options available. Attorney Rodriguez specializes in DUI cases and will discuss all possible outcomes with you. I'm scheduling an urgent consultation for you this week to review your case and discuss job protection strategies. You should receive a call within 24 hours.`,
        duration: 240,
        client_info: JSON.stringify({
          client_name: 'Sarah Johnson',
          case_type: 'Criminal Defense',
          urgency: 'high'
        }),
        case_details: JSON.stringify({
          case_id: 'CD-2024-002',
          summary: 'Client worried about job security, first DUI offense',
          follow_up_needed: true
        }),
        status: 'completed'
      }
    }),
    prisma.callLog.create({
      data: {
        bot_id: bots[2].id,
        call_id: 'call_003',
        transcript: `Bot: Hello, this is the Family Law intake assistant for Davis Family Law. I'm here to support you through your family legal matter. May I have your Case ID or name?

Client: Hi, I'm Michael Brown. I believe my case ID is FL-2024-003.

Bot: Thank you, Michael. I can see you have an active family law case regarding divorce proceedings with Jennifer Davis as your attorney. How can I help you today?

Client: My wife and I are trying to work out the custody schedule for our kids. We want to avoid going to court if possible. Can we modify our agreement?

Bot: It's wonderful that you and your wife are working together for your children's best interests. Yes, custody agreements can often be modified through mediation or collaborative processes. I'll have Jennifer Davis contact you this week to discuss mediation options and review any proposed changes to ensure they're in the best interest of your children.`,
        duration: 200,
        client_info: JSON.stringify({
          client_name: 'Michael Brown',
          case_type: 'Family Law',
          urgency: 'low'
        }),
        case_details: JSON.stringify({
          case_id: 'FL-2024-003',
          summary: 'Client wants to modify custody agreement through mediation',
          follow_up_needed: true
        }),
        status: 'completed'
      }
    })
  ])

  console.log('Seeding finished.')
  console.log(`Created ${clients.length} clients`)
  console.log(`Created ${cases.length} legal cases`)
  console.log(`Created ${bots.length} bots`)
  console.log(`Created ${callLogs.length} call logs`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
        