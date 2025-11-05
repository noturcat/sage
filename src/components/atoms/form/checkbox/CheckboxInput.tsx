import React from 'react'
import { FieldError, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import style from '../Input.module.scss'

export type CheckboxInputProps = {
  methods?: UseFormReturn
  name: string
  label?: string
  rules?: RegisterOptions
  options: { value: string; label: string | React.ReactNode }[]
  noMargin?: boolean
  defaultChecked?: boolean  
}

const CheckboxInput = ({ methods, name, label, rules, options, noMargin, defaultChecked }: CheckboxInputProps) => {
  const errors = methods?.formState?.errors[name]
  const context = useFormContext()

  return (
    <div className={`${style.formElement} ${noMargin && style.noMargin} ${errors && style.hasError}`}>
      {label && (
        <label className={style.label}>
          {label}
          <span className={style.required}>{rules?.required ? ' *' : ''}</span>
        </label>
      )}

      <div className={style.inputWrap}>
        {options.map((option) => (
          <div key={option.value} className={style.checkboxItem}>
            <input
              className={style.checkbox}
              id={`option-${option.value}`}
              {...context?.register(name, rules)}
              type={'checkbox'}
              value={option.value}
              defaultChecked={defaultChecked}
            />

            <label className={style.checkboxLabel} htmlFor={`option-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <p className={style.error}>{(errors as FieldError)?.message ?? ''}</p>
    </div>
  )
}

export default CheckboxInput
