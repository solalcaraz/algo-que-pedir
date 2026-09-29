<script>
  import Header from '$lib/components/layout/header/header.svelte'

  let { children } = $props()
</script>

<Header />
{@render children?.()}