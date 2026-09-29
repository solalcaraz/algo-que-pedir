<script lang="ts">
  import { onMount, onDestroy, type Snippet } from 'svelte'

  export let open: boolean
  export let onClose: () => void
  export let children: Snippet

  import './modal.css'

  // Cerrar modal con tecla "Esc"
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onClose()
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
    }
  })

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

</script>

{#if open}
  <div class="overlay" on:click={() => onClose()}>
    <div class="modal" on:click|stopPropagation>
      <button class="close-btn" on:click={onClose}>Cerrar</button>
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
{/if} -->
