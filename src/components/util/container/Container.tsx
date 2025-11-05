import style from './Container.module.scss'

type ContainerProps = {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'mediumLarge' | 'large'
}

const Container = ({ children, size = 'large' }: ContainerProps) => {
  return (
    <div className={`${style.container} ${style[size]}`}>{children}</div>
  )
}

export default Container
