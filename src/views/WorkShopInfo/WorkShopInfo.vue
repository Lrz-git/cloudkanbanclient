<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增车间</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑车间</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="DelWorkShop ()"
        >
          删除车间
        </div>

      </div>

      <div class="searchArea">
        <el-input
          placeholder="车间名"
          v-model="workShopName_like"
          clearable
          class="like_name"
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
          prop="workShopName"
          label="车间名称"
        />
        <el-table-column
          prop="userName"
          label="车间负责人"
        />
        <el-table-column
          prop="userPhone"
          label="负责人联系方式"
        />
        <el-table-column
          prop="LineCount"
          label="产线数量"
        />
        <el-table-column
          label="workShopId"
          prop="workShopId"
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
      title="新增车间"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="车间名称">
          <el-input
            v-model="addForm.workShopName"
            clearable
            placeholder="请输入车间名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-select
            v-model="addForm.userId"
            placeholder="请选择车间负责人(必选)"
            filterable
          >
            <el-option
              v-for="item in userInfo"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="AddWorkShop(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="AddWorkShop(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑车间"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="车间名称">
          <el-input
            v-model="editForm.workShopName"
            clearable
            placeholder="请输入车间名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-select
            v-model="editForm.userId"
            placeholder="请选择车间负责人(必选)"
            filterable
          >
            <el-option
              v-for="item in userInfo"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
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
import { GetUserInfoApi, GetWorkShopApi, AddWorkShopApi, EditWorkShopApi, DelWorkShopApi } from '../../api/workShopInfo.js'
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
    _this.query();
    _this.queryUser();
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
      workShopName_like: '',
      tableData: [],
      addForm: {
        workShopName: '',
        userId: ''
      },
      editForm: {
        workShopId: '',
        workShopName: '',
        userId: ''
      },
      userInfo: ''
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
    queryUser () {
      GetUserInfoApi(myCompanyId)
        .then(response => {
          console.log(response);
          if (response.data.stateCode == 0) {
            this.userInfo = JSON.parse(response.data.myData);
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
        .catch(error => {
          this.$notify.error({
            title: 'catch错误',
            message: error,
            duration: 0
          });
        });
    },
    query () {
      this.tableLoading = true;
      GetWorkShopApi(myCompanyId, this.workShopName_like)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.tableData = JSON.parse(response.data.myData);
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
        .catch(error => {
          this.$notify.error({
            title: 'catch错误',
            message: error,
            duration: 0
          });
        });
      this.tableLoading = false;
    },
    AddWorkShop (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.workShopName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入车间名', duration: 1000
          });
          return;
        }
        if (this.addForm.userId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择责任人', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddWorkShopApi(myCompanyId, this.addForm.workShopName, this.addForm.userId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加车间成功',
                message: this.addForm.workShopName + '下还没有产线 , 快去添加吧',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 2) {
              this.$notify.error({
                title: '添加车间失败',
                message: this.addForm.workShopName + ' 这个车间名称已经添加过了,换一个吧~'
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
    DelWorkShop () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的车间',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该车间, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelWorkShopApi(this.currentRow.workShopId)
          .then(response => {
            console.log(response.data.stateCode);
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.currentRow.workShopName + " 被删除了",
                type: 'success'
              });
              this.query();
            }
            else if (response.data.stateCode == 1) {
              this.$notify({
                title: '删除失败',
                message: '无法删除' + this.currentRow.workShopName + ',由于' + this.currentRow.workShopName + '下还存在产线,请先将产线的所属车间修改至其他车间再进行删除操作',
                type: 'warning',
                duration: 0
              });
              this.query();
            }
            else {
              this.$notify.error({
                title: '删除失败',
                message: '错误信息' + response.data.message,
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
    dblclick () {
      this.OpenEditDialog();
    },
    OpenEditDialog () {
      if (this.currentRow != null) {
        this.dialogEditForm = true;
        // this.editForm = (JSON.parse(JSON.stringify(this.currentRow)));
        this.editForm = { ...this.currentRow }
      } else {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要编辑的车间',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.workShopName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入车间名称', duration: 1000
        });
        return;
      }
      if (this.editForm.userId == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请选择车间负责人', duration: 1000
        });
        return;
      }
      this.editLoading = true;
      EditWorkShopApi(myCompanyId, this.editForm.workShopName, this.editForm.userId, this.editForm.workShopId)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.workShopName + " 的车间信息编辑成功",
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
              title: '编辑车间失败',
              message: '该车间名已经存在,换一个吧~'
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
            title: '编辑车间失败',
            message: error
          });
          this.editLoading = false;
          return;
        })
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
  width: 10rem;
  margin-left: 0rem;
  padding-right: 0.5rem;
}
.btnSearch:hover {
  background-color: rgb(64, 158, 255);
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
@import "../../styles/responseCss/WorkShopInfo/Mobile.scss";
</style>