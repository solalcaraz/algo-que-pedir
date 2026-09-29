<script lang="ts">
  import './inputOcultable.css'
  import Input from '$lib/components/generales/input/input.svelte'
  import IconoBoton from '../generales/icono boton/iconoBoton.svelte'
  interface Props {
    id: string
    nombre_label: string
    nombre: string
    placeholder?: string
    required?: boolean
    value: string
    disabled?: boolean
  }

  let {
    id,
    nombre_label = '',
    nombre: name,
    placeholder = 'Escribir',
    required = true,
    value = $bindable(),
    disabled = false
  }: Props = $props()

  let passOculta = $state(false)

  function togglePassword() {
    passOculta = !passOculta
  }
</script>

<div class="contenedor-password">
  <Input
    {nombre_label}
    type={passOculta ? 'text' : 'password'}
    {id}
    {name}
    {placeholder}
    {required}
    bind:value
    {disabled}
  />
  <IconoBoton
    onclick={togglePassword}
    claseIcono="icono-ojo {passOculta ? 'mostrar' : ''}"
    claseBoton="base-toggle-password toggle-button"
    ariaLabel={passOculta ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    {disabled}
  />
</div>

<style>
</style>
