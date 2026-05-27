import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const { eventoId, usuarioId } = await readBody(event)


    try {
        const inscripcion = await prisma.inscripcion.create({
            data: {
                eventoId: parseInt(eventoId),
                usuarioId: parseInt(usuarioId)
            }
        })
        return inscripcion
    } catch (error) {
        throw createError({ 
            statusCode: 400, 
            statusMessage: 'Error al inscribir. ¿Ya está inscrito?' 
        })
    }
})