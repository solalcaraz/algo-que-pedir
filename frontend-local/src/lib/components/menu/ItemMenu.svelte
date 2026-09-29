<script lang="ts">
  import type { Plato } from '$lib/types'

  type ItemMenuProps = {
    plato: Plato
  }

  let { plato }: ItemMenuProps = $props()
</script>

<li class="item-menu">
  <figure class="detalles-menu" data-testid={`plato-${plato.id}`}>
    <img src={plato.imagenUrlCompleta} class="imagen-menu" alt="Imagen del plato {plato.nombre}" />
    <figcaption>
      <p>{plato.nombre}</p>
      <p class="descripcion-plato">{plato.descripcion}</p>
    </figcaption>
  </figure>
  <div class="precio-menu">
    <span>${plato.valorBase.toFixed(2)}</span>
  </div>
</li>

<style>
  @import './item-menu.css';
</style>
