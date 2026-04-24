'use client';

import { useState } from 'react';
import { UserMinus, PowerOff, Power } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

interface Props {
  authorities: User[];
  onUpdate: (u: User) => void;
  onRemove: (id: number) => void;
}

type Action = { type: 'demote' | 'toggle'; user: User };

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function AuthoritiesTable({ authorities, onUpdate, onRemove }: Props) {
  const [pending, setPending] = useState<Action | null>(null);
  const [loading, setLoading] = useState(false);

  const isActive = (u: User) => !!u.email_verified_at;

  const handleConfirm = async () => {
    if (!pending) return;
    setLoading(true);
    try {
      if (pending.type === 'demote') {
        const res = await api.patch<ApiResponse<User>>(
          `/admin/users/${pending.user.id}/role`,
          { role: 'user' }
        );
        onRemove(res.data.data.id);
      } else {
        const res = await api.patch<ApiResponse<User>>(
          `/admin/users/${pending.user.id}/toggle`
        );
        onUpdate(res.data.data);
      }
    } catch {
      // silent — toast in production
    } finally {
      setLoading(false);
      setPending(null);
    }
  };

  if (authorities.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No authorities found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Authority', 'Status', 'Joined', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide pb-3 pr-4 last:pr-0 last:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {authorities.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                {/* Name + email */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-emerald-700">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">{u.name}</p>
                      <p className="text-slate-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 pr-4">
                  <StatusBadge status={isActive(u) ? 'active' : 'suspended'} />
                </td>

                {/* Joined */}
                <td className="py-3.5 pr-4 text-slate-400 text-xs whitespace-nowrap">
                  {formatDate(u.created_at)}
                </td>

                {/* Actions */}
                <td className="py-3.5 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setPending({ type: 'toggle', user: u })}
                      className={`p-1.5 rounded-lg transition text-slate-400 ${
                        isActive(u)
                          ? 'hover:bg-amber-50 hover:text-amber-600'
                          : 'hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                      title={isActive(u) ? 'Suspend' : 'Activate'}
                    >
                      {isActive(u) ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setPending({ type: 'demote', user: u })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      title="Demote to user"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pending}
        title={
          pending?.type === 'demote'
            ? 'Demote authority'
            : isActive(pending?.user ?? ({} as User))
            ? 'Suspend authority'
            : 'Activate authority'
        }
        message={
          pending?.type === 'demote'
            ? `Remove authority privileges from ${pending?.user.name}? They will become a regular user.`
            : isActive(pending?.user ?? ({} as User))
            ? `Suspend ${pending?.user.name}? They won't be able to log in.`
            : `Reactivate ${pending?.user.name}'s account?`
        }
        confirmLabel={
          pending?.type === 'demote'
            ? 'Demote'
            : isActive(pending?.user ?? ({} as User))
            ? 'Suspend'
            : 'Activate'
        }
        danger={pending?.type === 'demote' || isActive(pending?.user ?? ({} as User))}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </>
  );
}