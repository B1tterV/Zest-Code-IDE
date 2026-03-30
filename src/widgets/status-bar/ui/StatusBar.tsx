import { type FC } from 'react';
import { STATUS_BAR_HEIGHT, DEFAULT_STATUS_INFO } from '../config/status';
import { type StatusBarInfo } from '../model/types';
import './StatusBar.css';

interface StatusBarProps {
  className?: string;
  info?: StatusBarInfo;
}

export const StatusBar: FC<StatusBarProps> = ({
  className = '',
  info = DEFAULT_STATUS_INFO,
}) => {
  return (
    <footer
      className={`status-bar ${className}`}
      style={{ height: STATUS_BAR_HEIGHT }}
    >
      <div className="status-bar-left">
        {info.branch !== undefined && (
          <span className="status-item" title="Git Branch">
            {info.branch}
          </span>
        )}
        <span className="status-item" title="Errors">
          {info.errors} errors
        </span>
        <span className="status-item" title="Warnings">
          {info.warnings} warnings
        </span>
      </div>
      <div className="status-bar-right">
        <span className="status-item" title="Cursor Position">
          Ln {info.lineNumber}, Col {info.columnNumber}
        </span>
        <span className="status-item" title="File Encoding">
          {info.encoding}
        </span>
        {info.language !== undefined && (
          <span className="status-item" title="Language Mode">
            {info.language}
          </span>
        )}
      </div>
    </footer>
  );
};

export default StatusBar;