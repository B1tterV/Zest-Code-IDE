import { FC } from 'react';
import { WorkbenchGrid } from './WorkbenchGrid';
import { WorkbenchEmpty } from './WorkbenchEmpty';
import './Workbench.css';

interface WorkbenchProps {
  className?: string;
  isEmpty?: boolean;
}

export const Workbench: FC<WorkbenchProps> = ({ className = '', isEmpty = false }) => {
  return (
    <div className={`workbench-container flex-1 overflow-hidden flex flex-col ${className}`}>
      {isEmpty ? <WorkbenchEmpty /> : <WorkbenchGrid />}
    </div>
  );
};

export default Workbench;