import { useEffect } from 'react'

/**
 * **Hook to handle clicks outside** a referenced element.
 *
 * Listens for pointer down events outside the referenced element and calls
 * the onOutside callback when detected. Only active when the active flag is true.
 *
 * Example:
 * ```tsx
 * useOutsidePointerDown(isOpen, rootRef, () => setIsOpen(false))
 * ```
 *
 * Notes:
 * - Efficient event listener management.
 * - Only listens when component is active.
 * - Proper cleanup on unmount.
 */

function useOutsidePointerDown(
  active: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    if (!active) return
    const handler = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [active, onOutside, rootRef])
}

export default useOutsidePointerDown
