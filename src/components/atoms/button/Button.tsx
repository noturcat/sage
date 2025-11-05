'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './Button.module.scss'

type ButtonProps = {
  label: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'secondary-alt'
  styleType?: 'solid' | 'outlined'
  query?: Record<string, never>
  rawLink?: boolean
  target?: '_self' | '_blank'
  extraClass?: string
}

const Button = ({
  label,
  onClick = () => { },
  href,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  query,
  rawLink = false,
  styleType = 'solid',
  target,
  extraClass
}: ButtonProps) => {
  const classes = `
    ${style.button}
    ${loading ? style.loading : ''}
    ${disabled ? style.disabled : ''}
    ${variant ? style[variant] : ''}
    ${styleType ? style[styleType] : ''}
    ${extraClass ?? ''}
  `

  const content = (
    <>
      <span className={style.label}>{label}</span>
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

  if (rawLink) {
    return (
      <a className={classes} href={href} target={target}>
        {content}
      </a>
    )
  } else if (href) {
    const asProp = href.includes('#') ? href : undefined
    return (
      <Link
        className={classes}
        href={{ pathname: href, query }}
        as={asProp}
        target={target}
      >
        {content}
      </Link>
    )
  } else {
    return (
      <button className={classes} type={type} onClick={onClick} disabled={disabled}>
        {content}
      </button>
    )
  }
}

export default Button
