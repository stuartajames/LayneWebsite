'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  enquiryType: z.enum(['appraisal', 'viewing', 'general'], {
    error: 'Please select an enquiry type',
  }),
  message: z.string().min(10, 'Please enter a message (10+ characters)'),
})

type FormData = z.infer<typeof schema>

type Props = {
  subject?: string
}

export function ContactForm({ subject }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      enquiryType: subject ? 'viewing' : 'general',
    },
  })

  async function onSubmit(data: FormData) {
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, subject }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center ring-1 ring-green-200">
        <p className="font-semibold text-green-800">Message sent!</p>
        <p className="mt-1 text-sm text-green-700">
          Layne will be in touch with you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-medium text-green-700 underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {subject && (
        <p className="rounded-lg bg-brand-bg px-4 py-3 text-sm text-gray-600">
          Re: {subject}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="enquiryType" className="text-sm font-medium text-gray-700">
            Enquiry type <span className="text-red-500">*</span>
          </label>
          <select
            id="enquiryType"
            {...register('enquiryType')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
          >
            <option value="appraisal">Free appraisal</option>
            <option value="viewing">Book a viewing</option>
            <option value="general">General enquiry</option>
          </select>
          {errors.enquiryType && (
            <p className="text-xs text-red-600">{errors.enquiryType.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          Something went wrong. Please try again or call Layne directly on 021 246 8660.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start rounded-full bg-brand-gold px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-dark disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
