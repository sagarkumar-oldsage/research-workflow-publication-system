'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Title, Text, Card, SimpleGrid, Group, Progress,
  Badge, Box, Loader, Center, RingProgress, ThemeIcon,
} from '@mantine/core';
import { BarChart2, TrendingUp, Award, BookOpen, FileText, Lightbulb } from 'lucide-react';
import { getAllAssignments } from '@/services/assignmentService';
import { Assignment, AssignmentType } from '@/types';
import { ASSIGNMENT_TYPE_COLORS, ASSIGNMENT_TYPE_LABELS } from '@/lib/constants';
import dayjs from 'dayjs';

export default function AnalyticsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAssignments().then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Center h={400}><Loader /></Center>;

  const completed = assignments.filter((a) => a.status === 'completed');
  const active = assignments.filter((a) => a.status === 'active');
  const avgProgress = assignments.length
    ? Math.round(assignments.reduce((acc, a) => acc + a.progressPercent, 0) / assignments.length)
    : 0;

  // Count by type
  const byType: Partial<Record<AssignmentType, number>> = {};
  assignments.forEach((a) => {
    byType[a.type] = (byType[a.type] || 0) + 1;
  });

  // Monthly activity (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = dayjs().subtract(5 - i, 'month');
    const count = assignments.filter((a) =>
      dayjs(a.createdAt).format('YYYY-MM') === month.format('YYYY-MM')
    ).length;
    return { label: month.format('MMM'), count };
  });

  const maxMonthly = Math.max(...monthlyData.map((m) => m.count), 1);

  const statCards = [
    { label: 'Total Assignments', value: assignments.length, icon: BookOpen, color: 'blue' },
    { label: 'Completed', value: completed.length, icon: Award, color: 'green' },
    { label: 'In Progress', value: active.length, icon: TrendingUp, color: 'orange' },
    { label: 'Avg. Progress', value: `${avgProgress}%`, icon: BarChart2, color: 'violet' },
  ];

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2} c="gray.8">Analytics & Reports</Title>
        <Text c="dimmed" size="sm">Research productivity overview</Text>
      </Box>

      {/* Stats */}
      <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} p="lg" radius="md" shadow="sm">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>{stat.label}</Text>
                  <Text size="2rem" fw={700} c="gray.8" mt={4} style={{ lineHeight: 1 }}>{stat.value}</Text>
                </Box>
                <ThemeIcon color={stat.color} variant="light" size="xl" radius="md">
                  <Icon size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* By Type Breakdown */}
        <Card p="lg" radius="md" shadow="sm">
          <Title order={4} mb="md" c="gray.7">By Assignment Type</Title>
          {Object.keys(byType).length === 0 ? (
            <Center py="xl"><Text c="dimmed" size="sm">No data</Text></Center>
          ) : (
            <Stack gap="sm">
              {Object.entries(byType).map(([type, count]) => (
                <Box key={type}>
                  <Group justify="space-between" mb={4}>
                    <Group gap="xs">
                      <Badge
                        color={ASSIGNMENT_TYPE_COLORS[type as AssignmentType]}
                        variant="light"
                        size="sm"
                      >
                        {ASSIGNMENT_TYPE_LABELS[type as AssignmentType]}
                      </Badge>
                    </Group>
                    <Text size="sm" fw={600}>{count}</Text>
                  </Group>
                  <Progress
                    value={(count / assignments.length) * 100}
                    color={ASSIGNMENT_TYPE_COLORS[type as AssignmentType]}
                    size="sm"
                    radius="xl"
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Card>

        {/* Monthly Activity */}
        <Card p="lg" radius="md" shadow="sm">
          <Title order={4} mb="md" c="gray.7">Monthly Activity (Last 6 Months)</Title>
          <Stack gap="sm">
            {monthlyData.map((m) => (
              <Group key={m.label} gap="md">
                <Text size="sm" c="dimmed" w={30}>{m.label}</Text>
                <Box style={{ flex: 1 }}>
                  <Progress
                    value={(m.count / maxMonthly) * 100}
                    color="blue"
                    size="md"
                    radius="xl"
                  />
                </Box>
                <Text size="sm" fw={600} w={20}>{m.count}</Text>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* Completion Rate */}
        <Card p="lg" radius="md" shadow="sm">
          <Title order={4} mb="md" c="gray.7">Completion Rate</Title>
          <Center>
            <RingProgress
              size={160}
              thickness={16}
              label={
                <Text ta="center" fw={700} size="lg" c="green.7">
                  {assignments.length > 0 ? Math.round((completed.length / assignments.length) * 100) : 0}%
                </Text>
              }
              sections={[
                {
                  value: assignments.length > 0 ? (completed.length / assignments.length) * 100 : 0,
                  color: 'green',
                },
              ]}
            />
          </Center>
          <Text ta="center" size="sm" c="dimmed" mt="sm">
            {completed.length} of {assignments.length} assignments completed
          </Text>
        </Card>

        {/* Progress Distribution */}
        <Card p="lg" radius="md" shadow="sm">
          <Title order={4} mb="md" c="gray.7">Progress Distribution</Title>
          <Stack gap="sm">
            {[
              { label: '0–25%', range: [0, 25], color: 'red' },
              { label: '26–50%', range: [26, 50], color: 'orange' },
              { label: '51–75%', range: [51, 75], color: 'yellow' },
              { label: '76–99%', range: [76, 99], color: 'blue' },
              { label: '100%', range: [100, 100], color: 'green' },
            ].map((bucket) => {
              const count = assignments.filter(
                (a) => a.progressPercent >= bucket.range[0] && a.progressPercent <= bucket.range[1]
              ).length;
              return (
                <Group key={bucket.label} gap="md">
                  <Text size="sm" c="dimmed" w={55}>{bucket.label}</Text>
                  <Box style={{ flex: 1 }}>
                    <Progress
                      value={assignments.length ? (count / assignments.length) * 100 : 0}
                      color={bucket.color}
                      size="md"
                      radius="xl"
                    />
                  </Box>
                  <Text size="sm" fw={600} w={20}>{count}</Text>
                </Group>
              );
            })}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
