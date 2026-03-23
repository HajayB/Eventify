import styles from "./activityCard.module.css";
type ActivityCardProps = {
  eventTitle?: string;
  icon?: React.ReactNode;
  date?:string, 
  amount?:number,
  summary?:string,
  children?: React.ReactNode;
};

function ActivityCard({eventTitle, icon, date, amount, summary, children }: ActivityCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {summary && <h3 className={styles.summary}>{summary}</h3>}
        {amount && (
          <span className={styles.amount}>
            ₦{amount.toLocaleString()}
          </span>
        )}
        <span className={styles.title}>{eventTitle}</span>
      </div>

      <div className={styles.activityList}>
        {date && <h2 className={styles.date}>{date}</h2>}
        {children}
      </div>
    </div>
  );
}

export default ActivityCard;