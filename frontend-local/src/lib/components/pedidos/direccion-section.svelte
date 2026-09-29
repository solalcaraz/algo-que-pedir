<script lang="ts">
  import pinUbicacion from '$lib/assets/pin-ubicacion.svg'

  interface Props {
    direccion?: string
    latitud?: number
    longitud?: number
  }

  const { direccion, latitud, longitud }: Props = $props()
</script>

<section class="info-direccion">
  <img src={pinUbicacion} alt="icono de direccion" class="pin-ubicacion" />
  <div class="direccion-coordenadas">
    <h4>{direccion}</h4>
    <p>Lat: {latitud}, Long: {longitud}</p>
  </div>
</section>
