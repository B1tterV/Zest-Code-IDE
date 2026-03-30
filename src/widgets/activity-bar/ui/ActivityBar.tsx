import { type FC, type SVGProps } from 'react';
import {
  PRIMARY_ACTIVITIES,
  SECONDARY_ACTIVITIES,
  ACTIVITY_BAR_WIDTH,
} from '../config/activities';
import { type ActivityItemConfig } from '../model/types';
import './ActivityBar.css';

interface ActivityItemProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  tooltip: string;
  active?: boolean;
  onClick?: () => void;
}

const ActivityItem: FC<ActivityItemProps> = ({
  icon: Icon,
  tooltip,
  active = false,
  onClick,
}) => {
  return (
    <button
      className={`activity-item ${active ? 'activity-item-active' : ''}`}
      title={tooltip}
      onClick={onClick}
      type="button"
      aria-label={tooltip}
    >
      <Icon className="activity-icon" />
    </button>
  );
};

interface ActivityBarProps {
  className?: string;
  activeItemId?: string;
  onActivityClick?: (id: string) => void;
}

export const ActivityBar: FC<ActivityBarProps> = ({
  className = '',
  activeItemId = 'explorer',
  onActivityClick,
}) => {
  const handleActivityClick = (id: string) => {
    if (onActivityClick !== undefined) {
      onActivityClick(id);
    }
  };

  return (
    <aside className={`activity-bar ${className}`} style={{ width: ACTIVITY_BAR_WIDTH }}>
      <nav className="activity-items" aria-label="Primary navigation">
        {PRIMARY_ACTIVITIES.map((item: ActivityItemConfig) => (
          <ActivityItem
            key={item.id}
            icon={item.icon}
            tooltip={item.tooltip}
            active={item.id === activeItemId}
            onClick={() => handleActivityClick(item.id)}
          />
        ))}
      </nav>
      <nav className="activity-items activity-items-bottom" aria-label="Secondary navigation">
        {SECONDARY_ACTIVITIES.map((item: ActivityItemConfig) => (
          <ActivityItem
            key={item.id}
            icon={item.icon}
            tooltip={item.tooltip}
            onClick={() => handleActivityClick(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default ActivityBar;