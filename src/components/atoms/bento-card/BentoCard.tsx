import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import './BentoCard.css';

export interface BentoCardProps {
	image?: string;
	title?: string;
	description?: string;
	label?: string;
	textAutoHide?: boolean;
	disableAnimations?: boolean;
}

export interface BentoProps {
	textAutoHide?: boolean;
	enableSpotlight?: boolean;
	enableBorderGlow?: boolean;
	disableAnimations?: boolean;
	spotlightRadius?: number;
	enableTilt?: boolean;
	glowColor?: string;
	clickEffect?: boolean;
	enableMagnetism?: boolean;
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '24, 172, 106';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
	{
		image: '/images/functional-medicine.png',
		title: 'Functional Medicine',
		description: 'A holistic land-management practice that uses the power of photosynthesis in a plants to sequester carbon in the soil while improving soil health, crop yields, water resilience, and nutrient density.'
	},
	{
		image: '/images/infrared-sauna.png',
		title: 'Infrared Sauna',
		description: 'A relaxation technique that involves floating in a sensory deprivation tank filled with warm water and Epsom salt.'
	},
	{
		image: '/images/herbal-medicine.png',
		title: 'Herbal Medicine',
		description: 'The journey of nurturing and guiding children with love, support, and structure to foster their emotional, social, and cognitive development.'
	},
	{
		image: '/images/UCC.png',
		title: 'Upper Cervical Chiropractic',
		description: 'A specialized branch of chiropractic care that focuses on the alignment of the top two vertebrae in the spine: the atlas (C1) and axis (C2). These vertebrae play a crucial role in protecting the brainstem, which controls many vital functions in the body. Upper Cervical care emphasizes gentle, precise adjustments that aim to restore proper alignment without the need for forceful manipulation.'
	},
	{
		image: '/images/cold-plunge.png',
		title: 'Cold Plunge Therapy',
		description: 'A practice that unites breath, movement, and mindfulness to improve flexibility, strength, and inner peace, promoting overall well-being.'
	},
	{
		image: '/images/qi-gong.png',
		title: 'Qi Gong',
		description: 'The compassionate responsibility of ensuring the health, safety, and well-being of animals through proper nutrition, shelter, and medical attention.'
	}
];

const calculateSpotlightValues = (radius: number) => ({
	proximity: radius * 0.5,
	fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
	const rect = card.getBoundingClientRect();
	const relativeX = ((mouseX - rect.left) / rect.width) * 100;
	const relativeY = ((mouseY - rect.top) / rect.height) * 100;

	card.style.setProperty('--glow-x', `${relativeX}%`);
	card.style.setProperty('--glow-y', `${relativeY}%`);
	card.style.setProperty('--glow-intensity', glow.toString());
	card.style.setProperty('--glow-radius', `${radius}px`);
};

const GlobalSpotlight: React.FC<{
	gridRef: React.RefObject<HTMLDivElement | null>;
	disableAnimations?: boolean;
	enabled?: boolean;
	spotlightRadius?: number;
	glowColor?: string;
}> = ({
	gridRef,
	disableAnimations = false,
	enabled = true,
	spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
	glowColor = DEFAULT_GLOW_COLOR
}) => {
		const spotlightRef = useRef<HTMLDivElement | null>(null);
		const isInsideSection = useRef(false);

		useEffect(() => {
			if (disableAnimations || !gridRef?.current || !enabled) return;

			const spotlight = document.createElement('div');
			spotlight.className = 'global-spotlight';
			spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
			document.body.appendChild(spotlight);
			spotlightRef.current = spotlight;

			const handleMouseMove = (e: MouseEvent) => {
				if (!spotlightRef.current || !gridRef.current) return;

				const section = gridRef.current.closest('.bento-section');
				const rect = section?.getBoundingClientRect();
				const mouseInside =
					rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

				isInsideSection.current = mouseInside || false;
				const cards = gridRef.current.querySelectorAll('.card');

				if (!mouseInside) {
					gsap.to(spotlightRef.current, {
						opacity: 0,
						duration: 0.3,
						ease: 'power2.out'
					});
					cards.forEach(card => {
						(card as HTMLElement).style.setProperty('--glow-intensity', '0');
					});
					return;
				}

				const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
				let minDistance = Infinity;

				cards.forEach(card => {
					const cardElement = card as HTMLElement;
					const cardRect = cardElement.getBoundingClientRect();
					const centerX = cardRect.left + cardRect.width / 2;
					const centerY = cardRect.top + cardRect.height / 2;
					const distance =
						Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
					const effectiveDistance = Math.max(0, distance);

					minDistance = Math.min(minDistance, effectiveDistance);

					let glowIntensity = 0;
					if (effectiveDistance <= proximity) {
						glowIntensity = 1;
					} else if (effectiveDistance <= fadeDistance) {
						glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
					}

					updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
				});

				gsap.to(spotlightRef.current, {
					left: e.clientX,
					top: e.clientY,
					duration: 0.1,
					ease: 'power2.out'
				});

				const targetOpacity =
					minDistance <= proximity
						? 0.8
						: minDistance <= fadeDistance
							? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
							: 0;

				gsap.to(spotlightRef.current, {
					opacity: targetOpacity,
					duration: targetOpacity > 0 ? 0.2 : 0.5,
					ease: 'power2.out'
				});
			};

			const handleMouseLeave = () => {
				isInsideSection.current = false;
				gridRef.current?.querySelectorAll('.card').forEach(card => {
					(card as HTMLElement).style.setProperty('--glow-intensity', '0');
				});
				if (spotlightRef.current) {
					gsap.to(spotlightRef.current, {
						opacity: 0,
						duration: 0.3,
						ease: 'power2.out'
					});
				}
			};

			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseleave', handleMouseLeave);
				spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
			};
		}, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

		return null;
	};

const BentoCardGrid: React.FC<{
	children: React.ReactNode;
	gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
	<div className="card-grid bento-section" ref={gridRef}>
		{children}
	</div>
);

const useMobileDetection = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return isMobile;
};

