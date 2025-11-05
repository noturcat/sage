import { FieldError, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import style from '../Input.module.scss'

export type RadioInputProps = {
  methods?: UseFormReturn
  name: string
  label?: string
  rules?: RegisterOptions
  options: { value: string; label: string }[]
  columns?: number
}

const RadioInput = ({ methods, name, label, rules, options, columns }: RadioInputProps) => {
  const errors = methods?.formState?.errors[name]
  const context = useFormContext()

  return (
    <div className={`${style.formElement} ${errors && style.hasError}`}>
      {label && (
        <label className={style.label}>
          {label}
          <span className={style.required}>{rules?.required && ' *'}</span>
        </label>
      )}
      <div
        className={`${style.inputWrap} ${style.radioGroup} ${columns && style[`columns${columns}`]}`}
      >
        {options.map((option) => (
          <div key={option.value}>
            <input
              className={style.radioItem}
              id={`option-${option.value}`}
              {...context?.register(name, rules)}
              type={'radio'}
              value={option.value}
            />
            <label htmlFor={`option-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
      <p className={style.error}>{(errors as FieldError)?.message ?? ''}</p>
    </div>
  )
}

export default RadioInput
