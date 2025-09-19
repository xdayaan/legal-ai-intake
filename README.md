# Legal Intake Bot Management System

A comprehensive web application for managing AI-powered legal intake bots that handle client phone calls, case inquiries, and appointment scheduling using OpenMic AI integration.

## 🚀 Overview

This Next.js application provides a complete solution for law firms to:

- **Create and manage AI-powered intake bots** using OpenMic's conversational AI
- **Handle automated client calls** with intelligent case lookup and information retrieval
- **Store and analyze call transcripts** with detailed conversation logs
- **Manage legal case data** with client information and case details
- **Monitor bot performance** through comprehensive dashboards and analytics

## ✨ Key Features

### 🤖 AI Bot Management
- Create custom legal intake bots with specialized prompts
- Configure webhook integrations for real-time call handling
- Monitor bot performance and call success rates
- Easy bot deployment and management interface

### 📞 Automated Call Handling
- **Pre-call processing**: Retrieve client context before calls start
- **Real-time case lookup**: Extract case IDs from conversations and fetch details
- **Intelligent responses**: AI-powered conversation flow with legal expertise
- **Post-call analysis**: Store complete transcripts and call summaries

### 📊 Dashboard & Analytics
- Real-time statistics on bots, calls, and cases
- Recent call logs with conversation transcripts
- Case management and client information tracking
- Performance monitoring and success metrics

### 🔗 OpenMic AI Integration
- Seamless integration with OpenMic's conversational AI platform
- Automatic webhook configuration for call events
- Real-time bot creation and management
- Advanced voice AI capabilities with custom prompts

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenMic API
- **UI Components**: Radix UI, Lucide Icons

### Database Schema
- **Bots**: AI bot configurations with OpenMic integration
- **Call Logs**: Complete conversation transcripts and metadata
- **Legal Cases**: Client case information and attorney assignments
- **Clients**: Contact information and case associations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenMic AI account and API key
- ngrok (for webhook tunneling)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attack-capital-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/legal_ai_intake"
   OPENMIC_API_KEY="your_openmic_api_key"
   OPENMIC_BASE_URL="https://api.openmic.ai"
   NGROK_URL="https://your-ngrok-url.ngrok-free.app"
   NEXT_PUBLIC_NGROK_URL="https://your-ngrok-url.ngrok-free.app"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Webhook Setup
The application automatically configures webhooks with OpenMic for:
- **Pre-call**: Retrieve client context before calls
- **Post-call**: Store transcripts and call summaries
- **Function calls**: Handle case lookups and data retrieval

### Bot Configuration
When creating a bot, you'll need to provide:
- **Bot Name**: Display name for the bot
- **Description**: Purpose and functionality description
- **Prompt**: Detailed instructions for the AI assistant
- **Optional**: Existing OpenMic bot ID if manually created

## 📱 Usage

### Creating Your First Bot

1. Navigate to the dashboard
2. Click "Create New Bot"
3. Fill in the bot details:
   - Name: "Personal Injury Intake Bot"
   - Description: "Handles initial consultations for personal injury cases"
   - Prompt: Detailed legal intake instructions
4. The system will automatically create the bot in OpenMic and configure webhooks
5. Copy the webhook URLs for your reference

### Managing Calls

- **View Call Logs**: See all incoming calls with transcripts
- **Monitor Performance**: Track call success rates and durations
- **Access Case Data**: View client information and case details
- **Analyze Conversations**: Review AI responses and client interactions

### Case Management

- **Client Lookup**: AI automatically retrieves case information during calls
- **Data Storage**: All case details stored in PostgreSQL database
- **Attorney Assignment**: Track which attorney handles each case
- **Status Tracking**: Monitor case progress and updates

## 🔌 API Endpoints

### Bot Management
- `GET /api/bots` - List all bots
- `POST /api/bots` - Create new bot
- `PUT /api/bots/:id` - Update existing bot
- `DELETE /api/bots/:id` - Delete bot

### Webhooks
- `POST /api/webhooks/pre-call` - Pre-call processing
- `POST /api/webhooks/post-call` - Post-call data storage
- `POST /api/webhooks/function-call` - Case data retrieval

### Database Scripts
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🤖 AI Bot Features

### Intelligent Case Lookup
The AI bot can:
- Extract case IDs from natural conversation
- Look up client information in real-time
- Provide case status and attorney information
- Handle multiple case formats and naming conventions

### Conversation Flow
- Professional legal intake greeting
- Case ID verification and client authentication
- Detailed case information retrieval
- Appointment scheduling and follow-up
- Emergency case prioritization

### Voice Integration
- High-quality voice synthesis
- Real-time speech recognition
- Natural conversation flow
- Professional legal terminology

## 📊 Monitoring & Analytics

### Dashboard Metrics
- Total number of active bots
- Total calls handled
- Cases created this month
- Call success rates and durations

### Call Log Analysis
- Complete conversation transcripts
- Call duration and outcome
- Client satisfaction indicators
- Bot performance metrics

## 🔒 Security & Compliance

- **HIPAA Compliance**: Medical data handling capabilities
- **Data Encryption**: Secure storage of sensitive information
- **Access Control**: Role-based permissions for legal staff
- **Audit Logging**: Complete call and data access tracking

## 🚀 Deployment

### Production Setup
1. **Database**: Set up PostgreSQL in production
2. **Environment**: Configure production environment variables
3. **Webhooks**: Update ngrok URLs for production domain
4. **SSL**: Ensure HTTPS for webhook security