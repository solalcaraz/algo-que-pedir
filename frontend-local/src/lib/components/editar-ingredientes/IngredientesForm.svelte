<script lang="ts">
  export let ingredienteId: string | null = null
  export let onClose: () => void

  import './ingredientes-form.css'
  import { GrupoAlimenticio } from '$lib/models/ingrediente.svelte'
  import Boton from '../generales/boton/boton.svelte'
  import Input from '$lib/components/generales/input/input.svelte'
  import Switch from '$lib/components/generales/switch/switch.svelte'
  import Textarea from '$lib/components/generales/input/textarea.svelte'
  import { INGREDIENTES_MOCK } from '$lib/data/mocks/ingredientesMock'

  import { showToast } from '$lib/utils/toasts/toasts' 
  
  
  //Variables del formulario que en caso de edición
  //deberían llenarse con los datos del ingrediente que se está editando
  // TODO: no funciona con el Switch porque no está declarado como bindeable.

  let nombre = ''
  let costoMercado = 0
  let grupoAlimenticio = ''
  let origenAnimal = false

  const grupoOptions = [
    { value: GrupoAlimenticio.CEREALES_Y_TUBERCULOS, label: 'Cereales y tubérculos' },
    { value: GrupoAlimenticio.AZUCARES_Y_DULCES, label: 'Azúcares y dulces' },
    { value: GrupoAlimenticio.LACTEOS, label: 'Lácteos' },
    { value: GrupoAlimenticio.FRUTAS_Y_VERDURAS, label: 'Frutas y verduras' },
    { value: GrupoAlimenticio.GRASAS_Y_ACEITES, label: 'Grasas y aceites' },
    { value: GrupoAlimenticio.PROTEINAS, label: 'Proteínas' }
  ]

  $: if (ingredienteId) {
    const ingrediente = INGREDIENTES_MOCK.find(i => i.id === +ingredienteId)
    if (ingrediente) {
      nombre = ingrediente.nombre
      costoMercado = +ingrediente.costoMercado
      grupoAlimenticio = ingrediente.grupoAlimenticio
      origenAnimal = ingrediente.origenAnimal
    }
  }

  function guardarCambios() {
    //alert('Ingredientes guardados')
    showToast('Cambios guardados','success',3000)
    onClose()
  }

  function descartarCambios() {
    showToast('Cambios descartados :(','error',3000)
    onClose()
  }

</script>

<main class="vista-edicion-ingrediente main-vista">
  <h1 class="titulo-edicion">
    {ingredienteId ? `Editar ingrediente ${ingredienteId}` : 'Nuevo ingrediente'}
  </h1>

  <section class="container-edicion contenedor-general">
    <article class="item-input-edicion">
      <form>
        <Input
          nombre_label="Nombre del ingrediente*"
          type="text"
          bind:value={nombre}
          id="nombre-ingrediente"
          placeholder="Ingresa el nombre del ingrediente..."
          required={true}
        />

        <Input
          nombre_label="Costo*"
          type="number"
          bind:value={costoMercado}
          id="costo-ingrediente"
          placeholder="Ingresa su costo..."
          required={true}
        />

        <Textarea
          nombre_label="Grupo Alimenticio"
          bind:value={grupoAlimenticio}
          id="grupo-alimenticio"
          select={true}
          options={grupoOptions}
        />

        <Switch id="origen-toggle" bind:checked={origenAnimal} titulo="Origen animal" />

      </form>
      <div class="button">
        <Boton tipo="primario" onclick={guardarCambios}>Guardar Cambios</Boton>
        <Boton tipo="secundario" onclick={descartarCambios}>Descartar Cambios</Boton>
      </div>
    </article>
  </section>
</main>
