'use client';

import { useEffect, useState } from 'react';
import {
  Stack, Title, Group, Button, TextInput, Select, Badge, Card, Text,
  Progress, SimpleGrid, Box, SegmentedControl, Loader, Center, Menu,
  ActionIcon,
} from '@mantine/core';
import { Plus, Search, Filter, MoreVertical, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { getAllAssignments, deleteAssignment } from '@/services/assignmentService';
import { Assignment, AssignmentType, PriorityLevel } from '@/types';
import {
  ASSIGNMENT_TYPE_COLORS, ASSIGNMENT_TYPE_LABELS,
  PRIORITY_COLORS,
} from '@/lib/constants';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const loadAssignments = () => {
    setLoading(true);
    getAllAssignments().then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadAssignments(); }, []);

  const handleDelete = (id: string, title: string) => {
    modals.openConfirmModal({
      title: 'Delete Assignment',
      children: <Text size="sm">Are you sure you want to delete &quot;{title}&quot;? This cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await deleteAssignment(id);
        notifications.show({ title: 'Deleted', message: 'Assignment deleted', color: 'red' });
        loadAssignments();
      },
    });
  };

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Box>
          <Title order={2} c="gray.8">Assignments</Title>
          <Text c="dimmed" size="sm">{assignments.length} total assignments</Text>
        </Box>
        <Button component={Link} href="/assignments/new" leftSection={<Plus size={16} />}>
          New Assignment
        </Button>
      </Group>

      {/* Filters */}
      <Card p="md" radius="md" shadow="sm">
        <Group gap="md" wrap="wrap">
          <TextInput
            placeholder="Search assignments..."
            leftSection={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            data={typeOptions}
            value={typeFilter}
            onChange={(v) => setTypeFilter(v || 'all')}
            leftSection={<Filter size={14} />}
            w={180}
          />
          <Select
            data={statusOptions}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v || 'all')}
            w={150}
          />
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as 'grid' | 'list')}
            data={[{ label: 'Grid', value: 'grid' }, { label: 'List', value: 'list' }]}
            size="xs"
          />
        </Group>
      </Card>

      {loading ? (
        <Center h={300}><Loader /></Center>
      ) : filtered.length === 0 ? (
        <Center h={300}>
          <Stack align="center" gap="sm">
            <Text c="dimmed">No assignments found</Text>
            <Button component={Link} href="/assignments/new" size="sm">Create one</Button>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: view === 'grid' ? 3 : 1 }} spacing="md">
          {filtered.map((assignment) => {
            const isOverdue = dayjs(assignment.deadline).isBefore(dayjs()) && assignment.status === 'active';
            const currentStage = assignment.stages[assignment.currentStageIndex];
            return (
              <Card key={assignment.id} p="lg" radius="md" shadow="sm" style={{ border: '1px solid #E2E8F0' }}>
                <Group justify="space-between" mb="sm">
                  <Group gap="xs">
                    <Badge color={ASSIGNMENT_TYPE_COLORS[assignment.type]} variant="light" size="sm">
                      {ASSIGNMENT_TYPE_LABELS[assignment.type]}
                    </Badge>
                    <Badge color={PRIORITY_COLORS[assignment.priority]} variant="dot" size="sm">
                      {assignment.priority}
                    </Badge>
                  </Group>
                  <Menu shadow="md" width={160} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <MoreVertical size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Eye size={14} />}
                        component={Link}
                        href={`/assignments/${assignment.id}`}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<Trash2 size={14} />}
                        color="red"
                        onClick={() => handleDelete(assignment.id, assignment.title)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Text fw={600} size="sm" lineClamp={2} mb="xs">
                  <Link href={`/assignments/${assignment.id}`} style={{ color: '#1A365D', textDecoration: 'none' }}>
                    {assignment.title}
                  </Link>
                </Text>

                {assignment.targetVenue && (
                  <Text size="xs" c="dimmed" mb="xs" lineClamp={1}>📍 {assignment.targetVenue}</Text>
                )}

                <Group gap="xs" mb="sm" wrap="wrap">
                  {assignment.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} size="xs" variant="outline" color="gray">{tag}</Badge>
                  ))}
                </Group>

                <Box mb="xs">
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed">
                      {currentStage ? currentStage.name : 'Not started'}
                    </Text>
                    <Text size="xs" fw={600} c="blue">{assignment.progressPercent}%</Text>
                  </Group>
                  <Progress
                    value={assignment.progressPercent}
                    color={assignment.progressPercent === 100 ? 'green' : isOverdue ? 'red' : 'blue'}
                    size="sm"
                    radius="xl"
                  />
                </Box>

                <Group justify="space-between" mt="sm">
                  <Badge
                    color={assignment.status === 'completed' ? 'green' : assignment.status === 'active' ? 'blue' : 'gray'}
                    size="xs"
                    variant="filled"
                  >
                    {assignment.status}
                  </Badge>
                  <Text size="xs" c={isOverdue ? 'red' : 'dimmed'}>
                    {isOverdue ? '⚠ ' : ''}Due {dayjs(assignment.deadline).fromNow()}
                  </Text>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
