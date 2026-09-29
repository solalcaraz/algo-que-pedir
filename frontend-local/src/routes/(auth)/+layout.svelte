<!-- No importar header, hacer componente aparte si se cree necesario -->
<script>
  import './login.css'
  let { children } = $props()
</script>

{@render children?.()}
