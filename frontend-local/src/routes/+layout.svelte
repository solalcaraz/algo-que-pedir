<script lang="ts">
  import './general.css'
  import Logo from '$lib/assets/logo.svg'
  import Toast from '$lib/utils/toasts/Toast.svelte'

  let { children } = $props()
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Nata+Sans:wght@100..900&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href={Logo} />
</svelte:head>
<Toast />

{@render children()}
