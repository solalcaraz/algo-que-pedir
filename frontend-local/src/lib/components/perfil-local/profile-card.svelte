<script lang="ts">
  import type { Snippet } from 'svelte'

  const { title = '', children }: { title?: string, children?: Snippet } = $props()
  import './profile-card.css'
</script>

<section class="profile-card">
  {#if title}
    <h3>{title}</h3>
  {/if}

  <div class="card">
    {@render children?.()}
  </div>
</section>
