import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { UserService } from '@dracul/user-backend'
import { InitService } from '@dracul/user-backend'
import { UserInputError } from "apollo-server-errors"

import { createCodigo } from '../../../src/modules/sorteo/services/CodigoService'

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

describe('createCodigo', () => {
    it('Debería crear un nuevo código en la base de datos y devolver el documento creado', async () => {
        // Definir los datos del nuevo código

        await InitService.initAdminRole()
        await InitService.initRootUser()

        const vendedor = await UserService.findUserByUsername('root')
        const codigo = 'ABC123'
        const chances = 5
        const fechaHoraAsignacion = new Date()
        const fechaHoraWhatsapp = new Date()
        const mensajeWhatsapp = '¡Felicidades! Ha ganado un premio.'

        // Llamar a la función createCodigo con los datos definidos
        const createdCodigo = await createCodigo({}, { codigo, vendedor, chances, fechaHoraAsignacion, fechaHoraWhatsapp, mensajeWhatsapp })

        expect(createdCodigo.chances).toEqual(chances)
        expect(createdCodigo.fechaHoraAsignacion).toEqual(fechaHoraAsignacion)
        expect(createdCodigo.fechaHoraWhatsapp).toEqual(fechaHoraWhatsapp)
        expect(createdCodigo.mensajeWhatsapp).toEqual(mensajeWhatsapp)
        expect(createdCodigo.id).toBeDefined()
        expect(createdCodigo.vendedor).toBeDefined()
        expect(createdCodigo.vendedor._id).toEqual(vendedor._id)
    })

    it('Debería lanzar una excepción UserInputError si se produce un error de validación', async () => {

        // Intentar crear un código con datos inválidos
        const invalidCodigo = { codigo: '', vendedor: mongoose.Types.ObjectId(), chances: -1 }

        // Llamar a la función createCodigo con los datos inválidos y verificar que lance una excepción UserInputError
        await expect(createCodigo({}, invalidCodigo)).rejects.toThrow(UserInputError)
    })
})