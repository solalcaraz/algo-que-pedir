<script lang="ts">
  import { error } from '@sveltejs/kit'
  import type { LocalDTO } from '$lib/dto/localDTO'
  import { showToast } from '$lib/utils/toasts/toasts'
  import { Local } from '$lib/models/local.svelte.js'
  import { showError } from '$lib/utils/errorHandler.js'
  import { updateLocal } from '$lib/services/localService.js'
  import PropsButton from '$lib/components/generales/boton/boton.svelte'
  import Checkbox from '$lib/components/generales/checkbox/checkbox.svelte'
  import ProfileCard from '$lib/components/perfil-local/profile-card.svelte'
  import ValidadorMensaje from '$lib/utils/validadorMensaje/validadorMensaje.svelte'
  import type { MetodoDePago } from '$lib/models/metodosDePago.svelte.js'

  // Traemos la data que viene del backend y la asignamos al local que vamos a renderizar
  let { data } = $props()

  let local = new Local()

  local.idLocal = data.localDataBackend.idLocal
  local.nombreLocal = data.localDataBackend.nombre
  local.urlImagen = data.localDataBackend.urlImagenLocal
  local.direccion = data.localDataBackend.direccion
  local.altura = data.localDataBackend.altura
  local.latitud = data.localDataBackend.latitud
  local.longitud = data.localDataBackend.longitud
  local.porcentajeApp = data.localDataBackend.porcentajeSobreCadaPlato
  local.porcentajeAutor = data.localDataBackend.porcentajeRegaliasDeAutor

  data.localDataBackend.mediosDePago.forEach((medio: string) => {
    if (medio === 'QR') local.metodosDePago.QR = true
    if (medio === 'EFECTIVO') local.metodosDePago.EFECTIVO = true
    if (medio === 'TARJETA') local.metodosDePago.TARJETA = true
  })

  // Hacemos una copia de los datos del local, para volver a mostrarlos
  // en caso de que el usuario realice cambios y luego los descarte
  function hacerCopiaDelLocal() {
    return structuredClone({
      nombreLocal: local.nombreLocal,
      urlImagen: local.urlImagen,
      direccion: local.direccion,
      altura: local.altura,
      latitud: local.latitud,
      longitud: local.longitud,
      porcentajeApp: local.porcentajeApp,
      porcentajeAutor: local.porcentajeAutor,
      metodosDePago: { ...local.metodosDePago }
    })
  }

  let localCopiaOriginal = hacerCopiaDelLocal()

  function hayCambios(): boolean {
    if (
      local.nombreLocal !== localCopiaOriginal.nombreLocal ||
      local.urlImagen !== localCopiaOriginal.urlImagen ||
      local.direccion !== localCopiaOriginal.direccion ||
      local.altura !== localCopiaOriginal.altura ||
      local.latitud !== localCopiaOriginal.latitud ||
      local.longitud !== localCopiaOriginal.longitud ||
      local.porcentajeApp !== localCopiaOriginal.porcentajeApp ||
      local.porcentajeAutor !== localCopiaOriginal.porcentajeAutor
    ) {
      return true
    }

    for (const medio in local.metodosDePago) {
      const clave = medio as keyof typeof local.metodosDePago
      if (local.metodosDePago[clave] !== localCopiaOriginal.metodosDePago[clave]) {
        return true
      }
    }

    return false
  }

  function descartarCambios() {
    if (hayCambios()) {
      //En caso de haber cambios, restauramos los valores originales
      local.setNombre(localCopiaOriginal.nombreLocal)
      local.setUrlImagen(localCopiaOriginal.urlImagen)
      local.setDireccion(localCopiaOriginal.direccion)
      local.setAltura(localCopiaOriginal.altura)
      local.setLatitud(localCopiaOriginal.latitud)
      local.setLongitud(localCopiaOriginal.longitud)
      local.setPorcentajeApp(localCopiaOriginal.porcentajeApp)
      local.setPorcentajeAutor(localCopiaOriginal.porcentajeAutor)
      for (const medio in localCopiaOriginal.metodosDePago) {
        const clave = medio as keyof typeof local.metodosDePago
        local.setMetodoDePago(clave as MetodoDePago, localCopiaOriginal.metodosDePago[clave])
      }
      showToast('Cambios descartados', 'warning', 3000)
    } else {
      showToast('No hay cambios para descartar', 'warning', 3000)
    }
  }

  // Actualizamos los cambios realizados por el usuario en el backend
  //
  async function guardarCambios() {
    local.validarLocal()
    if (local.errors.length > 0) {
      showToast(local.errors.map((e) => e.mensaje).join('. '), 'error', 5000)
      return
    }

    try {
      await updateLocal(local.prepararDTO())
      localCopiaOriginal = hacerCopiaDelLocal()
      showToast('Cambios guardados', 'success', 3000)
    } catch (err) {
      showError('Error al guardar', err)
    }
  }
