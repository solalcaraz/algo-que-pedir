<script lang="ts">
  import '$lib/components/layout/header/header.css'
  import '$lib/components/generales/boton/boton.css'
  import { page } from '$app/state'

  import logoUrl from '$lib/assets/logo.svg'
  import carrito from '$lib/assets/carrito.svg'
  import menu from '$lib/assets/menu.svg'
  import ingredientes from '$lib/assets/ingredientes.svg'
  import usuarioIcono from '$lib/assets/usuario.svg'
  import usuarioInfo from '$lib/assets/usuario-chica.svg'

  import MenuHamburguesa from '$lib/components/generales/menu hamburguesa/hamburguesa.svelte'

  const urls = [
    { href: '/', icono: carrito, label: 'Pedidos', alias: ['/'] },
    { href: '/menu', icono: menu, label: 'Menú', alias: ['/menu', '/editar-plato'] },
    { href: '/ingrediente', icono: ingredientes, label: 'Ingredientes', alias: ['/ingrediente','/editar-ingrediente'] },
    { href: '/perfil-local', icono: usuarioIcono, label: 'Cuenta', alias: ['/perfil-local'] }
  ]

const paginaActiva = () => {
  const rutaActual = page.url.pathname

  const matcheaAlguna = (rutas: string[]) =>
    rutas.some((ruta) =>
      ruta === '/'
        ? rutaActual === '/'
        : rutaActual === ruta || rutaActual.startsWith(ruta + '/')
    )

  return urls.find((rutaParaAnalizar) => matcheaAlguna(rutaParaAnalizar.alias)) ?? urls[0]
}
</script>

<header class="header-pagina">
  <nav class="barra-navegacion">
    <a href="/" class="container-logo">
      <img class="logo-app" src={logoUrl} alt="Algo que pedir" />
      <h4>Algo que Pedir</h4>
    </a>

    <ul class="ul-links">
      {#each urls as { href, icono, label } (href)}
        <li class="items-navegacion">
          <a class="links-navegacion" {href} aria-label={label}>
            <img
              class="iconos-navegacion"
              src={icono}
              alt="Links navegacion pagina"
              aria-hidden="true"
            />
            <span>{label}</span>
          </a>
        </li>
      {/each}
    </ul>

    <div class="container-usuario">
      <a class="vista-activa" href={paginaActiva().href}>{paginaActiva().label}</a>

      <MenuHamburguesa urlsNavegacion={urls} />

      <img class="usuario-logo" src={usuarioInfo} alt="Cuenta" />
    </div>
  </nav>
</header>
