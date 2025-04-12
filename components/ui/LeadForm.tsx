'use client'

import { useState } from 'react'
import { z } from 'zod'

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email')
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface LeadFormProps {
  onSubmit: () => void
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: ''
  })
  const [errors, setErrors] = useState<Partial<LeadFormData>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      leadFormSchema.parse(formData)
      // Store in localStorage for persistence
      localStorage.setItem('user_info', JSON.stringify(formData))
      onSubmit()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LeadFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LeadFormData] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          placeholder="Enter your name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-600"
          placeholder="Enter your email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-gray-600"
      >
        Start Chat
      </button>
    </form>
  )
} 