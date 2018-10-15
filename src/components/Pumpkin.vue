<template>
  <div class="pumpkin">
    <div class="carve-actions" :class="{ dark: lit }">
      <button @click="undo">Undo</button>
      <button @click="redo">Redo</button>
      <button @click="clear">Clear</button>
    </div>
    <div class="pumpkin-actions">
      <button @click="$emit('light')">{{ lit ? 'Put Out' : 'Light' }}</button>
    </div>
    <svg :width="size" :height="size" @mousedown="beginPath" @touchstart="beginPath" @mousemove="movePath"
    @touchmove="movePath" @mouseup="closePath" @touchend="closePath" ref="svg">
      <defs>
        <clipPath id="pumpkin-body">
          <path d="M122.66274,51.51079a125.49847,125.49847,0,0,0-48,22c-16.08176,12.07821-25.03056,24.993-31.5,34.5-15.27182,22.44243-21.296,42.8249-24.5,54-8.56691,29.8802-8.27617,54.03418-8,68,.50379,25.47668.64471,53.02751,15.5,83.5,5.48277,11.24674,12.89852,26.06409,28.75,39.25,18.82083,15.656,39.76123,20.88275,52.25,24,9.484,2.36725,16.20449,3.1481,28.25,4.5,40.04331,4.49417,70.51261,2.68015,110.91668.08335a173.34709,173.34709,0,0,0,26.16668-3.16669c11.38141-2.35587,26.04245-5.42484,42.16666-15.16666a110.05386,110.05386,0,0,0,29.83334-26.5c11.73551-15.1134,16.33289-29.32913,19.83332-40.5,4.694-14.97995,5.85705-26.56476,7.33334-42.16665,1.19684-12.64858,2.72324-29.59548,1-51.33333-1.17252-14.79061-3.653-43.00792-18.16666-75.5-6.21087-13.90447-13.58642-29.99388-29.83334-45.66667a119.26963,119.26963,0,0,0-25-18.5,115.36509,115.36509,0,0,0-29.5-11.25" transform="translate(-10.56392)" fill="#f18f26"/>
        </clipPath>
        <filter id="inset-shadow">
          <feOffset dx="10s" dy="10"/>                                                         <!-- Shadow Offset -->
          <feGaussianBlur stdDeviation="5" result="offset-blur"/>                           <!-- Shadow Blur -->
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/> <!-- Invert the drop shadow to create an inner shadow -->
          <feFlood flood-color="#675a00" flood-opacity="1" result="color"/>                     <!-- Color & Opacity -->
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>               <!-- Clip color inside shadow -->
          <feComponentTransfer in="shadow" result="shadow">                                   <!-- Shadow Opacity -->
              <feFuncA type="linear" slope=".75"/>
          </feComponentTransfer>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>                       <!-- Put shadow over original object -->
      </filter>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" style="fill: #f18f26" clip-path="url(#pumpkin-body)"/>
      <g ref="g" clip-path="url(#pumpkin-body)">
        <path v-for="i in paths.length" :key="i" :d="paths[i-1]" :fill="lit ? '#ffe100' : '#642116'" :filter="lit && 'url(#inset-shadow)'"/>
        <path v-if="path" :d="path" stroke-width="5" stroke="#642116" fill="none"/>
      </g>
      <path d="M161.19165,54.8082l8.711-48.67625A7.44313,7.44313,0,0,1,177.22937,0h29.43982a7.44312,7.44312,0,0,1,7.34667,6.24878L221.92914,54.925a7.44312,7.44312,0,0,1-7.34667,8.63747h-46.0641A7.44313,7.44313,0,0,1,161.19165,54.8082Z" transform="translate(-10.56392)" fill="#3f7123"/>
      <path d="M251.53656,10.56368c-35.49078,0-66.15411,21.63758-80.61365,53H332.15027C317.69067,32.20126,287.02734,10.56368,251.53656,10.56368Z" transform="translate(-10.56392)" fill="#5c913b"/>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    lit: { type: Boolean, required: true }
  },
  data () {
    return {
      path: null,
      paths: [],
      cache: [],
      size: Math.min(window.innerWidth, 384)
    }
  },
  methods: {
    beginPath (e) {
      e.preventDefault()
      if (this.path || this.lit) return
      let [ x, y ] = this.getPoints(e)
      this.path = `M${x},${y}`
    },
    movePath (e) {
      e.preventDefault()
      if (this.path) {
        let [ x, y ] = this.getPoints(e)
        this.path += `L${x},${y}`
      }
    },
    closePath (e) {
      e.preventDefault()
      if (this.path) {
        if (this.path.indexOf('L') >= 0) {
          this.paths.push(`${this.path}z`)
          this.cache = []
        }
        this.path = null
      }
    },
    undo () {
      if (this.lit) return
      if (this.cache[this.cache.length - 1] instanceof Array)
        this.paths = this.cache.pop()
      else if (this.paths.length)
        this.cache.push(this.paths.pop())
    },
    redo () {
      if (this.lit) return
      let path = this.cache.pop()
      if (path && !(path instanceof Array))
        this.paths.push(path)
    },
    clear () {
      if (this.lit) return
      this.cache.push(this.paths.slice())
      this.paths = []
    },
    handleKeyDown (e) {
      switch (e.keyCode) {
        case 89: // y
          if (e.ctrlKey && !e.shiftKey)
            this.redo()
        break
        case 90: // z
          if (e.ctrlKey && e.shiftKey)
            this.redo()
          else if (e.ctrlKey)
            this.undo()
        break
      }
    },
    getPoints (e) {
      let { x, y } = this.$refs.svg.getBoundingClientRect()
      if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
        let touch = e.changedTouches.item(0)
        return [ touch.pageX - x, touch.pageY - y ]
      } else {
        return [ e.pageX - x, e.pageY - y ]
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }
}
</script>

<style scoped>
.pumpkin {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  background: #f18f26;
  border: 0;
  border-radius: .25rem;
  color: #fff;
  cursor: pointer;
  font-size: 2rem;
  margin: 0 .25rem;
  outline: none;
  padding: .25rem .75rem;
  transition: .2s background ease-in-out, .2s color ease-in-out;
  user-select: none;
}
.carve-actions {
  margin-bottom: .5rem;
}
.carve-actions.dark button {
  background: #383e4a;
  color: #21252b;
  cursor: default;
}
.pumpkin-actions {
  margin-bottom: 1rem;
}
.pumpkin-actions button {
  background: transparent;
  border: 3px solid #f18f26;
  color: #f18f26;
  padding: .25rem 4rem;
}
path {
  transition: .2s stroke ease-in-out, .2s fill ease-in-out;
}
</style>
