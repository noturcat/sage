import Link from 'next/link'
import style from './A.module.scss'

type AProps = {
  href?: string
  variant?: null | 'underline' | 'underline-blue'
  color?: 'blue' | 'white'
  children: React.ReactNode
  onClick?: () => void
}

const A = ({ href, variant = null, children, color, onClick }: AProps) => {
  const classes = `${style.a} ${variant && style[variant]} ${color && style[color]}`

  return (
    <>
      {href && (
        <Link className={classes} href={href}>
          {children}
        </Link>
      )}
      {!href && (
        <a className={classes} onClick={onClick}>
          {children}
        </a>
      )}
    </>
  )
}

export default A
