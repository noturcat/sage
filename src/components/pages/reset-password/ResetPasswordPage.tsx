import Container from "@/components/util/container/Container"
import ResetPasswordForm from "@/components/molecules/forms/reset-password-form/ResetPasswordForm"
import style from "./ResetPasswordPage.module.scss"

const ResetPasswordPage = () => {
  return (
    <div>
      <Container>
        <div className={style.wrapper}>
          <ResetPasswordForm />
        </div>
      </Container>
    </div>
  )
}

export default ResetPasswordPage