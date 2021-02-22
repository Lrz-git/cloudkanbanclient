<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增产线</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑产线</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="DelLine ()"
        >
          删除产线
        </div>

      </div>

      <div class="searchArea">
        <el-input
          placeholder="请输入产线名称"
          v-model="lineName_like"
          clearable
          class="like_name"
        >
        </el-input>

        <el-select
          v-model="selectedWorkShopId"
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="请选择车间以筛选"
          class="workShopSelect"
        >
          <el-option
            v-for="item in workShopInfo"
            :key="item.workShopId"
            :label="item.workShopName"
            :value="item.workShopId"
          >
          </el-option>
        </el-select>
      </div>

      <div class="searchArea">
        <el-select
          clearable
          filterable
          multiple
          collapse-tags
          v-model="selectedUserId"
          placeholder="请选择产线负责人以筛选"
        >
          <el-option
            v-for="item in userInfo"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>

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
          label="所属车间"
        />
        <el-table-column
          prop="lineName"
          label="产线名称"
        />
        <el-table-column
          prop="userName"
          label="产线负责人"
        />
        <el-table-column
          prop="userPhone"
          label="负责人联系方式"
        />
        <!-- <el-table-column
          prop="lineIp"
          label="设备IP地址"
        /> -->
        <el-table-column
          prop="lineMac"
          label="设备ID"
          width="300"
        />
        <el-table-column
          prop="population"
          label="标准人数"
          width="100"
        />
        <el-table-column
          prop="actualPopulation"
          label="实到人数"
        />
        <el-table-column
          prop="whetherOnline"
          label="连接状态"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.whetherOnline =='在线' ? 'success' : 'info'"
              effect="dark"
            >
              {{ scope.row.whetherOnline }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceState"
          label="设备状态"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.deviceState =='0' ? 'success' : 'info'"
              effect="dark"
            >
              {{ scope.row.deviceState=='0'?'正常':'维修' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="workShopId"
          prop="workShopId"
          v-if="false"
        />
        <el-table-column
          label="lineId"
          prop="lineId"
          v-if="false"
        />
        <el-table-column
          label="userId"
          prop="userId"
          v-if="false"
        />
      </el-table>

      <!-- <el-pagination
        class="pagination"
        background
        layout="prev, pager, next,sizes,total"
        :page-sizes="[10, 20, 25, 30]"
        :page-size="20"
        :total="1000"
      >
      </el-pagination> -->
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增产线"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>

        <el-form-item label="产线名称">
          <el-input
            v-model="addForm.lineName"
            clearable
            placeholder="请输入产线名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="Mac地址">
          <el-input
            v-model="addForm.lineMac"
            clearable
            placeholder="请输入Mac地址(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="所属车间">
          <el-select
            filterable
            v-model="addForm.workShopId"
            placeholder="请选择所属车间(必选)"
          >
            <el-option
              v-for="item in workShopInfo"
              :key="item.workShopId"
              :label="item.workShopName"
              :value="item.workShopId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-select
            filterable
            v-model="addForm.userId"
            placeholder="请选择车间负责人(必选)"
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

        <el-form-item label="标准人数">
          <el-input
            v-model="addForm.population"
            type="number"
            clearable
            placeholder="请输入标准人数(必填)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="AddLine(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="AddLine(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑产线"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>

        <el-form-item label="产线名称">
          <el-input
            v-model="editForm.lineName"
            clearable
            placeholder="请输入产线名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="设备ID">
          <el-input
            v-model="editForm.lineMac"
            clearable
            placeholder="请输入设备ID(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="所属车间">
          <el-select
            v-model="editForm.workShopId"
            filterable
            placeholder="请选择所属车间(必选)"
          >
            <el-option
              v-for="item in workShopInfo"
              :key="item.workShopId"
              :label="item.workShopName"
              :value="item.workShopId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车间负责人">
          <el-select
            filterable
            v-model="editForm.userId"
            placeholder="请选择车间负责人(必选)"
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

        <el-form-item label="标准人数">
          <el-input
            v-model="editForm.population"
            clearable
            type="number"
            placeholder="请输入标准人数(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="实际人数">
          <el-input
            v-model="editForm.actualPopulation"
            clearable
            type="number"
            placeholder="请输入标准人数(必填)"
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
import { GetUserAndWorkShopApi, GetLineInfoApi, AddLineApi, EditLineApi, DelLineApi } from '../../api/lineInfo.js'
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
    _this.queryUserAndWorkShop();
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
      lineName_like: '',
      selectedWorkShopId: '',
      selectedUserId: '',
      tableData: [],
      addForm: {
        workShopId: '',
        lineName: '',
        userId: '',
        lineMac: '',
        population: ''
      },
      editForm: {
        lineId: '',
        workShopId: '',
        lineName: '',
        userId: '',
        lineMac: '',
        population: '',
        actualPopulation: ''
      },
      userInfo: '',
      workShopInfo: ''
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
    queryUserAndWorkShop () {
      GetUserAndWorkShopApi(myCompanyId)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.userInfo = JSON.parse(response.data.myData).Table;
            this.workShopInfo = JSON.parse(response.data.myData).Table1;
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
      GetLineInfoApi(myCompanyId, this.lineName_like, this.selectedWorkShopId.join(','), this.selectedUserId.join(','))
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
    AddLine (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {

        if (this.addForm.lineName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入产线名称', duration: 1000
          });
          return;
        }
        if (this.addForm.lineMac == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入设备ID', duration: 1000
          });
          return;
        }
        if (this.addForm.workShopId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择所属车间', duration: 1000
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
        alert(this.addForm.population);
        if (this.addForm.population == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入标准人数', duration: 1000
          });
          return;
        }
        if (this.addForm.population <= 0) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '标准人数要大于0', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddLineApi(this.addForm.workShopId, this.addForm.lineName, this.addForm.userId, this.addForm.lineMac, this.addForm.population)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加产线成功',
                message: this.addForm.lineName + ' 下还没有计划 , 快去添加吧~',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 2) {
              this.$notify.error({
                title: '添加产线失败',
                message: '该车间下已经存在此名称的产线,换一个吧~'
              });
              this.addLoading = false;
              return;
            }
            else if (response.data.stateCode == 3) {
              this.$notify.error({
                title: '添加产线失败',
                message: '系统内已存在此设备ID,请您检查'
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
    DelLine () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的产线',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该产线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelLineApi(myCompanyId, this.currentRow.workShopId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.currentRow.lineName + " 被删除了",
                type: 'success'
              });
              this.query();
            }
            else if (response.data.stateCode == 1) {
              this.$notify({
                title: '删除失败',
                message: '无法删除' + this.currentRow.lineName + ',由于' + this.currentRow.lineName + '下还存在执行中的计划,请先将计划结束再进行删除操作',
                type: 'warning'
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
          message: '请选中您要编辑的产线',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.lineName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入产线名称', duration: 1000
        });
        return;
      }
      if (this.editForm.workShopId == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请选择所属车间', duration: 1000
        });
        return;
      }

      if (this.editForm.userId == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请选择责任人', duration: 1000
        });
        return;
      }
      if (this.editForm.population == '') {

        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入标准人数:', duration: 1000
        });
        return;
      }
      if (this.editForm.population <= 0) {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '标准人数要大于0', duration: 1000
        });
        return;
      }
      if (this.editForm.actualPopulation == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入实际人数', duration: 1000
        });
        return;
      }
      if (this.editForm.actualPopulation < 0) {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '实际人数要大于0', duration: 1000
        });
        return;
      }

      this.editLoading = true;
      EditLineApi(this.editForm.lineId, this.editForm.workShopId, this.editForm.lineName, this.editForm.userId, this.editForm.lineMac, this.editForm.population, this.editForm.actualPopulation)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.lineName + " 的产线信息编辑成功",
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
              title: '编辑产线失败',
              message: '该车间下已经存在此名称的产线,换一个吧~'
            });
            this.editLoading = false;
            return;
          }
          else if (res.data.stateCode == 3) {
            this.$notify.error({
              title: '编辑产线失败',
              message: '系统内已存在此设备ID,请您检查'
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
            title: '编辑产线失败',
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
  padding-right: 0rem;
}
.workShopSelect {
  //   width: 12rem;
  margin-left: 2rem;
  margin-right: 2rem;
  padding-right: 0rem;
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
@import "../../styles/responseCss/LineInfo/Mobile.scss";
</style>