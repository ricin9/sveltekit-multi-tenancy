<script lang="ts">
  import * as Card from "$lib/client/components/ui/card/index.js";
  import { Input } from "$lib/client/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { createUserSchema } from "./schema.js";
  import * as Form from "$ui/form";
  import { LoaderCircle } from "lucide-svelte";
  import * as RadioGroup from "$lib/client/components/ui/radio-group";

  export let data;
  const form = superForm(data.form, { validators: zod(createUserSchema) });
  const { form: formData, message, enhance, delayed } = form;
</script>

<div class="grid gap-6">
  <form use:enhance method="post" action="?/createUser">
    <Card.Root>
      <Card.Header>
        <Card.Title>Create User</Card.Title>
        <Card.Description
          >Create user for this tenant, this user will not be able to access
          other tenants</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <Form.Field {form} name="username">
          <Form.Control let:attrs>
            <Form.Label>Username</Form.Label>
            <Input {...attrs} bind:value={$formData.username} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Form.Label>User password</Form.Label>
            <Input {...attrs} bind:value={$formData.password} type="password" />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Fieldset {form} name="role" class="space-y-3">
          <Form.Legend>User Role</Form.Legend>
          <RadioGroup.Root
            bind:value={$formData.role}
            class="flex flex-col space-y-1"
          >
            <div class="flex items-center space-x-3 space-y-0">
              <Form.Control let:attrs>
                <RadioGroup.Item value="normal" {...attrs} />
                <Form.Label class="font-normal">Normal</Form.Label>
              </Form.Control>
            </div>
            <div class="flex items-center space-x-3 space-y-0">
              <Form.Control let:attrs>
                <RadioGroup.Item value="admin" {...attrs} />
                <Form.Label class="font-normal">Administrator</Form.Label>
              </Form.Control>
            </div>
            <RadioGroup.Input name="role" />
          </RadioGroup.Root>
          <Form.FieldErrors />
        </Form.Fieldset>
      </Card.Content>
      <Card.Footer class="border-t px-6 py-4 gap-2">
        <Form.Button disabled={$delayed}>
          {#if $delayed}<LoaderCircle
              class="mr-2 h-4 w-4 animate-spin"
            />{/if}Save</Form.Button
        >
        {#if $message}
          <p class="text-green-600 text-sm">{$message}</p>
        {/if}
      </Card.Footer>
    </Card.Root>
  </form>
</div>
