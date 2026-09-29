<script lang="ts">
  import { REST_SERVER_URL } from '$lib/services/configuration'
  import './pedidoRow.css'
  import type { PlatoConCantidad } from '$lib/dto/detalleDTO'
  interface Props {
    item: PlatoConCantidad
  }

  let { item }: Props = $props()

  const imagenCompleta = `${REST_SERVER_URL}/${item.imagenUrl}`
</script>

<tr>
  <td class="plato-detalle">
    <img src={imagenCompleta} class="icono" alt={item.nombre} />
    <div>
      <span class="texto-principal">{item.nombre}</span><br />
      <span class="texto-secundario">{item.descripcion}</span>
    </div>
  </td>
  <td>{item.cantidad}</td>
  <td>${item.precio.toFixed(2)}</td>
</tr>
