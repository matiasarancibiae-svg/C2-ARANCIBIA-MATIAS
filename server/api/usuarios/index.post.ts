import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    // Obtener el body desde el request recibido
    const body = await readBody(event)

    // Extraer los datos que vienen del modal
    const { nombreUsuario, correoElectronico, rutUsuario, eventoId } = body



    const nombreNormalizado = typeof nombreUsuario === 'string' ? nombreUsuario.trim() : ''
    const correoNormalizado = typeof correoElectronico === 'string' ? correoElectronico.trim() : ''
    const rutNormalizado = typeof rutUsuario === 'string' ? rutUsuario.trim() : ''
    const eventoIdNumero = Number(eventoId)

    // Insertar en la BD usando tu modelo exacto: 'usuario'
    const nuevoUsuario = await prisma.usuario.create({
        data: {
            nombre: nombreNormalizado,
            correo: correoNormalizado,
            rut: rutNormalizado,
            // Así se vincula el usuario con el evento en relaciones de arreglos en Prisma:
            eventos: {
                connect: { id: eventoIdNumero }
            }
        }
    })

    // Actualizar el contador de personas inscritas en ese evento
    await prisma.evento.update({
        where: { id: eventoIdNumero },
        data: {
            personasInscritas: {
                increment: 1
            }
        }
    })

    // Enviar respuesta al cliente
    return {
        ok: true,
        nuevoUsuario
    }
})