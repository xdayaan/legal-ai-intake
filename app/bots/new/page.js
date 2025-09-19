import BotForm from '@/components/BotForm'

export default function NewBotPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Bot</h1>
        <p className="text-gray-600 mt-2">
          Create a new legal intake bot to handle client calls
        </p>
      </div>
      <BotForm />
    </div>
  )
}