<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增计数方案</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑计数方案</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="Del ()"
        >
          删除计数方案
        </div>

      </div>

      <div class="searchArea">
        <el-input
          placeholder="计数方案名称"
          v-model="countPreceptName_like"
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
          prop="countPreceptName"
          label="计数方案名称"
        />
        <el-table-column
          prop="stepSize"
          label="实际计数步长"
          width="130"
        />
        <el-table-column
          prop="stepSize"
          label="不良计数步长"
          width="130"
        />
        <el-table-column
          prop="intervalTime"
          label="延时时间(s)"
          width="130"
        />
        <el-table-column
          prop="delayTime"
          label="闭合时间(s)"
          width="130"
        />
        <el-table-column
          prop="remark"
          label="备注"
        />
        <el-table-column
          prop="nowUseSum"
          label="当前被使用次数"
          width="200"
        />
        <el-table-column
          prop="useSum"
          label="累计被使用次数"
          width="200"
        />
        <el-table-column
          label="countPrecepId"
          prop="countPrecepId"
          v-if="false"
        />
      </el-table>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增计数方案"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="计数方案名称">
          <el-input
            v-model="addForm.countPreceptName"
            clearable
            placeholder="请输入计数方案名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            clearable
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>

        <el-form-item label="实际计数步长">
          <el-input-number
            class="inputNumber"
            v-model="addForm.stepSize"
            :step="1"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="不良计数步长">
          <el-input-number
            class="inputNumber"
            v-model="addForm.stepSizeBad"
            :step="1"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="延时时间(s)">
          <el-input-number
            class="inputNumber"
            v-model="addForm.intervalTime"
            :precision="1"
            :step=".1"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="闭合时间(s)">
          <el-input-number
            class="inputNumber"
            v-model="addForm.delayTime"
            :precision="1"
            :step=".1"
            :min="0"
          ></el-input-number>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="Add(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="Add(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑计数方案"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="计数方案名称">
          <el-input
            v-model="editForm.countPreceptName"
            clearable
            placeholder="请输入计数方案名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="editForm.remark"
            clearable
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>

        <el-form-item label="实际计数步长">
          <el-input-number
            class="inputNumber"
            v-model="editForm.stepSize"
            :step="1"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="不良计数步长">
          <el-input-number
            class="inputNumber"
            v-model="editForm.stepSizeBad"
            :step="1"
            :min="1"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="延时时间(s)">
          <el-input-number
            class="inputNumber"
            v-model="editForm.intervalTime"
            :precision="1"
            :step=".1"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="闭合时间(s)">
          <el-input-number
            class="inputNumber"
            v-model="editForm.delayTime"
            :precision="1"
            :step=".1"
            :min="0"
          ></el-input-number>
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
import { GetApi, EditApi, AddApi, DelApi } from '../../api/countInfo.js'
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
      countPreceptName_like: '',
      tableData: [],
      addForm: {
        countPreceptName: '',
        stepSize: '1',
        stepSizeBad: '1',
        intervalTime: '0.0',
        delayTime: '0.0',
        remark: ''
      },
      editForm: {
        countPreceptId: '',
        countPreceptName: '',
        stepSize: '',
        stepSizeBad: '',
        intervalTime: '',
        delayTime: '',
        remark: ''
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
    query () {
      this.tableLoading = true;
      GetApi(myCompanyId, this.countPreceptName_like)
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
    Add (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.countPreceptName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入计数方案名称', duration: 1000
          });
          return;
        }
        if (this.addForm.stepSize == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请调整实际计数步长', duration: 1000
          });
          return;
        }
        if (this.addForm.stepSizeBad == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请调整不良计数步长', duration: 1000
          });
          return;
        }
        if (this.addForm.intervalTime === '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请调整延时时间', duration: 1000
          });
          return;
        }
        if (this.addForm.delayTime === '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请调整闭合时间', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddApi(myCompanyId, this.addForm.countPreceptName, this.addForm.stepSize, this.addForm.stepSizeBad, this.addForm.intervalTime, this.addForm.delayTime, this.addForm.remark)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加计数方案成功',
                message: '快试试这个方案吧~',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 201) {
              this.$notify.error({
                title: '添加计数方案失败',
                message: '已存在此名称的计数方案,换一个吧~'
              });
              this.addLoading = false;
              return;
            }
            else {
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
          .catch(error => {
            this.$notify.error({
              title: '错误',
              message: '错误信息:' + error,
              duration: 0
            });
          })
      }
      this.addLoading = false;
    },
    Del () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的计数方案',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该计数方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelApi(myCompanyId, this.currentRow.countPreceptId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.currentRow.countPreceptName + " 被删除了",
                type: 'success'
              });
              this.query();
            }
            else if (response.data.stateCode == 1) {
              this.$notify({
                title: '删除失败',
                message: '无法删除此方案,因为有计划正在使用此计数方案,请先将计划结束再进行删除操作',
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
          message: '请选中您要编辑的计数方案',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.countPreceptName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入计数方案名称', duration: 1000
        });
        return;
      }
      if (this.editForm.stepSize == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请调整实际计数步长', duration: 1000
        });
        return;
      }
      if (this.editForm.stepSizeBad == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请调整不良计数步长', duration: 1000
        });
        return;
      }
      if (this.editForm.intervalTime === '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请调整延时时间', duration: 1000
        });
        return;
      }
      if (this.editForm.delayTime === '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请调整闭合时间', duration: 1000
        });
        return;
      }
      this.editLoading = true;
      EditApi(myCompanyId, this.editForm.countPreceptId, this.editForm.countPreceptName, this.editForm.stepSize, this.editForm.stepSizeBad, this.editForm.intervalTime, this.editForm.delayTime, this.editForm.remark)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.countPreceptName + " 的计数方案信息编辑成功",
              type: 'success'
            });
            this.editLoading = false;
            this.dialogEditForm = false;
            this.query();
            //初始化某个对象,用于清空表单
            this.editForm = this.$options.data().editForm;
            return;
          }
          else if (res.data.stateCode == 201) {
            this.$notify.error({
              title: '编辑计数方案信息失败',
              message: '已存在此名称的计数方案,换一个吧~'
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
            title: '编辑计数方案信息失败',
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
.changeArea {
  width: 450px !important;
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
@import "../../styles/responseCss/ProductInfo/Mobile.scss";
</style>