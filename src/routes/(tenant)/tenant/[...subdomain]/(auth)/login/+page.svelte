<script lang="ts">
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Card from "$ui/card";
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import { loginSchema } from "./schema.js";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";

  export let data;
  const form = superForm(data.form, { validators: zod(loginSchema) });
  const { form: formData, enhance, errors, delayed } = form;
</script>

<Card.Root class="w-full max-w-lg mx-auto">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>
      {#if $errors?._errors}
        <p class="text-red-500">{$errors?._errors.join(",")}</p>
      {/if}
      <p></p>
    </Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form method="post" use:enhance>
      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label>Username</Form.Label>
          <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>
        <Form.Description
          >Your tenant's instance's admin username</Form.Description
        >
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} bind:value={$formData.password} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button class="mt-2" disabled={$delayed}>
        {#if $delayed}<LoaderCircle
            class="mr-2 h-4 w-4 animate-spin"
          />{/if}Submit</Form.Button
      >
    </form>
  </Card.Content>
  <Card.Footer></Card.Footer>
</Card.Root>
