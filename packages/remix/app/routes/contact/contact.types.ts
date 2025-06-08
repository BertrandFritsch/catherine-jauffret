export type ContactFormData = {
  name: string
  email: string
  confirmationEmail: string
  message: string
}

export type ContactFormDataFields = keyof ContactFormData
