'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/Button';
import { Heart, LogOut, Edit, Home } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  const handleSignOut = async () => {
    await logOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-700">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user && !pathname.startsWith('/login')) {
    return null;
  }

  // 登录页面不需要 layout
  if (pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-amber-500" fill="currentColor" />
              <span className="font-semibold text-amber-900">DiaryAI</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-1 text-amber-700 hover:text-amber-900"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">首页</span>
              </Link>
              <Link
                href="/new"
                className="flex items-center space-x-1 text-amber-700 hover:text-amber-900"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">写日记</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="退出登录"
              >
                <LogOut className="w-5 h-5 text-amber-600" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-amber-600 text-sm">
          <p>💭 记录生活，遇见更好的自己</p>
        </div>
      </footer>
    </div>
  );
}
