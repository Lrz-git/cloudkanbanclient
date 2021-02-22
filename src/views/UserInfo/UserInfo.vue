<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增账户</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑账户</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="DelUser ()"
        >
          删除账户
        </div>

      </div>

      <div class="searchArea">
        <el-select
          class="group_like"
          v-model="groupIds"
          placeholder="请选择权限"
          multiple
          collapse-tags
          filterable
        >
          <el-option
            v-for="item in groupInfo"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId"
          >
          </el-option>
        </el-select>

        <el-input
          placeholder="姓名"
          v-model="userName_like"
          clearable
          class="like_name"
        >
        </el-input>
      </div>
      <div class="searchArea">

        <el-button
          type="primary"
          class="btnSearch"
          icon="el-icon-search"
          @click="query()"
        >搜索</el-button>

        <el-button
          type="danger"
          class="btnReset"
          icon="el-icon-refresh"
          @click="ResetPassWord()"
        >重置密码</el-button>

        <el-button
          type="warning"
          class="btnfreeze"
          icon="el-icon-lock"
          @click="FrozenAccount()"
        >冻结账户</el-button>

      </div>

      <!-- <div class="elseArea">
        <el-button
          type="success"
          icon="el-icon-printer"
          circle
        ></el-button>
        <el-button
          type="info"
          icon="el-icon-folder-opened"
          circle
        ></el-button>
      </div> -->

    </div>
    <div class="content">
      <el-table
        v-loading="tableLoading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%"
        :height="tableHeight"
        empty-text="这儿什么都没有~"
        :lazy="true"
        @current-change="handleCurrentChange"
        @row-dblclick="dblclick"
      >

        <el-table-column
          label="序号"
          type="index"
        />

        <el-table-column
          prop="userName"
          label="姓名"
        />
        <el-table-column
          prop="userPhone"
          label="账号"
          show-overflow-tooltip
        />
        <el-table-column
          prop="groupName"
          label="所属权限组"
          sortable
        />

        <el-table-column
          prop="userJob"
          label="职位"
          sortable
        />

        <el-table-column
          prop="userAvatar"
          label="照片"
        />

        <el-table-column
          prop="userEmail"
          label="邮箱"
        />
        <el-table-column
          label="ID"
          prop="userId"
          v-if="false"
        />
        <el-table-column
          label="groupId"
          prop="groupId"
          v-if="false"
        />
      </el-table>

      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next,sizes,total"
        :page-sizes="[10, 20, 25, 30]"
        :page-size="20"
        :total="1000"
      >
      </el-pagination>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增账户"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="姓名">
          <el-input
            v-model="addForm.Name"
            clearable
            prefix-icon="el-icon-user"
            placeholder="请输入姓名(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="账号(手机号)">
          <el-input
            v-model="addForm.Phone"
            maxlength="11"
            type="number"
            clearable
            prefix-icon="el-icon-mobile-phone"
            placeholder="请输入账号(必填)"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属权限组">
          <el-select
            v-model="addForm.GroupId"
            placeholder="请选择所属权限组(必选)"
            filterable
          >
            <el-option
              v-for="item in groupInfo"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            >
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="职位">
          <el-input
            v-model="addForm.Job"
            placeholder="请输入职位"
            prefix-icon="el-icon-mouse"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="照片">
          <el-input></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱">
          <el-input
            v-model="addForm.Email"
            clearable
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="AddUser(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="AddUser(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑账户"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="姓名">
          <el-input
            v-model="editForm.userName"
            clearable
            prefix-icon="el-icon-user"
            placeholder="请输入姓名(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="账号(手机号)">
          <el-input
            v-model="editForm.userPhone"
            maxlength="11"
            type="number"
            clearable
            prefix-icon="el-icon-mobile-phone"
            placeholder="请输入账号(必填)"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属权限组">
          <el-select
            v-model="editForm.groupId"
            placeholder="请选择所属权限组(必选)"
            filterable
          >
            <el-option
              v-for="item in groupInfo"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            >
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="职位">
          <el-input
            v-model="editForm.userJob"
            placeholder="请输入职位"
            prefix-icon="el-icon-mouse"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="照片">
          <el-input></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱">
          <el-input
            v-model="editForm.userEmail"
            clearable
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditForm=false">取 消</el-button>
        <el-button
          type="primary"
          @click="SaveChanges()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetGroupApi, GetUserApi, AddUserApi, EditUserApi, DelUserApi, EditPassWordApi } from '../../api/userInfo.js'
var myCompanyId;

export default {
  mounted () {
    myCompanyId = JSON.parse(this.$store.state.userInfo)[0].companyId
    let _this = this;//赋值vue的this
    _this.pageResize();
    window.onresize = () => {
      //调用methods中的事件
      _this.pageResize();
    }
    _this.getGroup();
    _this.query();
  },
  //注销window.onresize事件
  destroyed () {
    window.onresize = null;
  },
  data () {
    return {
      currentRow: null,
      dialogForm: false,
      dialogEditForm: false,
      tableLoading: false,
      addLoading: false,
      editLoading: false,
      tableHeight: window.innerHeight - 300,
      userName_like: '',
      groupInfo: [],
      groupIds: '',
      tableData: [],
      addForm: {
        Name: '',
        Phone: '',
        GroupId: '',
        Job: '',
        Avatar: null,
        Email: ''
      },
      editForm: {
        userName: '',
        userPhone: '',
        groupId: '',
        userJob: '',
        userAvatar: null,
        userEmail: ''
      }

    }
  },
  methods: {
    pageResize () {
      this.$nextTick(() => {
        let w = window.innerWidth;
        // console.log('w:' + w);
        if (w > 320 && w < 767) {
          //   console.log('1');
          this.tableHeight = window.innerHeight - 250
        }
        else if (w > 767 && w < 1023) {
          //   console.log('2');
          //   手机横屏
          if (window.innerHeight > 320 && window.innerHeight < 400) {
            this.tableHeight = window.innerHeight - 230
          }
          else {
            this.tableHeight = window.innerHeight - 350
          }
        }
        else if (w > 1023 && w < 1367) {
          //   console.log('3');
          this.tableHeight = window.innerHeight - 360
        }
        else {
          //   console.log('4');
          this.tableHeight = window.innerHeight - 250
        }
      })
    },
    getGroup () {
      GetGroupApi(myCompanyId)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.groupInfo = JSON.parse(response.data.myData);
          }
          else if (response.data.stateCode == 4 || response.data.stateCode == 3) {
            this.$notify.error({
              title: '提示',
              message: response.data.message,
              duration: 0
            });
          }
          else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: response.data.message,
              duration: 0
            });
          }
        })
    },
    query () {
      this.tableLoading = true;
      console.log(this.userName_like);
      GetUserApi(myCompanyId, this.groupIds.join(','), this.userName_like)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.tableData = JSON.parse(response.data.myData);
          }
          else if (response.data.stateCode == 4 || response.data.stateCode == 3) {
            this.$notify.error({
              title: '提示',
              message: response.data.message,
              duration: 0
            });
          }
          else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: response.data.message,
              duration: 0
            });
          }
        })
        .catch(error => { });
      this.tableLoading = false;
    },
    AddUser (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.Name == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入姓名', duration: 1000
          });
          return;
        }
        if (this.addForm.Phone == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入账号(手机号)', duration: 1000
          });
          return;
        }
        if (this.addForm.GroupId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择所属权限组', duration: 1000
          });
          return;
        }
        if (this.addForm.Job == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入职位', duration: 1000
          });
          return;
        }
        if (this.addForm.Email == '') {

        }
        this.addLoading = true;
        AddUserApi(myCompanyId, this.addForm.GroupId, this.addForm.Name, this.addForm.Phone, this.addForm.Job, this.addForm.Avatar, this.addForm.Email)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加账户成功',
                message: this.addForm.Name + ' 的登录账号是: ' + this.addForm.Phone + "  ,初始密码为: 888888",
                type: 'success'
              });
            }
            else if (response.data.stateCode == 2) {
              this.$notify.error({
                title: '添加账户失败',
                message: this.addForm.Phone + ' 这个账号(手机号)已经添加过了,换一个吧~'
              });
              this.addLoading = false;
              return;
            } else {
              this.$notify({
                type: 'warning',
                title: '提示',
                message: response.data.message,
                duration: 0
              });
            }
            this.dialogForm = false;
            //初始化某个对象,用于清空表单
            this.addForm = this.$options.data().addForm;
            this.query();
          })
      }
      this.addLoading = false;
    },
    DelUser () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的账户 !',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelUserApi(this.currentRow.userId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.currentRow.userName + " 的账户被删除了",
                type: 'success'
              });
              this.query();
            }
            else {
              this.$notify.error({
                title: '删除失败',
                message: "错误信息" + response.data.message,
                duration: 0
              });
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1000
        });
      });
    },
    OpenEditDialog () {
      if (this.currentRow != null) {
        this.dialogEditForm = true;
        // this.editForm = (JSON.parse(JSON.stringify(this.currentRow)));
        this.editForm = { ...this.currentRow }
        if (this.editForm.userEmail == '暂无') this.editForm.userEmail = '';

      } else {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要编辑的账户 !',
          duration: 1000
        });
        return;
      }
    },
    dblclick () {
      this.OpenEditDialog();
    },
    SaveChanges () {
      if (this.editForm.userName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入姓名', duration: 1000
        });
        return;
      }
      if (this.editForm.userPhone == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入账号(手机号)', duration: 1000
        });
        return;
      }
      if (this.editForm.groupId == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请选择所属权限组', duration: 1000
        });
        return;
      }
      if (this.editForm.userJob == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入职位', duration: 1000
        });
        return;
      }
      if (this.editForm.Email == '') {

      }
      this.editLoading = true;
      EditUserApi(this.editForm.userId, myCompanyId, this.editForm.groupId,
        this.editForm.userName, this.editForm.userPhone, this.editForm.userJob,
        this.editForm.userAvatar, this.editForm.userEmail)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.userName + " 的账户信息编辑成功",
              type: 'success'
            });
            this.editLoading = false;
            this.dialogEditForm = false;
            this.query();
            //初始化某个对象,用于清空表单
            this.editForm = this.$options.data().editForm;
            return;
          }
          else if (res.data.stateCode == 2) {
            this.$notify.error({
              title: '编辑账户失败',
              message: this.editForm.Phone + ' 这个账号(手机号)已经存在了,换一个吧~'
            });
            this.editLoading = false;
            return;
          }
          else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: res.data.message,
              duration: 0
            });
            this.editLoading = false;
            return;
          }
        })
        .catch(error => {
          this.$notify.error({
            title: '编辑账户失败',
            message: error
          });
          this.editLoading = false;
          return;
        })
    },
    ResetPassWord () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          message: '请选中您要重置密码的账号',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      EditPassWordApi(this.currentRow.userId, '888888')
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '重置成功',
              message: this.currentRow.userName + " 的密码被重置为 '888888'",
              type: 'success'
            });
            this.query();
            return;
          }
          else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: res.data.message,
              duration: 0
            });
            return;
          }
        })
    },
    FrozenAccount () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          message: '请选中您要冻结的账号',
          type: 'warning',
          duration: 1000
        });
      }
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.OperatingArea {
  height: $operationAreaHeight;
  display: flex;
  margin-bottom: 1.5rem;
  width: 100%;
  overflow: hidden;
}

.searchArea {
  display: flex;
  height: $operationAreaHeight;
}
.group_like {
  //   margin-left: 2rem;
  width: 12rem;
}
.like_name {
  width: 7rem;
  margin-left: 1rem;
  padding-right: 0.5rem;
}
.btnSearch:hover {
  background-color: rgb(64, 158, 255);
}
.btnReset:hover {
  background-color: rgb(245, 108, 108);
}
.btnfreeze:hover {
  background-color: rgb(230, 162, 60);
}

.content {
  //   padding-bottom: 0.3125rem;
  //   border: 2px solid red;
  //   height: 100%;
  .el-table {
    margin-bottom: 1rem;
    font-weight: bold;
  }
  .pagination {
    display: none;
    // display: flex;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
  }
}
@import "../../styles/responseCss/UserInfo/Mobile.scss";
</style>