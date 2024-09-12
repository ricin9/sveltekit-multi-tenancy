<script lang="ts">
  export let value: string;

  const time = new Date(value + "Z").toLocaleTimeString(undefined, {
    timeStyle: "short",
  });
  const date = new Date(value + "Z").toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
</script>

{#if value}
  <div class="flex flex-col items-center">
    <div>{date}</div>
    <div class="text-xs">{time}</div>
  </div>
{/if}
