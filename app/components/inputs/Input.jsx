'use client';

import React from 'react';
import { BiDollar } from 'react-icons/bi';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

const Input = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  required,
  register,
  onChange,
  errors
}) => {
  return (
    <div className='w-full relative'>
      {formatPrice && (
        <BiDollar 
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=' '
        type={type}
        className={`
          peer
          w-full
          p-2
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? 'pl-9' : 'pl-4'}
          ${errors[id] ? 'border-[#c7b198]' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-[#c7b198]' : 'focus:border-black'}
        `}
        onChange={onChange}
      />
      <label
        className={`
          absolute
          text-md
          duration-150
          transform
          -translate-y-3
          top-5
          z-10
          origin-[0]
          ${formatPrice ? 'left-9' : 'left-4'}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? 'text-[#c7b198]' : 'text-zinc-400'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;