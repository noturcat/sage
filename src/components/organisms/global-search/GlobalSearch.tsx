"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTypesenseClient, isTypesenseConfigured } from "@/lib/typesenseClient";
import type {
	Category,
	SearchItem,
	TypesenseHighlight,
	GenericDoc,
	TypesenseHit,
	TypesenseMultiSearchResult,
	TypesenseMultiSearchResponse,
	Props
} from "./GlobalSearch.types";
import { scoreMatch } from "@/util/typesenseFunction";
import GlocalSearchCategoryFilter from "./GlocalSearchCategoryFilter";
import style from "./GlobalSearch.module.scss";

const categories: Category[] = [
  "All",
  "Directories",
	"Listings",
  "Protocols",
  "Groups",
  "Pages",
  "Threads",
  "Discoveries",
  "Videos",
  "Events",
	"People",
	"Posts",
];

const defaultIndex: SearchItem[] = [];

export default function GlobalSearch({ open, onClose }: Props) {
	const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const [placeholderSuggestion, setPlaceholderSuggestion] = useState<string>("Search...");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [revealPhase, setRevealPhase] = useState<"0" | "1">("0");
  const revealRafRef = useRef<number | null>(null);
  const isDraggingChipsRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const lastDragAtRef = useRef<number>(0);
	const requestIdRef = useRef(0);
	const abortRef = useRef<AbortController | null>(null);

	const escapeHtml = (input: string): string => {
		return input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	const injectHighlightFallback = (text: string | undefined, q: string): string => {
		const safeText = escapeHtml(String(text || ""));
		const queryNorm = q.trim();
		if (!queryNorm) return safeText;
		try {
			const escaped = queryNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const regex = new RegExp(escaped, "ig");
			return safeText.replace(regex, (m) => `<mark class=\"${style.hl}\">${m}</mark>`);
		} catch {
			return safeText;
		}
	}

	const createHighlightedDescriptionExcerpt = (fullText: string, query: string, minChars: number = 120): string => {
		const plain = String(fullText || "").replace(/<[^>]*>/g, "").trim();
		if (!plain) return "";

		const q = String(query || "").trim();
		const totalLen = plain.length;

		let start = 0;
		let end = Math.min(minChars, totalLen);

		if (q) {
			try {
				const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regex = new RegExp(escaped, "i");
				const match = regex.exec(plain);
				if (match && match.index !== undefined) {
					const matchStart = match.index;
					const matchEnd = match.index + match[0].length;

					if (matchStart <= minChars / 2) {
						start = 0;
						end = Math.min(minChars, totalLen);
					} else if (totalLen - matchEnd <= minChars / 2) {
						end = totalLen;
						start = Math.max(0, end - minChars);
					} else {
						const context = Math.max(0, Math.floor((minChars - (match[0].length || 0)) / 2));
						start = Math.max(0, matchStart - context);
						end = Math.min(totalLen, start + minChars);
						if (end - start < minChars) {
							start = Math.max(0, end - minChars);
						}
					}
				}
			} catch {}
		}

		const needsLeadingEllipsis = start > 0;
		const needsTrailingEllipsis = end < totalLen;
		const slice = plain.slice(start, end);

		let result = "";
		if (q) {
			try {
				const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regex = new RegExp(escaped, "ig");
				let lastIndex = 0;
				let m: RegExpExecArray | null;
				while ((m = regex.exec(slice)) !== null) {
					result += escapeHtml(slice.slice(lastIndex, m.index));
					result += `<mark class=\"${style.hl}\">${escapeHtml(m[0])}</mark>`;
					lastIndex = regex.lastIndex;
				}
				result += escapeHtml(slice.slice(lastIndex));
			} catch {
				result = escapeHtml(slice);
			}
		} else {
			result = escapeHtml(slice);
		}

		return `${needsLeadingEllipsis ? "…" : ""}${result}${needsTrailingEllipsis ? "…" : ""}`;
	}

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
    } else {
      setQuery("");
      setActiveIndex(0);
      setActiveCategory("All");
      setSearchResults([]);
      setCurrentPage(1);
      setHasMore(false);
      setPlaceholderSuggestion("Search...");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  const categoryToCollectionName = (category: Exclude<Category, "All">): string => {
		if (category === "Directories") return "categories";
		if (category === "Listings") return "listings";
		if (category === "People") return "users";
		return category.toLowerCase();
  }

  const collectionNameToCategory = (collectionName: string | undefined): Exclude<Category, "All"> | null => {
    if (!collectionName) return null;
    const name = collectionName.toLowerCase();
    if (name === "categories" || name === "category") return "Directories";
    if (name === "listings" || name === "listing") return "Listings";
		if (name === "users" || name === "user") return "People";
    const found = (categories as string[]).find((c) => c.toLowerCase() === name && c !== "All");
    return found ? (found as Exclude<Category, "All">) : null;
  }

  const buildQueryFields = (): { queryBy: string; highlightFields: string } => {
    const fields = ["title"];
    return {
      queryBy: fields.join(","),
      highlightFields: ["title"].join(","),
    };
  }

	useEffect(() => {
		if (!open) return;

		const trimmed = query.trim();
		const tsClient = getTypesenseClient();
		if (!tsClient || !isTypesenseConfigured()) {
			const filtered = activeCategory === "All" ? defaultIndex : defaultIndex.filter(i => i.category === activeCategory);
			setSearchResults(!trimmed ? filtered : filtered.filter(i => scoreMatch(trimmed, i.title) >= 0));
			return;
		}

		// ⭐ FIX: clear any previous timer before creating a new one
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
			debounceTimerRef.current = null;
		}

		// ⭐ FIX: bump request id to invalidate in-flight timers/requests
		const myRequestId = ++requestIdRef.current;

		// Optional: prepare an AbortController if you later use fetch-based calls
		if (abortRef.current) abortRef.current.abort();
		abortRef.current = typeof AbortController !== "undefined" ? new AbortController() : null;

		debounceTimerRef.current = setTimeout(async () => {
			// ⭐ FIX: if a newer request started, bail out
			if (myRequestId !== requestIdRef.current) return;

			if (!trimmed) {
				setSearchResults([]);
				setPlaceholderSuggestion("Search...");
				return;
			}

			try {
				setIsSearching(true);

				const { queryBy, highlightFields } = buildQueryFields();
				const collectionsToSearch: Exclude<Category, "All">[] = (
					activeCategory === "All"
						? categories.filter((c): c is Exclude<Category, "All"> => c !== "All")
						: [activeCategory]
				) as Exclude<Category, "All">[];

				const PER_PAGE = 15;
				const perPagePerCollection = activeCategory === "All"
					? Math.max(1, Math.ceil(PER_PAGE / collectionsToSearch.length))
					: PER_PAGE;

				const searches = collectionsToSearch.map((cat) => {
					const collection = categoryToCollectionName(cat);
					if (collection === "listings" || collection === "categories") {
						const listingsQueryBy = "name,description";
						const listingsHighlight = "name,description";
						return {
							collection,
							q: trimmed,
							query_by: listingsQueryBy,
							query_by_weights: "1,2",
							per_page: perPagePerCollection,
							page: currentPage,
							prefix: "true",
							highlight_full_fields: listingsHighlight,
							highlight_affix_num_tokens: 4,
							highlight_start_tag: `<mark class=\"${style.hl}\">`,
							highlight_end_tag: "</mark>",
							drop_tokens_threshold: 2,
							num_typos: 2,
						} as const;
					} else if (collection === "users") {
						const usersQueryBy = "first_name,last_name,bio";
						const usersHighlight = "first_name,last_name,bio";
						return {
							collection,
							q: trimmed,
							query_by: usersQueryBy,
							query_by_weights: "1,2,3",
							per_page: perPagePerCollection,
							page: currentPage,
							prefix: "true",
							highlight_full_fields: usersHighlight,
							highlight_affix_num_tokens: 4,
							highlight_start_tag: `<mark class=\"${style.hl}\">`,
							highlight_end_tag: "</mark>",
							drop_tokens_threshold: 2,
							num_typos: 2,
						} as const;
					}
					return {
						collection,
						q: trimmed,
						query_by: queryBy,
						per_page: perPagePerCollection,
						page: currentPage,
						prefix: "true",
						highlight_full_fields: highlightFields,
						highlight_affix_num_tokens: 4,
						highlight_start_tag: `<mark class=\"${style.hl}\">`,
						highlight_end_tag: "</mark>",
						drop_tokens_threshold: 2,
						num_typos: 2,
					} as const;
				});

				const response = await (
					(tsClient as unknown as {
						multiSearch: {
							perform: (body: { searches: Array<Record<string, unknown>> }) => Promise<TypesenseMultiSearchResponse>;
						};
					}).multiSearch
				).perform({ searches: searches as Array<Record<string, unknown>> });

				// ⭐ FIX: ignore results if they're stale
				if (myRequestId !== requestIdRef.current) return;

				const merged: SearchItem[] = [];
				const counts: Record<Exclude<Category, "All">, number> = {
					Directories: 0,
					Listings: 0,
					Protocols: 0,
					Groups: 0,
					Pages: 0,
					Threads: 0,
					Discoveries: 0,
					Videos: 0,
					Events: 0,
					People: 0,
					Posts: 0,
				};

				const resultsArray: TypesenseMultiSearchResult[] = response?.results || [];
				for (let resultItem = 0; resultItem < resultsArray.length; resultItem++) {
					const r = resultsArray[resultItem];
					const requestedCollection: string | undefined = r?.request_params?.collection;
					const fallbackCollection: string = categoryToCollectionName(collectionsToSearch[resultItem] as Exclude<Category, "All">);
					const collectionName: string = (requestedCollection || fallbackCollection || "");
					const categoryName = collectionNameToCategory(collectionName);

					const hits: TypesenseHit[] = r?.hits || [];
					if (categoryName) counts[categoryName] = hits.length;

					for (const h of hits) {
						const doc: GenericDoc = (h?.document || {}) as GenericDoc;
						const highlights: TypesenseHighlight[] = Array.isArray(h?.highlights) ? (h.highlights as TypesenseHighlight[]) : [];

						const pickHighlight = (fields: string[]): string | undefined => {
							const found = highlights.find((x) => fields.includes(x.field));
							return found?.snippet;
						};

						const collLower = (collectionName || '').toLowerCase();
						const isDirectories = collLower === 'directories' || collLower === 'directory' || collLower === 'categories' || collLower === 'category';
						const isListings = collLower === 'listings' || collLower === 'listing';
						const isUsers = collLower === 'users' || collLower === 'user' || collLower === 'people';

						if (isDirectories) {
							const titleHl = pickHighlight(["name"]);
							const baseTitle = (doc.name || doc.title || "Untitled") as string;
							const title = (titleHl || injectHighlightFallback(baseTitle, trimmed)) as string;
							const baseDesc = String(doc.description || "");
							const description = createHighlightedDescriptionExcerpt(baseDesc, trimmed, 110) as string;
							const slug = doc.slug as string | undefined;
							const href = slug ? `/directory/${slug}` : "/directory";
							const avatarUrl = doc.thumbnail_url ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${doc.thumbnail_url as string}` : '';

							const item: SearchItem = {
								title,
								subtitle: doc.company_name,
								href,
								icon: doc.icon,
								category: (categoryName || "Directories") as Category,
								description,
								image: doc.image,
								badge: doc.badge,
								avatarUrl: avatarUrl
							};
							merged.push(item);
						} else if (isListings) {
							const titleHl = pickHighlight(["name"]);
							const baseTitle = (doc.name || doc.title || "Untitled") as string;
							const title = (titleHl || injectHighlightFallback(baseTitle, trimmed)) as string;
							const baseDesc = String(doc.description || "");
							const description = createHighlightedDescriptionExcerpt(baseDesc, trimmed, 110) as string;
							const slug = doc.slug as string | undefined;
							const href = slug ? `/listings/${slug}` : "/listings";
							const avatarUrl = doc.avatar_url ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${doc.avatar_url as string}` : '';

							const item: SearchItem = {
								title,
								subtitle: doc.company_name,
								href,
								icon: doc.icon,
								category: (categoryName || "Listings") as Category,
								description,
								image: doc.image,
								badge: doc.badge,
								avatarUrl: avatarUrl
							};
							merged.push(item);
						} else if (isUsers) {
							const titleHl = pickHighlight(["first_name", "last_name"]);
							const baseTitle = (`${doc.first_name} ${doc.last_name}` || "Untitled") as string;
							const title = (titleHl || baseTitle) as string;
							const baseDesc = String(doc.bio || "");
							const description = createHighlightedDescriptionExcerpt(baseDesc, trimmed, 110) as string;
							const slug = doc.slug as string | undefined;
							const href = slug ? `/${slug}` : "/";
							const avatarUrl = doc.avatar_url ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${doc.avatar_url as string}` : '';

							const item: SearchItem = {
								title,
								subtitle: doc.company_name,
								href,
								icon: doc.icon,
								category: (categoryName || "People") as Category,
								description,
								image: doc.image,
								badge: doc.badge,
								avatarUrl: avatarUrl
							};
							merged.push(item);
						} else {
							const titleHl = pickHighlight(["title", "name"]);
							const derivedCategory = (categoryName || (doc.category as Category) || (collectionName ? (collectionName.charAt(0).toUpperCase() + collectionName.slice(1)) as Category : "Pages")) as Category;
							const baseTitle = (doc.title || doc.name || doc.company_name || doc.slug || "Untitled") as string;
							const title = (titleHl || injectHighlightFallback(baseTitle, trimmed)) as string;
							const baseDesc = String(doc.description || "");
							const description = createHighlightedDescriptionExcerpt(baseDesc, trimmed, 110) as string;
							const item: SearchItem = {
								title,
								subtitle: doc.subtitle,
								href: (doc.href || doc.url || "/") as string,
								icon: doc.icon,
								category: derivedCategory,
								description,
								image: doc.image,
								badge: doc.badge,
							};
							merged.push(item);
						}
					}
				}

				setSearchResults((prev) => {
					if (currentPage === 1) return merged;
					const seen = new Set(prev.map((p) => `${p.href}|${p.title}`));
					const toAdd = merged.filter((m) => !seen.has(`${m.href}|${m.title}`));
					return prev.concat(toAdd);
				});

				if (merged.length > 0 && currentPage === 1) {
					const suggestionText = String(merged[0].title || "").replace(/<[^>]*>/g, "").trim();
					setPlaceholderSuggestion(suggestionText ? `Try: ${suggestionText}` : "Search...");
				} else if (currentPage === 1) {
					setPlaceholderSuggestion("No results found");
				}

				const anyFullPage = resultsArray.some((r) => (r?.hits?.length || 0) >= perPagePerCollection);
				setHasMore(anyFullPage);
				setIsLoadingMore(false);

			} catch (err) {
				// optional: if using AbortController, ignore abort errors
				// if (abortRef.current?.signal.aborted) return;
				console.error(err);
				setSearchResults([]);
			} finally {
				// ⭐ FIX: only end "searching" if still latest request
				if (myRequestId === requestIdRef.current) setIsSearching(false);
			}
		}, 300); // small bump to 300ms can help, optional

		// ⭐ FIX: CLEANUP — clear the timer and abort on unmount or dependency change
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
				debounceTimerRef.current = null;
			}
			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
		};
		// NOTE: keep currentPage here to support pagination; keep open/query/category too
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, activeCategory, open, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory]);

  useEffect(() => {
    if (!open) {
      setRevealPhase("0");
      return;
    }

    if (isSearching) {
      if (revealRafRef.current) cancelAnimationFrame(revealRafRef.current);
      setRevealPhase("0");
      return;
    }

    if (query.trim() && searchResults.length > 0) {
      if (revealRafRef.current) cancelAnimationFrame(revealRafRef.current);
      revealRafRef.current = requestAnimationFrame(() => setRevealPhase("1"));
    } else {
      setRevealPhase("1");
    }

    return () => {
      if (revealRafRef.current) {
        cancelAnimationFrame(revealRafRef.current);
        revealRafRef.current = null;
      }
    };
  }, [open, isSearching, searchResults, query]);

  useEffect(() => {
    if (!open) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first && first.isIntersecting) {
        if (!isSearching && hasMore) {
          setCurrentPage((p) => p + 1);
        }
      }
    }, { root: null, rootMargin: "200px", threshold: 0 });
    const sentinel = loadMoreRef.current;
    if (sentinel) observerRef.current.observe(sentinel);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [open, isSearching, hasMore, loadMoreRef]);

  useEffect(() => {
    if (!open) return;
    const el = chipsRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingChipsRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartScrollLeftRef.current = el.scrollLeft;
      el.setAttribute("data-dragging", "1");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingChipsRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      el.scrollLeft = dragStartScrollLeftRef.current - deltaX;
      lastDragAtRef.current = Date.now();
    };

    const handleMouseUp = () => {
      isDraggingChipsRef.current = false;
      el.setAttribute("data-dragging", "0");
    };

    // Disable wheel-based scrolling to enforce drag-only behavior
		const handleWheel = (e: WheelEvent) => {
			if (el.scrollWidth <= el.clientWidth) return;
			// Convert vertical wheel to horizontal scroll
			if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
				el.scrollLeft += e.deltaY;
				e.preventDefault();
			}
		};

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartXRef.current = t.clientX;
      touchStartYRef.current = t.clientY;
      dragStartScrollLeftRef.current = el.scrollLeft;
      isDraggingChipsRef.current = false;
      el.setAttribute("data-dragging", "0");
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartXRef.current;
      const dy = t.clientY - touchStartYRef.current;
      if (!isDraggingChipsRef.current && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        isDraggingChipsRef.current = true;
        el.setAttribute("data-dragging", "1");
      }
      if (isDraggingChipsRef.current) {
        el.scrollLeft = dragStartScrollLeftRef.current - dx;
        lastDragAtRef.current = Date.now();
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      isDraggingChipsRef.current = false;
      el.setAttribute("data-dragging", "0");
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);

    // Prevent click on buttons if we dragged
    const handleClickCapture = (e: MouseEvent) => {
      const now = Date.now();
      const recentlyDragged = now - lastDragAtRef.current < 250;
      if (isDraggingChipsRef.current || recentlyDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    el.addEventListener("click", handleClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("wheel", handleWheel as EventListener);
      el.removeEventListener("touchstart", handleTouchStart as EventListener);
      el.removeEventListener("touchmove", handleTouchMove as EventListener);
      el.removeEventListener("touchend", handleTouchEnd as EventListener);
      el.removeEventListener("touchcancel", handleTouchEnd as EventListener);
      el.removeEventListener("click", handleClickCapture, true);
    };
  }, [open]);

  const visibleCategories: Category[] = useMemo(() => {
    return categories;
  }, []);

  const handleClickItem = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!open) return null;

	const handleActiveCategory = (category: Category) => {
		setActiveCategory(category)
	}

  return (
		<>
			<div className={style.container} role="dialog" aria-modal="true" aria-label="Global Search">
				<div className={style.backdrop} onClick={onClose} />
				<div className={style.searchContainer}>
					<div className={style.panel}>
						<div className={style.header}>
							<Image src="/icons/white-magnifying-glass.svg" alt="Search" width={36} height={36} />
							<input
								ref={inputRef}
								type="text"
								autoFocus
								placeholder={placeholderSuggestion}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</div>

						{query.trim() && (
							<div className={style.resultPanel}>
								<GlocalSearchCategoryFilter
									categories={visibleCategories}
									onActiveCategory={handleActiveCategory}
								/>

								<div className={style.loading} role="status" aria-live="polite">
									<div className={style.progressBar} data-searching={isSearching ? "0" : "1"}>
										{isSearching && (
											<div className={style.progressIndicator} />
										)}
									</div>
								</div>

                <ul className={style.results} role="listbox" aria-label="Search results" data-reveal={revealPhase}>
									{!isSearching && searchResults.length === 0 && (
										<li className={style.empty}>No results</li>
									)}
									{searchResults.map((result, index) => (
										<li
											key={`${result.href}-${index}`}
											className={`${style.resultItem} ${index === activeIndex ? style.active : ""}`}
											role="option"
											aria-selected={index === activeIndex}
											onMouseEnter={() => setActiveIndex(index)}
											onMouseDown={(e) => e.preventDefault()}
											onClick={() => handleClickItem(result.href)}
										>
											<div className={style.left}>
												<Image className={style.thumb} src={result.avatarUrl || "/images/avatar-placeholder.png"} alt="" width={44} height={44} />
											</div>
											<div className={style.center}>
												<div className={style.heading}>
													<h6 className={style.title} dangerouslySetInnerHTML={{ __html: String(result.title) }} />
													<span className={style.badge}>{result.category}</span>
												</div>
												<p className={style.description} dangerouslySetInnerHTML={{ __html: String(result.description || "") }} />
											</div>
										</li>
									))}
									<div ref={loadMoreRef} className={style.sentinel} aria-hidden="true" />
								</ul>

								{hasMore && (
									<button
										className={style.seeMore}
										onClick={() => {
											setIsLoadingMore(true);
											setCurrentPage((p) => p + 1);
										}}
										disabled={isLoadingMore}
									>
										{isLoadingMore ? (
											<>
												<span className={style.spinner} aria-hidden="true" />
												Loading…
											</>
										) : (
											<>
												See more
												<Image className={style.seeMoreIcon} src="/icons/white-arrow-down.svg" alt="" width={12} height={12} />
											</>
										)}
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
  );
}


