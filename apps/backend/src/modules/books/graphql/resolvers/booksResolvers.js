import { createBook } from '../../service/bookService.js'

export default {
    Mutation: {
        sendBook: async (_, {title, description}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_CREATE)) throw new ForbiddenError("Not Authorized")
            return await createBook({title, description})
        }
    }
}