'use client';

import {
  ShieldCheck, ShieldOff, UserX, UserCheck, Trash2,
  RefreshCw, FileX,
} from 'lucide-react';
import type { ActivityLogEntry } from '@/hooks/useActivityLogs';

interface Props {
  logs: ActivityLogEntry[];
}

const ACTION_CONFIG: Record<string, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
}> = {
  user_promoted:   { icon: ShieldCheck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', label: 'Promoted'       },
  user_demoted:    { icon: ShieldOff,   iconBg: 'bg-slate-100',   iconColor: 'text-slate-500',   label: 'Demoted'        },
  user_suspended:  { icon: UserX,       iconBg: 'bg-red-100',     iconColor: 'text-red-600',     label: 'Suspended'      },
  user_activated:  { icon: UserCheck,   iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    label: 'Activated'      },
  user_deleted:    { icon: Trash2,      iconBg: 'bg-red-100',     iconColor: 'text-red-600',     label: 'User deleted'   },
  report_deleted:  { icon: FileX,       iconBg: 'bg-red-100',     iconColor: 'text-red-600',     label: 'Report deleted' },
  status_updated:  { icon: RefreshCw,   iconBg: 'bg-orange-100',  iconColor: 'text-orange-600',  label: 'Status updated' },
};

const FALLBACK = { icon: RefreshCw, iconBg: 'bg-slate-100', iconColor: 'text-slate-500', label: 'Action' };

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0)  return `${mins}m ago`;
  return 'Just now';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ActivityFeed({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-100" />

      <div className="space-y-1">
        {logs.map((log, i) => {
          const cfg = ACTION_CONFIG[log.action] ?? FALLBACK;
          const Icon = cfg.icon;
          const isLast = i === logs.length - 1;

          return (
            <div key={log.id} className={`flex gap-4 ${isLast ? '' : 'pb-5'}`}>
              {/* Icon dot */}
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.iconBg} ${cfg.iconColor}`}>
                        {cfg.label}
                      </span>
                      {log.target_type === 'report' && (
                        <span className="text-[10px] text-slate-400">
                          Report #{log.target_id}
                        </span>
                      )}
                      {log.meta && log.action === 'status_updated' && (
                        <span className="text-[10px] text-slate-400">
                          {log.meta.old_status} → {log.meta.new_status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(log.created_at)}</p>
                    <p className="text-[10px] text-slate-300 whitespace-nowrap mt-0.5">{formatDate(log.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}