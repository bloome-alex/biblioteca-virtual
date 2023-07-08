import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import Codigo from '../../../src/modules/sorteo/models/CodigoModel'
import { obtenerCantidadDeCodigos } from '../../../src/modules/sorteo/services/CodigoService'

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


describe('obtenerCantidadDeCodigos', () => {
    it('Debería devolver la cantidad correcta de códigos en la base de datos', async () => {
        // Crear algunos códigos en la base de datos
        const codigo1 = { _id: mongoose.Types.ObjectId(), codigo: 'ABC123' }
        const codigo2 = { _id: mongoose.Types.ObjectId(), codigo: 'DEF456' }
        const codigo3 = { _id: mongoose.Types.ObjectId(), codigo: 'GHI789' }
        await Codigo.create([codigo1, codigo2, codigo3])

        // Llamar a la función obtenerCantidadDeCodigos y verificar que devuelve la cantidad correcta
        const cantidadDeCodigos = await obtenerCantidadDeCodigos()
        expect(cantidadDeCodigos).toEqual(3)
    })

    it('Debería devolver 0 cuando no hay códigos en la base de datos', async () => {
        // Llamar a la función obtenerCantidadDeCodigos cuando no hay códigos y verificar que devuelve 0
        const cantidadDeCodigos = await obtenerCantidadDeCodigos()
        expect(cantidadDeCodigos).toEqual(0)
    })
})