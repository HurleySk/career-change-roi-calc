import { useState, useRef, useEffect, useCallback } from 'react'

interface CollapsibleSectionProps {
  title: string
  accentColor?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  accentColor = 'border-cyan-500',
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  )

  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight)
        }
      })
      observer.observe(contentRef.current)
      return () => observer.disconnect()
    }
  }, [])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <div
      className={`border-l-2 ${accentColor} mb-4 rounded-r-lg bg-slate-900/50 backdrop-blur-sm`}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-800/40 rounded-tr-lg"
      >
        <h3 className="font-display text-base font-semibold text-slate-200">
          {title}
        </h3>
        <span
          className={`text-slate-500 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          &#9662;
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? (contentHeight ?? 1000) : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-4 pb-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  )
}
