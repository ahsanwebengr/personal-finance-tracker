import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ value, onChange, options, className = '', label, ...props }) {
    return (
        <div className={`relative ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <div className="relative flex items-center">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="input-field appearance-none cursor-pointer pr-10"
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
