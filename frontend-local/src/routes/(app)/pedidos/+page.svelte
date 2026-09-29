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

  //Por default la vista arranca con el filtrado de los pedidos Pendientes
  let estadoActivo = $state<EstadoDelPedido>(data.estado ?? EstadoDelPedido.PENDIENTE)

  //Mantiene el filtrado si volves atras
  $effect(() => {
    if (data.estado) estadoActivo = data.estado
  })

  //Filtrado de los pedidos segun el estado activo
  const pedidosFiltrados = $derived<Pedido[]>(
    (data.pedidos ?? []).filter((it: Pedido) => it.estadoPedido === estadoActivo)
  )

  //Cambia el estado activo por el seleccionado tras el onclick
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
      buscarPedidos() //refresca si todo salio ok
      showToast(`Pedido #${id} actualizado a ${nuevoEstado.toLowerCase()}`, 'success')
    } catch (error: unknown) {
      showError('Error al actualizar el pedido.', error)
      await buscarPedidos()
    }
  }
</script>

<main class="container-principal main-vista">
  <!-- Contenedor de toda la vista -->
  <h1>Pedidos actuales</h1>

  <nav class="container-estados">
    <!-- Contenedor de los estados de los pedidos -->
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
    <!-- Contenedor de las tarjetas de pedidos -->
    <!-- Si esta vacia la lista filtrada va al else -->
    {#if pedidosFiltrados.length}
      {#each pedidosFiltrados as pedido (pedido.id)}
        <PedidoCard {pedido} cambioDeEstado={manejarCambioDeEstado} />
      {/each}
    {:else}
      <p class="estado-notfound">No se encontraron pedidos</p>
    {/if}
  </section>
</main>
