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
          className: 'bg-status-active text-white',
          icon: Play
        };
      case 'PAUSE':
        return {
          label: 'Paused',
          className: 'bg-status-pause text-white',
          icon: Pause
        };
      case 'DELETE':
        return {
          label: 'Delete',
          className: 'bg-status-delete text-white',
          icon: Trash2
        };
      case 'CONTROL':
        return {
          label: 'Control',
          className: 'bg-status-control text-white',
          icon: Settings
        };
      default:
        return {
          label: status,
          className: 'bg-muted text-muted-foreground',
          icon: Settings
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;