import { FieldValues, useForm, UseFormProps } from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

export function useZodForm<TSchema extends ZodSchema<FieldValues>>(
  schema: TSchema,
  props?: Omit<UseFormProps<TypeOf<TSchema>>, 'resolver'>
) {
  return useForm<TypeOf<TSchema>>({
    ...props,
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
}


