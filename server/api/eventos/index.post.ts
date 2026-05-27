import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
    // obtener el body desde el request recibido
    const body = await readBody(event)

    // extraer los datos del body
    const { titulo, fecha, hora, lugar, imagenURL, valor, topePersonas } = body

    // formatear los datos para inserción
    const tituloNormalizado = typeof titulo === 'string' ? titulo.trim() : ''
    const lugarNormalizado = typeof lugar === 'string' ? lugar.trim() : ''
    const imagenNormalizada = typeof imagenURL === 'string' ? imagenURL.trim() : '/uploads/placeholder.jpg' // <---- Cambiar
    const fechaNormalizada = typeof fecha === 'string' ? fecha.trim() : ''
    const horaNormalizada = typeof hora === 'string' ? hora.trim() : ''



    const valorNumero = Number(valor)
    const topeNumero = Number(topePersonas)

    const rutaFinal = body.imagenURL.startsWith('/images/') 
    ? body.imagenURL 
    : `/images/${body.imagenURL}`

    // insertar en BD
    const nuevoEvento = await prisma.evento.create({
      data: {
        titulo: tituloNormalizado,
        fecha: fechaNormalizada,
        hora: horaNormalizada,
        lugar: lugarNormalizado,
        imagenURL: rutaFinal,
        valor: valorNumero,
        personasInscritas: 0, // Todo evento parte con 0 usuarios inscritos
        topePersonas: topeNumero
      }
    })


    


    // enviar respuesta al cliente
    return {
        ok: true,
        nuevoEvento
    }
})
