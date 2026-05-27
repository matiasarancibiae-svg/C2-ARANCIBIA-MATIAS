import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requerido' })

    const evento = await prisma.evento.findUnique({
        where: { id: parseInt(id) },
        include: { 
            usuarios: true,
            _count: {
                select: { usuarios: true }
            }
        }
    })

    if (!evento) throw createError({ statusCode: 404, statusMessage: 'Evento no encontrado' })

    return evento
})