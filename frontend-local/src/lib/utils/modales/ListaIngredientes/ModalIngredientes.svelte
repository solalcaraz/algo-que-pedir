<script lang="ts">
  import './modalIngredientes.css'
  
  import { onMount } from 'svelte'
  import { SvelteSet } from 'svelte/reactivity'
  import Boton from '$lib/components/generales/boton/boton.svelte'
  import Tabla from '$lib/components/generales/tabla/Tabla.svelte'
  import IngredienteRow from '$lib/components/ingredientes/IngredienteRow.svelte'
  import Checkbox from '$lib/components/generales/checkbox/checkbox.svelte'
  
  import type { Ingrediente } from '$lib/models/ingrediente.svelte'
  import { ingredientesService } from '$lib/services/ingredienteService'
  import { showError } from '$lib/utils/errorHandler'

  interface IngredientesModalProps {
    ingredientesActuales: Ingrediente[]
    onAgregar: (ingredientes: Ingrediente[]) => void
  }

  let { ingredientesActuales, onAgregar }: IngredientesModalProps = $props()

  // Estados del componente
  let todosLosIngredientes: Ingrediente[] = []
  let ingredientesSeleccionados = new SvelteSet<number>()
  let cargando = $state(true)

  // Cargar ingredientes al abrir este componente
  onMount(async () => {
    try {
      todosLosIngredientes = await ingredientesService.todosLosIngredientes()
    } catch (error) {
      showError('Error al cargar ingredientes', error)
    } finally { cargando = false }
  })

  // Filtrar ingredientes que ya están en el plato, uso derived para recalcular cuando se cambia
  const ingredientesDisponibles = $derived(
    todosLosIngredientes.filter(
      ing => !ingredientesActuales.some(actual => actual.id === ing.id)
    )
  )

  // Agregar o sacar ingredientes a los que se seleccionan
  const toggleIngrediente = (id: number) => {
    if (ingredientesSeleccionados.has(id)) {
      ingredientesSeleccionados.delete(id) // si ya estaba en la lista, lo saco
    } else {
      ingredientesSeleccionados.add(id) // si no estaba entonces lo agrego
    }
  }

  const confirmar = () => {
    const seleccionados = todosLosIngredientes.filter(
      ing => ingredientesSeleccionados.has(ing.id!)
    )
    onAgregar(seleccionados)
    ingredientesSeleccionados.clear()
  }
</script>

<section class="modal-ingredientes">
  <h2>Agregar Ingredientes</h2>

  {#if cargando}
    <p class="cargando">Cargando ingredientes...</p>
  {:else if ingredientesDisponibles.length === 0}
    <p class="sin-ingredientes">No hay más ingredientes disponibles</p>
  {:else}
    <article class="lista-ingredientes">
      <Tabla>
        {#snippet nombreColumnas()}
          <th>Nombre</th>
          <th>Grupo</th>
          <th class="txtColumna">Origen</th>
          <th class="txtColumna">Acciones</th>
        {/snippet}
        {#snippet datosFilas()}  
          {#each ingredientesDisponibles as ingrediente (ingrediente.id)}
            <IngredienteRow {ingrediente}>
              {#snippet acciones()}
                <Checkbox
                checked={ingredientesSeleccionados.has(ingrediente.id!)} 
                onchange={() => toggleIngrediente(ingrediente.id!)}/>
              {/snippet}
            </IngredienteRow>
          {/each}
        {/snippet}
      </Tabla>
    </article>

    <section class="modal-footer">
      <p class="contador">
        {ingredientesSeleccionados.size} ingrediente{ingredientesSeleccionados.size !== 1 ? 's' : ''} seleccionado{ingredientesSeleccionados.size !== 1 ? 's' : ''}
      </p>
      <Boton onclick={confirmar} disabled={ingredientesSeleccionados.size === 0} >
        Agregar ({ingredientesSeleccionados.size})
      </Boton>
    </section>
  {/if}
</section>