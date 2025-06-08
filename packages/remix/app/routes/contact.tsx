import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { isEmailValid } from '#app/shared/utils'
import { type ContactFormData } from './contact/contact.types'
import { InputField } from './contact/inputField'
import { TextAreaField } from './contact/textAreaField'
import { Title } from './shared/Title'

const titleVariants = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.8,
    },
  },
  exit: {
    opacity: 0,
  },
} as const satisfies Variants

export default function Contact() {
  const createContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ ...data, 'form-name': 'contact' }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(
            'an error occurred while sending the contact message!',
          )
        }
      })
    },
    onError: (error) => {
      console.error('Error sending contact message:', error)
    },
  })
  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<ContactFormData>()
  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    createContact.mutate(data)
  }

  return (
    <>
      <Title title="Contact" />
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.p initial="initial" animate="visible" exit="exit">
          {createContact.isPending && (
            <motion.span variants={titleVariants}>
              Le message est en cours d'envoi...
            </motion.span>
          )}
          {createContact.isError && (
            <motion.span variants={titleVariants} className="text-yellow-500">
              Le message n'a malheureusement pas pu être envoyé.
              <br />
              Vous pouvez réessayer plus tard.
            </motion.span>
          )}
          {createContact.isSuccess && (
            <motion.span variants={titleVariants}>
              Merci pour votre message.
              <br />
              Je vous répondrai dès que possible.
            </motion.span>
          )}
        </motion.p>
      </AnimatePresence>
      {createContact.isIdle && (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <p>
            Laissez-moi votre message et vos coordonnées et je vous répondrai
            dès que possible
          </p>
          <InputField
            autoFocus
            error={errors.name}
            errorMessage="Laissez-moi votre nom"
            label="Votre nom"
            registerOptions={register('name', { required: true })}
          />
          <InputField
            error={errors.email}
            errorMessage="Laissez-moi votre adresse de messagerie"
            label="Votre adresse de messagerie"
            registerOptions={register('email', {
              required: true,
              validate: (value) =>
                isEmailValid(value)
                  ? true
                  : "L'adresse de messagerie est invalide",
            })}
          />
          <InputField
            error={errors.confirmationEmail}
            errorMessage="Veuillez confirmer votre adresse de messagerie"
            label="Confirmez l'adresse de messagerie"
            registerOptions={register('confirmationEmail', {
              required: true,
              validate: (value) =>
                value === watch('email')
                  ? true
                  : 'Les adresses de messagerie ne correspondent pas',
            })}
          />
          <TextAreaField
            label="Votre message"
            errorMessage="Veuillez laisser un message"
            registerOptions={register('message', { required: true })}
            error={errors.message}
          />
          <button
            className="uppercase bg-[#7f7f7f] text-white rounded-sm p-2 mt-2 self-start text-sm hover:bg-[#4f4f4f] cursor-pointer"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Envoyer
          </button>
        </form>
      )}
    </>
  )
}
