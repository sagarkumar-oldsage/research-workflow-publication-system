'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Card, Center, Group, PasswordInput,
  Stack, Text, TextInput, Title, Anchor, Alert, Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: { displayName: '', email: '', password: '', confirmPassword: '', role: 'contributor' as UserRole },
    validate: {
      displayName: (v) => (v.trim().length < 2 ? 'Name must be at least 2 characters' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (v, values) => (v !== values.password ? 'Passwords do not match' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError('');
    try {
      await register(values.email, values.password, values.displayName, values.role);
      notifications.show({ title: 'Account created!', message: 'Welcome to ResearchFlow', color: 'green' });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg.includes('email-already-in-use') ? 'This email is already registered.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A365D 0%, #2B4C7E 50%, #4A7BBF 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <Card shadow="xl" radius="lg" p="xl" w={440} style={{ background: 'white' }}>
        <Stack gap="lg">
          <Center>
            <Stack gap="xs" align="center">
              <Box
                style={{
                  background: 'linear-gradient(135deg, #1A365D, #2B4C7E)',
                  borderRadius: '12px', padding: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <BookOpen size={32} color="white" />
              </Box>
              <Title order={2} style={{ color: '#1A365D' }}>Create Account</Title>
              <Text c="dimmed" size="sm">Join ResearchFlow</Text>
            </Stack>
          </Center>

          {error && (
            <Alert icon={<AlertCircle size={16} />} color="red" radius="md">{error}</Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput label="Full Name" placeholder="Dr. Jane Smith" {...form.getInputProps('displayName')} />
              <TextInput label="Email" placeholder="you@university.edu" type="email" {...form.getInputProps('email')} />
              <Select
                label="Role"
                data={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'contributor', label: 'Contributor' },
                  { value: 'reviewer', label: 'Reviewer' },
                ]}
                {...form.getInputProps('role')}
              />
              <PasswordInput label="Password" placeholder="Min 6 characters" {...form.getInputProps('password')} />
              <PasswordInput label="Confirm Password" placeholder="Repeat password" {...form.getInputProps('confirmPassword')} />
              <Button type="submit" loading={loading} fullWidth size="md" color="blue.8">
                Create Account
              </Button>
            </Stack>
          </form>

          <Group justify="center">
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor href="/login" size="sm" fw={600}>Sign In</Anchor>
            </Text>
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}
