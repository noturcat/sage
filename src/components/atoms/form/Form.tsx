'use client'

import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import styles from './Form.module.scss'

/**
 * **Form component system** built on React Hook Form.
 *
 * Provides context-aware form field management, validation state handling, and accessible form controls.
 * Built without external UI libraries using pure HTML elements with SCSS styling.
 *
 * Example:
 * ```tsx
 * <Form {...form}>
 *   <FormField
 *     control={form.control}
 *     name="email"
 *     render={({ field }) => (
 *       <FormItem>
 *         <FormLabel>Email</FormLabel>
 *         <FormControl>
 *           <input type="email" {...field} />
 *         </FormControl>
 *         <FormMessage />
 *       </FormItem>
 *     )}
 *   />
 * </Form>
 * ```
 *
 * Notes:
 * - Complete React Hook Form integration.
 * - Automatic accessibility attributes.
 * - Validation error handling and display.
 */

// Main Form component - wrapper around FormProvider
const Form = FormProvider

// Type definition for FormField context value
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

// Context for sharing field name across form components
const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

/** Controller wrapper that provides field context. */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// Type definition for FormItem context value
type FormItemContextValue = {
  id: string
}

// Context for sharing form item ID across form components
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

/** Custom hook for accessing form field state and context. */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

/** Container component for form field groups. */
function FormItem({ className = '', ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={`${styles.formItem} ${className}`} {...props} />
    </FormItemContext.Provider>
  )
}

/** Label component with error state styling. */
function FormLabel({ className = '', ...props }: React.ComponentProps<'label'>) {
  const { error, formItemId } = useFormField()

  return (
    <label
      data-slot="form-label"
      data-error={!!error}
      className={`${styles.formLabel} ${error ? styles.formLabelError : ''} ${className}`}
      htmlFor={formItemId}
      {...props}
    />
  )
}

/** Wrapper for form input elements. */
function FormControl({ children, ...props }: React.ComponentProps<'div'>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <div data-slot="form-control" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childElement = child as React.ReactElement<{
            className?: string
            id?: string
            'aria-describedby'?: string
            'aria-invalid'?: boolean
          }>

          return React.cloneElement(childElement, {
            id: formItemId,
            'aria-describedby': !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`,
            'aria-invalid': !!error,
            className: `${childElement.props.className || ''} ${styles.formControl}`,
          })
        }
        return child
      })}
    </div>
  )
}

/** Descriptive text for form fields. */
function FormDescription({ className = '', ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={`${styles.formDescription} ${className}`}
      {...props}
    />
  )
}

/** Error message display component. */
function FormMessage({ className = '', children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={`${styles.formMessage} ${className}`}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
