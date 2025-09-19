import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import BotForm from '@/components/BotForm'

async function getBot(id) {
  const bot = await db.bot.findUnique({
    where: { id }
  })

  if (!bot) {
    notFound()
  }

  return bot
}

export default async function EditBotPage({ params }) {
  const bot = await getBot(params.id)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Bot</h1>
        <p className="text-gray-600 mt-2">
          Update your legal intake bot configuration
        </p>
      </div>
      <BotForm bot={bot} />
    </div>
  )
}