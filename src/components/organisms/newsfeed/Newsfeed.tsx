import CardNewsfeed from '@/components/molecules/cards/card-newsfeed/CardNewsfeed'
import style from './Newsfeed.module.scss'

function Newsfeed() {
	const newsfeedItems = [
		{
			id: '1',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '12 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '2',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '12 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '3',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '10 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '4',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '12 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '5',
			variant: 'shared',
			name: 'John Doe',
			sharedBy: 'John Doe',
			groupName: 'Regenerative Farming Collective',
			timeElapsed: '6 hours ago',
			imageUrl: '/images/newsfeed-image.jpg',
			membersCount: '12,431 MEMBERS',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '6',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '4 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
		{
			id: '7',
			variant: 'post',
			name: 'John Doe',
			timeElapsed: '2 hours ago',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		},
	]

	return (
		<div className={style.newfeed}>
			{newsfeedItems.map(item => (
				<CardNewsfeed
					key={item.id}
					{...item}
					variant={item.variant as 'post' | 'shared' | 'reposted'}
				/>
			))}
		</div>
	)
}

export default Newsfeed
