<script lang="ts">
  import { EstadoDelPedido } from '$lib/models/estadosPedido'
  import './estadoBadge.css'

  type EstadoBadgeProps = {
    estado: EstadoDelPedido
  }

  let { estado }: EstadoBadgeProps = $props()

  const estadoColores: Record<EstadoDelPedido, string> = {
    [EstadoDelPedido.PENDIENTE]: '#ff9800', // Orange
    [EstadoDelPedido.PREPARADO]: '#2196f3', // Blue
    [EstadoDelPedido.ENTREGADO]: '#4caf50', // Green
    [EstadoDelPedido.CANCELADO]: '#f44336' // Red
  }

  const colorBadge = estadoColores[estado] || estadoColores[EstadoDelPedido.PENDIENTE]
</script>

<span class="estado-badge" style="background-color: {colorBadge}">
  {estado}
</span>
