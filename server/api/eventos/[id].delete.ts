import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requerido' })

    try {
        // Borramos el evento
        return await prisma.evento.delete({
            where: { id: parseInt(id) }
        })
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el evento' })
    }
})