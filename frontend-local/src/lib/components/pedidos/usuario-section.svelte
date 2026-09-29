<script lang="ts">
  import iconoUsuario from '$lib/assets/pedido-user-icon.png'

  interface Props {
    nombre?: string
    username?: string
    avatar?: string
  }

  const {
    nombre,
    username,
    avatar = iconoUsuario
  }: Props = $props()
</script>

<section class="info-usuario">
  <img src={avatar} alt="Icono de usuario" class="icono-usuario-pedido" />
  <div class="nombre-usuario">
    <h4>{nombre}</h4>
    <p><b>usuario: </b> {username}</p>
  </div>
</section>
