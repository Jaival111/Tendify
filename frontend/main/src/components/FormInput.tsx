import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  autoFocus?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  autoFocus,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={name}
          required
          autoFocus={autoFocus}
          className={`block w-full ${icon ? 'pl-10' : 'pl-4'
            } pr-10 py-3 border ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fadeIn" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;