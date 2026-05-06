'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell, Loader, Center } from '@mantine/core';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import { useDisclosure } from '@mantine/hooks';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  if (!user) return null;

  return (
    <AppShell
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader opened={opened} onToggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar>
        <AppSidebar onClose={toggle} />
      </AppShell.Navbar>
      <AppShell.Main style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
