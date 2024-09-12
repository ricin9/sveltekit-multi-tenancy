<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Avatar from "$lib/client/components/ui/avatar/index.js";
  import { Button } from "$lib/client/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/client/components/ui/dropdown-menu/index.js";
  import type { User } from "lucia";

  export let user: User;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      class="relative h-8 w-8 rounded-full"
    >
      <Avatar.Root class="h-9 w-9">
        <Avatar.Fallback>{user.username[0]}</Avatar.Fallback>
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="end">
    <DropdownMenu.Label class="font-normal">
      <div class="flex flex-col space-y-1">
        <p class="text-sm font-medium leading-none">{user.username}</p>
        <p class="text-muted-foreground text-xs leading-none">
          {user.role}
        </p>
      </div>
    </DropdownMenu.Label>
    <DropdownMenu.Separator />
    <!-- <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Billing
        <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Settings
        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>New Team</DropdownMenu.Item>
    </DropdownMenu.Group> -->
    <!-- <DropdownMenu.Separator /> -->
    <DropdownMenu.Item
      on:click={async () => {
        await fetch("/logout");
        goto("/login");
      }}>Log out</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
