'use client';

import { useState, type ReactNode, type ElementType, type InputHTMLAttributes, type FormEvent } from 'react';
import { User, Sun, Moon, Monitor, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { Theme } from '@/lib/theme';
import api from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { User as UserType } from '@/types';

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({ title, description, children }: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Password input with toggle
// ---------------------------------------------------------------------------
function PasswordInput({ value, onChange, placeholder, disabled }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const show = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const Toast = toast ? (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
        toast.type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {toast.msg}
    </div>
  ) : null;

  return { show, Toast };
}

// ---------------------------------------------------------------------------
// Profile section
// ---------------------------------------------------------------------------
function ProfileSection() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [busy, setBusy] = useState(false);
  const { show, Toast } = useToast();

  const handleSave = async () => {
    if (!name.trim() || name.trim() === user?.name) return;
    setBusy(true);
    try {
      const res = await api.patch<ApiResponse<UserType>>('/auth/profile', { name: name.trim() });
      updateUser(res.data.data);
      show('Profile updated successfully');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update profile';
      show(msg, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {Toast}
      <Section
        title="Account Information"
        description="Update your display name. Email cannot be changed."
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
              <User className="w-2.5 h-2.5" />
              Admin
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={busy}
            />
          </Field>
          <Field label="Email address">
            <Input value={user?.email ?? ''} disabled />
          </Field>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={busy || !name.trim() || name.trim() === user?.name}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Save className="w-3.5 h-3.5" />
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Password section
// ---------------------------------------------------------------------------
function PasswordSection() {
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState('');
  const { show, Toast }       = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      await api.put('/auth/password', {
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      show('Password changed successfully');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to change password';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {Toast}
      <Section title="Change Password" description="Use a strong password of at least 8 characters.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Current password">
            <PasswordInput
              value={current}
              onChange={setCurrent}
              placeholder="Enter current password"
              disabled={busy}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New password">
              <PasswordInput
                value={next}
                onChange={setNext}
                placeholder="Min. 8 characters"
                disabled={busy}
              />
            </Field>
            <Field label="Confirm new password">
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                placeholder="Repeat new password"
                disabled={busy}
              />
            </Field>
          </div>

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={busy || !current || !next || !confirm}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Lock className="w-3.5 h-3.5" />
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Appearance section
// ---------------------------------------------------------------------------
const themeOptions: { value: Theme; label: string; icon: ElementType; desc: string }[] = [
  { value: 'light',  label: 'Light',  icon: Sun,     desc: 'Always use light mode' },
  { value: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Follow device preference' },
];

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Section title="Appearance" description="Choose how the admin panel looks.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themeOptions.map(({ value, label, icon: Icon, desc }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${active ? 'bg-emerald-100 dark:bg-emerald-800/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
              </div>
              {active && (
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 self-start" />
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ProfileSection />
      <AppearanceSection />
      <PasswordSection />
    </div>
  );
}
