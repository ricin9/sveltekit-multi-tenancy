<script lang="ts">
  import * as Card from "$lib/client/components/ui/card/index.js";

  import Button from "$ui/button/button.svelte";
</script>

<div class="grid gap-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Backup data</Card.Title>
      <Card.Description
        >Download your database dump (libsql/sqlite), you are free to inspect
        it.</Card.Description
      >
    </Card.Header>
    <Card.Content class="space-y-2">
      Thanks to the architecture of this app, each tenant has its own isolated
      database which makes it very easy to download your own data to back it up
      locally or some other place.
    </Card.Content>
    <Card.Footer class="border-t px-6 py-4">
      <Button
        ><a href="/settings/data/download-dump" download="dump.sql"
          >Download dump</a
        ></Button
      >
    </Card.Footer>
  </Card.Root>
</div>
