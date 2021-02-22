<template>
  <div id="nav-wrap">
    <div class="MenuTop">
      <!-- src="" -->

      <el-avatar
        :src="circleUrl"
        :size="100"
        fit="contain"
      ></el-avatar>
      <!-- shape="square" -->

      <div class="UserText">
        <div class="MenuTopUserName">用户 : {{userInfos[0].userName}}</div>
        <div class="MenuTopJob">职位 : {{userInfos[0].userJob}}</div>
        <div class="MenuTopCompanyName">公司 : {{userInfos[0].companyName}}</div>
        <div class="MenuTopCompanyName">截止 : {{userInfos[0].expirationTime}} , {{userInfos[0].remainingDays}}天</div>
      </div>
    </div>

    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse=='true' ? true :false"
      background-color="transparent"
      div-color="#808080"
      active-div-color="#4e73df"
      unique-opened
      router
    >
      <el-submenu
        :index="item.menuId+''"
        v-for="(item,index) in menulist"
        :key="index"
      >
        <!-- 一级菜单 -->
        <template slot="title">
          <i v-bind:class="item.menuIcon_BS"></i>
          <span
            slot="title"
            class="MenuName"
          >
            {{item.menuName}}
          </span>
        </template>
        <!-- 二级菜单 -->
        <div class="childMenuBorder">
          <div class="childMenu">
            <el-menu-item
              style="border-radius:.35rem"
              v-for="(el,i) in item.childMenuList"
              :index="'/layout/' + el.pageUrl_BS"
              :key="i"
              @click="saveNavState('/layout/' +el.pageUrl_BS)"
            >
              {{el.menuName}}
            </el-menu-item>
          </div>
        </div>
      </el-submenu>
    </el-menu>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "navMenu",
  setup (props, { root }) {
    root.$router;
  },
  data () {
    return {
      circleUrl: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png", //"https://s1.ax1x.com/2020/11/02/BrMKNd.jpg",
      //被激活的项
      activePath: "",
      userInfos: [],
      //isCollapse: false,
      //默认的菜单数据,等待computed在created的时候赋值
      menulist: [],
    };
  },
  created () {
    //初始化menulist,从computed拿出被映射的值
    this.menulist = this.rightList;
    this.userInfos = JSON.parse(this.userInfo);
    //获取被激活的项,用于高亮
    this.activePath = window.sessionStorage.getItem("tabIndexJSON"); //activePath可弃用
  },
  watch: {
    tabIndex (val) {
      this.activePath = val;
    },
  },
  computed: {
    //从Vuex里映射出来
    ...mapState(["rightList", "userInfo", "tabIndex"]),
    //获取菜单是否缩放
    ...mapState(["isCollapse"]),
  },
  methods: {
    handleOpen (key, keyPath) {
      //   console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      //   console.log(key, keyPath);
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="scss">
@import "../../../styles/config.scss";
@import "../../../styles/elementuiEdit.scss";

.MenuTop {
  display: flex;
  color: White;
  width: 100%;
  padding-top: 1.5rem;
  flex-direction: column;
  align-items: center;
  height: 220px;
  //   @include webkit(transition, all 0.1s ease 0s);
}
.UserText {
  display: flex;
  margin-top: 1rem;
  flex-direction: column;
  width: 80%;
  align-items: flex-start;
}
.Avatar {
  //   width: 6rem;
  //   height: 6rem;
  //   border-radius: 50% !important;
}
.MenuTopJob {
  padding-top: 0.625rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.MenuTop .MenuTopUserName {
  font-size: 0.8rem;
  font-weight: 500;
}

.MenuTop .MenuTopCompanyName {
  padding-top: 0.625rem;
  font-weight: 500;
  font-size: 0.8rem;
}

#nav-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: rgba($color: #3c5b9a, $alpha: 1);
  margin: 0;
  @include webkit(transition, all 0.2s ease 0s);
}
//layout的class为open时
.open {
  #nav-wrap {
    width: $navMenu;
    .el-menu-vertical-demo {
      width: $navMenu;
    }
  }
}

//layout的class为close时
.close {
  #nav-wrap {
    width: $navMenuMin;
    .el-menu-vertical-demo {
      width: $navMenuMin;
    }
  }
  .MenuTop {
    visibility: hidden;
    width: $navMenuMin;
  }
}

.el-menu-vertical-demo {
  width: $navMenu;
  @include webkit(transition, all 0.05s ease 0s);
}
.childMenuBorder {
  padding: 0.625rem 1rem;
}
.childMenu {
  background-color: white;
  padding: 0.3125rem;
  border-radius: 0.35rem;
  @include webkit(box-shadow, 0 0.625rem 1rem 0px rgba(0, 0, 0, 0.3));
}
.MenuName {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.25rem;
}
.MenuName:hover {
  color: white;
}
@import "../../../styles/responseCss/Layout/Nav/Mobile.scss";
</style>