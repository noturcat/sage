import { ImageLoader } from '@/util/imageLoader'
import Image from 'next/image'
import Link from 'next/link'
import style from './ButtonIcon.module.scss'

type ButtonIconProps = {
  icon: string
  iconPos?: 'append' | 'prepend'
  onClick?: () => void
  href?: string
  target?: string
  query?: Record<string, never>
  size?: number
  alt?: string
  label?: string
  variant: 'primary' | 'secondary' | 'circular' | 'social' | 'text'
  styleType: 'solid' | 'outlined' | 'icon' | 'icon-alt'
  disabled?: boolean
  extraClass?: string
  type?: 'button' | 'submit' | 'reset'
  rawLink?: boolean
  hideLabel?: boolean
  loading?: boolean
  tintColor?: string
}

const ButtonIcon = ({
  icon,
  iconPos = 'prepend',
  onClick,
  size = 18,
  alt,
  href,
  target,
  query,
  label,
  variant = 'primary',
  styleType = 'solid',
  disabled,
  extraClass,
  type = 'button',
  rawLink = false,
  hideLabel = false,
  loading = false,
  tintColor,
}: ButtonIconProps) => {
  const asProp = href?.includes('#') ? `${href}` : undefined
  const classes = `
    ${style.buttonIcon}
    ${variant && style[variant]}
    ${styleType && style[styleType]}
    ${style[`icon-${iconPos}`]}
    ${disabled ? style.disabled : ''}
    ${loading ? style.loading : ''}
    ${extraClass ?? ''}
  `

  const content = (
    <>
      {label && variant !== 'circular' && (
        <span className={style.label} data-hide-label={hideLabel ?? false}>
          {label}
        </span>
      )}
      {!loading && icon && !tintColor && (
        <Image loader={ImageLoader} src={icon} width={size} height={size} alt={alt ?? 'Icon'} />
      )}
      {!loading && icon && tintColor && (
        <span
          className={style.maskIcon}
          style={{
            WebkitMaskImage: `url(${icon})`,
            maskImage: `url(${icon})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            backgroundColor: tintColor,
            width: size,
            height: size,
          }}
          aria-hidden
        />
      )}
      {loading && (
        <Image
          src="/icons/loader.svg"
          alt="loading"
          width={24}
          height={24}
          className={style.spinner}
        />
      )}
    </>
  )

  if (!href) {
    return (
      <button
        type={type}
        className={classes}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {content}
      </button>
    )
  }

  if (rawLink) {
    return (
      <a href={href} target={target} className={classes} onClick={disabled ? undefined : onClick}>
        {content}
      </a>
    )
  }

  return (
    <Link
      href={{ pathname: href, query }}
      as={asProp}
      className={classes}
      onClick={disabled ? undefined : onClick}
      {...(target && { target })}
    >
      {content}
    </Link>
  )
}

export default ButtonIcon
