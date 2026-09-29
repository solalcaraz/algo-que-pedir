<script lang='ts'>
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import IconoBoton from '$lib/components/generales/icono boton/iconoBoton.svelte'
  import IngredienteRow from '$lib/components/ingredientes/IngredienteRow.svelte'
  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import { goto, invalidate } from '$app/navigation'
  import type { PageProps } from './$types'

  import eye from '$lib/assets/eye.svg'
  import pencil from '$lib/assets/pencil-simple.svg'
  import trash from '$lib/assets/trash.svg'
  import type { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { ingredientesService } from '$lib/services/ingredienteService'
  import { showError } from '$lib/utils/errorHandler'
  import { showToast } from '$lib/utils/toasts/toasts'

  let { data }: PageProps = $props()
  let ingredientes = $derived(data.ingredientes)

  const buscarIngredientes = async () => {
    await invalidate('ingredientes:list')
  }

  const editar = (ingrediente: Ingrediente, readOnly: boolean = false) => { goto (`/editar-ingrediente/${ingrediente.id}?readOnly=${readOnly}`)}
  const crearIngrediente = () => { goto ('/editar-ingrediente/nuevo')}
  
  const eliminar = async (ingrediente: Ingrediente) => {
    try {
      await ingredientesService.eliminarIngrediente(ingrediente.id!)
      buscarIngredientes()
      showToast('Ingrediente eliminado con éxito', 'success')
    } catch (error: unknown) {
      showError('Error al eliminar el ingrediente', error)
      await buscarIngredientes()
    }
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
  {#each ingredientes as ingrediente (ingrediente.id)}
    <IngredienteRow {ingrediente} data-testid={'ingrediente-'+ingrediente.id}>
      {#snippet columnasExtra()}
        <td data-testid={'costo-'+ingrediente.id}>${ingrediente.costoMercado.toFixed(2)}</td>
      {/snippet}
      {#snippet acciones()}
        <div class="iconos-acciones">
          <IconoBoton onclick={() => editar(ingrediente, true)} data-testid={'ver-'+ingrediente.id}>
            <img src={eye} alt="ojo" class="icono-ojo">
          </IconoBoton>
          <IconoBoton onclick={() => editar(ingrediente)} data-testid={'editar-'+ingrediente.id}>
            <img src={pencil} alt="lapiz">
          </IconoBoton>
          <!-- AGREGAR ACCION PARA EL ICONO BOTON TRASH -->
          <IconoBoton onclick={() => eliminar(ingrediente)} data-testid={'eliminar-'+ingrediente.id}>
            <img src={trash} alt="tacho">
          </IconoBoton>
        </div>
      {/snippet}
    </IngredienteRow>
  {/each}
{/snippet}


<main class="ingrediente-container main-vista">
    <header class="boton-titulo">
        <h1>Ingredientes</h1>
        <Boton onclick={crearIngrediente} data-testid='crear'>Nuevo ingrediente</Boton>
    </header>
    <Tabla {nombreColumnas} {datosFilas}/>
</main> 

<style>
  @import './ingredientes.css';

  th {
    padding: 1rem;
  }
</style>