import { useRouter } from "next/navigation"
import Heading from "@/components/atoms/typography/heading/Heading"
import P from "@/components/atoms/typography/paragraph/P"
import A from "@/components/atoms/link/A"
import CardProfile from "@/components/molecules/cards/card-profile/CardProfile"
import ButtonIcon from "@/components/atoms/button/ButtonIcon"
import style from './SelectAccountType.module.scss'

type SelectAccountTypeProps = {
  onSelectAccount: (accountType: 'personal' | 'business') => void
  onLogin: () => void
}

const SelectAccountType = ({ onSelectAccount, onLogin }: SelectAccountTypeProps) => {
	const { push } = useRouter()

  const personalAvatars = [
    { src: '/images/1.jpg' },
    { src: '/images/2.jpg' },
    { src: '/images/3.jpg' },
  ]

  const businessProviderAvatars = [
    { src: '/images/4.jpg' },
    { src: '/images/5.jpg' },
    { src: '/images/6.jpg' },
  ]

	const handleRoute = () => {
		push('/')
	}

  return (
    <div className={style.container}>
      <div className={style.heading}>
				<div className={style.headingTitle}>
					<ButtonIcon
						variant={'text'}
						styleType={'icon'}
						icon={'/icons/back.svg'}
						size={38}
						onClick={handleRoute}
					/>
					<Heading as={'h4'} fontWeight={'semibold'}>Select Profile Type</Heading>
				</div>
        <P as={'span'} size={14} extraClass={'subtitle'}>Select the type of account you would like to sign up for.</P>
      </div>

      <div className={style.options}>
        <CardProfile
          type={'personal'}
          subheading={'For regular users to explore and use the platform for personal needs.'}
          avatars={personalAvatars}
          onClick={() => onSelectAccount('personal')}
        />

        <CardProfile
          type={'business provider'}
          subheading={'For businesses to offer services.'}
          avatars={businessProviderAvatars}
					onClick={() => onSelectAccount('personal')}
        />
      </div>

      <div className={style.login}>
        Already have an account? <A onClick={onLogin}>Sign In</A>
      </div>
    </div>
  )
}

export default SelectAccountType
