import styles from "./index.module.css";

type Props = {
  x: number;
  y: number;
  timestamp: number;
  value: string;
};

export function FlyingReaction({ x, y, timestamp, value }: Props) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${styles.disappear} text-${(timestamp % 5) + 2}xl ${styles["goUp" + (timestamp % 3)]}`}
      style={{ left: x, top: y }}
    >
      <div className={styles["leftRight" + (timestamp % 3)]}>
        <div className="-translate-x-1/2 -translate-y-1/2 transform">
          {value}
        </div>
      </div>
    </div>
  );
}
