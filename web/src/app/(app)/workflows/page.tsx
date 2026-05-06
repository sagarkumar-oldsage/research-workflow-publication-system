'use client';

import {
  Stack, Title, Text, Box, Card, SimpleGrid, Badge, Group,
  ThemeIcon, Button,
} from '@mantine/core';
import { GitBranch, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { WORKFLOW_TEMPLATES, ASSIGNMENT_TYPE_LABELS, ASSIGNMENT_TYPE_COLORS } from '@/lib/constants';
import { AssignmentType } from '@/types';

export default function WorkflowsPage() {
  const types = Object.keys(WORKFLOW_TEMPLATES) as AssignmentType[];

  return (
    <Stack gap="xl">
      <Box>
        <Title order={2} c="gray.8">Workflow Templates</Title>
        <Text c="dimmed" size="sm">
          Pre-built stage workflows for each assignment type. Stages are automatically applied when you create an assignment.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {types.map((type) => {
          const stages = WORKFLOW_TEMPLATES[type];
          return (
            <Card key={type} p="lg" radius="md" shadow="sm" style={{ border: '1px solid #E2E8F0' }}>
              <Group mb="md" justify="space-between">
                <Badge color={ASSIGNMENT_TYPE_COLORS[type]} variant="filled" size="md">
                  {ASSIGNMENT_TYPE_LABELS[type]}
                </Badge>
                <Text size="xs" c="dimmed">{stages.length} stages</Text>
              </Group>

              <Stack gap={6}>
                {stages.map((stage, i) => (
                  <Group key={i} gap="xs">
                    <Box
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        border: '1.5px solid #3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text size="xs" fw={600} c="blue" style={{ lineHeight: 1 }}>{i + 1}</Text>
                    </Box>
                    <Text size="xs" c="gray.7">{stage.name}</Text>
                  </Group>
                ))}
              </Stack>

              <Button
                component={Link}
                href={`/assignments/new?type=${type}`}
                variant="light"
                size="xs"
                fullWidth
                mt="md"
                rightSection={<ChevronRight size={12} />}
              >
                Use This Workflow
              </Button>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
