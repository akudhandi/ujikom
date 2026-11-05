import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon = "chart-column", title, description, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__inner">
        <span aria-hidden="true" className="empty__icon">
          <Icon className="icon--lg" name={icon} />
        </span>
        <h3>{title}</h3>
        <p className="t-small">{description}</p>
        {action}
      </div>
    </div>
  );
}
