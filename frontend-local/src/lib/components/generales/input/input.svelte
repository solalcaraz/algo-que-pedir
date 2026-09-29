<script lang="ts">
  import './input.css'
  import type { HTMLInputAttributes } from 'svelte/elements'

  export type InputType = 'email' | 'file' | 'number' | 'password' | 'text'

  interface PropsInput extends HTMLInputAttributes {
    nombre_label: string,
    type: InputType,
    id: string,
    value?: File | number | string
  }
  
  let { nombre_label, type, id, value=$bindable(''), required=true, ...rest }: PropsInput = $props()
</script>

<div class="label-input">
  <label for={id}>{nombre_label}</label>
  <input {type} {id} bind:value={value} {...rest} {required}>
</div>