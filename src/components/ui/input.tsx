import React from 'react';

// Gunakan type alias agar seluruh atribut standar elemen <input> otomatis tersedia
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Gunakan ...props untuk menangkap semua atribut yang diwarisi
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    // 2. Sebarkan (spread) semua props ke elemen input.
    // Ini akan meneruskan type, value, onChange, placeholder, required, disabled, dll. secara otomatis.
    {...props} 
    className={`border px-2 py-1 rounded-md ${className}`}
  />
);

export default Input;