import React from 'react';

// 1. Warisi (extends) semua tipe atribut standar dari React untuk elemen <input>
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Anda tetap bisa menambahkan props kustom di sini jika suatu saat dibutuhkan
  // contoh: errorState?: boolean;
}

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