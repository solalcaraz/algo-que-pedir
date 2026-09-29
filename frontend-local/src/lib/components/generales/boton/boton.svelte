<script lang="ts">
  import './boton.css'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  interface PropsButton extends HTMLButtonAttributes {
    tipo?: 'primario' | 'secundario'
    children: Snippet
  }
  const { tipo = 'primario', children, ...rest }: PropsButton = $props()
</script>

<button class={`boton-${tipo}`} {...rest}>
  {@render children()}
</button>