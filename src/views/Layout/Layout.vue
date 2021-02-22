<template>
  <div
    id="layout"
    :class="[isCollapse=='true' ? 'close' : 'open' ]"
  >
    <layoutHeader />
    <layoutHMain />
    <layoutNav class="layoutNav" />
  </div>
</template>

<script>
import layoutHeader from './Components/Header'
import layoutHMain from './Components/Main'
import layoutNav from './Components/Nav'
import { mapState } from 'vuex'

export default {
  name: 'layout',
  components: { layoutHeader, layoutHMain, layoutNav },
  data () {
    return {
      //   menuState: false
    };
  },
  computed: {
    //从Vuex里映射出来,可以直接this.isCollapse使用
    ...mapState(['isCollapse', 'isCollapse'])
  },
  created () {

  }
}
</script>

<style lang="scss">
@import "../../styles/responseCss/Layout/Mobile.scss";

// #layout {

// }
</style>