import { useEffect } from 'react'
import { RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import style from '../Input.module.scss'

export type TextInputProps = {
  methods?: UseFormReturn
  name: string
  label?: string
  rules?: RegisterOptions
  placeholder?: string
  inputType?: string
  defaultValue?: string
  readOnly?: boolean,
  hasError?: boolean
}

const TextInput = ({
  name,
  label,
  rules,
  placeholder = '',
  inputType = 'text',
  defaultValue,
  readOnly = false,
  hasError = false
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
    setValue
  } = useFormContext()

  const error = errors?.[name]?.message

  useEffect(() => {
  if (defaultValue) {
    setValue(name, defaultValue);
  }
}, [defaultValue, name, setValue]);

  return (
    <div className={`${style.formElement} ${(error || hasError) ? style.hasError : ''}`}>
      {inputType != 'hidden' && label && (
        <label className={style.label}>
          {label}
          <span className={style.required}>{rules?.required && ' *'}</span>
        </label>
      )}
      <div className={style.inputWrap}>
        <input
          readOnly={readOnly}
          placeholder={placeholder}
          className={style.input}
          type={inputType}
          {...register(name, rules)}
        />{' '}
      </div>
      <p className={style.error}>{error as string ?? ''}</p>
    </div>
  )
}

export default TextInput
