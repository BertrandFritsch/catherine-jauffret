import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { isEmailValid, isURLValid } from '#app/shared/utils'
import { InputField } from '../contact/inputField'
import { TextAreaField } from '../contact/textAreaField'

type GuestbookFormData = {
  name: string
  email: string
  website?: string
  comment: string
}

const titleVariants: Variants = {
  initial: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.8 } },
  exit: { opacity: 0 },
}

export default function GuestbookForm() {
  const createGuestbook = useMutation({
    mutationFn: async (data: GuestbookFormData) => {
      const response = await fetch('/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...data, 'form-name': 'guestbook' }),
      })
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message")
      }
    },
    onError: (error) =>
      console.error('Error sending guestbook message:', error),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestbookFormData>()

  const onSubmit: SubmitHandler<GuestbookFormData> = (data) => {
    createGuestbook.mutate(data)
  }

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <motion.p
          className="h-12"
          initial="initial"
          animate="visible"
          exit="exit"
        >
          {createGuestbook.isPending && (
            <motion.span
              className="italic"
              variants={titleVariants}
              initial="false"
            >
              Le message est en cours d'envoi...
            </motion.span>
          )}
          {createGuestbook.isError && (
            <motion.span
              variants={titleVariants}
              className="italic text-yellow-500"
            >
              Le message n'a malheureusement pas pu être envoyé.
              <br />
              Vous pouvez réessayer plus tard.
            </motion.span>
          )}
          {createGuestbook.isSuccess && (
            <motion.span variants={titleVariants} className="italic">
              Merci pour votre message.
              <br />
              Je le mettrai en ligne dès que possible.
            </motion.span>
          )}
        </motion.p>
      </AnimatePresence>

      {createGuestbook.isIdle && (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            autoFocus
            label="Votre nom"
            error={errors.name}
            errorMessage="Laissez-moi votre nom"
            registerOptions={register('name', { required: true })}
          />

          <InputField
            label="Votre adresse de messagerie"
            error={errors.email}
            errorMessage="Laissez-moi votre adresse de messagerie"
            registerOptions={register('email', {
              required: true,
              validate: (value) =>
                isEmailValid(value)
                  ? true
                  : "L'adresse de messagerie est invalide",
            })}
          />

          <InputField
            label="Votre site web (facultatif)"
            error={errors.website}
            errorMessage="L'URL du site web est invalide"
            registerOptions={register('website', {
              validate: (value) =>
                !value || isURLValid(value)
                  ? true
                  : "L'URL du site web est invalide",
            })}
          />

          <TextAreaField
            label="Votre message"
            error={errors.comment}
            errorMessage="Veuillez laisser un message"
            registerOptions={register('comment', { required: true })}
          />

          <button
            type="submit"
            className="uppercase bg-[#7f7f7f] text-white rounded-sm p-2 mt-2 self-start text-sm hover:bg-[#4f4f4f] cursor-pointer"
          >
            Envoyer
          </button>
        </form>
      )}
    </>
  )
}
