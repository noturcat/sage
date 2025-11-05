import style from './Badge.module.scss';

type BadgeProps = {
  count: string
  fontSize?: number
  size?: number
  extraClass?: string
};

const Badge = ({
  count,
  fontSize = 6,
  size = 35,
  extraClass
}: BadgeProps) => {
  return (
    <div
      className={`${style.badge} ${extraClass ?? ''}`}
      style={{
        width: size,
        height: size,
        fontSize: fontSize,
      }}
    >
      {count}
    </div>
  );
}

export default Badge
