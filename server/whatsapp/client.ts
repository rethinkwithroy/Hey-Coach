import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID || ''
const authToken = process.env.TWILIO_AUTH_TOKEN || ''
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

let _twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (!_twilioClient) {
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured')
    }
    _twilioClient = twilio(accountSid, authToken)
  }
  return _twilioClient
}

export async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured, skipping WhatsApp message')
    return
  }

  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    
    await getTwilioClient().messages.create({
      from: whatsappNumber,
      to: formattedTo,
      body: message,
    })
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw error
  }
}

export async function initiateWhatsAppCall(to: string, callbackUrl: string): Promise<string> {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured')
  }

  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    
    const call = await getTwilioClient().calls.create({
      from: whatsappNumber,
      to: formattedTo,
      url: callbackUrl,
    })

    return call.sid
  } catch (error) {
    console.error('Error initiating WhatsApp call:', error)
    throw error
  }
}

export async function getCallRecording(callSid: string): Promise<string | null> {
  try {
    const recordings = await getTwilioClient().recordings.list({ callSid, limit: 1 })
    
    if (recordings.length > 0) {
      const recordingUrl = `https://api.twilio.com${recordings[0].uri.replace('.json', '.mp3')}`
      return recordingUrl
    }
    
    return null
  } catch (error) {
    console.error('Error fetching call recording:', error)
    return null
  }
}

export async function transcribeAudio(recordingUrl: string): Promise<string> {
  console.log('Transcription would be performed here for:', recordingUrl)
  return 'Transcription placeholder - integrate with Whisper API or similar service'
}
