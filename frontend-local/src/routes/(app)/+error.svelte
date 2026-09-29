<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import errorImg  from '$lib/assets/errorImg.png'
  import Boton from '$lib/components/generales/boton/boton.svelte'
</script>
<div class="error-contenedor">
  <h1>Error: {page.status}</h1>
  <p>{page.error?.message ?? 'Error desconocido, contactese con el administrador de la página.'}</p>
  <img src={errorImg} alt="Imagen de error">
  <Boton onclick={() => goto('/')}>Ir al inicio</Boton>
</div>

<style>
  .error-contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }
  p {
    color: red;
  }
  img {
    max-width: 600px;
  }
</style>