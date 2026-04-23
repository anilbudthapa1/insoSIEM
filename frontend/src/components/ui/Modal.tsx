import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  }[size]

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-surface border border-border rounded-xl shadow-2xl',
            'w-full mx-4 animate-fade-in',
            'max-h-[90vh] overflow-y-auto',
            sizeClass,
            className,
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-text-primary">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-text-secondary mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary transition-colors ml-4 mt-0.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          )}
          {!(title || description) && (
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          )}
          <div className="p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
