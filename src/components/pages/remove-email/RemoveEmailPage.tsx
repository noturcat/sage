import Container from "@/components/util/container/Container"
import RemoveEmailForm from "@/components/molecules/forms/remove-email-form/RemoveEmailForm"
import style from "./RemoveEmailPage.module.scss"

const RemoveEmailPage = () => {
  return (
    <div>
      <Container>
        <div className={style.wrapper}>
          <RemoveEmailForm />
        </div>
      </Container>
    </div>
  )
}

export default RemoveEmailPage