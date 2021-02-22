<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogAddForm = true"
        >新增权限组</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑权限组</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="DelGroup ()"
        >
          删除权限组
        </div>

      </div>

      <div class="searchArea">
        <el-input
          placeholder="权限名"
          v-model="groupName_like"
          clearable
          class="groupNameInput"
        >

        </el-input>
        <el-button
          type="primary"
          class="btnSearch"
          icon="el-icon-search"
          @click="query()"
        >搜索</el-button>
      </div>
    </div>
    <div
      class="content"
      :style="{height: contentHeight+'px'}"
    >

      <el-collapse
        accordion
        @change="queryDetail"
      >
        <el-collapse-item
          v-for="(item,index) in groupData"
          :key="index"
          :name="item.groupId"
          class="accordionLrz"
        >
          <template slot="title">
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              :disabled="item.remark=='暂无'"
            >
              <div slot="content">备注:<br />
                {{item.remark}}
              </div>
              <div class="collTitle">
                <!-- @click="queryDetail(item.groupId)" -->
                <div
                  class="titleTXT"
                  @click.stop
                >
                  <i class="el-icon-s-flag"></i>
                </div>
                <div class="titleTXT">权限组名: {{item.groupName}}</div>
                <div class="titleTXT">创建者: {{item.creator}}</div>
                <div class="titleTXT">创建时间:{{item.creationTime}}</div>
                <div class="titleTXT">修改者: {{item.lastReviser}}</div>
                <div class="titleTXT">修改时间: {{item.lastModifiedTime}}</div>
              </div>
            </el-tooltip>

          </template>
          <el-table
            :data="detailData"
            :show-header="true"
          >
            <el-table-column
              prop="menuName"
              label="菜单名称"
            >
            </el-table-column>
            <el-table-column
              prop="viewPower"
              label="查看权限"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.viewPower"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="EditPower(scope.row.relationId,'view')"
                >
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column
              prop="addPower"
              label="新增权限"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.addPower"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="EditPower(scope.row.relationId,'add')"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="delPower"
              label="删除权限"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.delPower"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="EditPower(scope.row.relationId,'del')"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="editPower"
              label="编辑权限"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.editPower"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="EditPower(scope.row.relationId,'edit')"
                >
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增权限组"
      :visible.sync="dialogAddForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="权限组名">
          <el-input
            v-model="addForm.groupName"
            clearable
            prefix-icon="el-icon-connection"
            placeholder="请输入权限组名(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            clearable
            prefix-icon="el-icon-document"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="AddGroup(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="AddGroup(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑权限组"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="权限组名">
          <el-input
            v-model="editForm.groupName"
            clearable
            prefix-icon="el-icon-connection"
            placeholder="请输入权限组名(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="editForm.remark"
            clearable
            prefix-icon="el-icon-document"
            placeholder="请输入备注"
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
import { GetGroupApi, GetDetailApi, AddGroupApi, EditPowerApi, DelGroupApi, EditGroupApi } from '../../api/powerInfo.js'
var myCompanyId;
var lastGroupId; //展开项的ID 用于搜索详情时判断上一次是不是已经搜索过,如果是 那么就不再搜索
var unfoldGroupId = 0; //展开项的ID 用于判断是否展开 ,而后进行编辑/删除操作
export default {
  mounted () {
    myCompanyId = JSON.parse(this.$store.state.userInfo)[0].companyId
    let _this = this;//赋值vue的this
    _this.pageResize();
    window.onresize = () => {
      //调用methods中的事件
      _this.pageResize();
    }
    // _this.getGroup();
    _this.query();
    _this.queryDetail(1);
    // lastGroupId = 0;
    unfoldGroupId = 0;
  },
  //注销window.onresize事件
  destroyed () {
    window.onresize = null;
  },
  data () {
    return {
      dialogAddForm: false,
      dialogEditForm: false,
      addLoading: false,
      editLoading: false,
      contentHeight: window.innerHeight - 300,
      groupName_like: '',
      groupData: [],
      detailData: [],
      addForm: {
        groupName: '',
        remark: ''
      },
      editForm: {
        groupName: '',
        remark: ''
      }
    }
  },
  methods: {
    pageResize () {
      this.$nextTick(() => {
        let w = window.innerWidth;
        if (w > 320 && w < 767) {
          this.contentHeight = window.innerHeight - 250
        }
        else if (w > 767 && w < 1023) {
          //   手机横屏
          if (window.innerHeight > 320 && window.innerHeight < 400) {
            this.contentHeight = window.innerHeight - 230
          }
          else {
            this.contentHeight = window.innerHeight - 350
          }
        }
        else if (w > 1023 && w < 1367) {
          this.contentHeight = window.innerHeight - 360
        }
        else {
          this.contentHeight = window.innerHeight - 250
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
      GetGroupApi(myCompanyId, this.groupName_like)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.groupData = JSON.parse(response.data.myData);
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
    },
    queryDetail (val) {
      //手风琴的展开事件,传递过来的值val 是item的name,所以将name绑定为Id
      if (val != '') {
        if (lastGroupId != val) {
          GetDetailApi(val).then(res => {
            if (res.data.stateCode == 0) {
              this.detailData = JSON.parse(res.data.myData);
            }
          })
          lastGroupId = val; //展开项的ID 用于搜索详情
        }
        //展开项的ID 用于判断是否展开 ,而后进行编辑/删除操作
        unfoldGroupId = val;
      }
      else if (val == '') {
        //   此时代表没有展开项
        unfoldGroupId = 0;
      }
    },
    EditPower (relationId, powerType) {
      //   console.log(relationId, powerType);
      EditPowerApi(relationId, powerType)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: res.data.message.slice(0, 3),
              message: res.data.message,
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
            title: '错误',
            message: error,
            duration: 0
          });
        })
    },
    AddGroup (type) {
      //取消
      if (type == 1) {
        this.dialogAddForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.groupName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入权限组名', duration: 1000
          });
          return;
        }

        this.addLoading = true;
        AddGroupApi(myCompanyId, JSON.parse(this.$store.state.userInfo)[0].userId, this.addForm.groupName, this.addForm.remark)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加权限组成功',
                message: '创建人为: ' + JSON.parse(this.$store.state.userInfo)[0].userName + ' , 新创建的权限组默认拥有所有权限噢,请按需调整',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 2) {
              this.$notify.error({
                title: '添加权限组失败',
                message: this.addForm.Phone + ' 这个权限组名已经存在,换一个吧~'
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
            this.dialogAddForm = false;
            //初始化某个对象,用于清空表单
            this.addForm = this.$options.data().addForm;
            this.query();
          })
      }
      this.addLoading = false;
    },
    DelGroup () {
      if (unfoldGroupId == 0) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请先展开您要删除的权限组',
          duration: 1200
        });
        return;
      }
      this.$confirm('此操作将永久删除该权限组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelGroupApi(unfoldGroupId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: response.data.message,
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
          .catch(error => {
            this.$notify.error({
              title: '出错',
              message: error,
            });
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
      if (unfoldGroupId != 0) {
        this.dialogEditForm = true;

        this.groupData.forEach(item => {
          if (item.groupId == unfoldGroupId) {
            this.editForm = { ...item };
            if (this.editForm.remark == '暂无')
              this.editForm.remark = '';
          }
        });
      } else if (unfoldGroupId === 0) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请先展开您要编辑的权限组',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.groupName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入权限组名', duration: 1000
        });
        return;
      }
      this.editLoading = true;
      EditGroupApi(myCompanyId, unfoldGroupId, JSON.parse(this.$store.state.userInfo)[0].userId, this.editForm.groupName, this.editForm.remark)
        .then(res => {
          console.log(res);
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.groupName + " 的账户信息编辑成功",
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
.groupNameInput {
  margin-left: 1rem;
  width: 10rem;
  //   margin-left: 1rem;
  padding-right: 0.5rem;
}
.btnSearch:hover {
  background-color: rgb(64, 158, 255);
}

.collTitle {
  display: flex;
  width: 100%;
  overflow: auto;
  //   justify-content: space-between;
}

.titleTXT {
  width: 17%;
  font-size: 1rem;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 1rem;
}

.titleTXT:nth-child(1) {
  width: 1rem;
  margin: 0;
}
.titleTXT:nth-child(2) {
  width: 12%;
}
.titleTXT:nth-child(3) {
  width: 12%;
}
.titleTXT:nth-child(5) {
  width: 12%;
}
.el-collapse-item__content .el-table {
  width: 80%;
}
//滚动条
.content::-webkit-scrollbar {
  width: 5px;
}

/* 滚动条的滑块 */
.content::-webkit-scrollbar-thumb {
  background-color: #3c5b9a !important;
  border-radius: 10px;
}

.el-table__row > td {
  border: none !important;
}

.el-table::before {
  //去掉最下面的那一条线
  height: 0px !important;
}

@import "../../styles/responseCss/PowerInfo/Mobile.scss";
</style>