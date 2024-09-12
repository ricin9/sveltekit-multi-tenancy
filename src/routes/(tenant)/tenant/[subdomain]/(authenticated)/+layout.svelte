<script>
  import { File } from "svelte-radix";
  import * as DropdownMenu from "$lib/client/components/ui/dropdown-menu/";
  import * as Sheet from "$lib/client/components/ui/sheet/";
  import { Button } from "$ui/button";
  import { CircleUser, Menu } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
  const { user } = data;

  const routes = [
    {
      name: "Tasks",
      href: "/tasks",
      adminOnly: false,
    },
    {
      name: "Settings",
      href: "/settings",
      adminOnly: true,
    },
  ];
</script>

<div class="flex min-h-screen w-full flex-col">
  <header
    class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6"
  >
    <nav
      class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
    >
      <a
        href="##"
        class="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <File class="h-6 w-6" />
        <span class="sr-only">Miloudi Multi Tenancy example</span>
      </a>

      {#each routes as route}
        {#if route.adminOnly === false || user.role === "admin"}
          <a
            href={route.href}
            class={($page.url.pathname.startsWith(route.href)
              ? "text-foreground"
              : "text-muted-foreground") +
              " hover:text-foreground transition-colors"}
          >
            {route.name}
          </a>
        {/if}
      {/each}
    </nav>
    <Sheet.Root>
      <Sheet.Trigger asChild let:builder>
        <Button
          variant="outline"
          size="icon"
          class="shrink-0 md:hidden"
          builders={[builder]}
        >
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <nav class="grid gap-6 text-lg font-medium">
          <a href="##" class="flex items-center gap-2 text-lg font-semibold">
            <File class="h-6 w-6" />
            <span class="sr-only">Miloudi Multi Tenancy Demo</span>
          </a>
          {#each routes as route}
            {#if route.adminOnly === false || user.role === "admin"}
              <a
                href={route.href}
                class={($page.url.pathname.startsWith(route.href)
                  ? "text-foreground"
                  : "text-muted-foreground") + " hover:text-foreground "}
              >
                {route.name}
              </a>
            {/if}
          {/each}
        </nav>
      </Sheet.Content>
    </Sheet.Root>
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div class="ml-auto flex-1 sm:flex-initial"></div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="secondary"
            size="icon"
            class="rounded-full"
          >
            <CircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <!-- <DropdownMenu.Separator />
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Item>Support</DropdownMenu.Item> -->
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            on:click={async () => {
              await fetch("/logout");
              goto("/login");
            }}>Logout</DropdownMenu.Item
          >
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </header>
  <main
    class="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
  >
    <slot />
  </main>
</div>
