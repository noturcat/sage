'use client'

//react
import React from 'react'
import Home from './home/Home'
// styles
import style from './Community.module.scss'

type CommunityHomeProps = {
	children?: React.ReactNode
}

const CommunityHome = ({ children }: CommunityHomeProps = {}) => {
	const defaultPagesContent = <Home />

	return (
		<div>
			<div className={style.wrapper}>{children ?? defaultPagesContent}</div>
		</div>
	)
}

export default CommunityHome
