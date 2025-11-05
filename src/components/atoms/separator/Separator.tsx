import style from './Separator.module.scss'

type SeparatorProps = {
	orientation?: 'horizontal' | 'vertical'
	extraClass?: string
}

const Separator = ({ orientation = 'horizontal', extraClass }: SeparatorProps) => {
	const className = `${style.separator} ${style[orientation]} ${extraClass ?? ''}`.trim()

	return <div className={className} />
}

export default Separator
