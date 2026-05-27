import type { Evento } from './evento'

export interface Usuario {
  id: number
  nombre: string
  rut: string
  correo: string
  // Como un usuario puede estar inscrito en varios eventos, 
  // mapeamos la relación que incluimos en el index.get.ts
  eventosInscritos?: Evento[]
}