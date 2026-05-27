import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        // Consultar todos los usuarios en la BD
        const usuarios = await prisma.usuario.findMany({
  
            include: {
                eventos: true
            }
        })

        // Retornar la lista al cliente
        return usuarios

    } catch (error: any) {
        // En caso de que falle la conexión con la base de datos
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Error al obtener la lista de usuarios.'
        })
    }
})