import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookSchema = Schema({
    title: String,
    description: String
})

const Book = mongoose.model('book', BookSchema)

export default Book