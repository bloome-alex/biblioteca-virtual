import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import Codigo from '../../../src/modules/sorteo/models/CodigoModel'
import { findCodigoLibre, encontrarCodigoLibreAsignarVendedor } from '../../../src/modules/sorteo/services/CodigoService'

import { UserService } from '@dracul/user-backend'
import { InitService } from '@dracul/user-backend'

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

describe('findCodigoLibre', () => {
    it('Debería devolver el primer código sin vendedor asignado', async () => {
        await InitService.initAdminRole()
        await InitService.initRootUser()
        const vendedor = await UserService.findUserByUsername('root')

        // Crear códigos en la base de datos, algunos con vendedor asignado y otros sin vendedor
        const codigo1 = { _id: mongoose.Types.ObjectId(), codigo: 'ABC123' }
        const codigo2 = { _id: mongoose.Types.ObjectId(), codigo: 'DEF456', vendedor }
        const codigo3 = { _id: mongoose.Types.ObjectId(), codigo: 'GHI789', vendedor }
        await Codigo.create([codigo1, codigo2, codigo3])

        // Llamar a la función findCodigoLibre y verificar que devuelva el primer código sin vendedor asignado
        const result = await findCodigoLibre()
        expect(result.toObject().codigo).toEqual('ABC123')
        expect(result.toObject().vendedor).toBe(undefined)
    })

    it('Debería devolver el código correcto cuando se encuentra uno libre', async () => {
        await InitService.initAdminRole()
        await InitService.initRootUser()
        const vendedor = await UserService.findUserByUsername('root')
    
        // Crear códigos en la base de datos, algunos con vendedor asignado y otros sin vendedor
        const codigo1 = { _id: mongoose.Types.ObjectId(), codigo: 'ABC123' }
        const codigo2 = { _id: mongoose.Types.ObjectId(), codigo: 'DEF456', vendedor }
        const codigo3 = { _id: mongoose.Types.ObjectId(), codigo: 'GHI789', vendedor }
        await Codigo.create([codigo1, codigo2, codigo3])
    
        // Llamar a la función encontrarCodigoLibreAsignarVendedor y verificar que devuelve el código correcto
        const userId = vendedor._id.toString() // Obtener solo el ID como una cadena
        const chances = 5
        const result = await encontrarCodigoLibreAsignarVendedor(userId, chances)
    
        expect(result.toObject().codigo).toEqual('ABC123')
        expect(result.vendedor.toObject()._id.toString()).toEqual(userId)
        expect(result.toObject().chances).toEqual(chances)
        expect(result.fechaHoraAsignacion).toBeInstanceOf(Date)
    })

    it('Debería devolver null cuando no hay códigos sin vendedor asignado', async () => {
        await InitService.initAdminRole()
        await InitService.initRootUser()
        const vendedor = await UserService.findUserByUsername('root')

        // Crear códigos en la base de datos, todos con vendedor asignado
        const codigo1 = { _id: mongoose.Types.ObjectId(), codigo: 'ABC123', vendedor }
        const codigo2 = { _id: mongoose.Types.ObjectId(), codigo: 'DEF456', vendedor }
        const codigo3 = { _id: mongoose.Types.ObjectId(), codigo: 'GHI789', vendedor }
        await Codigo.create([codigo1, codigo2, codigo3])

        // Llamar a la función findCodigoLibre y verificar que devuelva null
        const result = await findCodigoLibre()
        expect(result).toBeNull()
    })
})