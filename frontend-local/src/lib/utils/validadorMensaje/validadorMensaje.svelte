<script lang="ts">
  import './validadorMensaje.css'

  type VistaModelo = {
    tieneError: (_: string) => boolean
    mensajesError: (_: string) => string
  }

  type ValidadorProps = {
    elemento: VistaModelo
    atributo: string
  }

  let { elemento, atributo }: ValidadorProps = $props()
</script>

{#if elemento.tieneError(atributo)}
  <div class="validacion-fila">
    <div data-testid={`errorMessage-${atributo}`}>
      {elemento.mensajesError(atributo)}
    </div>
  </div>
{/if}