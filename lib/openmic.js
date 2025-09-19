class OpenMicAPI {
  constructor() {
    this.baseURL = process.env.OPENMIC_BASE_URL
    this.apiKey = process.env.OPENMIC_API_KEY
  }

  async createBot(botData) {
    try {
      console.log('OpenMic API - Creating bot...')
      console.log('Request URL:', `${this.baseURL}/v1/bots`)
      console.log('Request data:', JSON.stringify({
        name: botData.name,
        prompt: botData.prompt,
        webhook_urls: botData.webhook_urls
      }, null, 2))

      const response = await fetch(`${this.baseURL}/v1/bots`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: botData.name,
          prompt: botData.prompt,
          webhook_urls: botData.webhook_urls
        })
      })

      console.log('OpenMic API - Response status:', response.status)
      console.log('OpenMic API - Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const text = await response.text()
        console.error('OpenMic API - Error response body:', text)
        throw new Error(`OpenMic API Error: ${response.status} ${response.statusText} - ${text}`)
      }

      const responseData = await response.json()
      console.log('OpenMic API - Success response:', JSON.stringify(responseData, null, 2))

      return responseData
    } catch (error) {
      console.error('OpenMic API - Exception occurred:', error)
      throw error
    }
  }

  async updateBot(botId, botData) {
    try {
      const response = await fetch(`${this.baseURL}/v1/bots/${botId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(botData)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`OpenMic API Error: ${response.status} ${response.statusText} - ${text}`)
      }

      return await response.json()
    } catch (error) {
      console.error('OpenMic API Error:', error)
      throw error
    }
  }

  async deleteBot(botId) {
    try {
      const response = await fetch(`${this.baseURL}/v1/bots/${botId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`OpenMic API Error: ${response.status} ${response.statusText} - ${text}`)
      }

      return response.ok
    } catch (error) {
      console.error('OpenMic API Error:', error)
      throw error
    }
  }
}

export const openmic = new OpenMicAPI()