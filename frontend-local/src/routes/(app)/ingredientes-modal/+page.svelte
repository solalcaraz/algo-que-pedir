<script lang="ts">
  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import { INGREDIENTES_MOCK } from '$lib/data/mocks/ingredientesMock'
  import IconoBoton from '$lib/components/generales/icono boton/iconoBoton.svelte'
  import IngredienteRow from '$lib/components/ingredientes/IngredienteRow.svelte'

  import eye from '$lib/assets/eye.svg'
  import trash from '$lib/assets/trash.svg'
  import pencil from '$lib/assets/pencil-simple.svg'
  
  import Modal from '$lib/utils/modales/Modal.svelte'
  import IngredientesForm from '$lib/components/editar-ingredientes/IngredientesForm.svelte'

  let modalOpen = false
  let ingredienteId: string | null = null

  const abrirNuevo = () => {
    ingredienteId = null
    modalOpen = true
  }

  const abrirEditar = (id: string) => {
    ingredienteId = id
    modalOpen = true
  }

  const cerrarModal = () => {
    modalOpen = false
  }

  const editar = (id: string) => {
    abrirEditar(id)
  }
</script>

{#snippet nombreColumnas()}
  <th>Nombre</th>
  <th>Costo</th>
  <th class="cabecera-alimenticio">Grupo alimenticio</th>
  <th class="cabecera-origen">Origen</th>
  <th class="cabecera-acciones">Acciones</th>
{/snippet}

{#snippet datosFilas()}
  {#each INGREDIENTES_MOCK as ingrediente (ingrediente.id)}
    <IngredienteRow {ingrediente}>
      {#snippet columnasExtra()}
        <td>{ingrediente.costoMercado}</td>
      {/snippet}
      {#snippet acciones()}
        <div class="iconos-acciones">
          <!-- AGREGAR ACCION PARA EL ICONO BOTON EYE -->
          <IconoBoton claseIcono="icono-ojo">
            <img src={eye} alt="ojo" />
          </IconoBoton>
          <IconoBoton onclick={() => editar(ingrediente.id)}>
            <img src={pencil} alt="lapiz" />
          </IconoBoton>
          <!-- AGREGAR ACCION PARA EL ICONO BOTON TRASH -->
          <IconoBoton>
            <img src={trash} alt="tacho" />
          </IconoBoton>
        </div>
      {/snippet}
    </IngredienteRow>
  {/each}
{/snippet}

<main class="ingrediente-container main-vista">
  <header class="boton-titulo">
    <h1>Ingredientes</h1>
    <Boton onclick={abrirNuevo}>Nuevo ingrediente</Boton>
  </header>
  <Tabla {nombreColumnas} {datosFilas} />
</main>

<Modal
  open={modalOpen}
  onClose={cerrarModal}
  componente={IngredientesForm}
  props={{ ingredienteId }}
/>

<style>
  @import './ingredientes.css';

  th {
    padding: 1rem;
  }
</style>
