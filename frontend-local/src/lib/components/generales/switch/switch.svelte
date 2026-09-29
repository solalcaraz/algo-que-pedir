<script lang="ts">
  import './switch.css'
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface PropsSwitch extends HTMLInputAttributes{
    id: string,
    titulo?: string,
    subtitulo?: string,
    checked?: boolean
  }
  let { id, titulo='', subtitulo='', checked=$bindable(false), ...rest }: PropsSwitch = $props()
</script>

<label class="switch switch-separacion" for="{id}">
    <span class="contenedor-texto">
        <span class="titulo-label"><b>{titulo}</b></span>
        <span class="subtitulo-label">{subtitulo}</span>
    </span>
    <input type="checkbox" id={id} bind:checked={checked} {...rest}>
    <span class="slider"></span>
</label>