</script>

<main class="contenedor-principal main-vista">
  <header class="titulo-principal">
    <h1>Información del local</h1>
  </header>

  <ProfileCard>
    <div class="informacion-local">
      <form class="inputs-local" on:submit>
        <label for="nombre-local">Nombre del local*</label>
        <input
          id="nombre-local"
          data-testid="nombre-local"
          type="text"
          bind:value={local.nombreLocal}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="nombreLocal" />

        <label for="url-imagen-local">URL de la imagen*</label>
        <input
          id="url-imagen-local"
          type="text"
          bind:value={local.urlImagen}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="urlImagen" />
      </form>

      <img src={local.urlImagen} alt="Imagen del local" class="imagen-local" />
      <!-- La imagen se carga directamente desde la URL declarada -->
    </div>
  </ProfileCard>

  <ProfileCard>
    <h3>Dirección</h3>
    <div class="card-inputs">
      <div>
        <label for="direccion">Dirección*</label>
        <input
          id="direccion"
          type="text"
          bind:value={local.direccion}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="direccion" />
      </div>
      <div>
        <label for="altura">Altura*</label>
        <input
          id="altura"
          type="number"
          bind:value={local.altura}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="altura" />
      </div>
      <div>
        <label for="latitud">Latitud*</label>
        <input
          id="latitud"
          type="number"
          bind:value={local.latitud}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="latitud" />
      </div>
      <div>
        <label for="longitud">Longitud*</label>
        <input
          id="longitud"
          type="number"
          bind:value={local.longitud}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="longitud" />
      </div>
    </div>
  </ProfileCard>

  <ProfileCard>
    <h3>Porcentajes</h3>
    <div class="card-inputs">
      <div>
        <label for="porcentaje-comision-app">Porcentaje de comisión con la app*</label>
        <input
          id="porcentaje-comision-app"
          type="number"
          bind:value={local.porcentajeApp}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="porcentajeApp" />
      </div>

      <div>
        <label for="porcentaje-comision-plato-autor">
          Porcentaje de comisión con autores de platos*
        </label>
        <input
          id="porcentaje-comision-plato-autor"
          type="number"
          bind:value={local.porcentajeAutor}
          placeholder="Escribir"
          required
        />
        <ValidadorMensaje elemento={local} atributo="porcentajeAutor" />
      </div>

      <h3>Métodos de pago</h3>
      <div class="metodos-de-pago">
        <Checkbox label="QR" bind:checked={local.metodosDePago.QR} />
        <Checkbox label="Efectivo" bind:checked={local.metodosDePago.EFECTIVO} />
        <Checkbox label="Tarjeta" bind:checked={local.metodosDePago.TARJETA} />
      </div>
    </div>
  </ProfileCard>

  <div class="button">
    <PropsButton tipo="primario" onclick={guardarCambios} data-testid="guardar-cambios"
      >Guardar Cambios</PropsButton
    >
    <PropsButton tipo="secundario" onclick={descartarCambios} data-testid="descartar-cambios"
      >Descartar Cambios</PropsButton
    >
  </div>
</main>
