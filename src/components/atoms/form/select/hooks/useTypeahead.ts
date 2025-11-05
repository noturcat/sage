/**
 * **Check if keyboard event** represents a printable character.
 *
 * Determines if a keyboard event represents a single printable character
 * that can be used for typeahead functionality, excluding modifier keys.
 *
 * Example:
 * ```tsx
 * const isPrintable = isPrintableKey(event)
 * ```
 *
 * Notes:
 * - Returns true if the key is a printable character.
 * - Excludes modifier keys (ctrl, meta, alt).
 * - Used for typeahead functionality in select components.
 */

function isPrintableKey(e: React.KeyboardEvent) {
	return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey
}

export default isPrintableKey
