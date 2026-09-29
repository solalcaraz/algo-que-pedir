<script lang="ts">
  import './editar-ingrediente.css'
  import Input from '$lib/components/generales/input/input.svelte'
  import Switch from '$lib/components/generales/switch/switch.svelte'
  import Textarea from '$lib/components/generales/input/textarea.svelte'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import Validador from '$lib/utils/validadorMensaje/validadorMensaje.svelte'
  import { GrupoAlimenticio } from '$lib/models/ingrediente.svelte'
  import { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { showError } from '$lib/utils/errorHandler'
  import { ingredientesService } from '$lib/services/ingredienteService'
  import { goto } from '$app/navigation'
  import { showToast } from '$lib/utils/toasts/toasts'

  const volver = () => {
    goto('/ingrediente')
  }
  
  let { data } = $props()
  const { ingrediente, nuevoIngrediente, readOnly } = data

  const actualizar = async () => {
    try {
      const ingredienteActual: Ingrediente = ingrediente
      ingredienteActual.validarIngrediente()
      if (!ingredienteActual.invalid()){
        if (nuevoIngrediente) {
          await ingredientesService.crearIngrediente(ingredienteActual)
          showToast('Ingrediente creado con éxito', 'success')
        } else {
          await ingredientesService.actualizarIngrediente(ingredienteActual)
          showToast('Ingrediente actualizado con éxito', 'success')
        }
        volver()
      }
    } catch (error) {
      showError('Error al actualizar el ingrediente', error)
    }
  }

  const titulo = $derived(readOnly ? 'Detalle Ingrediente' : (nuevoIngrediente ? 'Nuevo Ingrediente' : 'Editar Ingrediente')) // eslint-disable-line
  const botonGuardar = $derived(nuevoIngrediente ? 'Crear ingrediente' : 'Guardar cambios')

  const opcionesGrupo: { value: GrupoAlimenticio; label: string }[] = [
    { value: GrupoAlimenticio.CEREALES_Y_TUBERCULOS, label: 'Cereales y tubérculos' },
    { value: GrupoAlimenticio.AZUCARES_Y_DULCES, label: 'Azúcares y dulces' },
    { value: GrupoAlimenticio.LACTEOS, label: 'Lácteos' },
    { value: GrupoAlimenticio.FRUTAS_Y_VERDURAS, label: 'Frutas y verduras' },
    { value: GrupoAlimenticio.GRASAS_Y_ACEITES, label: 'Grasas y aceites' },
    { value: GrupoAlimenticio.PROTEINAS, label: 'Proteínas' }
  ]
</script>

<main class="vista-edicion-ingrediente main-vista">
  <!-- Contenedor de toda la vista -->
  <h1 class="titulo-edicion" data-testid='titulo'>{titulo}</h1>
  <section class="container-edicion contenedor-general">
    <!-- Contenedor de los campos de edicion ingrediente -->
    <article class="item-input-edicion">
      <form>
        <Input
          nombre_label="Nombre del ingrediente*"
          type="text"
          id="nombre-ingrediente"
          placeholder="Ingresa el nombre del ingrediente..."
          required={true}
          data-testid="nombre"
          bind:value={ingrediente.nombre}
          disabled={readOnly}
        />
        <Validador elemento={ingrediente} atributo="nombre" />

        <Input
          nombre_label="Costo*"
          type="number"
          id="costo-ingrediente"
          placeholder="Ingresa su costo..."
          required={true}
          data-testid="costo"
          bind:value={ingrediente.costoMercado}
          disabled={readOnly}
        />
        <Validador elemento={ingrediente} atributo="costoMercado" />

        <Textarea
          nombre_label="Grupo Alimenticio"
          id="grupo-alimenticio"
          select={true}
          options={[{ value: '', label: 'Selecciona una opción' }, ...opcionesGrupo]}
          data-testid="grupo"
          bind:value={ingrediente.grupoAlimenticio}
          disabled={readOnly}
        />
        <Validador elemento={ingrediente} atributo="grupoAlimenticio" />

        <article class="origen-toggle">
          <Switch
            id="origen-toggle"
            titulo="Origen animal"
            data-testid="origen"
            bind:checked={ingrediente.esAnimal}
            disabled={readOnly}
          />
        </article>
      </form>
    </article>
  </section>
  <div class="container-botones-edicion">
    <!-- Contenedor de los botones de guardar y descartar cambios -->
    {#if !readOnly}
      <Boton data-testid="btnGuardar" type="button" class="boton-primario boton-guardar" onclick={actualizar}
      >{botonGuardar}</Boton>
      <Boton data-testid="btnDescartar" class="boton-secundario boton-descartar" onclick={volver}
        >Descartar cambios</Boton>
    {/if}
  </div>
</main>
