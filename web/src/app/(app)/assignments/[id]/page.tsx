'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Stack, Title, Group, Badge, Progress, Card, Text, Box, Grid,
  Button, Tabs, Loader, Center, Avatar, Divider, Textarea,
  Select, ActionIcon, Tooltip, Anchor, SimpleGrid, ThemeIcon,
} from '@mantine/core';
import {
  ArrowLeft, CheckCircle2, Clock, Users, Link2, Tag, Activity,
  FileText, ChevronRight, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getAssignment, updateStageStatus, getActivityLogs } from '@/services/assignmentService';
import { Assignment, WorkflowStage, ActivityLog } from '@/types';
import {
  ASSIGNMENT_TYPE_COLORS, ASSIGNMENT_TYPE_LABELS,
  PRIORITY_COLORS, STAGE_STATUS_COLORS, STAGE_STATUS_LABELS,
} from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { modals } from '@mantine/modals';

dayjs.extend(relativeTime);

const STATUS_OPTIONS = Object.entries(STAGE_STATUS_LABELS).map(([value, label]) => ({ value, label }));

function StageCard({
  stage,
  isActive,
  isLocked,
  onUpdateStatus,
}: {
  stage: WorkflowStage;
  isActive: boolean;
  isLocked: boolean;
  onUpdateStatus: (stageId: string, status: WorkflowStage['status'], remarks?: string) => Promise<void>;
}) {
  const [remarks, setRemarks] = useState(stage.remarks || '');
  const [newStatus, setNewStatus] = useState(stage.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(stage.id, newStatus, remarks);
    setSaving(false);
  };

  return (
    <Card
      p="md"
      radius="md"
      style={{
        border: `2px solid ${isActive ? '#3B82F6' : stage.status === 'completed' ? '#22C55E' : '#E2E8F0'}`,
        opacity: isLocked ? 0.5 : 1,
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {isActive && (
        <Badge
          color="blue"
          size="xs"
          style={{ position: 'absolute', top: -8, left: 12 }}
        >
          Active
        </Badge>
      )}
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <ThemeIcon
            color={STAGE_STATUS_COLORS[stage.status]}
            variant="light"
            size="md"
            radius="xl"
          >
            {stage.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          </ThemeIcon>
          <Text fw={600} size="sm">{stage.name}</Text>
        </Group>
        <Badge color={STAGE_STATUS_COLORS[stage.status]} variant="light" size="sm">
          {STAGE_STATUS_LABELS[stage.status]}
        </Badge>
      </Group>

      {stage.assignedToName && (
        <Group gap="xs" mb="xs">
          <Avatar size="xs" color="blue" radius="xl">
            {stage.assignedToName.charAt(0)}
          </Avatar>
          <Text size="xs" c="dimmed">{stage.assignedToName}</Text>
        </Group>
      )}

      {stage.dueDate && (
        <Text size="xs" c="dimmed" mb="sm">
          Due: {dayjs(stage.dueDate).format('MMM D, YYYY')}
        </Text>
      )}

      {!isLocked && (
        <Stack gap="xs" mt="sm">
          <Textarea
            size="xs"
            placeholder="Add remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
          />
          <Group gap="xs">
            <Select
              size="xs"
              data={STATUS_OPTIONS}
              value={newStatus}
              onChange={(v) => setNewStatus((v || stage.status) as WorkflowStage['status'])}
              style={{ flex: 1 }}
            />
            <Button size="xs" loading={saving} onClick={handleSave} disabled={newStatus === stage.status && remarks === stage.remarks}>
              Save
            </Button>
          </Group>
        </Stack>
      )}

      {isLocked && (
        <Group gap="xs" mt="xs">
          <AlertCircle size={12} color="#94A3B8" />
          <Text size="xs" c="dimmed">Complete previous stage to unlock</Text>
        </Group>
      )}

      {stage.completedAt && (
        <Text size="xs" c="green" mt="xs">
          ✓ Completed {dayjs(stage.completedAt).fromNow()}
        </Text>
      )}
    </Card>
  );
}

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    const [data, activityLogs] = await Promise.all([
      getAssignment(id as string),
      getActivityLogs(id as string),
    ]);
    setAssignment(data);
    setLogs(activityLogs);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleUpdateStage = async (
    stageId: string,
    status: WorkflowStage['status'],
    remarks?: string
  ) => {
    if (!assignment || !user || !profile) return;
    try {
      await updateStageStatus(assignment.id, stageId, status, remarks, user.uid, profile.displayName);
      notifications.show({ title: 'Stage updated', message: 'Progress saved successfully', color: 'green' });
      await loadData();
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to update stage', color: 'red' });
    }
  };

  if (loading) return <Center h={400}><Loader size="lg" /></Center>;
  if (!assignment) return <Center h={400}><Text>Assignment not found</Text></Center>;

  const isOverdue = dayjs(assignment.deadline).isBefore(dayjs()) && assignment.status === 'active';

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group>
        <Button
          component={Link}
          href="/assignments"
          variant="subtle"
          leftSection={<ArrowLeft size={14} />}
          color="gray"
          size="sm"
        >
          Assignments
        </Button>
      </Group>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* Title Card */}
          <Card p="lg" radius="md" shadow="sm" mb="md">
            <Group gap="sm" mb="md" wrap="wrap">
              <Badge color={ASSIGNMENT_TYPE_COLORS[assignment.type]} variant="filled">
                {ASSIGNMENT_TYPE_LABELS[assignment.type]}
              </Badge>
              <Badge color={PRIORITY_COLORS[assignment.priority]} variant="light">
                {assignment.priority} priority
              </Badge>
              {isOverdue && <Badge color="red" variant="filled">Overdue</Badge>}
              <Badge
                color={assignment.status === 'completed' ? 'green' : assignment.status === 'active' ? 'blue' : 'gray'}
                variant="outline"
              >
                {assignment.status}
              </Badge>
            </Group>

            <Title order={2} mb="xs" style={{ color: '#1A365D' }}>{assignment.title}</Title>

            {assignment.targetVenue && (
              <Text c="dimmed" size="sm" mb="md">📍 {assignment.targetVenue}</Text>
            )}

            <Text size="sm" c="gray.7" mb="lg">{assignment.description}</Text>

            {/* Progress */}
            <Box mb="md">
              <Group justify="space-between" mb={6}>
                <Text size="sm" fw={500} c="gray.7">
                  Overall Progress — Stage {assignment.currentStageIndex + 1} of {assignment.stages.length}
                </Text>
                <Text size="sm" fw={700} c="blue">{assignment.progressPercent}%</Text>
              </Group>
              <Progress
                value={assignment.progressPercent}
                color={assignment.progressPercent === 100 ? 'green' : isOverdue ? 'red' : 'blue'}
                size="lg"
                radius="xl"
                animated={assignment.progressPercent < 100 && !isOverdue}
              />
            </Box>

            {/* Tags */}
            {assignment.tags.length > 0 && (
              <Group gap="xs">
                <Tag size={14} color="#94A3B8" />
                {assignment.tags.map((tag) => (
                  <Badge key={tag} size="xs" variant="outline" color="gray">{tag}</Badge>
                ))}
              </Group>
            )}
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="workflow">
            <Tabs.List>
              <Tabs.Tab value="workflow" leftSection={<CheckCircle2 size={14} />}>Workflow</Tabs.Tab>
              <Tabs.Tab value="activity" leftSection={<Activity size={14} />}>Activity</Tabs.Tab>
              <Tabs.Tab value="links" leftSection={<Link2 size={14} />}>Links</Tabs.Tab>
            </Tabs.List>

            {/* Workflow Tab */}
            <Tabs.Panel value="workflow" pt="md">
              <Stack gap="sm">
                {assignment.stages.map((stage, index) => {
                  const isActive = index === assignment.currentStageIndex;
                  const isLocked = index > assignment.currentStageIndex &&
                    assignment.stages[index - 1]?.status !== 'completed';
                  return (
                    <Box key={stage.id} style={{ position: 'relative' }}>
                      {index < assignment.stages.length - 1 && (
                        <Box
                          style={{
                            position: 'absolute',
                            left: 20,
                            top: '100%',
                            width: 2,
                            height: 12,
                            background: stage.status === 'completed' ? '#22C55E' : '#E2E8F0',
                            zIndex: 1,
                          }}
                        />
                      )}
                      <StageCard
                        stage={stage}
                        isActive={isActive}
                        isLocked={isLocked}
                        onUpdateStatus={handleUpdateStage}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Tabs.Panel>

            {/* Activity Tab */}
            <Tabs.Panel value="activity" pt="md">
              {logs.length === 0 ? (
                <Center py="xl">
                  <Text c="dimmed" size="sm">No activity yet</Text>
                </Center>
              ) : (
                <Stack gap="sm">
                  {logs.map((log) => (
                    <Group key={log.id} gap="sm" align="flex-start">
                      <Avatar size="sm" color="blue" radius="xl">
                        {log.userName.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Group gap="xs">
                          <Text size="sm" fw={500}>{log.userName}</Text>
                          <Text size="xs" c="dimmed">{dayjs(log.createdAt).fromNow()}</Text>
                        </Group>
                        <Text size="sm" c="gray.7">{log.action}</Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              )}
            </Tabs.Panel>

            {/* Links Tab */}
            <Tabs.Panel value="links" pt="md">
              <Stack gap="md">
                {assignment.documentLinks.length > 0 && (
                  <Box>
                    <Text fw={600} size="sm" mb="sm">Documents</Text>
                    <Stack gap="xs">
                      {assignment.documentLinks.map((link, i) => (
                        <Anchor key={i} href={link} target="_blank" size="sm">
                          <Group gap="xs">
                            <FileText size={14} />
                            {link}
                          </Group>
                        </Anchor>
                      ))}
                    </Stack>
                  </Box>
                )}
                {assignment.referenceLinks.length > 0 && (
                  <Box>
                    <Text fw={600} size="sm" mb="sm">References</Text>
                    <Stack gap="xs">
                      {assignment.referenceLinks.map((link, i) => (
                        <Anchor key={i} href={link} target="_blank" size="sm">
                          <Group gap="xs">
                            <Link2 size={14} />
                            {link}
                          </Group>
                        </Anchor>
                      ))}
                    </Stack>
                  </Box>
                )}
                {assignment.documentLinks.length === 0 && assignment.referenceLinks.length === 0 && (
                  <Center py="xl">
                    <Text c="dimmed" size="sm">No links added</Text>
                  </Center>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>

        {/* Right Sidebar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Timeline */}
            <Card p="lg" radius="md" shadow="sm">
              <Title order={5} mb="md" c="gray.7">Timeline</Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Start Date</Text>
                  <Text size="sm" fw={500}>{dayjs(assignment.startDate).format('MMM D, YYYY')}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Deadline</Text>
                  <Text size="sm" fw={500} c={isOverdue ? 'red' : 'gray.8'}>
                    {dayjs(assignment.deadline).format('MMM D, YYYY')}
                  </Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Created</Text>
                  <Text size="sm" fw={500}>{dayjs(assignment.createdAt).format('MMM D, YYYY')}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Team */}
            <Card p="lg" radius="md" shadow="sm">
              <Group mb="md">
                <Users size={16} color="#64748B" />
                <Title order={5} c="gray.7">Team</Title>
              </Group>
              <Stack gap="sm">
                {assignment.teamMemberNames?.map((name, i) => (
                  <Group key={i} gap="sm">
                    <Avatar size="sm" color="blue" radius="xl">
                      {name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>{name}</Text>
                      {assignment.leadMemberName === name && (
                        <Badge size="xs" color="blue" variant="light">Lead</Badge>
                      )}
                    </Box>
                  </Group>
                ))}
                {!assignment.teamMemberNames?.length && (
                  <Text size="sm" c="dimmed">No team members assigned</Text>
                )}
              </Stack>
            </Card>

            {/* Stage Summary */}
            <Card p="lg" radius="md" shadow="sm">
              <Title order={5} mb="md" c="gray.7">Stage Summary</Title>
              <SimpleGrid cols={2}>
                {Object.entries(STAGE_STATUS_LABELS).map(([status, label]) => {
                  const count = assignment.stages.filter((s) => s.status === status).length;
                  return (
                    <Box key={status}>
                      <Text size="xl" fw={700} c={STAGE_STATUS_COLORS[status as keyof typeof STAGE_STATUS_COLORS]}>
                        {count}
                      </Text>
                      <Text size="xs" c="dimmed">{label}</Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
