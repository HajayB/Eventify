import styles from "./cards.module.css";

type MiniCardProps = {
  title: string;
  value?: string | number;
  subtitle?: string|number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

function MiniCard({ title, value, subtitle, icon, children }: MiniCardProps) {
  return (

    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      {value && <h2 className={styles.value}>{value}</h2>}

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}

export default MiniCard;