import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { UserService } from '@dracul/user-backend'
import { InitService } from '@dracul/user-backend'
import { UserInputError } from "apollo-server-errors"

import { findCodigo, createCodigo, updateCodigo, deleteCodigo } from '../../../src/modules/sorteo/services/CodigoService'

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

describe('updateCodigo', () => {
    it('should update the document with the given id', async () => {
        // Create a sample document to update

        await InitService.initAdminRole()
        await InitService.initRootUser()

        const vendedor = await UserService.findUserByUsername('root')
        const codigo = 'ABC123'
        const chances = 1
        const fechaHoraAsignacion = new Date()
        const fechaHoraWhatsapp = new Date()
        const mensajeWhatsapp = '¡Felicidades! Ha ganado un premio.'

        const initialDoc = await createCodigo({}, { codigo, vendedor, chances, fechaHoraAsignacion, fechaHoraWhatsapp, mensajeWhatsapp })


        // Call the updateCodigo function
        const updatedDoc = await updateCodigo({}, initialDoc._id, {
            codigo: 'newCodigo',
            vendedor,
            chances: 5,
            fechaHoraAsignacion: new Date(),
            fechaHoraWhatsapp: new Date(),
            mensajeWhatsapp: 'Updated message',
        })

        const fetchedDoc = await findCodigo(updatedDoc._id)

        // Assertions
        expect(fetchedDoc).toBeDefined()
        expect(fetchedDoc.codigo).toBe('newCodigo')
        expect(fetchedDoc.vendedor.toObject()._id).toEqual(vendedor._id)
        expect(fetchedDoc.chances).toBe(5)

        // Clean up - delete the document after the test
        await deleteCodigo(fetchedDoc._id)
    })

    it('should throw a UserInputError if validation fails', async () => {
        // Create a sample document to update
        await InitService.initAdminRole()
        await InitService.initRootUser()

        const vendedor = await UserService.findUserByUsername('root')
        const codigo = 'ABC123'
        const chances = 1
        const fechaHoraAsignacion = new Date()
        const fechaHoraWhatsapp = new Date()
        const mensajeWhatsapp = '¡Felicidades! Ha ganado un premio.'

        // Llamar a la función createCodigo con los datos definidos
        const initialDoc = await createCodigo({}, { codigo, vendedor, chances, fechaHoraAsignacion, fechaHoraWhatsapp, mensajeWhatsapp })

        // Call the updateCodigo function with invalid properties
        try {
            await updateCodigo({}, initialDoc._id, {
                codigo: '', // Invalid value
                vendedor,
                chances: 5,
                fechaHoraAsignacion: new Date(),
                fechaHoraWhatsapp: new Date(),
                mensajeWhatsapp: 'Updated message',
            })
            // If the function does not throw an error, fail the test
            expect(true).toBe(false)
        } catch (error) {
            expect(error).toBeInstanceOf(UserInputError)
        }
    })
})
