import { ImageLoader } from '@/util/imageLoader'
import Image from 'next/image'
import style from './ButtonAnimated.module.scss'

type ButtonAnimatedProps = {
  label: string
  icon: string
  hoverIcon: string
  variant?: 'flat' | 'outlined'
  onClick?: () => void
  alt?: string
  extraClass?: string
  loading?: boolean
}

const ButtonAnimated = ({
  icon,
  hoverIcon,
  variant = 'flat',
  onClick,
  alt,
  label,
  extraClass,
  loading = false
}: ButtonAnimatedProps) => {
  const classes = `
    ${style.buttonAnimated}
    ${style.baseStyle}
    ${variant === 'flat' ? style.flat : ''}
    ${variant === 'outlined' ? style.outlined : ''}
    ${loading ? style.loading : ''}
    ${extraClass ?? ''}
  `

  return (
    <button
      type="button"
      className={classes}
      onClick={loading ? undefined : onClick}
      disabled={loading}
    >
      <label className={style.label}>{label}</label>

      {!loading && icon && (
        <Image
          loader={ImageLoader}
          src={icon}
          width={24}
          height={24}
          alt={alt ?? 'Icon'}
          className={style.iconDefault}
        />
      )}

      {!loading && hoverIcon && (
        <Image
          loader={ImageLoader}
          src={hoverIcon}
          width={24}
          height={24}
          alt={alt ?? 'Icon'}
          className={style.iconHover}
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

      <span className={style.hoverEffect}></span>
    </button>
  )
}

export default ButtonAnimated
