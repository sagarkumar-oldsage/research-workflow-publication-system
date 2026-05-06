'use client';

import { useEffect, useState } from 'react';
import {
  Grid, Card, Text, Title, Group, Badge, Progress, Stack,
  Box, SimpleGrid, RingProgress, Loader, Center, Button,
  ThemeIcon, Paper,
} from '@mantine/core';
import {
  FolderOpen, CheckCircle, Clock, AlertTriangle, Plus, TrendingUp, Users, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getAllAssignments } from '@/services/assignmentService';
import { Assignment } from '@/types';
import { ASSIGNMENT_TYPE_COLORS, ASSIGNMENT_TYPE_LABELS } from '@/lib/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function DashboardPage() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAssignments().then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Center h={400}><Loader size="lg" /></Center>;
  }

  const active = assignments.filter((a) => a.status === 'active');
  const completed = assignments.filter((a) => a.status === 'completed');
  const overdue = assignments.filter((a) =>
    a.status === 'active' && dayjs(a.deadline).isBefore(dayjs())
  );
  const dueThisWeek = assignments.filter((a) =>
    a.status === 'active' &&
    dayjs(a.deadline).isAfter(dayjs()) &&
    dayjs(a.deadline).isBefore(dayjs().add(7, 'day'))
  );

  const stats = [
    { label: 'Active Assignments', value: active.length, icon: FolderOpen, color: 'blue', bg: '#EFF6FF' },
    { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'green', bg: '#F0FDF4' },
    { label: 'Due This Week', value: dueThisWeek.length, icon: Clock, color: 'orange', bg: '#FFF7ED' },
    { label: 'Overdue', value: overdue.length, icon: AlertTriangle, color: 'red', bg: '#FEF2F2' },
  ];

  const recentAssignments = assignments.slice(0, 5);

  return (
    <Stack gap="xl">
      {/* Welcome Header */}
      <Box>
        <Title order={2} style={{ color: '#1A365D' }}>
          Welcome back, {profile?.displayName?.split(' ')[0]} 👋
        </Title>
        <Text c="dimmed" size="sm" mt={4}>
          Here&apos;s an overview of your research workflow.
        </Text>
      </Box>

      {/* Stat Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} p="lg" radius="md" style={{ background: stat.bg, border: `1px solid ${stat.bg}` }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase" ls={0.5}>{stat.label}</Text>
                  <Text size="2rem" fw={700} mt={4} style={{ color: '#1A365D', lineHeight: 1 }}>
                    {stat.value}
                  </Text>
                </Box>
                <ThemeIcon color={stat.color} variant="light" size="xl" radius="md">
                  <Icon size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Grid gutter="md">
        {/* Recent Assignments */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card radius="md" p="lg" shadow="sm">
            <Group justify="space-between" mb="md">
              <Title order={4} c="gray.8">Recent Assignments</Title>
              <Button
                component={Link}
                href="/assignments"
                variant="subtle"
                size="xs"
                color="blue"
              >
                View all
              </Button>
            </Group>

            {recentAssignments.length === 0 ? (
              <Stack align="center" py="xl" gap="sm">
                <FolderOpen size={40} color="#CBD5E1" />
                <Text c="dimmed" size="sm">No assignments yet</Text>
                <Button component={Link} href="/assignments/new" size="sm" leftSection={<Plus size={14} />}>
                  Create First Assignment
                </Button>
              </Stack>
            ) : (
              <Stack gap="sm">
                {recentAssignments.map((assignment) => {
                  const isOverdue = dayjs(assignment.deadline).isBefore(dayjs()) && assignment.status === 'active';
                  return (
                    <Paper
                      key={assignment.id}
                      p="md"
                      radius="md"
                      style={{ border: '1px solid #E2E8F0', cursor: 'pointer' }}
                      component={Link}
                      href={`/assignments/${assignment.id}`}
                    >
                      <Group justify="space-between" mb={8}>
                        <Group gap="sm">
                          <Badge
                            color={ASSIGNMENT_TYPE_COLORS[assignment.type]}
                            variant="light"
                            size="sm"
                          >
                            {ASSIGNMENT_TYPE_LABELS[assignment.type]}
                          </Badge>
                          {isOverdue && <Badge color="red" size="sm">Overdue</Badge>}
                        </Group>
                        <Text size="xs" c="dimmed">
                          Due {dayjs(assignment.deadline).fromNow()}
                        </Text>
                      </Group>
                      <Text fw={500} size="sm" mb={8} lineClamp={1}>{assignment.title}</Text>
                      <Progress
                        value={assignment.progressPercent}
                        color={
                          assignment.progressPercent === 100 ? 'green' :
                          isOverdue ? 'red' :
                          'blue'
                        }
                        size="sm"
                        radius="xl"
                      />
                      <Group justify="space-between" mt={4}>
                        <Text size="xs" c="dimmed">
                          Stage {assignment.currentStageIndex + 1} of {assignment.stages.length}
                        </Text>
                        <Text size="xs" fw={500} c="blue">{assignment.progressPercent}%</Text>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Card>
        </Grid.Col>

        {/* Right Panel */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Progress Overview */}
            <Card radius="md" p="lg" shadow="sm">
              <Title order={4} c="gray.8" mb="md">Overall Progress</Title>
              <Center>
                <RingProgress
                  size={140}
                  thickness={14}
                  label={
                    <Text ta="center" fw={700} size="lg" c="blue.8">
                      {assignments.length > 0
                        ? Math.round(
                            assignments.reduce((acc, a) => acc + a.progressPercent, 0) /
                              assignments.length
                          )
                        : 0}%
                    </Text>
                  }
                  sections={[
                    {
                      value: assignments.length > 0
                        ? Math.round(
                            assignments.reduce((acc, a) => acc + a.progressPercent, 0) /
                              assignments.length
                          )
                        : 0,
                      color: 'blue',
                    },
                  ]}
                />
              </Center>
              <Stack gap={8} mt="md">
                <Group justify="space-between">
                  <Group gap={6}>
                    <Box w={10} h={10} style={{ borderRadius: '50%', background: '#22C55E' }} />
                    <Text size="xs" c="dimmed">Completed</Text>
                  </Group>
                  <Text size="xs" fw={500}>{completed.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap={6}>
                    <Box w={10} h={10} style={{ borderRadius: '50%', background: '#3B82F6' }} />
                    <Text size="xs" c="dimmed">Active</Text>
                  </Group>
                  <Text size="xs" fw={500}>{active.length}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap={6}>
                    <Box w={10} h={10} style={{ borderRadius: '50%', background: '#EF4444' }} />
                    <Text size="xs" c="dimmed">Overdue</Text>
                  </Group>
                  <Text size="xs" fw={500}>{overdue.length}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Quick Actions */}
            <Card radius="md" p="lg" shadow="sm">
              <Title order={4} c="gray.8" mb="md">Quick Actions</Title>
              <Stack gap="sm">
                <Button
                  component={Link}
                  href="/assignments/new"
                  leftSection={<Plus size={16} />}
                  variant="light"
                  fullWidth
                  justify="left"
                >
                  New Assignment
                </Button>
                <Button
                  component={Link}
                  href="/assignments"
                  leftSection={<FolderOpen size={16} />}
                  variant="light"
                  color="gray"
                  fullWidth
                  justify="left"
                >
                  View All Assignments
                </Button>
                <Button
                  component={Link}
                  href="/analytics"
                  leftSection={<BarChart2 size={16} />}
                  variant="light"
                  color="teal"
                  fullWidth
                  justify="left"
                >
                  Analytics
                </Button>
                <Button
                  component={Link}
                  href="/team"
                  leftSection={<Users size={16} />}
                  variant="light"
                  color="violet"
                  fullWidth
                  justify="left"
                >
                  Team Members
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
