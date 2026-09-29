<script lang="ts">
  import type { Pedido } from '$lib/models/pedido.svelte'
  import UsuarioSection from '$lib/components/pedidos/usuario-section.svelte'
  import DireccionSection from './direccion-section.svelte'

  import { iconoMedioPago } from '$lib/utils/medioPagoIcono'
  import { goto } from '$app/navigation'
  import { EstadoDelPedido } from '$lib/models/estadosPedido'
  
  interface Props {
    pedido: Pedido
    cambioDeEstado?: (id: number, nuevoEstado: string) => void
  }

  const { pedido, cambioDeEstado }: Props = $props()

  const redireccionADetalle = () => goto(`/detalle-pedido/${pedido.id}`)

  const mapaSiguienteEstado: Record<string, { label: string; next?: string }> = {
    [EstadoDelPedido.PENDIENTE]: { label: 'Preparar',  next: 'PREPARADO' },
    [EstadoDelPedido.PREPARADO]: { label: 'Entregar',  next: 'ENTREGADO' },
    [EstadoDelPedido.ENTREGADO]: { label: 'Ver detalle' },
    [EstadoDelPedido.CANCELADO]: { label: 'Ver detalle' }
  }

  const accion = $derived(
    mapaSiguienteEstado[pedido.estadoPedido] ?? { label: 'Ver detalle' }
  )

  const manejoCambioEstado = (e: Event) => {
    // Sin esto, el click en el botón también dispara el onclick de la tarjeta y navega al detalle
    e.stopPropagation()
    e.preventDefault()
    const next = accion.next
    if(!next){
      redireccionADetalle()
    }else{
      cambioDeEstado?.(pedido.id!, next)
    }
  }
</script>

<article class="pedido-tarjeta contenedor-general" onclick={redireccionADetalle}>
  <header class="pedido-header">
    <p>Pedido #{pedido.id}</p>

    <UsuarioSection nombre={pedido.cliente.nombre} username={pedido.cliente.username} />

    <p class="info-pedido">
      Hora: {pedido.hora} | Articulos: {pedido.items} | Total: ${pedido.precioTotal.toFixed(2)}
    </p>
  </header>

  <DireccionSection
    direccion={pedido.direccion.direccion}
    latitud={pedido.direccion.latitud}
    longitud={pedido.direccion.longitud}
  />

  <footer class="pedido-footer">
    <div class="modo-pago">
      <img src={iconoMedioPago(pedido.medioDePago)} alt="modo de pago" class="icono-pago" />
      <p><b>Pago con {pedido.medioDePago}</b></p>
    </div>
  </footer>
  <button type="button" class="boton-primario boton-preparar" onclick={manejoCambioEstado}
    >{accion.label}</button
  >
</article>
