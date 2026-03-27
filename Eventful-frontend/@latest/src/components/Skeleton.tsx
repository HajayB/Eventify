import styles from "./Skeleton.module.css";

type Props = {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: "dark" | "light";
  style?: React.CSSProperties;
};

function Skeleton({
  width = "100%",
  height = "16px",
  borderRadius = "6px",
  variant = "dark",
  style,
}: Props) {
  return (
    <div
      className={variant === "light" ? styles.skeletonLight : styles.skeleton}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export default Skeleton;
