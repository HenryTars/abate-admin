'use client';

import { useState } from 'react';
import { ShieldCheck, Trash2, UserCheck, UserX, MoreHorizontal } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';

interface Props {
  users: User[];
  onUpdate: (user: User) => void;
  onDelete: (id: number) => void;
}

type ActionType = 'toggle' | 'role' | 'delete' | null;

interface PendingAction {
  type: ActionType;
  user: User;
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function UsersTable({ users, onUpdate, onDelete }: Props) {
  const [pending, setPending]     = useState<PendingAction | null>(null);
  const [actionLoading, setLoading] = useState(false);
  const [openMenu, setOpenMenu]   = useState<number | null>(null);

  const confirm = (type: ActionType, user: User) => {
    setOpenMenu(null);
    setPending({ type, user });
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setLoading(true);
    try {
      const { type, user } = pending;

      if (type === 'delete') {
        await api.delete(`/admin/users/${user.id}`);
        onDelete(user.id);
      } else if (type === 'toggle') {
        const res = await api.patch<ApiResponse<User>>(
          `/admin/users/${user.id}/toggle`
        );
        onUpdate(res.data.data);
      } else if (type === 'role') {
        const newRole = user.role === 'authority' ? 'user' : 'authority';
        const res = await api.patch<ApiResponse<User>>(
          `/admin/users/${user.id}/role`,
          { role: newRole }
        );
        onUpdate(res.data.data);
      }
    } catch {
      // silently ignore — in production you'd show a toast
    } finally {
      setLoading(false);
      setPending(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No users found
      </div>
    );
  }

  const isSuspended = (u: User) => !u.email_verified_at;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide pb-3 pr-6 last:pr-0 last:text-right"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                {/* User info */}
                <td className="py-3.5 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-slate-500">
                        {user.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 leading-none">{user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="py-3.5 pr-6">
                  <StatusBadge status={user.role} />
                </td>

                {/* Status */}
                <td className="py-3.5 pr-6">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                    ${isSuspended(user) ? 'text-red-600' : 'text-emerald-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSuspended(user) ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {isSuspended(user) ? 'Suspended' : 'Active'}
                  </span>
                </td>

                {/* Joined */}
                <td className="py-3.5 pr-6 text-slate-400 text-xs">
                  {timeAgo(user.created_at)}
                </td>

                {/* Actions */}
                <td className="py-3.5 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {openMenu === user.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 text-sm">
                          <button
                            onClick={() => confirm('role', user)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            {user.role === 'authority' ? 'Remove authority' : 'Make authority'}
                          </button>
                          <button
                            onClick={() => confirm('toggle', user)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
                          >
                            {isSuspended(user)
                              ? <><UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Activate</>
                              : <><UserX className="w-3.5 h-3.5 text-orange-500" /> Suspend</>
                            }
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => confirm('delete', user)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete user
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={pending?.type === 'delete'}
        title="Delete user"
        message={`Permanently delete ${pending?.user.name}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={pending?.type === 'toggle'}
        title={pending?.user && isSuspended(pending.user) ? 'Activate user' : 'Suspend user'}
        message={
          pending?.user && isSuspended(pending.user)
            ? `Activate ${pending.user.name}? They will regain full access.`
            : `Suspend ${pending?.user.name}? They won't be able to log in.`
        }
        confirmLabel={pending?.user && isSuspended(pending.user) ? 'Activate' : 'Suspend'}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={pending?.type === 'role'}
        title="Change role"
        message={
          pending?.user.role === 'authority'
            ? `Remove authority role from ${pending?.user.name}?`
            : `Grant authority role to ${pending?.user.name}? They can update report statuses.`
        }
        confirmLabel="Confirm"
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </>
  );
}