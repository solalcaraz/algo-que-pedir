<script lang='ts'>
  import './ingrediente-row.css'
  import type { Snippet } from 'svelte'
  import { Ingrediente } from '$lib/models/ingrediente.svelte'
  import IconoBoton from '../generales/icono boton/iconoBoton.svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  
  import cow from '$lib/assets/cow.svg'
  import palta from '$lib/assets/palta.svg'
  import trash from '$lib/assets/trash.svg'

type IngredienteRowProps = SvelteHTMLElements['tr'] & {
  ingrediente: Ingrediente,
  columnasExtra?: Snippet<[]>,
  acciones?: Snippet<[Ingrediente]>
  eliminar?: () => void
}

let { ingrediente, columnasExtra, acciones, eliminar = () => {}, ...trAtributos }: IngredienteRowProps = $props()

const mapaIconos = {'vegetal': palta, 'animal': cow}
const iconoOrigen = mapaIconos[ingrediente.origenAnimal]
</script>

<tr {...trAtributos}>
  <td data-testid={'nombre-'+ingrediente.id}>{ingrediente.nombre}</td>
  
  {#if columnasExtra}
    {@render columnasExtra()}
  {/if}
  
  <td class="celda-alimenticio" data-testid={'grupo-'+ingrediente.id}>{ingrediente.grupoAlimenticio}</td>

  <td class="icono-origen" data-testid={'origen-'+ingrediente.id}><img src={iconoOrigen} alt="palta"></td>

  {#if acciones}
    <td class="icono-accion">
      {@render acciones(ingrediente)}
    </td>  
  {:else} <!-- sino por defecto dejamos el tacho -->
    <td class="icono-accion">
      <IconoBoton onclick={eliminar}>
        <img src={trash} alt="eliminar">
      </IconoBoton>
    </td>
  {/if}
</tr>