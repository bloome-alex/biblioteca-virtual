import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import Codigo from '../../../src/modules/sorteo/models/CodigoModel'
import {createManyCodigos} from '../../../src/modules/sorteo/services/CodigoService'

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

describe('createManyCodigos', () => {

    const codigoId = mongoose.Types.ObjectId()
    const codigo = { _id: codigoId, codigo: "A2B3C4D5" }

    const segundoCodigoId = mongoose.Types.ObjectId()
    const segundoCodigo = { _id: segundoCodigoId, codigo: "A3B4C5D6" }

    const tercerCodigoId = mongoose.Types.ObjectId()
    const tercerCodigo = { _id: tercerCodigoId, codigo: "A7B8C9D10" }

    const codigos = [codigo, segundoCodigo, tercerCodigo]

    const batchSize = 2

    it('should create documents in batches', async () => {
        await createManyCodigos(codigos, batchSize)

        // Verify the documents were created
        const createdCodigos = await Codigo.find()
        expect(createdCodigos.length).toBe(codigos.length)

        // Verify the created documents match the sample data
        codigos.forEach((codigo, index) => {
            expect(createdCodigos[index].codigo).toBe(codigo.codigo)
        })
    })

    it('should handle errors gracefully', async () => {
        // Mock the console.error method
        jest.spyOn(console, 'error').mockImplementationOnce(() => { })

        // Mock the Codigo.create method to throw an error
        jest.spyOn(Codigo, 'create').mockImplementationOnce(() => {
            throw new Error('Mock create error')
        })

        // Call the function
        await createManyCodigos(codigos, batchSize)

        // Verify the error was logged
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('An error occurred'))

        // Restore the original implementations
        jest.spyOn(console, 'error').mockRestore()
        jest.spyOn(Codigo, 'create').mockRestore()
    })
})
