import Book from '../model/Book'

export const createBook = async ({title, description}) => {
    const book = new Book({title, description})
    return await book.save()
}