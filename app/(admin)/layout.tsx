import AuthGuard from '@/components/layout/AuthGuard';
import LayoutShell from '@/components/layout/LayoutShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <LayoutShell>{children}</LayoutShell>
    </AuthGuard>
  );
}
