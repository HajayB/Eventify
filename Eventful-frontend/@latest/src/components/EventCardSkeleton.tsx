import Skeleton from "./Skeleton";

function EventCardSkeleton() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      borderRadius: "12px",
      overflow: "hidden",
      height: "360px",
      display: "flex",
      flexDirection: "column",
    }}>
      <Skeleton height="220px" borderRadius="0" />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Skeleton height="20px" width="65%" />
        <Skeleton height="13px" width="90%" />
        <Skeleton height="13px" width="78%" />
        <Skeleton height="13px" width="55%" />
      </div>
    </div>
  );
}

export default EventCardSkeleton;
