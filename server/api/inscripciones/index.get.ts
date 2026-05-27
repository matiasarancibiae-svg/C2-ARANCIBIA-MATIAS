export default defineEventHandler(async (event) => {
    // 1. OBTENER EL ID (Aquí es donde debes definir eventoId)
    const id = getRouterParam(event, 'id')
    
    // Validar que el ID exista
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID es obligatorio' })
    
    // Convertirlo a número si es necesario
    const eventoId = parseInt(id)

    // 2. AHORA SÍ, usar eventoId en la consulta
    const evento = await prisma.evento.findUnique({
        where: { id: eventoId }, // <--- Aquí ya no dará error
        include: {
            inscripciones: {
                include: {
                    usuario: true
                }
            }
        }
    })

    return evento
})