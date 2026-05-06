'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Title, Card, Text, Group, Avatar, Badge, SimpleGrid,
  Box, Loader, Center, Button,
} from '@mantine/core';
import { Mail, Shield } from 'lucide-react';
import { getAllUsers } from '@/services/userService';
import { UserProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const ROLE_COLORS = { admin: 'red', contributor: 'blue', reviewer: 'green' };

export default function TeamPage() {
  const { profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Center h={400}><Loader /></Center>;

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2} c="gray.8">Team Members</Title>
        <Text c="dimmed" size="sm">{users.length} members in your research team</Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {users.map((user) => (
          <Card key={user.uid} p="lg" radius="md" shadow="sm" style={{ border: '1px solid #E2E8F0' }}>
            <Stack align="center" gap="sm">
              <Avatar
                size="xl"
                color="blue"
                radius="xl"
                src={user.photoURL}
              >
                {user.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box ta="center">
                <Group gap="xs" justify="center">
                  <Text fw={600}>{user.displayName}</Text>
                  {user.uid === currentProfile?.uid && (
                    <Badge size="xs" color="blue" variant="light">You</Badge>
                  )}
                </Group>
                {user.department && (
                  <Text size="xs" c="dimmed">{user.department}</Text>
                )}
              </Box>
              <Badge
                color={ROLE_COLORS[user.role] || 'gray'}
                variant="light"
                leftSection={<Shield size={10} />}
                tt="capitalize"
              >
                {user.role}
              </Badge>
              <Group gap="xs" c="dimmed">
                <Mail size={12} />
                <Text size="xs">{user.email}</Text>
              </Group>
              {user.bio && (
                <Text size="xs" c="dimmed" ta="center" lineClamp={2}>{user.bio}</Text>
              )}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
