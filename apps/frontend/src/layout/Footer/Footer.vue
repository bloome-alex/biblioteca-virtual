<template>
  <v-footer dark >
    <v-card
        flat
        tile
        class="text-center"
        min-width="100%"
        height="100px"
    >
      <v-card-actions>
        <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
        <div class="pt-4">
          {{ new Date().getFullYear() }} <strong>@DRACUL</strong>
        </div>

        <v-spacer></v-spacer>
        <dark-mode ></dark-mode>
      </v-card-actions>

    </v-card>
  </v-footer>
</template>

<script>
import {DarkMode} from "@dracul/customize-frontend";

export default {
  name: "Footer",
  components: {DarkMode}
}
</script>

<style scoped>

</style>
