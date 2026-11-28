'use client';

import { useState, type ComponentProps } from 'react';
import { InputField } from './input-field';

type PasswordFieldProps = Omit<ComponentProps<typeof InputField>, 'type' | 'trailing'>;

/** Password input with an accessible visibility toggle. */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <InputField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}
