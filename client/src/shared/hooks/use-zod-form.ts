'use client';

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { normalizeError } from '@/shared/errors/app-error';

interface ValidationIssue {
  path: readonly PropertyKey[];
  message: string;
}

/** Structural shape of a Zod schema; avoids coupling the hook to Zod generics. */
interface ZodLikeSchema<TInput, TOutput> {
  safeParse(
    value: TInput,
  ):
    | { success: true; data: TOutput }
    | { success: false; error: { issues: readonly ValidationIssue[] } };
}

interface UseZodFormOptions<TValues extends Record<string, string>, TOutput> {
  schema: ZodLikeSchema<TValues, TOutput>;
  initialValues: TValues;
  onSubmit: (values: TOutput) => Promise<void> | void;
}

type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

/**
 * Reusable form state + Zod validation for client components.
 * Field-level errors map to the first issue for that field; submit errors
 * are normalised into a single, user-safe alert message.
 */
export function useZodForm<TValues extends Record<string, string>, TOutput>({
  schema,
  initialValues,
  onSubmit,
}: UseZodFormOptions<TValues, TOutput>) {
  type Field = Extract<keyof TValues, string>;

  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setFieldValue = useCallback((field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const getFieldProps = useCallback(
    (field: Field) => ({
      name: field,
      value: String(values[field] ?? ''),
      onChange: (event: ChangeEvent<HTMLInputElement>) => setFieldValue(field, event.target.value),
      'aria-invalid': Boolean(errors[field]),
    }),
    [errors, setFieldValue, values],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError('');

      const result = schema.safeParse(values);
      if (!result.success) {
        const nextErrors: FieldErrors<TValues> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as Field | undefined;
          if (field && !nextErrors[field]) nextErrors[field] = issue.message;
        }
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setSubmitting(true);
      try {
        await onSubmit(result.data);
      } catch (error) {
        setFormError(normalizeError(error).message);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, schema, values],
  );

  return { values, errors, formError, submitting, getFieldProps, setFieldValue, handleSubmit };
}
