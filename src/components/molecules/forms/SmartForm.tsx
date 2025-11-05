import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import React, { useEffect } from 'react'
import Button from '@/components/atoms/button/Button'
import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './SmartForm.module.scss'

type SmartFormProps<T extends FieldValues> = {
  methods: UseFormReturn<T>
  defaultValues?: Partial<T>
  children: React.ReactNode
  onSubmit: (data: T) => void
  onSkip?: () => void
  loading?: boolean
  submitLabel?: string
  skipLabel?: string
  resetTrigger?: number
  className?: string
  formRef?: React.RefObject<HTMLFormElement>
  submitButton?: 'icon' | 'custom'
}

const SmartForm = <T extends FieldValues>({
  methods,
  children,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
  skipLabel,
  onSkip,
  resetTrigger,
  className,
  formRef,
  submitButton = 'custom'
}: SmartFormProps<T>) => {
  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods

  const isReactElementWithProps = (
    child: React.ReactNode,
  ): child is React.ReactElement<{ name?: string; children?: React.ReactNode }> => {
    return React.isValidElement(child) && typeof child.props === 'object'
  }

  const recursiveCloneChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      let childProps: Record<string, unknown> = {}
      if (isReactElementWithProps(child) && 'name' in child.props) {
        childProps = {
          ...child.props,
          methods,
          key: child.props.name,
        }
      }
      if (isReactElementWithProps(child) && child.props?.children) {
        childProps.children = recursiveCloneChildren(child.props.children)
      }
      return child && React.isValidElement(child) ? React.cloneElement(child, childProps) : child
    })
  }

  const handleSkip = () => {
    if (onSkip) onSkip()
  }

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) reset()
  }, [resetTrigger, reset])

  return (
    <FormProvider {...methods}>
      <form ref={formRef} className={className} onSubmit={handleSubmit(onSubmit)}>
        {recursiveCloneChildren(children)}
        <div className={style.actions} data-form-has-skip={!!(onSkip && skipLabel)}>
          {onSkip && skipLabel ? (
            <Button label={skipLabel} type="button" variant="primary" styleType="outlined" onClick={handleSkip} />
          ) : (
            <div></div>
          )}
          {submitButton === 'icon' && (
            <ButtonIcon
              variant="primary"
              styleType="solid"
              size={18}
              icon="/icons/white-arrow-right.svg"
              disabled={!isValid || loading}
              label={submitLabel}
              type="submit"
              loading={loading}
            />
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default SmartForm
