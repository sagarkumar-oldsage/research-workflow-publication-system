'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Anchor,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      await login(values.email, values.password);
      notifications.show({ title: 'Welcome back!', message: 'Logged in successfully', color: 'green' });
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A365D 0%, #2B4C7E 50%, #4A7BBF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card shadow="xl" radius="lg" p="xl" w={420} style={{ background: 'white' }}>
        <Stack gap="lg">
          <Center>
            <Stack gap="xs" align="center">
              <Box
                style={{
                  background: 'linear-gradient(135deg, #1A365D, #2B4C7E)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={32} color="white" />
              </Box>
              <Title order={2} style={{ color: '#1A365D' }}>ResearchFlow</Title>
              <Text c="dimmed" size="sm" ta="center">
                Research Workflow & Publication Management
              </Text>
            </Stack>
          </Center>

          {error && (
            <Alert icon={<AlertCircle size={16} />} color="red" radius="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@university.edu"
                type="email"
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps('password')}
              />
              <Button type="submit" loading={loading} fullWidth size="md" color="blue.8">
                Sign In
              </Button>
            </Stack>
          </form>

          <Group justify="center">
            <Text size="sm" c="dimmed">
              Don&apos;t have an account?{' '}
              <Anchor href="/register" size="sm" fw={600}>
                Register
              </Anchor>
            </Text>
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}
