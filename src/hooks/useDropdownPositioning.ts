import { useCallback, useEffect } from 'react'

/**
 * Simple dropdown positioning hook
 */
function useDropdownPositioning(
	active: boolean,
	triggerRef: React.RefObject<HTMLElement | null>,
	contentRef: React.RefObject<HTMLDivElement | null>
) {
	const update = useCallback(() => {
		const triggerEl = triggerRef.current
		const contentEl = contentRef.current
		if (!triggerEl || !contentEl) return

		const triggerRect = triggerEl.getBoundingClientRect()
		const viewportHeight = window.innerHeight
		const viewportWidth = window.innerWidth
		const padding = 8

		// Force a reflow to get accurate content dimensions
		contentEl.style.visibility = 'hidden'
		contentEl.style.display = 'block'
		const contentRect = contentEl.getBoundingClientRect()
		contentEl.style.visibility = 'visible'

		// Calculate available space
		const spaceBelow = viewportHeight - triggerRect.bottom - padding
		const spaceAbove = triggerRect.top - padding

		// Determine vertical position - use a minimum content height if contentRect.height is 0
		const contentHeight = contentRect.height || 200 // fallback height
		const shouldPlaceAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow

		// Calculate horizontal position (center by default)
		let left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2

		// Clamp to viewport
		left = Math.max(padding, Math.min(left, viewportWidth - contentRect.width - padding))

		// Calculate final top position with viewport clamping
		let top: number
		if (shouldPlaceAbove) {
			top = triggerRect.top - contentHeight - padding
			// Ensure it doesn't go above viewport
			top = Math.max(padding, top)
		} else {
			top = triggerRect.bottom + padding
			// Ensure it doesn't go below viewport
			const maxTop = viewportHeight - contentHeight - padding
			top = Math.min(top, maxTop)
		}

		// Apply positioning
		contentEl.style.position = 'fixed'
		contentEl.style.left = `${left}px`
		contentEl.style.top = `${top}px`
		contentEl.style.zIndex = '9999'
	}, [triggerRef, contentRef])

	useEffect(() => {
		if (!active) return

		// Use requestAnimationFrame to ensure content is rendered
		const rafId = requestAnimationFrame(update)

		// Update on scroll and resize
		const handleUpdate = () => update()
		window.addEventListener('scroll', handleUpdate, true)
		window.addEventListener('resize', handleUpdate)

		return () => {
			cancelAnimationFrame(rafId)
			window.removeEventListener('scroll', handleUpdate, true)
			window.removeEventListener('resize', handleUpdate)
		}
	}, [active, update])
}

export default useDropdownPositioning
