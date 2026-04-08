import { FC } from 'react';
import { useEditorStore } from '@/entities/editor';
import { WorkbenchGrid } from './WorkbenchGrid';
import { WorkbenchEmpty } from './WorkbenchEmpty';
import './Workbench.css'
import 'dockview-react/dist/styles/dockview.css';

export const Workbench: FC = () => {
  const hasTabs = useEditorStore((s) => s.tabs.length > 0);

  return (
    <div className="workbench-container pr-1 flex-1 overflow-hidden flex flex-col h-full">
      {!hasTabs ? <WorkbenchEmpty /> : <WorkbenchGrid />}
    </div>
  );
};