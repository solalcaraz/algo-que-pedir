<script lang="ts">
  import './iconoBoton.css'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  interface PropsButton extends HTMLButtonAttributes {
    claseIcono?: string
    claseBoton?: string
    onclick: () => void
    children?: Snippet
    ariaLabel?: string
  }
  let {
    onclick,
    claseIcono = '',
    claseBoton = 'iconoBoton-basico',
    children,
    ...rest
  }: PropsButton = $props()
</script>

<button class={claseBoton} {onclick} type="button" {...rest}>
  {#if claseIcono}
    <div class={claseIcono}></div>
  {:else}
    {@render children?.()}
  {/if}
</button>
