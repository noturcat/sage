import style from './ContentHeader.module.scss'

/**
 * Flexible **compound header** for content pages.
 *
 * Provides a consistent layout with subcomponents for title, info, and footer.
 * Use it to compose page headers for protocols, threads, and discoveries.
 *
 * Example:
 * ```tsx
 * <ContentHeader>
 *   <ContentHeader.Title>Protocol Title</ContentHeader.Title>
 *   <ContentHeader.ContentInfo>
 *     <ProtocolAvatar {...authorData} />
 *   </ContentHeader.ContentInfo>
 *   <ContentHeader.Footer>
 *     <ProtocolActions tags={tags} />
 *   </ContentHeader.Footer>
 * </ContentHeader>
 * ```
 *
 * Notes:
 * - Intended as a page-level header (one per page).
 * - Children should be the provided subcomponents for consistent spacing/semantics.
 */

function ContentHeader({ children }: { children: React.ReactNode }) {
	return <main className={style.wrapper}>{children}</main>
}

/** Main title for the content header (semantic h2). */
function ContentHeaderTitle({ children }: { children: React.ReactNode }) {
	return <h2 className={style.title}>{children}</h2>
}

/** Container for author/meta blocks shown beneath the title. */
function ContentHeaderContentInfo({ children }: { children: React.ReactNode }) {
	return <div className={style.contentInfo}>{children}</div>
}

/** Footer area for tags, badges, and actions. */
function ContentHeaderFooter({ children }: { children: React.ReactNode }) {
	return <div className={style.footer}>{children}</div>
}

// Attach sub-components to main component
ContentHeader.Title = ContentHeaderTitle
ContentHeader.ContentInfo = ContentHeaderContentInfo
ContentHeader.Footer = ContentHeaderFooter

export default ContentHeader
