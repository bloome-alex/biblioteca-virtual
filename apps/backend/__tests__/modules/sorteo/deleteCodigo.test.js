import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { UserService } from '@dracul/user-backend'
import { InitService } from '@dracul/user-backend'

import { deleteCodigo, createCodigo, findCodigo } from '../../../src/modules/sorteo/services/CodigoService'

let mongoServer

beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
})

afterEach(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})


describe('deleteCodigo', () => {
    it('should delete the document with the given id', async () => {
        // Create a sample document to delete
        await InitService.initAdminRole()
        await InitService.initRootUser()

        const vendedor = await UserService.findUserByUsername('root')
        const codigo = 'ABC123'
        const chances = 1
        const fechaHoraAsignacion = new Date()
        const fechaHoraWhatsapp = new Date()
        const mensajeWhatsapp = '¡Felicidades! Ha ganado un premio.'

        // Llamar a la función createCodigo con los datos definidos
        const createdDoc = await createCodigo({}, { codigo, vendedor, chances, fechaHoraAsignacion, fechaHoraWhatsapp, mensajeWhatsapp })

        const deletionResult = await deleteCodigo(createdDoc._id)

        expect(deletionResult.id).toBe(createdDoc._id)
        expect(deletionResult.success).toBe(true)

        // Fetch the deleted document from the database to check it was deleted
        const fetchedDoc = await findCodigo(createdDoc._id)
        expect(fetchedDoc).toBeNull()
    })

    it('should throw an error if the document does not exist', async () => {
        try {
            await deleteCodigo('nonExistingId')
            // If the function does not throw an error, fail the test
            expect(true).toBe(false)
        } catch (error) {
            expect(error).toBeDefined()
        }
    })
})