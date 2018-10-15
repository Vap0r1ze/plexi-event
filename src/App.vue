<template>
  <div id="app" :class="{ dark: lit }">
    <h1>Carve your pumpkin!</h1>
    <pumpkin :lit="lit" @light="lit = !lit"/>
  </div>
</template>

<script>
import Pumpkin from './components/Pumpkin.vue'

export default {
  components: {
    Pumpkin
  },
  data () {
    return {
      lit: false
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Raleway");

#app {
  height: 100vh;
  font-family: 'Google Sans', Raleway;
  overflow: hidden;
  transition: .2s background ease-in-out;
  width: 100vw;
}
h1 {
  color: #642116;
  font-size: 3rem;
  font-weight: 700;
  margin: 1.5rem;
  text-align: center;
  transition: .2s color ease-in-out;
}

#app.dark {
  background: #21252b;
}
#app.dark h1 {
  color: #fff;
}
</style>
