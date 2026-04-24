'use client';

import { useState } from 'react';
import { MapPin, User, Calendar, MessageSquare, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';
import api from '@/lib/api';
import { normalizeImageUrl } from '@/lib/utils';
import type { Report, Comment, ApiResponse } from '@/types';

interface Props {
  report: Report;
  onStatusChange: (updated: Report) => void;
}

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved' },
];

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

export default function ReportDetailPanel({ report, onStatusChange }: Props) {
  const [comments, setComments]     = useState<Comment[] | null>(null);
  const [loadingCmts, setLoadingCmts] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showComments, setShowComments]     = useState(false);

  const loadComments = async () => {
    if (comments !== null) { setShowComments(true); return; }
    setLoadingCmts(true);
    setShowComments(true);
    try {
      const res = await api.get<ApiResponse<Comment[]>>(
        `/reports/${report.id}/comments`
      );
      setComments(res.data.data);
    } catch {
      setComments([]);
    } finally {
      setLoadingCmts(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === report.status) return;
    setUpdatingStatus(true);
    try {
      const res = await api.patch<ApiResponse<Report>>(
        `/reports/${report.id}/status`,
        { status: newStatus }
      );
      onStatusChange(res.data.data);
    } catch {
      // silently fail — toast in production
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="divide-y divide-slate-100">

      {/* Image */}
      {normalizeImageUrl(report.image_url) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizeImageUrl(report.image_url)!}
          alt="Report"
          className="w-full h-56 object-cover"
        />
      )}

      {/* Meta section */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={report.status} />
          <span className="text-xs text-slate-400">#{report.id}</span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{report.description}</p>

        <div className="space-y-1.5 pt-1">
          {report.location_name && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {report.location_name}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{report.user?.name ?? 'Unknown'} &middot; {report.user?.email}</span>
            {report.is_anonymous && (
              <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Anonymous post
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {new Date(report.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })} &middot; {timeAgo(report.created_at)}
          </div>
        </div>
      </div>

      {/* Status update */}
      <div className="px-6 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Update Status
        </p>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              disabled={updatingStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border
                ${report.status === opt.value
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                } disabled:opacity-50`}
            >
              {updatingStatus && report.status !== opt.value && (
                <RefreshCw className="w-3 h-3 animate-spin" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="px-6 py-4">
        <button
          onClick={loadComments}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {showComments ? 'Comments' : 'Load Comments'}
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {loadingCmts ? (
              <div className="flex justify-center py-4">
                <Spinner className="text-slate-400" />
              </div>
            ) : comments?.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No comments yet</p>
            ) : (
              comments?.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-lg text-xs ${
                    c.is_official
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${c.is_official ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {c.user?.name ?? 'User'}
                      {c.is_official && (
                        <span className="ml-1.5 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">
                          OFFICIAL
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{c.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}