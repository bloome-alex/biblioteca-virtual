import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import Codigo from '../../../src/modules/sorteo/models/CodigoModel'
import { findCodigo } from '../../../src/modules/sorteo/services/CodigoService'

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


describe('findCodigo', () => {
    it('Debería devolver el documento correcto cuando se proporciona un ID válido', async () => {
        // Crear un código en la base de datos
        const codigoId = mongoose.Types.ObjectId()
        const codigo = { _id: codigoId, codigo: "A2B3C4D5" }

        const segundoCodigoId = mongoose.Types.ObjectId()
        const segundoCodigo = { _id: segundoCodigoId, codigo: "A3B4C5D6" }

        const tercerCodigoId = mongoose.Types.ObjectId()
        const tercerCodigo = { _id: tercerCodigoId, codigo: "A7B8C9D10" }

        await Codigo.create([codigo, segundoCodigo, tercerCodigo])

        // Llamar a la función findCodigo con el ID válido y verificar que el resultado sea el código correcto
        const result = await findCodigo(codigoId)
        expect(result.toObject()).toMatchObject({ codigo: "A2B3C4D5" })

        const segundoCodigoResult = await findCodigo(segundoCodigoId)
        expect(segundoCodigoResult.toObject()).toMatchObject({ codigo: "A3B4C5D6" })

        const tercerCodigoResult = await findCodigo(tercerCodigo)
        expect(tercerCodigoResult.toObject()).toMatchObject({ codigo: "A7B8C9D10" })
    })
})