<script lang="ts">
  import './pedidos-actuales.css'
  import PedidoCard from '$lib/components/pedidos/pedido-card.svelte'
  import { pedidoService } from '$lib/services/pedidoService'
  import { Pedido } from '$lib/models/pedido.svelte'
  import { EstadoDelPedido, estadosLabelBoton } from '$lib/models/estadosPedido'
  import { goto, invalidate } from '$app/navigation'
  import { showToast } from '$lib/utils/toasts/toasts'
  import { showError } from '$lib/utils/errorHandler'

  let { data } = $props<{ data: { estado: EstadoDelPedido; pedidos: Pedido[] } }>()

  let estadoActivo = $state<EstadoDelPedido>(data.estado ?? EstadoDelPedido.PENDIENTE)

  // Al volver atrás cambia la URL pero no se remonta el componente: sincronizo el filtro con el estado cargado
  $effect(() => {
    if (data.estado) estadoActivo = data.estado
  })

  const pedidosFiltrados = $derived<Pedido[]>(
    (data.pedidos ?? []).filter((it: Pedido) => it.estadoPedido === estadoActivo)
  )

  const switchEstado = (nuevoEstado: EstadoDelPedido) => {
    estadoActivo = nuevoEstado
    goto(`/pedidos?estado=${nuevoEstado}`)
  }

  const buscarPedidos = async () => {
    await invalidate('pedidos:list')
  }

  const manejarCambioDeEstado = async (id: number, nuevoEstado: string) => {
    try {
      await pedidoService.actualizarEstado(id, nuevoEstado)
      buscarPedidos()
      showToast(`Pedido #${id} actualizado a ${nuevoEstado.toLowerCase()}`, 'success')
    } catch (error: unknown) {
      showError('Error al actualizar el pedido.', error)
      await buscarPedidos()
    }
  }
</script>

<main class="container-principal main-vista">
  <h1>Pedidos actuales</h1>

  <nav class="container-estados">
    {#each estadosLabelBoton as { estado, label } (label)}
      <button
        type="button"
        class="link-estados {estadoActivo === estado ? 'estado-activo' : ''}"
        onclick={() => switchEstado(estado)}
        >{label}
      </button>
    {/each}
  </nav>

  <section class="container-tarjetas">
    {#if pedidosFiltrados.length}
      {#each pedidosFiltrados as pedido (pedido.id)}
        <PedidoCard {pedido} cambioDeEstado={manejarCambioDeEstado} />
      {/each}
    {:else}
      <p class="estado-notfound">No se encontraron pedidos</p>
    {/if}
  </section>
</main>
