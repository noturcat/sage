'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'
import Heading from '@/components/atoms/typography/heading/Heading'
import P from '@/components/atoms/typography/paragraph/P'
import Button from '@/components/atoms/button/Button'
import style from './WelcomePanel.module.scss'

const WelcomePanel = () => {
	const { push } = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [showCheck, setShowCheck] = useState<boolean>(false)
  const [checkAnimated, setCheckAnimated] = useState<boolean>(false)
  const [revealContent, setRevealContent] = useState<boolean>(false)

	const goToHomepage = async () => {
    setLoading(true)

    try {
			deleteCookie('userId')
			deleteCookie('username')
			deleteCookie('userEmail')
			deleteCookie('password')
			push('/')
    } catch (error) {
      console.error("Error :", error)
    }

    setLoading(false)
  }

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowCheck(true)
      setCheckAnimated(true)
    }, 800)

    const timer2 = setTimeout(() => {
      setRevealContent(true)
    }, 1400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className={style.welcomePanel}>
			<div className={style.panelGroup}>
        <div className={`${style.icon} ${style.animateIcon}`}>
          <span
            className={
              showCheck
                ? `${style.check} ${checkAnimated ? style.animateCheck : ''}`
                : style.loader
            }
          ></span>
        </div>

        <div className={`${style.formContent} ${revealContent ? style.reveal : ''}`}>
          <Heading as="h4" fontWeight="bold">Welcome to Just Holistics!</Heading>
					<P as="p" extraClass={style.welcomePanel}>Successfully Created a Personal Account.</P>

          <div className={style.actions}>
            <Button
              type="button"
              variant="primary"
              styleType="outlined"
              label="Done"
              loading={loading}
							onClick={goToHomepage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePanel
