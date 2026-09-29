<script lang="ts">
  import './input.css'
  import type { HTMLAttributes } from 'svelte/elements'

  interface PropsTextarea extends HTMLAttributes<HTMLElement> {
    nombre_label: string,
    id: string,
    value?: string,
    textarea?: boolean,
    select?: boolean,
    options?: {value: string, label: string}[] //array de opciones para el dropdown
    required?: boolean,
    disabled?: boolean
  }
  
  let { nombre_label, id, value=$bindable(''), required=true, textarea=false, select=false, options=[], ...rest }: PropsTextarea = $props()
</script>

<div class="label-input">
  <label for={id}>{nombre_label}</label>
  {#if textarea}
    <textarea class="textarea-descripcion" id={id} bind:value={value} {...rest}></textarea>
  {:else if select}
    <select {id} bind:value {required} {...rest}>
      {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {/if}
</div>