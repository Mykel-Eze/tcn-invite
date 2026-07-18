import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './Input'
import { cn } from '../../lib/utils'

// Password field with a show/hide toggle. Accepts the same props as Input.
export function PasswordInput({ label, className, ...props }) {
    const [ visible, setVisible ] = useState(false)

    return (
        <div className="w-full space-y-1">
            {label && (
                <label className="text-sm font-medium text-white/80 block ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <Input
                    {...props}
                    type={visible ? 'text' : 'password'}
                    className={cn('pr-11', className)}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setVisible(v => !v)}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    )
}
