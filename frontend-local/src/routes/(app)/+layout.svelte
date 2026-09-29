<script>
  import Header from '$lib/components/layout/header/Header.svelte'

  let { children } = $props()
</script>

<Header />
{@render children?.()}