'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack, Title, Card, TextInput, Textarea, Select, MultiSelect,
  Button, Group, Grid, Text, Box, TagsInput, SimpleGrid,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createAssignment } from '@/services/assignmentService';
import { getAllUsers } from '@/services/userService';
import { AssignmentType, PriorityLevel, UserProfile } from '@/types';
import { ASSIGNMENT_TYPE_LABELS } from '@/lib/constants';

export default function NewAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const form = useForm({
    initialValues: {
      title: '',
      type: 'conference_paper' as AssignmentType,
      description: '',
      priority: 'medium' as PriorityLevel,
      startDate: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetVenue: '',
      teamMembers: [] as string[],
      leadMember: '',
      tags: [] as string[],
      referenceLinks: [] as string[],
      documentLinks: [] as string[],
    },
    validate: {
      title: (v) => (!v.trim() ? 'Title is required' : null),
      description: (v) => (!v.trim() ? 'Description is required' : null),
      leadMember: (v) => (!v ? 'Lead member is required' : null),
      deadline: (v, values) =>
        v <= values.startDate ? 'Deadline must be after start date' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!user) return;
    setLoading(true);
    try {
      const teamMemberNames = users
        .filter((u) => values.teamMembers.includes(u.uid))
        .map((u) => u.displayName);
      const lead = users.find((u) => u.uid === values.leadMember);

      const id = await createAssignment(
        {
          title: values.title,
          type: values.type,
          description: values.description,
          priority: values.priority,
          status: 'active',
          startDate: values.startDate.toISOString(),
          deadline: values.deadline.toISOString(),
          targetVenue: values.targetVenue,
          teamMembers: values.teamMembers,
          teamMemberNames,
          leadMember: values.leadMember,
          leadMemberName: lead?.displayName,
          tags: values.tags,
          referenceLinks: values.referenceLinks,
          documentLinks: values.documentLinks,
          createdBy: user.uid,
        },
        user.uid
      );
      notifications.show({ title: 'Assignment created!', message: 'Workflow has been set up', color: 'green' });
      router.push(`/assignments/${id}`);
    } catch (err) {
      notifications.show({ title: 'Error', message: 'Failed to create assignment', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map((u) => ({ value: u.uid, label: u.displayName }));

  const typeOptions = Object.entries(ASSIGNMENT_TYPE_LABELS).map(([value, label]) => ({
    value, label,
  }));

  return (
    <Stack gap="xl">
      <Group>
        <Button component={Link} href="/assignments" variant="subtle" leftSection={<ArrowLeft size={14} />} color="gray">
          Back
        </Button>
        <Box>
          <Title order={2} c="gray.8">Create New Assignment</Title>
          <Text c="dimmed" size="sm">Fill in the details to start tracking your research work</Text>
        </Box>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              {/* Basic Info */}
              <Card p="lg" radius="md" shadow="sm">
                <Title order={4} mb="md" c="gray.7">Basic Information</Title>
                <Stack gap="md">
                  <TextInput
                    label="Assignment Title"
                    placeholder="e.g. Deep Learning for Medical Image Segmentation"
                    required
                    {...form.getInputProps('title')}
                  />
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Select
                        label="Assignment Type"
                        data={typeOptions}
                        required
                        {...form.getInputProps('type')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Select
                        label="Priority Level"
                        data={[
                          { value: 'critical', label: '🔴 Critical' },
                          { value: 'high', label: '🟠 High' },
                          { value: 'medium', label: '🟡 Medium' },
                          { value: 'low', label: '🟢 Low' },
                        ]}
                        {...form.getInputProps('priority')}
                      />
                    </Grid.Col>
                  </Grid>
                  <Textarea
                    label="Description"
                    placeholder="Describe the research work, objectives, and expected outcomes..."
                    rows={4}
                    required
                    {...form.getInputProps('description')}
                  />
                  <TextInput
                    label="Target Conference / Journal / Publisher"
                    placeholder="e.g. IEEE CVPR 2025, Nature Medicine"
                    {...form.getInputProps('targetVenue')}
                  />
                </Stack>
              </Card>

              {/* Timeline */}
              <Card p="lg" radius="md" shadow="sm">
                <Title order={4} mb="md" c="gray.7">Timeline</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <DatePickerInput
                    label="Start Date"
                    required
                    value={form.values.startDate}
                    onChange={(d) => form.setFieldValue('startDate', d || new Date())}
                    error={form.errors.startDate}
                  />
                  <DatePickerInput
                    label="Deadline"
                    required
                    value={form.values.deadline}
                    onChange={(d) => form.setFieldValue('deadline', d || new Date())}
                    error={form.errors.deadline}
                    minDate={form.values.startDate}
                  />
                </SimpleGrid>
              </Card>

              {/* Links */}
              <Card p="lg" radius="md" shadow="sm">
                <Title order={4} mb="md" c="gray.7">Links & Resources</Title>
                <Stack gap="md">
                  <TagsInput
                    label="Document Links"
                    description="Add Google Drive, Overleaf, GitHub links (press Enter after each)"
                    placeholder="https://docs.google.com/..."
                    value={form.values.documentLinks}
                    onChange={(v) => form.setFieldValue('documentLinks', v)}
                  />
                  <TagsInput
                    label="Reference Links"
                    description="Add reference papers or resources"
                    placeholder="https://arxiv.org/..."
                    value={form.values.referenceLinks}
                    onChange={(v) => form.setFieldValue('referenceLinks', v)}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Right Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Card p="lg" radius="md" shadow="sm">
                <Title order={4} mb="md" c="gray.7">Team Assignment</Title>
                <Stack gap="md">
                  <MultiSelect
                    label="Team Members"
                    data={userOptions}
                    placeholder="Select team members"
                    searchable
                    {...form.getInputProps('teamMembers')}
                  />
                  <Select
                    label="Lead Member"
                    data={userOptions.filter((u) => form.values.teamMembers.includes(u.value))}
                    placeholder="Select lead"
                    required
                    {...form.getInputProps('leadMember')}
                  />
                </Stack>
              </Card>

              <Card p="lg" radius="md" shadow="sm">
                <Title order={4} mb="md" c="gray.7">Tags & Keywords</Title>
                <TagsInput
                  label="Tags"
                  placeholder="deep learning, computer vision..."
                  value={form.values.tags}
                  onChange={(v) => form.setFieldValue('tags', v)}
                />
              </Card>

              <Card p="lg" radius="md" shadow="sm">
                <Title order={5} mb="sm" c="gray.7">Workflow Preview</Title>
                <Text size="xs" c="dimmed">
                  A workflow with stages will be auto-generated based on the assignment type you selected.
                </Text>
                <Text size="xs" c="blue" mt="xs" fw={500}>
                  {(ASSIGNMENT_TYPE_LABELS[form.values.type])} workflow will be applied.
                </Text>
              </Card>

              <Button
                type="submit"
                loading={loading}
                size="md"
                leftSection={<Save size={16} />}
                fullWidth
              >
                Create Assignment
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
    </Stack>
  );
}
