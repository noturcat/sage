import style from './P.module.scss'

type ParagraphProps = {
  as?: 'p' | 'span' | 'div'
  size?: number
  children: React.ReactNode
  extraClass?: string
}

const P = ({ children, as = 'p', size = 16, extraClass }: ParagraphProps) => {
  const ParagraphTag = as as React.ElementType;

  return (
    <ParagraphTag style={size ? { fontSize: `${size}px` } : {}} className={`${style.p} ${extraClass ?? ''}`}>
      {children}
    </ParagraphTag>
  )
}

export default P
