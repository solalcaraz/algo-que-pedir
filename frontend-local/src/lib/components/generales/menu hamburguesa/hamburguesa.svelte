<script lang="ts">
  import './hamburguesa.css'
  import hamburguesa from '$lib/assets/hamburguesa-menu.svg'

  let { urlsNavegacion = [] as Array<{ href: string; icono: string; label: string }> } = $props()

  let estadoMenu = $state(false) //El menu arranca cerrado

  //Cierra/Abre el menu
  const toggleMenu = () => {
    estadoMenu = !estadoMenu
  }
</script>

<section class="hamburguesa-container">
  <button class="hamburguesa" aria-haspopup="menu" aria-expanded={estadoMenu} onclick={toggleMenu}>
    <img class="hamburguesa-icono" src={hamburguesa} alt="Menu desplegable" />
  </button>

  {#if estadoMenu}
    <ul class="tablet-dropdown" role="menu">
      {#each urlsNavegacion as { href, label } (href)}
        <li role="none">
          <a {href} class="dropdown-item" role="menuitem" onclick={toggleMenu}>
            <span>{label}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>
