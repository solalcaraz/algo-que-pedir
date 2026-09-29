import { ValidarMensaje } from '$lib/utils/validadorMensaje/ValidarMensaje'

export class Validable {
  errors: ValidarMensaje[] = $state([])

  tieneError(campo: string): boolean {
    return this.errors.some((_) => _.campo === campo)
  }

  agregarError(campo: string, mensaje: string) {
    this.errors.push(new ValidarMensaje(campo, mensaje))
  }

  mensajesError(campo: string): string {
    return this.errors
      .filter((_) => _.campo === campo)
      .map((_) => _.mensaje)
      .join('. ')
  }

  invalid(): boolean {
    return this.errors.length > 0
  }
}
