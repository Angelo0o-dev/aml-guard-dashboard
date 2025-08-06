import { Badge } from "@/components/ui/badge";
import { Play, Pause, Trash2, Settings } from "lucide-react";

interface StatusBadgeProps {
  status: 'ACTIVE' | 'PAUSE' | 'DELETE' | 'CONTROL';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active',
          className: 'bg-gradient-to-r from-status-active to-success-glow text-white border-0',
          icon: Play
        };
      case 'PAUSE':
        return {
          label: 'Paused',
          className: 'bg-gradient-to-r from-status-pause to-warning-glow text-white border-0',
          icon: Pause
        };
      case 'DELETE':
        return {
          label: 'Deleted',
          className: 'bg-gradient-to-r from-status-delete to-destructive-glow text-white border-0',
          icon: Trash2
        };
      case 'CONTROL':
        return {
          label: 'Control',
          className: 'bg-gradient-to-r from-status-control to-primary-glow text-white border-0',
          icon: Settings
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground',
          icon: Settings
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} px-3 py-1 text-xs font-medium flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all duration-300`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;