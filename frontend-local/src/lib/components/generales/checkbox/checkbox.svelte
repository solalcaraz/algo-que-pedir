<script lang="ts">

  import './checkbox.css'
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface PropsCheckbox extends HTMLInputAttributes {
    label?: string
    checked?: boolean
  }

  let { label, checked = $bindable(false), ...rest }: PropsCheckbox = $props()
</script>

<label>
  <input type="checkbox" bind:checked {...rest} />
  <span>{label}</span>
</label>