import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export function Notification({ type = 'success', message, onClose, duration = 5000 }) {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const styles = {
        success: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            text: 'text-green-400',
            icon: CheckCircle
        },
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-400',
            icon: XCircle
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
            icon: Info
        }
    }

    const style = styles[type] || styles.info
    const Icon = style.icon

    return (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 ${style.bg} border ${style.border} rounded-lg p-4 shadow-lg backdrop-blur-sm animate-slide-in`}>
            <div className="flex items-start gap-3">
                <Icon className={`${style.text} flex-shrink-0 mt-0.5`} size={20} />
                <p className={`flex-1 text-sm ${style.text}`}>{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${style.text} cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0`}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    )
}
