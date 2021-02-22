<template>
  <div id="main-wrap">
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="Router" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transitionName: "slide-right",
    };
  },
  methods: {

  },
  watch: {
    $route (to, from) {
      let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "slide-left";
      }
      this.$router.isBack = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";

#main-wrap {
  overflow: auto;
  position: fixed;
  top: $headerHeight + 1.25rem;
  left: $navMenu;
  right: 1.25rem;
  bottom: 1.25rem;
  background-color: white;
  //   border: 1.25rem solid #f7f7f7;
  @include webkit(box-shadow, 0 1rem 1rem 0px rgba(0, 0, 0, 0.6));
  border-bottom: none;
  @include webkit(transition, all 0.2s ease 0s);
  @include webkit(box-sizing, border);
  padding: 1.25rem 1.25rem;
}
//滚动条
#main-wrap::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* 滚动条的滑块 */
#main-wrap::-webkit-scrollbar-thumb {
  background-color: #3c5b9a !important;
  border-radius: 10px;
}
.open {
  #main-wrap {
    left: $navMenu + 1.25rem;
  }
}
.close {
  #main-wrap {
    left: $navMenuMin + 1.25rem;
  }
}

.Router {
  position: absolute;
  width: calc(100% - 2.5rem);
  transition: all 1s ease;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  @include webkit(transform, translate(100%, 0));
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0.2;
  @include webkit(transform, translate(-120%, 0));
}
@import "../../../styles/responseCss/Layout/Main/Mobile.scss";
</style>