<script lang="ts">
  import './editar-plato.css'
  import { goto } from '$app/navigation'
  import type { Plato } from '$lib/types'
  import { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { platosService } from '$lib/services/platoService'
  import { opcionesImagen } from '$lib/utils/imagenesPlato'
  import plus from '$lib/assets/plus-circle.svg'

  // Componentes
  import Input from '$lib/components/generales/input/input.svelte'
  import Textarea from '$lib/components/generales/input/textarea.svelte'
  import Switch from '$lib/components/generales/switch/switch.svelte'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import ValidadorMensaje from '$lib/utils/validadorMensaje/validadorMensaje.svelte'
  import IngredienteRow from '$lib/components/ingredientes/IngredienteRow.svelte'
  import IconoBoton from '$lib/components/generales/icono boton/iconoBoton.svelte'
  import Modal from '$lib/utils/modales/Modal.svelte'
  import ModalIngredientes from '$lib/utils/modales/ListaIngredientes/ModalIngredientes.svelte'
  import { showToast } from '$lib/utils/toasts/toasts'
  import { showError } from '$lib/utils/errorHandler'

  // Recibo la carga del plato segun corresponda
  let { data } = $props()
  const { plato, nuevoPlato } = data

  // Estado local para deshabilitar botones
  let guardando = $state(false)
  let modalAbierto = $state(false)

  // Effect y variable para manejar archivo
  let imagenSeleccionada = $state(plato.imagenUrl.split('/').pop())

  $effect(() => {
    if (imagenSeleccionada) {
      plato.imagenUrl = `/images/${imagenSeleccionada}`
    }
  })

  // Dinamismo para el titulo y el texto del boton primario
  const titulo = $derived( nuevoPlato ? 'Agregar nuevo plato' : `Editar Plato: ${plato?.nombre}` )
  const txtBtnPrimario = $derived(nuevoPlato ? 'Agregar plato' : 'Guardar cambios')

  // Eliminar ingrediente de la tabla
  const eliminarIngrediente = (ingredienteId: number) => {
    plato.eliminarIngrediente(ingredienteId)
    showToast('Ingrediente eliminado con éxito', 'success')
  }
  // Agregar ingredientes seleccionados del modal
  const agregarIngredientes = (ingredientes: Ingrediente[]) => {
    ingredientes.forEach((ing) => plato.agregarIngrediente(ing))
    showToast(`${ingredientes.length} ingrediente(s) agregado(s)`, 'success')
    modalAbierto = false
  }
  // Funciones para los botones
  const volver = () => {
    goto('/menu')
  }
  const guardar = async () => {
    try {
      guardando = true
      const platoEdit: Plato = plato
      platoEdit.validarPlato()
      if (!plato.invalid()) {
        if (nuevoPlato) {
          await platosService.crearPlato(plato)
          showToast('Plato creado con éxito', 'success')
        } else {
          await platosService.actualizarPlato(plato)
          showToast('Plato actualizado con éxito', 'success')
        }
        setTimeout(() => volver(), 1000)
      }
    } catch (error) {
      showError('Error al guardar el plato', error)
    } finally {
      guardando = false
    }
  }

  const confirmarDescarte = () => {
    const confirmar = confirm('¿Estas seguro de que desea descartar los cambios?')
    if (confirmar) {
      volver()
    }
  }
</script>

<main class="main-vista vista-editar-plato">
  <h1 class="titulo">{titulo}</h1>

  <!-- Descripción del plato -->
  <section class="contenedor-general editar-plato">
    <form>
      <Input
        data-testid="titulo" nombre_label="Nombre del plato*" type="text" id="nombre" 
        bind:value={plato.nombre} maxlength={30} placeholder="Ej: Hamburguesa completa con cheddar"
      />
      <ValidadorMensaje elemento={plato} atributo="nombre" />

      <Textarea data-testid="descripcion" id="descripcion" nombre_label="Descripcion*" textarea={true} bind:value={plato.descripcion} />
      <ValidadorMensaje elemento={plato} atributo="descripcion" />

      <!-- Imagen cargada como select, son brindadas desde el back -->
       <Textarea data-testid="imagen" nombre_label="URL de la imagen del plato*" id="imagen" select={true}
        options={[{value: '', label: 'Selecciona una imagen para tu plato'}, ...opcionesImagen]}
        bind:value={imagenSeleccionada}
      />
      <ValidadorMensaje elemento={plato} atributo="imagen" />
    </form>

    <!-- Imagen de referencia -->
    <div class="editar-plato__imagen">
      <img class="foto" src={plato.imagenUrlCompleta} alt="Vista previa del plato" />
    </div>
  </section>

  <!-- Costos del plato -->
  <section class="contenedor-general contenedor-general_especifico">
    <h2>Costos</h2>
    <form class="costos-plato">
      <Input data-testid="valorBase" nombre_label="Precio Base*" type="number" id="valorBase" 
      bind:value={plato.valorBase} placeholder="Ej: 500" min="0" />
      <ValidadorMensaje elemento={plato} atributo="valorBase" />

      <Switch id="esDeAutor" titulo="Plato de Autor" subtitulo="Aplica un porcentaje adicional al precio de venta" bind:checked={plato.esDeAutor} />

      <!-- Promocion solo si NO es nuevo -->
      {#if plato.esNuevo}
        <p class="warning-platoNuevo">
          ⚠️ Los platos nuevos no pueden estar en promoción. Esta funcionalidad se habilitará luego
          de 30 días creado el plato.
        </p>
      {:else}
        <Switch id="estaEnPromocion" titulo="Plato en Promoción" subtitulo="Aplica un descuento al precio de venta" bind:checked={plato.estaEnPromocion} />
        {#if plato.estaEnPromocion}
          <Input data-testid="porcentajeDescuento" nombre_label="Porcentaje de descuento*" type="number" id="porcentajeDescuento"
            bind:value={plato.porcentajeDescuento} placeholder="Ej: 25%" min="0" max="100" />
          <ValidadorMensaje elemento={plato} atributo="porcentajeDescuento" />
        {/if}
      {/if}
    </form>
  </section>

  <!-- Detalle de los ingredientes  -->
  <section class="contenedor-general contenedor-general_especifico">
    <h2>Ingredientes</h2>
    <div class="contenedor_titulo-span">
      <h3 class="subtitulo">Costo de producción</h3>
      <span>{plato.costoProduccion.toFixed(2)}</span>
    </div>

    <Tabla>
      {#snippet nombreColumnas()}
        <th>Nombre</th>
        <th>Grupo</th>
        <th class="txtColumna">Origen</th>
        <th class="txtColumna">Acciones</th>
      {/snippet}
      {#snippet datosFilas()}
        {#each plato.ingredientes as ingrediente (ingrediente.id)}
          <IngredienteRow {ingrediente} eliminar={() => eliminarIngrediente(ingrediente.id!)} />
        {/each}
      {/snippet}
      {#snippet datosExtra()}
        <td colspan="3">Seleccionar ingrediente...</td>
        <td class="icono-accion">
          <IconoBoton data-testid="agregarIngredientes" onclick={() => modalAbierto = true}>
            <img src={plus} alt="agregar" />
          </IconoBoton>
        </td>
      {/snippet}
    </Tabla>
  </section>

  <div class="botones-juntos">
    <Boton data-testid="btnGuardar" type="submit" onclick={guardar} disabled={guardando}>
      {guardando ? 'Guardando...' : txtBtnPrimario}</Boton
    >
    <Boton
      data-testid="btnDescartar"
      tipo="secundario"
      onclick={confirmarDescarte}
      disabled={guardando}>Descartar cambios</Boton
    >
  </div>
</main>

<!-- Modal de ingredientes -->
<Modal open={modalAbierto} onClose={() => modalAbierto = false}>
  <ModalIngredientes ingredientesActuales={plato.ingredientes} onAgregar={agregarIngredientes} />
</Modal>
