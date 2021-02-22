<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="Del()"
        >
          删除
        </div>
      </div>

      <div class="searchArea">
        <el-select
          class="interval"
          v-model="Condition.shiftId"
          placeholder="请选择班次"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in shiftInfo"
            :key="item.shiftId"
            :label="item.shiftName"
            :value="item.shiftId"
          >
          </el-option>
        </el-select>

        <el-select
          class="interval"
          v-model="Condition.lineId"
          placeholder="请选择产线"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in lineInfo"
            :key="item.lineId"
            :label="item.lineName"
            :value="item.lineId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="searchArea">

        <el-select
          class="interval"
          v-model="Condition.productId"
          placeholder="请选择产品"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in productInfo"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId"
          >
          </el-option>
        </el-select>

        <el-input
          placeholder="订单号"
          v-model="Condition.orderOn"
          clearable
          class="like_name"
        >
        </el-input>
      </div>
      <el-button
        type="primary"
        class="btnSearch"
        icon="el-icon-search"
        @click="query()"
      >搜索</el-button>

    </div>
    <div class="content">
      <div class="lrzHead">
        <div style="margin-left:.625rem;width:70px">序号</div>
        <div style="width:230px">订单编号</div>
        <div style="width:230px">所属产线</div>
        <div style="width:130px">班次</div>
        <div style="width:230px">计数方案</div>
        <div style="width:230px">产品名称,型号</div>
        <div style="width:330px">开始日期</div>
        <div style="margin-right:2.625rem;width:70px">计划状态</div>
      </div>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(item,index) in tableData"
          :key="index"
          :name="item.planId"
        >
          <template slot="title">
            <div class="lrzBody">
              <div style="margin-left:.625rem;;width:70px">{{index+1}}</div>
              <div style="width:230px">{{item.orderNo}}</div>
              <div style="width:230px">{{item.lineName}}</div>
              <div style="width:130px">{{item.shiftName}}</div>
              <div style="width:230px">{{item.countPreceptName}}</div>
              <div style="width:230px">{{item.productName}}</div>
              <div style="width:330px">{{dateFormat(item.startDate)}}</div>
              <div style="margin-right:.625rem;width:70px">{{item.state}}</div>
            </div>
          </template>
          <el-table
            v-loading="
                tableLoading"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            empty-text="这儿什么都没有~"
            :lazy="true"
            @current-change="handleCurrentChange"
            @row-dblclick="dblclick"
          >

            <el-table-column
              prop="orderNo"
              label="订单编号"
            />
            <el-table-column
              prop="lineName"
              label="所属产线"
            />
            <el-table-column
              prop="shiftName"
              label="班次"
            />
            <el-table-column
              prop="countPreceptName"
              label="计数方案"
            />
            <el-table-column
              prop="productName"
              label="产品名称,型号"
            />
            <el-table-column
              prop="startDate"
              label="开始日期"
            />
            <el-table-column
              prop="state"
              label="计划状态"
            />
            <el-table-column
              label="planId"
              prop="planId"
              v-if="false"
            />

          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增计划"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="计划名称">
          <el-input
            v-model="addForm.shiftName"
            clearable
            placeholder="请输入计划名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <!-- <el-input
            v-model="addForm.remark"
            clearable
            placeholder="请输入备注"
          ></el-input> -->
        </el-form-item>

        <el-form-item
          :label="'时间段'+(index+1)"
          v-for="(item , index) in addTime"
          :key="index"
          class="TimeItem"
        >
          <el-time-picker
            is-range
            v-model="item.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
          <span
            class="el-icon-delete addDelTime"
            @click.prevent="removeTimeEl(item,0)"
          ></span>

        </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addTimeEl(0)"
        ></el-button>
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
      title="编辑计划"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="计划名称">
          <el-input
            v-model="editForm.shiftName"
            clearable
            placeholder="请输入计划名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="">

        </el-form-item>

        <el-form-item
          :label="'时间段'+(index+1)"
          v-for="(item , index) in editTime"
          :key="index"
          class="TimeItem"
        >
          <el-time-picker
            v-model="item.startTime"
            placeholder="开始时间"
          >
          </el-time-picker>
          <el-time-picker
            v-model="item.endTime"
            placeholder="结束时间"
          >
          </el-time-picker>
          <span
            class="el-icon-delete addDelTime"
            @click.prevent="removeTimeEl(item,1)"
          ></span>

        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addTimeEl(1)"
        ></el-button>
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
import { LoginApi } from '../../api/login.js';
import { GetConditionApi, GetApi, EditApi, AddApi, DelApi } from '../../api/plan.js'
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
    _this.queryCondition();
    _this.query();
  },
  //注销window.onresize事件
  destroyed () {
    window.onresize = null;
  },
  data () {
    return {
      //搜索条件
      Condition: {
        shiftId: '',
        lineId: '',
        orderOn: '',
        productId: ''
      },
      addTime: [{
        time: [new Date(2016, 9, 10, 12, 0), new Date(2016, 9, 10, 23, 30)]
      },
      {
        time: [new Date(2016, 9, 10, 12, 0), new Date(2016, 9, 10, 23, 30)]
      }],
      currentRow: null,
      dialogForm: false,
      dialogEditForm: false,
      tableLoading: false,
      addLoading: false,
      editLoading: false,
      tableHeight: window.innerHeight - 300,
      selectedShift: '',
      tableData: [],
      shiftInfo: [],
      lineInfo: [],
      productInfo: [],
      addForm: {
        shiftName: '',
        remark: '',
      },
      editForm: {
        shiftId: '',
        shiftName: '',
      },
      editTime: []
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
    queryCondition () {
      GetConditionApi(myCompanyId)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.lineInfo = JSON.parse(res.data.myData).Table;
            this.shiftInfo = JSON.parse(res.data.myData).Table1;
            this.productInfo = JSON.parse(res.data.myData).Table2;
            //根据计划的第一个Id查询时间段
            // this.query(this.shiftData[0].shiftId);
          }
          else {
            this.$notify({
              type: 'warning',
              title: '提示',
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
        });
    },
    query () {
      this.tableLoading = true;
      GetApi(myCompanyId, this.Condition.lineId.join(','), this.Condition.shiftId.join(','), this.Condition.productId.join(','), this.Condition.orderOn)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.tableData = JSON.parse(response.data.myData);
            this.editTime = JSON.parse(response.data.myData);
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
        this.addTime = this.$options.data().addTime;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.shiftName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入计划名称', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddApi(myCompanyId, this.addForm.shiftName, JSON.stringify(this.addTime))
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加计划成功',
                message: '希望能够帮助您合理的安排生产时间~',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 201) {
              this.$notify({
                type: 'warning',
                title: '添加计划失败',
                message: '已存在此名称的计划,换一个吧~'
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
            this.addTime = this.$options.data().addTime;
            this.queryCondition();
          })
      }
      this.addLoading = false;
    },
    Del () {
      if (this.selectedShift == '') {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的计划',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该计划 , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delSelectedShiftId;
        this.shiftData.forEach(item => {
          if (item.shiftName == this.selectedShift) {
            delSelectedShiftId = item.shiftId
          }
        })
        DelApi(myCompanyId, delSelectedShiftId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.selectedShift + " 被删除了",
                type: 'success'
              });
              this.queryCondition();
            }
            else if (response.data.stateCode == 1) {
              this.$notify({
                type: 'warning',
                title: '删除失败',
                message: response.data.message
              });
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
      if (this.selectedShift != '') {
        this.dialogEditForm = true;
        // this.editTime = (JSON.parse(JSON.stringify(this.tableData)));
        //this.editTime = { ...this.tableData } 不知为何失效, 无法取消双向绑定
        this.editForm.shiftName = (JSON.parse(JSON.stringify(this.selectedShift)));
      } else {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要编辑的计划',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.shiftName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入计划名称', duration: 1000
        });
        return;
      }
      this.editLoading = true;
      this.shiftData.forEach(item => {
        if (item.shiftName == this.selectedShift) {
          this.editForm.shiftId = item.shiftId;
        }
      })
      this.editTime.forEach(item => {
        this.$delete(item, 'shiftId');
        this.$delete(item, 'shiftName');
        this.$delete(item, 'workingTimeId');
      })
      EditApi(myCompanyId, this.editForm.shiftId, this.editForm.shiftName, JSON.stringify(this.editTime))
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.shiftName + " 的计划信息编辑成功",
              type: 'success'
            });
            this.editLoading = false;
            this.dialogEditForm = false;
            this.queryCondition();
            //初始化某个对象,用于清空表单
            this.editForm = this.$options.data().editForm;
            this.editTime = this.$options.data().editTime;
            return;
          }
          else if (res.data.stateCode == 201) {
            this.$notify({
              type: 'warning',
              title: '编辑计划信息失败',
              message: '已存在此名称的计划,换一个吧~'
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
            title: '错误',
            message: error
          });
          this.editLoading = false;
          return;
        })
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    removeTimeEl (item, type) {
      if (type == 0) {
        if (this.addTime.length == 1) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '每个计划至少有一个时间段', duration: 1000
          });
          return;
        }
        var index = this.addTime.indexOf(item)
        if (index !== -1) {
          this.addTime.splice(index, 1)
        }
      }
      else {
        if (this.editTime.length == 1) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '每个计划至少有一个时间段', duration: 1000
          });
          return;
        }
        var index = this.editTime.indexOf(item)
        if (index !== -1) {
          this.editTime.splice(index, 1)
        }
      }
    },
    addTimeEl (type) {
      //增加的时候添加时间段文本框
      if (type == 0) {
        this.addTime.push({
          time: [new Date(2016, 9, 10, 12, 0), new Date(2016, 9, 10, 23, 30)]
        });
      }
      //编辑的时候添加时间段文本框
      else {
        this.editTime.push({
          startTime: new Date(2016, 9, 10, 12, 0),
          endTime: new Date(2016, 9, 10, 23, 30)
        });
      }
    },
    /*日期处理*/
    dateFormat: function (date) {
      if (date === undefined) {
        return ''
      };
      return this.$moment(date).format("yyyy年MM月DD日")
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
  width: 250px;
}
.searchArea {
  display: flex;
  height: $operationAreaHeight;
}
.interval {
  margin-right: 1.5rem;
  width: 14rem;
}
.interval:nth-child(2) {
  width: 15rem;
}
.like_name {
  width: 10rem;
  margin-left: 0rem;
  padding-right: 0.5rem;
}
.lrzHead {
  width: 100%;
  height: 3rem;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: #546fab;
  color: white;
  display: flex;
  align-items: center;
  overflow-x: auto;
  //   justify-content: space-between;
}
.lrzBody {
  width: 100%;
  height: 3rem;
  font-size: 0.875rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  //   justify-content: space-between;
  overflow-x: auto;
}
// .el-collapse-item__arrow {
//   margin: 0 0rem 0 auto !important;
//   transition: transform 0.3s;
//   font-weight: bold;
//   color: #409eff;
//   font-size: 1rem;
// }
.btnSearch:hover {
  background-color: rgb(64, 158, 255);
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 90% !important;
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

.el-table__row > td {
  border: none !important;
}

.el-table::before {
  //去掉最下面的那一条线
  height: 0px !important;
}

.el-table {
  margin-top: 1rem;
  //   color: #409eff;
}

@import "../../styles/responseCss/BadType/Mobile.scss";
</style>