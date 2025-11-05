import { useState } from 'react'
import { FieldError, RegisterOptions, useFormContext } from 'react-hook-form'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from '../Input.module.scss'

export type PasswordInputProps = {
  name: string
  label?: string
  rules?: RegisterOptions
  placeholder?: string
  confirm?: string
}

const PasswordInput = ({ name, label, rules, placeholder = '', confirm }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const context = useFormContext()

  const {
    register,
    formState: { errors }
  } = context

  const fieldErrors = errors[name]

  if (confirm) {
    rules = {
      ...rules,
      validate: (value: string) => value === context.getValues(confirm) || 'Passwords do not match',
    }
  } 

  return (
    <div className={`${style.formElement} ${(fieldErrors || fieldErrors) ? style.hasError : ''}`}>
      {label && (
        <label className={style.label}>
          {label}
          <span className={style.required}>{rules?.required && ' *'}</span>
        </label>
      )}
      <div className={style.inputWrap}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={style.input}
          {...register(name, rules)}
        />
        <ButtonIcon
          icon={showPassword ? '/icons/eye-off.svg' : '/icons/eye-open.svg'}
          variant={"text"}
          styleType={"icon"}
          size={24}
          alt={"Toggle password visibility"}
          onClick={() => setShowPassword(prev => !prev)}
          extraClass={style.eyeButton}
        />
      </div>
      <p className={style.error}>{(fieldErrors as FieldError)?.message ?? ''}</p>
    </div>
  )
}

export default PasswordInput
