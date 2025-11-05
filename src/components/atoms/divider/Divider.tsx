import style from './Divider.module.scss'

type DividerProps = {
  extraClass?: string
}

const Divider = ({ extraClass }: DividerProps) => {
  return <hr className={`${style.divider} ${extraClass ?? ''}`} />
}

export default Divider