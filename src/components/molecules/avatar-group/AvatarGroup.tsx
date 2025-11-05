import Avatar from '@/components/atoms/avatar/Avatar';
import Badge from '@/components/atoms/badge/Badge';
import style from './AvatarGroup.module.scss';

type AvatarGroupProps = {
  avatars: { src: string; alt?: string }[]
  maxDisplay?: number
  size?: number
  count: number
};

const AvatarGroup = ({
  avatars,
  maxDisplay = 4,
  size = 40,
  count = 0
}: AvatarGroupProps) => {
  const displayAvatars = avatars.slice(0, maxDisplay);
  const hiddenCount = count > 0 ? `${count}+` : 0;

  return (
    <div className={style.avatarGroup}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          zIndex={avatars.length - index}
          extraClass={style.avatar}
        />
      ))}

      {hiddenCount && (
        <Badge count={hiddenCount} size={size} extraClass={style.badge} />
      )}
    </div>
  );
}

export default AvatarGroup
