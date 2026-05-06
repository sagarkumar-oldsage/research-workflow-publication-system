'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppShell, Stack, Text, NavLink, Box, ScrollArea, Divider, Avatar, Group,
} from '@mantine/core';
import {
  LayoutDashboard, FolderOpen, PlusCircle, GitBranch, Users,
  BarChart3, Settings, LogOut, BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assignments', label: 'Assignments', icon: FolderOpen },
  { href: '/assignments/new', label: 'New Assignment', icon: PlusCircle },
  { href: '/workflows', label: 'Workflows', icon: GitBranch },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AppShell.Navbar
      style={{
        background: '#1A365D',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box p="md" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Group gap="sm">
          <Box
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BookOpen size={20} color="white" />
          </Box>
          <Text fw={700} size="lg" c="white">ResearchFlow</Text>
        </Group>
      </Box>

      {/* Nav Items */}
      <ScrollArea flex={1} p="sm">
        <Stack gap={4}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                onClick={onClose}
                label={<Text size="sm" c="white">{item.label}</Text>}
                leftSection={<Icon size={18} color={active ? 'white' : 'rgba(255,255,255,0.6)'} />}
                active={active}
                style={{
                  borderRadius: '8px',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.08)' },
                }}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      {/* User Section */}
      <Box p="sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Divider color="rgba(255,255,255,0.1)" mb="sm" />
        {profile && (
          <Group gap="sm" mb="sm">
            <Avatar
              size="sm"
              color="blue"
              radius="xl"
              src={profile.photoURL}
            >
              {profile.displayName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="xs" fw={600} c="white" truncate>{profile.displayName}</Text>
              <Text size="xs" c="rgba(255,255,255,0.5)" truncate tt="capitalize">{profile.role}</Text>
            </Box>
          </Group>
        )}
        <NavLink
          label={<Text size="sm" c="rgba(255,255,255,0.7)">Logout</Text>}
          leftSection={<LogOut size={16} color="rgba(255,255,255,0.6)" />}
          onClick={handleLogout}
          style={{ borderRadius: '8px' }}
        />
      </Box>
    </AppShell.Navbar>
  );
}
