<script lang="ts">
  import * as Dialog from "$lib/client/components/ui/dialog";
  import { Button } from "$ui/button";
  import {
    createTaskSchema,
    type CreateTask,
    type Task,
  } from "../(data)/schemas";
  import * as Form from "$ui/form";
  import { superForm, type SuperForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { Input } from "$ui/input";
  import * as Select from "$ui/select/index.js";
  import { labels, priorities, statuses } from "../(data)/data";
  import { PlusCircled } from "svelte-radix";
  import { LoaderCircle } from "lucide-svelte";
  import { tasks } from "../tasksStore";

  export let data;

  const form = superForm(data.form, {
    validators: zod(createTaskSchema),
    onUpdate({ form }) {
      if (form.message && form.message.task) {
        const task = form.message.task[0];
        task.createdBy = { id: data.user.id, username: data.user.username };
        $tasks = [...$tasks, form.message.task[0]];
      }
    },
  }) as SuperForm<CreateTask>;
  const { form: formData, message, enhance, delayed } = form;

  $: selectedLabel = $formData.label
    ? {
        label:
          labels.find((l) => l.value === $formData.label)?.label ||
          $formData.label,
        value: $formData.label,
      }
    : undefined;

  $: selectedStatus = $formData.status
    ? {
        label:
          statuses.find((l) => l.value === $formData.status)?.label ||
          $formData.status,
        value: $formData.status,
      }
    : undefined;

  $: selectedPriority = $formData.priority
    ? {
        label:
          priorities.find((l) => l.value === $formData.priority)?.label ||
          $formData.priority,
        value: $formData.priority,
      }
    : undefined;
</script>

<Dialog.Root>
  <Dialog.Trigger let:builder
    ><Button
      variant="outline"
      size="sm"
      class="ml-auto hidden h-8 lg:flex"
      builders={[builder]}
      ><PlusCircled class="mr-2 h-4 w-4" /> Create Task</Button
    ></Dialog.Trigger
  >
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create a new task</Dialog.Title>
      <Dialog.Description>
        Fill in the form below to create a new task.
        {#if $message}
          <p class="text-green-500">
            Your task has been created successfully. You can continue to create
            other tasks below.
          </p>
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    <form method="post" use:enhance>
      <Form.Field {form} name="title">
        <Form.Control let:attrs>
          <Form.Label>Title</Form.Label>
          <Input {...attrs} bind:value={$formData.title} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="label">
        <Form.Control let:attrs>
          <Form.Label>Label</Form.Label>
          <Select.Root
            selected={selectedLabel}
            onSelectedChange={(v) => {
              v && ($formData.label = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select task's label" />
            </Select.Trigger>
            <Select.Content>
              {#each labels as label}
                <Select.Item value={label.value} label={label.label} />
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.label} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="status">
        <Form.Control let:attrs>
          <Form.Label>Status</Form.Label>
          <Select.Root
            selected={selectedStatus}
            onSelectedChange={(v) => {
              v && ($formData.status = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select task's status" />
            </Select.Trigger>
            <Select.Content>
              {#each statuses as status}
                <Select.Item value={status.value} label={status.label} />
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.status} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="priority">
        <Form.Control let:attrs>
          <Form.Label>Priority</Form.Label>
          <Select.Root
            selected={selectedPriority}
            onSelectedChange={(v) => {
              v && ($formData.priority = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select task's priority" />
            </Select.Trigger>
            <Select.Content>
              {#each priorities as priority}
                <Select.Item value={priority.value} label={priority.label} />
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.priority} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button class="mt-2  w-full" disabled={$delayed}>
        {#if $delayed}<LoaderCircle
            class="mr-2 h-4 w-4 animate-spin"
          />{/if}Save Task</Form.Button
      >
    </form>
  </Dialog.Content>
</Dialog.Root>
