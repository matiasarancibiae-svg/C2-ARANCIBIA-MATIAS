export interface Evento{
    id: number
    titulo: string
    fecha: string
    hora: string
    imagenURL: string
    valor: number
    lugar: string
    personasInscritas: number
    topePersonas: number
    _count?: {
    usuarios: number;
  };
}