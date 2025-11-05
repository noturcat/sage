import style from './FloatingButton.module.scss'

function FloatingButton({
	children,
	className = '',
	...props
}: React.HtmlHTMLAttributes<HTMLButtonElement>) {
	return (
		<button className={`${style.floatingButton} ${className}`} {...props}>
			{children}
		</button>
	)
}

export default FloatingButton
