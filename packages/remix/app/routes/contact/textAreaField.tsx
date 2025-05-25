import classnames from 'classnames'
import {
  type UseFormRegisterReturn,
  type FieldValue,
  type FieldValues,
  type FieldError,
} from 'react-hook-form'

type TextAreaFieldProps<TFieldValues extends FieldValues> = {
  label: string
  error: FieldError | undefined
  errorMessage: string
  registerOptions: UseFormRegisterReturn<FieldValue<TFieldValues>>
}

export function TextAreaField({
  label,
  error,
  errorMessage,
  registerOptions,
}: TextAreaFieldProps<FieldValues>) {
  return (
    <fieldset
      className={classnames(
        'relative rounded-sm text-sm border-1 border-solid border-[#7f7f7f] focus-within:border-[var(--color-default-foreground)] w-full',
        {
          'border-yellow-500 focus-within:border-yellow-500 text-yellow-500':
            error,
        },
      )}
    >
      <legend className="mx-2 px-2">{label}</legend>
      <textarea
        className="p-4 border-none outline-none w-full"
        rows={10}
        {...registerOptions}
      />
      {error && (
        <span className="absolute top-full left-0 text-xs mt-1">
          {errorMessage}
        </span>
      )}
    </fieldset>
  )
}
