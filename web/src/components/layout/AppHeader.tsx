'use client';

import { AppShell, Group, ActionIcon, Text, Box, Avatar, Menu, Badge } from '@mantine/core';
import { Menu as MenuIcon, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function AppHeader({ opened, onToggle }: AppHeaderProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AppShell.Header style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
      <Group h="100%" px="md" justify="space-between">
        <Group gap="sm">
          <ActionIcon
            variant="subtle"
            color="gray"
            hiddenFrom="sm"
            onClick={onToggle}
            aria-label="Toggle navigation"
          >
            <MenuIcon size={20} />
          </ActionIcon>
          <Text fw={600} c="gray.7" visibleFrom="sm" size="sm">
            Research Workflow & Publication Management
          </Text>
        </Group>

        <Group gap="sm">
          <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Notifications">
            <Box style={{ position: 'relative' }}>
              <Bell size={20} />
              <Badge
                size="xs"
                color="red"
                style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: 0 }}
              >
                3
              </Badge>
            </Box>
          </ActionIcon>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                size="sm"
                color="blue"
                radius="xl"
                src={profile?.photoURL}
                style={{ cursor: 'pointer' }}
              >
                {profile?.displayName?.charAt(0).toUpperCase()}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{profile?.displayName}</Menu.Label>
              <Menu.Label c="dimmed" fz="xs">{profile?.email}</Menu.Label>
              <Menu.Divider />
              <Menu.Item leftSection={<User size={14} />} onClick={() => router.push('/settings/profile')}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<Settings size={14} />} onClick={() => router.push('/settings')}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<LogOut size={14} />} color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
