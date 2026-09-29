import type { LocalDTO } from '$lib/dto/localDTO'
import type { MetodoDePago } from './metodosDePago.svelte'
import { getUsuarioDelLocal } from '$lib/utils/currentSession'
import { esEntero, positivo, vacio } from '$lib/utils/validaciones'
import { ValidarMensaje } from '$lib/utils/validadorMensaje/ValidarMensaje'

export class Local {

  idLocal: number | null = null
  nombreLocal = $state<string>('')
  urlImagen = $state<string>('')
  direccion = $state<string>('')
  altura = $state<number>(0)
  latitud = $state<number>(0)
  longitud = $state<number>(0)
  porcentajeApp = $state<number>(0)
  porcentajeAutor = $state<number>(0)
  usuario = getUsuarioDelLocal()
  metodosDePago = $state<Record<MetodoDePago, boolean>>({
    QR: false,
    Efectivo: false,
    Transferencia: false
  })

  // Setters - puntualmente para que funcione bien la reactividad al momento de descartar cambios
  // y que la actualización sea hecha por page.svelte y no por la clase Local
  setNombre(nombre: string) {
    this.nombreLocal = nombre
  }

  setUrlImagen(url: string) {
    this.urlImagen = url
  }
  setDireccion(direccion: string) {
    this.direccion = direccion
  }

  setAltura(valor: number) {
    this.altura = valor
  }

  setLatitud(valor: number) {
    this.latitud = valor
  }

  setLongitud(valor: number) {
    this.longitud = valor
  }

  setPorcentajeApp(valor: number) {
    this.porcentajeApp = valor
  }

  setPorcentajeAutor(valor: number) {
    this.porcentajeAutor = valor
  }

  setMetodoDePago(medio: MetodoDePago, activo: boolean) {
    this.metodosDePago = { ...this.metodosDePago, [medio]: activo }
  }

  prepararDTO(): LocalDTO {
    const medios: MetodoDePago[] = []

    if (this.metodosDePago.QR) medios.push('QR' as MetodoDePago)
    if (this.metodosDePago.Efectivo) medios.push('EFECTIVO' as MetodoDePago)
    if (this.metodosDePago.Transferencia) medios.push('TRANSFERENCIA_BANCARIA' as MetodoDePago)

    return {
      idLocal: this.idLocal ?? 1,
      nombre: this.nombreLocal,
      urlImagenLocal: this.urlImagen,
      direccion: this.direccion,
      altura: this.altura,
      latitud: this.latitud,
      longitud: this.longitud,
      porcentajeSobreCadaPlato: this.porcentajeApp,
      porcentajeRegaliasDeAutor: this.porcentajeAutor,
      usuario: this.usuario!,
      mediosDePago: medios
    }
  }

  errors: ValidarMensaje[] = $state([])

  //Variable para hacer una copia de los valores originales de carga
  //por si el usuario descarta los cambios que realiza
  private original?: Local


  tieneError(campo: string): boolean {
    return this.errors.some((_) => _.campo === campo)
  }

  agregarError(campo: string, mensaje: string) {
    this.errors.push( new ValidarMensaje(campo, mensaje))
  }

  mensajesError(campo: string): string {
    return this.errors
      .filter((_) => _.campo === campo)
      .map((_) => _.mensaje)
      .join('. ')
  }


  // Validaciones
  validarLocal() {
    
    const PORCENTAJE_MINIMO = 0
    const PORCENTAJE_MAXIMO = 100
    const LATITUD_MINIMA = -90
    const LATITUD_MAXIMA = 90
    const LONGITUD_MINIMA = -180
    const LONGITUD_MAXIMA = 180

    this.errors.length = 0 // se limpian errores anteriores

    if (vacio(this.nombreLocal)) {
      this.agregarError('nombreLocal', 'El nombre del local no puede estar vacío')
    }

    if (vacio(this.urlImagen)) {
      this.agregarError('urlImagen','Debe ingresar la URL de la imagen')
    }

    if (vacio(this.direccion)) {
      this.agregarError('nombreLocal', 'Por favor, ingrese una dirección válida')
    }

    if (!positivo(this.altura) || !esEntero(this.altura)) {
      this.agregarError('altura', 'Debe ingresar una altura válida')
    }

    if (LATITUD_MINIMA >= this.latitud || this.latitud >= LATITUD_MAXIMA) {
      this.agregarError('latitud', 'La latitud debe ser un valor entre -90° y 90°')
    }

    if (LONGITUD_MINIMA >= this.longitud || this.longitud >= LONGITUD_MAXIMA) {
      this.agregarError('longitud', 'La longitud debe ser un valor entre -180° y 180°')
    }

    if (PORCENTAJE_MINIMO >= this.porcentajeApp || this.porcentajeApp >= PORCENTAJE_MAXIMO) {
      this.agregarError('porcentajeApp', 'Debe ingresar un valor entre 0 y 100')
    }

    if (PORCENTAJE_MINIMO >= this.porcentajeAutor || this.porcentajeAutor >= PORCENTAJE_MAXIMO) {
      this.agregarError('porcentajeAutor', 'Debe ingresar un valor entre 0 y 100')
    }
  }
}