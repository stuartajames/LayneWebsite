import { NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  enquiryType: z.enum(['appraisal', 'viewing', 'general']),
  message: z.string().min(10),
  subject: z.string().optional(),
})

const ENQUIRY_LABELS: Record<string, string> = {
  appraisal: 'Free appraisal',
  viewing: 'Book a viewing',
  general: 'General enquiry',
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, enquiryType, message, subject } = parsed.data

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const emailText = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Enquiry type: ${ENQUIRY_LABELS[enquiryType]}`,
    subject ? `Property: ${subject}` : null,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  const { error } = await resend.emails.send({
    from: 'Layne Hughes Website <onboarding@resend.dev>',
    to: process.env.LAYNE_EMAIL ?? '',
    replyTo: email,
    subject: `${ENQUIRY_LABELS[enquiryType]} — ${name}`,
    text: emailText,
  })

  if (error) {
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
