import apolloClient from '../../../apollo'
class BooksProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    sendBook({title, description}){
        return this.gqlc.mutate({
            mutation: require('./gql/sendBook.graphql'),
            variables: {title, description}
        })
    }
}
const booksProvider = new BooksProvider()
booksProvider.setGqlc(apolloClient)
export default booksProvider
