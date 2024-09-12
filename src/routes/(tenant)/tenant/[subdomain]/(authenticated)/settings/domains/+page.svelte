<script lang="ts">
  import * as Card from "$lib/client/components/ui/card/index.js";
  import { Input } from "$lib/client/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { customDomainSchema } from "./schema.js";
  import * as Form from "$ui/form";
  import { LoaderCircle } from "lucide-svelte";
  import Separator from "$ui/separator/separator.svelte";
  import { Label } from "$ui/label/index.js";
  import { PUBLIC_DOMAIN } from "$env/static/public";
  import FormDescription from "$ui/form/form-description.svelte";
  import Badge from "$ui/badge/badge.svelte";

  export let data;
  const form = superForm(data.form, {
    validators: zod(customDomainSchema),
  });
  const { form: formData, message, enhance, delayed } = form;
</script>

<div class="grid gap-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Tenant Subdomain</Card.Title>
      <Card.Description>Your own subdomain.</Card.Description>
    </Card.Header>
    <Card.Content class="space-y-2">
      <Label>Tenant Subdomain</Label>
      <Input disabled value={data.domainInfo.subdomain + "." + PUBLIC_DOMAIN} />
    </Card.Content>
  </Card.Root>

  <form use:enhance method="post" action="?/setCustomDomain">
    <Card.Root>
      <Card.Header>
        <Card.Title>Custom Domain</Card.Title>
        <Card.Description>Your own custom domain.</Card.Description>
      </Card.Header>
      <Card.Content>
        {#if data.domainInfo.customDomain}
          <Form.Field {form} name="host">
            <Form.Control let:attrs>
              <Form.Label>Custom Domain</Form.Label>
              <Input {...attrs} disabled value={data.domainInfo.customDomain} />
            </Form.Control>
          </Form.Field>
        {:else}
          <Form.Field {form} name="host">
            <Form.Control let:attrs>
              <Form.Label>Custom Domain</Form.Label>
              <Input {...attrs} bind:value={$formData.host} />
            </Form.Control>
            <Form.FormDescription class="flex flex-col gap-2"
              >Change your custom domain's DNS
              <div>
                <Badge variant="secondary">CNAME</Badge>
                <Badge variant="secondary"
                  >{$formData.host || "<your custom domain>"}</Badge
                >
                <Badge variant="secondary">{PUBLIC_DOMAIN}</Badge>
              </div>
            </Form.FormDescription>
            <Form.FieldErrors />
          </Form.Field>
        {/if}
      </Card.Content>
      <Card.Footer class="border-t px-6 py-4 gap-2">
        <Form.Button
          disabled={Boolean(data.domainInfo.customDomain) || $delayed}
        >
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
