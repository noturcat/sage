import Avatar from '@/components/atoms/avatar/Avatar'
import ButtonPill from '@/components/atoms/button/ButtonPill'
import { generateContacts } from '@/mocks/dummyData'

import style from './Contacts.module.scss'
type ContactsProps = {
	contacts?: {
		avatar?: string
		name?: string
	}[]
}
const Contacts = ({ contacts = generateContacts(3) }: ContactsProps) => {
	return (
		<div className={style.contacts}>
			<div className={style.contactsHeader}>
				<h1>Contacts</h1>
			</div>
			<div className={style.contactsList}>
				{contacts.map((contact, index) => (
					<div className={style.contactsItem} key={`${contact.name}-${index}`}>
						<div className={style.contactsItemAvatar}>
							<Avatar src={contact.avatar ?? '/images/1.jpg'} size={40} />
						</div>
						<div className={style.contactsItemInfo}>
							<h3>{contact.name ?? 'John Doe'}</h3>
						</div>
						<div className={style.contactsItemActions}>
							<ButtonPill label="Message" variant="outlined" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Contacts
