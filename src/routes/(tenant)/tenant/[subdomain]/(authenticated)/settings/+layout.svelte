<script lang="ts">
  import { page } from "$app/stores";

  const routes = [
    {
      name: "General",
      href: "/settings/general",
    },
    {
      name: "Domains",
      href: "/settings/domains",
    },
    { name: "Users", href: "/settings/users" },
    { name: "Data", href: "/settings/data" },
  ];
</script>

<div class="mx-auto grid w-full max-w-6xl gap-2">
  <h1 class="text-3xl font-semibold">Settings</h1>
</div>
<div
  class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
>
  <nav
    class="text-muted-foreground grid gap-4 text-sm"
    data-x-chunk-container="chunk-container after:right-0"
  >
    {#each routes as route}
      <a
        href={route.href}
        class={$page.url.pathname.startsWith(route.href)
          ? "text-primary font-semibold"
          : ""}
      >
        {route.name}
      </a>
    {/each}
  </nav>

  <slot />
</div>
