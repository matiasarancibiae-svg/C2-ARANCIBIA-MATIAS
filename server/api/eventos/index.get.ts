import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const eventos = await prisma.evento.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                _count: {
                    select: { usuarios: true }
                }
            }
        })
        
        return eventos
        
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al consultar los eventos en la BD'
        })
    }
})