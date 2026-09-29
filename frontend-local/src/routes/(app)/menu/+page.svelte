<script lang='ts'>
  import { goto } from '$app/navigation'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import ItemMenu from '$lib/components/menu/ItemMenu.svelte'

  let { data } = $props()
  let platos = $derived(data.platos)

  const navegarANuevoPlato = () => {
    goto('./plato/')
  }
</script>

<main class="menu-container main-vista">
  <header class="boton-titulo">
      <h1>Gestión del Menú</h1>
        <Boton onclick={
          navegarANuevoPlato
        }>Agregar nuevo plato</Boton>
  </header>
  <section class="contenedor-general">
      <h2>Platos Disponibles</h2>
      <ul class="lista-menu">
        {#each platos as plato (plato.id)}
          <a href="./plato/{plato.id}">
            <ItemMenu {plato} />
          </a>
        {/each}
      </ul>
  </section>
</main>

<style>
  @import './menu.css';

  h2 {
    padding-bottom: 1rem;
  }
</style>
