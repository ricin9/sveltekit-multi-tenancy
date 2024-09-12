<script lang="ts">
  import * as Card from "$lib/client/components/ui/card/index.js";
  import { Input } from "$lib/client/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { tenantNameSchema } from "./schema.js";
  import * as Form from "$ui/form";
  import { LoaderCircle } from "lucide-svelte";
  import Separator from "$ui/separator/separator.svelte";

  export let data;
  const form = superForm(data.form, { validators: zod(tenantNameSchema) });
  const { form: formData, message, enhance, delayed } = form;
</script>

<div class="grid gap-6">
  <form use:enhance method="post" action="?/changeTenantName">
    <Card.Root>
      <Card.Header>
        <Card.Title>Tenant Name</Card.Title>
        <Card.Description>Your business/company name.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form.Field {form} name="tenantName">
          <Form.Control let:attrs>
            <Form.Label>Tenant Name</Form.Label>
            <Input {...attrs} bind:value={$formData.tenantName} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Card.Content>
      <Card.Footer class="border-t px-6 py-4 gap-2">
        <Form.Button disabled={$delayed}>
          {#if $delayed}<LoaderCircle
              class="mr-2 h-4 w-4 animate-spin"
            />{/if}Save</Form.Button
        >
        {#if $message}
          <p class="text-green-600 text-sm">Updated.</p>
        {/if}
      </Card.Footer>
    </Card.Root>
  </form>
</div>
