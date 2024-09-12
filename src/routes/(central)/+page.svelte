<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Card from "$ui/card";
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import { PUBLIC_DOMAIN } from "$env/static/public";
  import { tenantCreationSchema } from "./schema.js";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";

  export let data;
  const form = superForm(data.form, { validators: zod(tenantCreationSchema) });
  const { form: formData, message, enhance, delayed } = form;
</script>

<Card.Root class="w-full max-w-lg mx-auto">
  <Card.Header>
    <Card.Title class="text-2xl">Create a tenant</Card.Title>
    <Card.Description>
      <p>Create your tenant with an isolated database</p>
      {#if $message}
        <p class="text-green-500">
          {$message.message} your domain is :
          <a href={$message.domain} class="underline" target="_blank"
            >{$message.domain}</a
          >
        </p>
      {/if}
    </Card.Description>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <form method="post" use:enhance>
      <Form.Field {form} name="tenantName">
        <Form.Control let:attrs>
          <Form.Label>Tenant Name</Form.Label>
          <Input {...attrs} bind:value={$formData.tenantName} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="subdomain">
        <Form.Control let:attrs>
          <Form.Label>Subdomain</Form.Label>
          <Input {...attrs} bind:value={$formData.subdomain} />
        </Form.Control>
        <Form.Description
          >Subdomain should only contain characters and hyphens {$formData.subdomain +
            "." +
            PUBLIC_DOMAIN}</Form.Description
        >
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label>Admin username</Form.Label>
          <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>
        <Form.Description
          >Your tenant's instance's admin username</Form.Description
        >
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>Admin password</Form.Label>
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
