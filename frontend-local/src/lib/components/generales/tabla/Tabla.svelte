<script lang="ts">
  import './tablas.css'
  import type { Snippet } from 'svelte'
  import type { HTMLTableAttributes } from 'svelte/elements'

  interface PropsTabla extends HTMLTableAttributes {
    nombreColumnas: Snippet
    datosFilas: Snippet
    datosExtra?: Snippet
  }

  let { nombreColumnas, datosFilas, datosExtra }: PropsTabla = $props()
</script>

<section class="contenedor-tabla"> <!-- Sin este section no me pone los bordes -->
  <table>
    <thead>
      <tr>
        {@render nombreColumnas()}
      </tr>
    </thead>
    <tbody>
      {@render datosFilas()}
    </tbody>
    {#if datosExtra}  
      <tfoot>
        <tr>
          {@render datosExtra()}
        </tr>
      </tfoot>
    {/if}
  </table>
</section>