'use client'

//react
import React from 'react'
import Home from './home/Home'
import Container from '@/components/util/container/Container'
// styles
import style from './HomePage.module.scss'

type HomePageProps = {
	children?: React.ReactNode
}

const HomePage = ({ children }: HomePageProps = {}) => {
	const defaultPagesContent = <Home />

	return (
		<div className={style.wrapper}>
			<Container>
				<div className={style.content}>{children ?? defaultPagesContent}</div>
			</Container>
		</div>
	)
}

export default HomePage
