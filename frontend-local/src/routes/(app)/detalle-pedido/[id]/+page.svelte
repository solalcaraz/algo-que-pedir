<script lang="ts">
  import './detalle-pedido.css'
  import { iconoMedioPago } from '$lib/utils/medioPagoIcono'
  import type { PedidoDetalleDTO } from '$lib/dto/detalleDTO'

  import { MedioDePago, medioPagoDesdeBack } from '$lib/models/metodosDePago.svelte'
  import { EstadoDelPedido } from '$lib/models/estadosPedido'

  import type { PlatoConCantidad } from '$lib/dto/detalleDTO'

  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import PedidoRow from '$lib/components/detalle-pedido/pedidoRow.svelte'
  import EstadoBadge from '$lib/components/detalle-pedido/estadoBadge.svelte'
  import UsuarioSection from '$lib/components/pedidos/usuario-section.svelte'
  import DireccionSection from '$lib/components/pedidos/direccion-section.svelte'

  interface Props {
    data: PedidoDetalleDTO
  }

  let { data }: Props = $props()

  //Agrego esta linea que llama a la fx medioPagoDesdeBack que recibe un string y lo matchea con el
  //valor correspondiente del Enum del fron. De esa manera renderiza bien el valor en texto y el icono
  const medioDePagoEnum: MedioDePago = medioPagoDesdeBack(data.medioDePago)

  const platosAgrupados = $derived(
    data.platos.reduce((acum: PlatoConCantidad[], plato) => {
      const existingPlato = acum.find((p) => p.id === plato.id)
      if (existingPlato) {
        existingPlato.cantidad++
        return acum
      }
      return [...acum, { ...plato, cantidad: 1 }]
    }, [])
  )

  function volver() {
    history.back()
  }
</script>

<main class="main-vista">
  <section class="contenedor-estado">
    <h1>Pedido #{data.id}</h1>
    <div>
      <h2>Estado del Pedido</h2>
      <EstadoBadge estado={data.estado as EstadoDelPedido} />
    </div>
  </section>

  <section class="contenedor-general contenedor-info">
    <div class="cliente-info">
      <h2>Cliente</h2>
      <UsuarioSection nombre={data.cliente.nombre} username={data.cliente.username} />
    </div>
    <div class="cliente-info">
      <h2>Dirección de entrega</h2>
      <DireccionSection
        direccion={data.direccion.direccion}
        latitud={data.direccion.latitud}
        longitud={data.direccion.longitud}
      />
    </div>
  </section>

  <section class="contenedor-general">
    <h2>Resumen del Pedido</h2>
    <Tabla>
      {#snippet nombreColumnas()}
        <th>Plato</th>
        <th>Cantidad</th>
        <th>Precio</th>
      {/snippet}
      {#snippet datosFilas()}
        {#each platosAgrupados as plato (plato.id)}
          <PedidoRow item={plato} />
        {/each}
      {/snippet}
    </Tabla>
  </section>

  <section class="contenedor-general">
    <div class="contenedor-tabla-pago">
      <h3>Pago</h3>
      <dl class="tabla-pago">
        <dt>Subtotal</dt>
        <dd>${data.subtotal.toFixed(2)}</dd>
        <dt>Comisión del delivery</dt>
        <dd>${data.comisionDelivery.toFixed(2)}</dd>
        {#if data.incrementoPago > 0}
          <dt>Incremento por tipo de pago</dt>
          <dd>${data.incrementoPago.toFixed(2)}</dd>
        {/if}
        <dt class="total-label">Total</dt>
        <dd class="total-amount">${data.total.toFixed(2)}</dd>
      </dl>
      <h3>Método de Pago</h3>
      <div class="metodo-pago">
        <img src={iconoMedioPago(medioDePagoEnum)} class="icono" alt="Método de pago" />
        <p>Pago con {medioDePagoEnum}</p>
      </div>
    </div>
  </section>

  <div class="boton-volver">
    <Boton tipo="primario" onclick={volver}>Volver</Boton>
  </div>
</main>
