<template>
  <div id="header-wrap">
    <div class="headertop">
      <i
        @click="editIsCollapse"
        class="el-icon-s-operation menuSwitch"
      ></i>

      <div class="rightInfo">
        <el-tooltip
          content="全屏/正常"
          placement="top"
        >
          <i
            class="el-icon-full-screen greeting"
            @click="screenfull"
          ></i>
        </el-tooltip>

        <el-tooltip
          content="刷新"
          placement="top"
        >
          <i
            @click="refresh"
            class="el-icon-refresh-left greeting"
          ></i>
        </el-tooltip>

        <span class="greeting">您好,任我行</span>

        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <div class="block userPhoto">
              <el-avatar
                class=""
                :size="40"
                :src="circleUrl"
                shape="square"
              ></el-avatar>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-picture-outline"
              command="changeAv"
            >更换头像
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-setting"
              command="editPassWord"
            >修改密码</el-dropdown-item>
            <!-- <el-dropdown-item icon="el-icon-setting">设置</el-dropdown-item> -->
            <el-dropdown-item
              icon="el-icon-switch-button"
              command="exit"
            >退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="tab">
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        @tab-remove="removeTab"
        @tab-click="clickTab"
        tab-position="bottom"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.path"
          :label="item.meta.name"
          :name="item.path"
          :closable="item.meta.name=='首页' ? false : true"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 换头像弹窗 -->
    <el-dialog
      v-loading="changeAvatarLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="更换头像"
      :visible.sync="changeAvatarDialog"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <!-- :http-request="submitUpload" -->
      <el-form>
        <el-form-item label="更换头像">
          <el-upload
            class="upload-demo"
            drag
            :limit=1
            action="自定义上传,这里随便填"
            :auto-upload="false"
            :on-change="fileChange"
            :file-list="files"
          >

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div
              class="el-upload__tip"
              slot="tip"
            >只能上传jpg/png文件，且不超过3M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- <el-form>
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:8884/Tool/AvatarUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div
            class="el-upload__tip"
            slot="tip"
          >只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form> -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changeAvatarDialog=false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpload()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog
      v-loading="editPassWordLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="修改密码"
      :visible.sync="editPassWordDialog"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="旧密码">
          <el-input
            placeholder="请输入旧密码"
            v-model="editPassWordForm.oldPassWord"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="">

        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            placeholder="请输入新密码"
            v-model="editPassWordForm.newPassWord"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input
            placeholder="请输入新密码"
            v-model="editPassWordForm.newPassWord2"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="savePassWord(0)">取 消</el-button>
        <el-button
          type="primary"
          @click="savePassWord(1)"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import store from "@/store";
import screenfull from 'screenfull'
import { AvatarUploadApi } from '../../../api/tool.js'
import { EditNewPassWordApi } from '../../../api/userInfo.js'

