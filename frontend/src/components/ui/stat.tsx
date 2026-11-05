import { Icon, type IconName } from "@/components/ui/icon";

type StatProps = {
  icon: IconName;
  label: string;
  value: string;
  note: string;
};

export function Stat({ icon, label, value, note }: StatProps) {
  return (
    <article className="card stat">
      <div className="stat__top">
        <span className="stat__label">{label}</span>
        <span aria-hidden="true" className="stat__icon">
          <Icon name={icon} />
        </span>
      </div>
      <div>
        <p className="t-stat">{value}</p>
        <p className="stat__note mt">{note}</p>
      </div>
    </article>
  );
}
