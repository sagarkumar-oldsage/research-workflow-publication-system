'use client';

import { useState } from 'react';
import {
  Stack, Title, Card, TextInput, Textarea, Select, Button,
  Group, Avatar, Text, Box, Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Save, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/userService';

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      department: profile?.department || '',
    },
    validate: {
      displayName: (v) => (!v.trim() ? 'Name is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, values);
      notifications.show({ title: 'Profile updated', message: 'Your changes have been saved', color: 'green' });
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update profile', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="xl" maw={640}>
      <Box>
        <Title order={2} c="gray.8">Settings</Title>
        <Text c="dimmed" size="sm">Manage your profile and preferences</Text>
      </Box>

      <Card p="lg" radius="md" shadow="sm">
        <Group mb="lg">
          <Avatar size="xl" color="blue" radius="xl" src={profile?.photoURL}>
            {profile?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Text fw={600} size="lg">{profile?.displayName}</Text>
            <Text size="sm" c="dimmed">{profile?.email}</Text>
            <Text size="xs" c="blue" tt="capitalize">{profile?.role}</Text>
          </Box>
        </Group>

        <Divider mb="lg" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              placeholder="Dr. Jane Smith"
              required
              {...form.getInputProps('displayName')}
            />
            <TextInput
              label="Department / Affiliation"
              placeholder="e.g. Computer Science, IIT Delhi"
              {...form.getInputProps('department')}
            />
            <Textarea
              label="Bio"
              placeholder="Brief description about your research focus..."
              rows={3}
              {...form.getInputProps('bio')}
            />
            <TextInput
              label="Email"
              value={profile?.email || ''}
              disabled
              description="Email cannot be changed"
            />
            <Select
              label="Role"
              value={profile?.role}
              disabled
              data={[
                { value: 'admin', label: 'Admin' },
                { value: 'contributor', label: 'Contributor' },
                { value: 'reviewer', label: 'Reviewer' },
              ]}
              description="Role can only be changed by an admin"
            />
            <Group justify="flex-end">
              <Button type="submit" loading={loading} leftSection={<Save size={16} />}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