const BentoCard: React.FC<BentoProps> = ({
	textAutoHide = true,
	enableSpotlight = true,
	enableBorderGlow = true,
	disableAnimations = false,
	spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
	enableTilt = false,
	glowColor = DEFAULT_GLOW_COLOR,
	clickEffect = true,
	enableMagnetism = false
}) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const isMobile = useMobileDetection();
	const shouldDisableAnimations = disableAnimations || isMobile;

	return (
		<>
			{enableSpotlight && (
				<GlobalSpotlight
					gridRef={gridRef}
					disableAnimations={shouldDisableAnimations}
					enabled={enableSpotlight}
					spotlightRadius={spotlightRadius}
					glowColor={glowColor}
				/>
			)}

			<BentoCardGrid gridRef={gridRef}>
				{cardData.map((card, index) => {
					const baseClassName = `card ${textAutoHide ? 'card--text-autohide' : ''} ${enableBorderGlow ? 'card--border-glow' : ''}`;
					const cardProps = {
						className: baseClassName,
						style: {
							['--bg' as string]: `url(${card.image})`,
							'--glow-color': glowColor
						} as React.CSSProperties
					};

					return (
						<div
							key={index}
							{...cardProps}
							ref={el => {
								if (!el) return;

								const handleMouseMove = (e: MouseEvent) => {
									if (shouldDisableAnimations) return;

									const rect = el.getBoundingClientRect();
									const x = e.clientX - rect.left;
									const y = e.clientY - rect.top;
									const centerX = rect.width / 2;
									const centerY = rect.height / 2;

									if (enableTilt) {
										const rotateX = ((y - centerY) / centerY) * -10;
										const rotateY = ((x - centerX) / centerX) * 10;
										gsap.to(el, {
											rotateX,
											rotateY,
											duration: 0.1,
											ease: 'power2.out',
											transformPerspective: 1000
										});
									}

									if (enableMagnetism) {
										const magnetX = (x - centerX) * 0.05;
										const magnetY = (y - centerY) * 0.05;
										gsap.to(el, {
											x: magnetX,
											y: magnetY,
											duration: 0.3,
											ease: 'power2.out'
										});
									}
								};

								const handleMouseLeave = () => {
									if (shouldDisableAnimations) return;

									if (enableTilt) {
										gsap.to(el, {
											rotateX: 0,
											rotateY: 0,
											duration: 0.3,
											ease: 'power2.out'
										});
									}

									if (enableMagnetism) {
										gsap.to(el, {
											x: 0,
											y: 0,
											duration: 0.3,
											ease: 'power2.out'
										});
									}
								};

								const handleClick = (e: MouseEvent) => {
									if (!clickEffect || shouldDisableAnimations) return;

									const rect = el.getBoundingClientRect();
									const x = e.clientX - rect.left;
									const y = e.clientY - rect.top;

									// Calculate the maximum distance from click point to any corner
									const maxDistance = Math.max(
										Math.hypot(x, y),
										Math.hypot(x - rect.width, y),
										Math.hypot(x, y - rect.height),
										Math.hypot(x - rect.width, y - rect.height)
									);

									const ripple = document.createElement('div');
									ripple.style.cssText = `
                    position: absolute;
                    width: ${maxDistance * 2}px;
                    height: ${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                    left: ${x - maxDistance}px;
                    top: ${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  `;

									el.appendChild(ripple);

									gsap.fromTo(
										ripple,
										{
											scale: 0,
											opacity: 1
										},
										{
											scale: 1,
											opacity: 0,
											duration: 0.8,
											ease: 'power2.out',
											onComplete: () => ripple.remove()
										}
									);
								};

								el.addEventListener('mousemove', handleMouseMove);
								el.addEventListener('mouseleave', handleMouseLeave);
								el.addEventListener('click', handleClick);
							}}
						>
							<div className="card__header">
								<div className="card__label">
									<Image src="/icons/eye.svg" alt="Eye icon" width={35} height={35} />
								</div>
							</div>
							<div className="card__content">
								<h2 className="card__title">{card.title}</h2>
								<p className="card__description">{card.description}</p>
							</div>
						</div>
					);
				})}
			</BentoCardGrid>
		</>
	);
};

export default BentoCard;
