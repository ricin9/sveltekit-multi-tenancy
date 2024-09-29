<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Form from "$ui/form";
  import { Input } from "$ui/input";
  import { PUBLIC_DOMAIN } from "$env/static/public";
  import { tenantCreationSchema } from "./schema.js";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import { Separator } from "$ui/separator/index.js";
  import Label from "$ui/label/label.svelte";

  export let data;
  const form = superForm(data.form, { validators: zod(tenantCreationSchema) });
  const { form: formData, message, enhance, delayed } = form;
</script>

<div class="text-center">
  {#if $message}
    <p class="text-green-500">
      {$message.message} your domain is :
      <a href={$message.domain} class="underline" target="_blank"
        >{$message.domain}</a
      >
    </p>
  {/if}

  <form method="post" use:enhance>
    <Form.Field {form} name="tenantName">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          placeholder="Tenant Name"
          bind:value={$formData.tenantName}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="subdomain">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          placeholder="Subdomain"
          bind:value={$formData.subdomain}
        />
      </Form.Control>
      <Form.Description
        >Subdomain should only contain characters and hyphens <br
        />{$formData.subdomain + "." + PUBLIC_DOMAIN}</Form.Description
      >
      <Form.FieldErrors />
    </Form.Field>

    <Separator class="my-3" />

    <div class="mb-3">
      <Label>Admin Account</Label>
    </div>
    <Form.Field {form} name="username">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          placeholder="Admin Username"
          bind:value={$formData.username}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          placeholder="Admin Password"
          bind:value={$formData.password}
          type="password"
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="mt-2 w-full" disabled={$delayed}>
      {#if $delayed}<LoaderCircle
          class="mr-2 h-4 w-4 animate-spin"
        />{/if}Submit</Form.Button
    >
  </form>
</div>