export default {
  data () {
    return {
      files: [],
      isFullscreen: false,
      circleUrl: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",//https://s1.ax1x.com/2020/11/02/BrMKNd.jpg
      editableTabsValue: "",
      changeAvatarDialog: false,
      changeAvatarLoading: false,
      editPassWordDialog: false,
      editPassWordLoading: false,
      editPassWordForm: {
        oldPassWord: '',
        newPassWord: '',
        newPassWord2: '',
      }
    };
  },
  watch: {
    tabIndex (val) {
      this.editableTabsValue = val;
      sessionStorage.setItem("tabIndexJSON", val);
    },
    editableTabs (arr) {
      sessionStorage.setItem("editableTabsJSON", JSON.stringify(arr));
    },
  },
  computed: {
    ...mapState(["editableTabs", "tabIndex"]),
  },
  mounted () {
    this.editableTabsValue = this.tabIndex;
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false
      }
    }
  },
  methods: {

    //文件状态改变的时候会触发
    fileChange (file, fileList) {
      //拿到文件列表
      this.files = fileList;
      console.log(file);
      //   var reader = new FileReader(); //实例化文件读取对象
      //   reader.readAsDataURL(fileList[0].raw); //将文件读取为 DataURL,也就是base64编码
      //   reader.onload = (ev) => { //文件读取成功完成时触发
      //     var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
      //     this.POSTUpload(ev.target.result)
      //     console.log(ev)
      //   }
    },
    //开始上传图片
    submitUpload () {
      var reader = new FileReader(); //实例化文件读取对象
      reader.readAsDataURL(this.files[0].raw); //将文件读取为 DataURL,也就是base64编码
      reader.onload = (ev) => { //文件读取成功完成时触发
        var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
        console.log(ev);
        this.POSTUpload(ev.target.result)
      }
    },
    POSTUpload (flie) {
      //获取公司ID,获取用户ID
      let companyId = JSON.parse(this.$store.state.userInfo)[0].companyId;
      let userId = JSON.parse(this.$store.state.userInfo)[0].userId;

      console.log(companyId, userId, flie);

      AvatarUploadApi(companyId, userId, flie)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '成功',
              message: '上传成功,重新登录后生效',
              type: 'success'
            });
          }
          else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
              duration: 0
            });
          }

        })
        .catch(error => {
          this.$notify.error({
            title: 'catch错误',
            message: error,
            duration: 0
          });
        })
    },
    //下拉菜单
    handleCommand (command) {
      // 退出
      if (command == 'exit') {
        this.$router.push("/Login");
      }
      else if (command == 'changeAv') {
        this.changeAvatarDialog = true;
      }
      else if (command == 'editPassWord') {
        this.editPassWordDialog = true;
      }

    },

    // 保存新密码
    savePassWord (type) {
      if (type == 1) {
        if (this.editPassWordForm.newPassWord.length < 6 || this.editPassWordForm.newPassWord.length > 12) {
          this.$message({
            showClose: true,
            center: true,
            duration: 1500,
            message: '密码在6-12位之间',
            type: 'warning',
            offset: 130
          });
          return;
        }
        if (this.editPassWordForm.newPassWord != this.editPassWordForm.newPassWord2) {
          this.$message({
            showClose: true,
            center: true,
            duration: 1500,
            message: '两次密码不一致喔',
            type: 'warning',
            offset: 130
          });
          return;
        }
        let userId = JSON.parse(this.$store.state.userInfo)[0].userId;
        EditNewPassWordApi(userId, this.editPassWordForm.oldPassWord, this.editPassWordForm.newPassWord)
          .then(res => {
            if (res.data.stateCode == 0) {
              this.$notify({
                title: '修改成功',
                message: '请牢记您的新密码',
                type: 'success'
              });
              this.editPassWordDialog = false;
              this.editPassWordForm = this.$options.data().editPassWordForm;
            }
            else {
              this.$notify({
                title: '修改失败',
                message: res.data.message,
                type: 'warning'
              });
            }
          })
          .catch(error => {
            this.$notify.error({
              title: 'catch错误',
              message: error,
              duration: 0
            });
          })
      }
      else {
        this.editPassWordDialog = false;
        this.editPassWordForm = this.$options.data().editPassWordForm;
      }
    },
    // 删除tab
    removeTab (val) {
      store.commit("editableTabsDel", val);
    },
    // 跳转
    clickTab (val) {
      if (window.location.hash.split("#")[1] == val.name) return;
      this.$router.push(val.name);
      return;
    },
    //改变是否展开菜单的值
    editIsCollapse () {
      this.$store.commit("setIsCollapse");
    },
    //刷新页面
    refresh () {
      window.location.reload();
    },
    //全屏事件
    screenfull () {
      screenfull.toggle()
      this.isFullscreen = true
    },
    //是否全屏并按键ESC键的方法
    checkFull () {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";

#header-wrap {
  margin: 0;
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: $headerHeight;
  background-color: white;
  @include webkit(transition, all 0.2s ease 0s);
  @include webkit(box-shadow, 0 0.625rem 1rem 0px rgba(0, 0, 0, 0.3));
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.headertop {
  margin: 0;
  background-color: #3c5b9a;
  height: 3.625rem;
  line-height: 3.625rem;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menuSwitch {
  height: 3.625rem;
  line-height: 3.625rem;
  font-size: 1.25rem;
  color: white;
  //   font-weight: 1000 !important;
  cursor: pointer;
  z-index: 99;
}
.userPhoto {
  cursor: pointer;
  height: 2.5rem;
  padding: 0px 1.25rem;
}
.tab {
  padding-left: 1.875rem;
}
.rightInfo {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.greeting {
  color: white;
  padding: 0px 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
.greeting:nth-child(3) {
  font-size: 1rem;
  font-weight: normal;
}

@import "../../../styles/responseCss/Layout/Header/Mobile.scss";
</style>