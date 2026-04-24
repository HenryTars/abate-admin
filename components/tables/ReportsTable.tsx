'use client';

import { useState } from 'react';
import { Trash2, Eye, RotateCcw } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Drawer from '@/components/ui/Drawer';
import ReportDetailPanel from '@/components/cards/ReportDetailPanel';
import api from '@/lib/api';
import { normalizeImageUrl } from '@/lib/utils';
import type { Report } from '@/types';

interface Props {
  reports: Report[];
  onUpdate: (r: Report) => void;
  onDelete: (id: number) => void;
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function ReportsTable({ reports, onUpdate, onDelete }: Props) {
  const [selected, setSelected]           = useState<Report | null>(null);
  const [toDelete, setToDelete]           = useState<Report | null>(null);
  const [toRestore, setToRestore]         = useState<Report | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/reports/${toDelete.id}`);
      onDelete(toDelete.id);
      if (selected?.id === toDelete.id) setSelected(null);
    } catch {
      // silent fail
    } finally {
      setDeleteLoading(false);
      setToDelete(null);
    }
  };

  const handleRestore = async () => {
    if (!toRestore) return;
    setRestoreLoading(true);
    try {
      const res = await api.post(`/admin/reports/${toRestore.id}/restore`);
      onUpdate(res.data.data as Report);
    } catch {
      // silent fail
    } finally {
      setRestoreLoading(false);
      setToRestore(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No reports found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Report', 'Submitted by', 'Location', 'Status', 'Date', 'Actions'].map((h) => (
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
            {reports.map((r) => {
              const isDeleted = !!r.deleted_at;
              return (
                <tr
                  key={r.id}
                  className={`transition-colors cursor-pointer ${
                    isDeleted
                      ? 'bg-red-50/40 hover:bg-red-50'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => !isDeleted && setSelected(r)}
                >
                  {/* Image + description */}
                  <td className="py-3.5 pr-4 max-w-[240px]">
                    <div className="flex items-center gap-3">
                      {normalizeImageUrl(r.image_url) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={normalizeImageUrl(r.image_url)!}
                          alt=""
                          className={`w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100 ${isDeleted ? 'opacity-40 grayscale' : ''}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className={`text-sm truncate block max-w-[160px] ${isDeleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {r.description}
                        </span>
                        {isDeleted && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-600">
                            Deleted
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Submitted by */}
                  <td className="py-3.5 pr-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm ${isDeleted ? 'text-slate-400' : 'text-slate-700'}`}>
                          {r.user?.name ?? '—'}
                        </p>
                        {r.is_anonymous && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            anon
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs">{r.user?.email}</p>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 pr-4">
                    <span className="text-slate-500 text-xs">
                      {r.location_name ?? '—'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 pr-4">
                    {!isDeleted && <StatusBadge status={r.status} />}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 pr-4 text-slate-400 text-xs whitespace-nowrap">
                    {timeAgo(r.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      {isDeleted ? (
                        <button
                          onClick={() => setToRestore(r)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                          title="Restore report"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setToDelete(r)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                        title={isDeleted ? 'Permanently delete' : 'Delete report'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        title={`Report #${selected?.id}`}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <ReportDetailPanel
            report={selected}
            onStatusChange={(updated) => {
              onUpdate(updated);
              setSelected(updated);
            }}
          />
        )}
      </Drawer>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!toDelete}
        title={toDelete?.deleted_at ? 'Permanently delete report' : 'Delete report'}
        message={
          toDelete?.deleted_at
            ? `Permanently remove report #${toDelete.id}? This cannot be undone.`
            : `Delete report by ${toDelete?.user?.name ?? 'user'}? The user will be able to see it was removed.`
        }
        confirmLabel={toDelete?.deleted_at ? 'Delete permanently' : 'Delete'}
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      {/* Restore confirm */}
      <ConfirmDialog
        open={!!toRestore}
        title="Restore report"
        message={`Restore report #${toRestore?.id} so it appears publicly again?`}
        confirmLabel="Restore"
        loading={restoreLoading}
        onConfirm={handleRestore}
        onCancel={() => setToRestore(null)}
      />
    </>
  );
}