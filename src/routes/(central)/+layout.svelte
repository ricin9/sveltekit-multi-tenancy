<script>
  import Check from "svelte-radix/CheckCircled.svelte";
</script>

<!-- this does not need to be in +layout.svelte, this is just a wrapper around the tenant creation form -->
<!-- but since i only have the form in this side of router and i want to get this done fast -->
<!-- im putting it here instead of refactoring ./+page.svelte -->

<head>
  <title>Miloudi Multi Tenancy Demo</title>
</head>
<div
  class="container relative flex flex-col min-h-screen w-full lg:grid lg:grid-cols-2 lg:max-w-none lg:px-0"
>
  <div
    class="w-full px-4 py-8 flex items-center justify-center lg:p-8 order-1 lg:order-2"
  >
    <div
      class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
    >
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Create a tenant</h1>
        <p class="text-muted-foreground text-sm">
          Create your tenant with an isolated database
        </p>
      </div>
      <slot />
    </div>
  </div>

  <div
    class="bg-muted relative flex flex-col p-6 text-white lg:p-10 dark:border-r order-2 lg:order-1"
  >
    <div
      class="lg:absolute lg:inset-0 lg:bg-cover lg:bg-center hidden lg:block"
      style="
        background-image: url(https://images.unsplash.com/photo-1637946175491-53bca31c90ba?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
      "
    ></div>
    <div class="relative z-20 flex items-center text-lg font-medium mb-6">
      Miloudi Multi Tenancy Demo
    </div>
    <div class="relative z-20 space-y-6 mb-6">
      <h2 class="text-xl font-bold lg:text-2xl">Key Features:</h2>
      <ul class="space-y-3 text-sm">
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>Isolated Database:</strong> Each tenant gets their own database
            for data privacy.</span
          >
        </li>
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>Unique Subdomain:</strong> Every tenant has their own subdomain
            for easy access.</span
          >
        </li>
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>Custom Domains:</strong> Tenants can use their own domain names.</span
          >
        </li>
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>Automatic SSL:</strong> SSL certificates are auto-issued for
            all domains.</span
          >
        </li>
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>Data Portability:</strong> Tenants can download their database
            anytime.</span
          >
        </li>
        <li class="flex items-start">
          <Check class="mr-2 h-5 w-5 flex-shrink-0" />
          <span
            ><strong>User Management:</strong> Tenant admins can create users with
            tenant-specific access.</span
          >
        </li>
      </ul>
    </div>
  </div>
</div>
