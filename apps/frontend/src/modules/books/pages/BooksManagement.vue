<template>
    <v-card>
        <v-card-title>Gestor de libros</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field label="titulo" v-model="title"></v-text-field>
                <v-text-field label="description" v-model="description"></v-text-field>
            </v-form>
        </v-card-text>
        <v-btn color="primary" block @click="sendBook">Enviar</v-btn>
    </v-card>
</template>

<script>
    import booksProvider from '../providers/booksProvider.js'

    export default {
        name: 'BooksManagement',
        data(){
            return{
                title: '',
                description: ''
            }
        },
        methods: {
            async sendBook(){
                const response = await booksProvider.sendBook({title: this.title, description: this.description})

                console.log(response.data)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>