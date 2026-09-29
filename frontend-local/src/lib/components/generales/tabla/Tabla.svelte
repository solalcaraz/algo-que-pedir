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

<!-- Sin este section la tabla no muestra los bordes -->
<section class="contenedor-tabla">
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