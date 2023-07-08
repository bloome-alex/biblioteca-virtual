import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { findCodigoByCodigo } from '../../../src/modules/sorteo/services/CodigoService'
import Codigo from '../../../src/modules/sorteo/models/CodigoModel'

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

describe('findCodigoByCodigo', () => {
    it('Debería devolver el documento correcto cuando se proporciona un código válido', async () => {
        // Crear códigos en la base de datos
        const codigo1 = { _id: mongoose.Types.ObjectId(), codigo: 'ABC123' }
        const codigo2 = { _id: mongoose.Types.ObjectId(), codigo: 'DEF456' }
        const codigo3 = { _id: mongoose.Types.ObjectId(), codigo: 'GHI789' }
        await Codigo.create([codigo1, codigo2, codigo3])

        // Llamar a la función findCodigoByCodigo con un código válido y verificar que el resultado sea el código correcto
        const result1 = await findCodigoByCodigo('ABC123')
        expect(result1.toObject()).toMatchObject({ codigo: 'ABC123' })

        const result2 = await findCodigoByCodigo('DEF456')
        expect(result2.toObject()).toMatchObject({ codigo: 'DEF456' })

        const result3 = await findCodigoByCodigo('GHI789')
        expect(result3.toObject()).toMatchObject({ codigo: 'GHI789' })
    })

    it('Debería devolver null cuando se proporciona un código no existente', async () => {
        // Llamar a la función findCodigoByCodigo con un código no existente y verificar que el resultado sea null
        const result = await findCodigoByCodigo('XYZ789')
        expect(result).toBeNull()
    })
})