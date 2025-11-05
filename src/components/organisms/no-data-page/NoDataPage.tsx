import ButtonIcon from '@/components/atoms/button/ButtonIcon'
import style from './NoDataPage.module.scss'

const NoDataPage = ({ title, icon }: { title: string; icon: string }) => {
  return (
    <div className={style.noDataPage}>
      <div className={style.noDataPageContent}>
        <div className={style.noDataPageContentIcon}>
          <ButtonIcon
            key={title}
            icon={icon}
            size={32}
            variant="text"
            styleType="icon"
            iconPos="append"
            tintColor="var(--jh-gray-01)"
            extraClass={style.noDataPageContentIconButton}
          />
        </div>
        <div className={style.noDataPageContentDescription}>
          <p>There is no {title} available on the site. Be the first to create it today!</p>
        </div>
      </div>
    </div>
  )
}

export default NoDataPage
