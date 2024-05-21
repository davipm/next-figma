import styles from "./index.module.css";

type Props = {
  x: number;
  y: number;
  timestamp: number;
  value: string;
};

export function FlyingReaction({ x, y, timestamp, value }: Props) {
  return (
    <div className={`pointer-events-none absolute select-none`}>
      <div>
        <div>FlyingReaction</div>
      </div>
    </div>
  );
}
