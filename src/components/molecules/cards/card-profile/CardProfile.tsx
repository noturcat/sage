// import Link from 'next/link'
import ButtonAnimated from '@/components/atoms/button/ButtonAnimated'
import Heading from '@/components/atoms/typography/heading/Heading'
import Divider from '@/components/atoms/divider/Divider'
import P from '@/components/atoms/typography/paragraph/P'
import AvatarGroup from '@/components/molecules/avatar-group/AvatarGroup'
import style from './CardProfile.module.scss'

type CardProfileProps = {
  type: 'personal' | 'business provider'
  avatars?: { src: string; alt?: string }[]
  subheading: string
  onClick?: () => void
}

const CardProfile = ({ type, subheading, avatars, onClick }: CardProfileProps) => {
  return (
    <div className={`${style.cardContainer} group`} onClick={onClick}>
      <div className={style.cardHeading}>
        <Heading as={'h5'} fontWeight={'semibold'}>{type}</Heading>
        <Divider />
        <P as={'span'} size={14} extraClass={'subtitle'}>
          {subheading}
          {type === 'business provider' && (
            <i>*Requires approval by site admin.*</i>
          )}
        </P>
      </div>

      <div className={style.cardAction}>
        {avatars && avatars.length > 0 && (
          <AvatarGroup
            avatars={avatars}
            maxDisplay={3}
            size={35}
            count={100}
          />
        )}

        <ButtonAnimated
          variant={'flat'}
          icon={'/icons/white-arrow-right.svg'}
          hoverIcon={'/icons/green-arrow-right.svg'}
          label={'Join Now'}
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

export default CardProfile
