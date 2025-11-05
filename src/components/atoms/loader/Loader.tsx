'use client'

import style from './Loader.module.scss'

const Loader = () => {
  return (
    <div>
      <div className={style.loader}>
        <div className={style.spinner}></div>
      </div>
    </div>
  )
}

export default Loader
