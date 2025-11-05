import Container from "@/components/util/container/Container"
import ChangeEmailForm from "@/components/molecules/forms/change-email-form/ChangeEmailForm"
import style from "./ChangeEmailPage.module.scss"

const ChangeEmailPage = () => {
	return (
		<div>
			<Container>
				<div className={style.wrapper}>
					<ChangeEmailForm />
				</div>
			</Container>
		</div>
	)
}

export default ChangeEmailPage
