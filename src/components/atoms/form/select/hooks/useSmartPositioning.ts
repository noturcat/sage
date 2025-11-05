import { useCallback, useEffect } from 'react'

/**
 * **Hook for intelligent dropdown positioning** with collision detection.
 *
 * Automatically positions dropdown content relative to trigger element with
 * viewport collision detection. Handles horizontal centering with clipping and vertical flipping.
 *
 * Example:
 * ```tsx
 * useSmartPositioning(isOpen, triggerRef, contentRef)
 * ```
 *
 * Notes:
 * - Automatic viewport collision detection.
 * - Horizontal centering with viewport clamping.
 * - Vertical flip when space is insufficient.
 * - Responsive to window resize and scroll.
 */

function useSmartPositioning(
	active: boolean,
	triggerRef: React.RefObject<HTMLElement | null>,
	contentRef: React.RefObject<HTMLElement | null>
) {
	const update = useCallback(() => {
		const tEl = triggerRef.current
		const cEl = contentRef.current
		if (!tEl || !cEl) return

		const vw = window.innerWidth,
			vh = window.innerHeight,
			pad = 8
		const t = tEl.getBoundingClientRect()
		const c = cEl.getBoundingClientRect()

		// Find the modal container to calculate space relative to it, not viewport
		const modal = tEl.closest('[role="dialog"], .modal, [data-modal]') as HTMLElement

		// Smart horizontal positioning - start aligned with trigger left edge
		let desiredLeft = 0 // Start aligned with trigger left edge (relative to trigger)

		// Calculate horizontal boundaries relative to trigger
		let leftBoundary = -t.left + pad
		let rightBoundary = vw - t.left - pad - c.width

		if (modal) {
			const modalRect = modal.getBoundingClientRect()
			leftBoundary = modalRect.left - t.left + pad
			rightBoundary = modalRect.right - t.left - pad - c.width
		}

		// If calendar would overflow right, try to align with trigger right edge
		if (desiredLeft + c.width > rightBoundary) {
			desiredLeft = t.width - c.width
		}

		// If still overflowing left, center it as fallback
		if (desiredLeft < leftBoundary) {
			desiredLeft = t.width / 2 - c.width / 2
		}

		// Final clamp to boundaries
		const clampedLeft = Math.min(Math.max(desiredLeft, leftBoundary), rightBoundary)
		cEl.style.setProperty('--position-left', `${Math.round(clampedLeft)}px`)
		let availableSpaceBelow = vh - t.bottom - pad
		let availableSpaceAbove = t.top - pad

		if (modal) {
			const modalRect = modal.getBoundingClientRect()
			// Calculate space within the modal boundaries
			availableSpaceBelow = modalRect.bottom - t.bottom - pad
			availableSpaceAbove = t.top - modalRect.top - pad
		}

		const contentHeight = Math.min(c.height, 20 * 16) // Assume max 20rem height

		// SUPER aggressive logic - if there's less than 400px below, open on top
		// Also force top if we're in a modal and space is tight
		const isInModal = !!modal
		const placeTop =
			availableSpaceBelow < 400 ||
			(isInModal && availableSpaceBelow < 500) ||
			(availableSpaceBelow < contentHeight && availableSpaceAbove > availableSpaceBelow)

		cEl.dataset.side = placeTop ? 'top' : 'bottom'
	}, [triggerRef, contentRef])

	useEffect(() => {
		if (!active) return

		// Use requestAnimationFrame to ensure content is fully rendered
		const rafId = requestAnimationFrame(() => {
			update()
		})

		// Also add a delayed update in case the first one doesn't work
		const timeoutId = setTimeout(() => {
			update()
		}, 100)

		const onReflow = () => update()
		window.addEventListener('resize', onReflow)
		window.addEventListener('scroll', onReflow, true)
		const ro = new ResizeObserver(onReflow)
		if (triggerRef.current) ro.observe(triggerRef.current)
		if (contentRef.current) ro.observe(contentRef.current)
		return () => {
			cancelAnimationFrame(rafId)
			clearTimeout(timeoutId)
			window.removeEventListener('resize', onReflow)
			window.removeEventListener('scroll', onReflow, true)
			ro.disconnect()
		}
	}, [active, update, triggerRef, contentRef])
}

export default useSmartPositioning
