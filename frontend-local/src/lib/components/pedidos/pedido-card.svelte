<script lang="ts">
  import type { Pedido } from '$lib/models/pedido.svelte'
  import UsuarioSection from '$lib/components/pedidos/usuario-section.svelte'
  import DireccionSection from './direccion-section.svelte'

  import { iconoMedioPago } from '$lib/utils/medioPagoIcono'
  import { goto } from '$app/navigation'
  import { EstadoDelPedido } from '$lib/models/estadosPedido'
  
  interface Props {
    pedido: Pedido
    //intento de una callback prop: el comp padre (vista) le pasa una fx opcional a la card
    //para que le avise si sucede un evento (el cambio de estado, en este caso)
    cambioDeEstado?: (id: number, nuevoEstado: string) => void
  }

  const { pedido, cambioDeEstado }: Props = $props()

  // Redireccion al detalle del pedido, toma el id del pedido para armar la ruta
  const redireccionADetalle = () => goto(`/detalle-pedido/${pedido.id}`)

  //Me sirve para el label dinamico de los botones y asociar cuál es el siguiente estado
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
    e.stopPropagation()       //Detiene la propagacion del evento para que no se active un onclick del article
    e.preventDefault()
    const next = accion.next  //si la accion tiene un valor para el sig estado, llama a esa callback prop 
    if(!next){
      redireccionADetalle()   //si no, renderiza el boton para que veas el detalle
    }else{
      cambioDeEstado?.(pedido.id, next)
    }
  }
</script>

<article class="pedido-tarjeta contenedor-general" onclick={redireccionADetalle}>
  <!---->
  <!-- Tarjeta de pedido -->
  <header class="pedido-header">
    <p>Pedido #{pedido.id}</p>

    <!--Componente info de usuario-->
    <UsuarioSection nombre={pedido.cliente.nombre} username={pedido.cliente.username} />

    <p class="info-pedido">
      Hora: {pedido.hora} | Articulos: {pedido.items} | Total: ${pedido.precioTotal.toFixed(2)}
    </p>
  </header>

  <!--Componente info de direccion-->
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
