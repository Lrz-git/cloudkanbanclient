<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增班次</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑班次</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="Del ()"
        >
          删除班次
        </div>
      </div>

      <div class="searchArea">
        <el-radio-group v-model="selectedShift">
          <el-radio-button
            v-for="(item,index) in shiftData"
            :key="index"
            v-model="item.shiftId"
            :label="item.shiftName"
            @click.native="queryTime(item.shiftId)"
          ></el-radio-button>
        </el-radio-group>
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
          prop="shiftName"
          label="所属班次"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="nextDayTxt"
          label="是否跨天"
        />
        <el-table-column
          label="shiftId"
          prop="shiftId"
          v-if="false"
        />
        <el-table-column
          label="nextDay"
          prop="nextDay"
          v-if="false"
        />
        <el-table-column
          label="workingTimeId"
          prop="workingTimeId"
          v-if="false"
        />
      </el-table>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增班次"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="班次名称">
          <el-input
            v-model="addForm.shiftName"
            clearable
            placeholder="请输入班次名称(必填)"
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
          label="工作时间段"
          style="width:100%"
        >
          <el-table
            ref="multipleTable"
            :data="addTime"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            empty-text="请选中班次以编辑计划明细~"
          >

            <el-table-column
              prop="startTime"
              label="开始时间"
            >
              <template slot-scope="scope">
                <el-time-picker
                  type="datetime"
                  placeholder="选择开始时间"
                  v-model="scope.row.startTime"
                  value-format="HH:mm:ss"
                >
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <el-time-picker
                  type="datetime"
                  placeholder="选择结束时间"
                  v-model="scope.row.endTime"
                  value-format="HH:mm:ss"
                >
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="nextDay"
              label="是否跨天"
              width="100"
            >

              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.nextDay"
                  active-color="#13ce66"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
            >
              <template slot-scope="scope">
                <span
                  class="el-icon-delete"
                  @click.prevent="removeTimeEl(scope.row,0)"
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- <el-form-item
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

        </el-form-item> -->

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
      title="编辑班次"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="班次名称">
          <el-input
            v-model="editForm.shiftName"
            clearable
            placeholder="请输入班次名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="">

        </el-form-item>

        <el-form-item
          label="工作时间段"
          style="width:100%"
        >
          <el-table
            ref="multipleTable"
            :data="editTime"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            empty-text="请选中班次以编辑计划明细~"
          >

            <el-table-column
              prop="startTime"
              label="开始时间"
            >
              <template slot-scope="scope">
                <el-time-picker
                  type="datetime"
                  placeholder="选择开始时间"
                  v-model="scope.row.startTime"
                  value-format="HH:mm:ss"
                >
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <el-time-picker
                  type="datetime"
                  placeholder="选择结束时间"
                  v-model="scope.row.endTime"
                  value-format="HH:mm:ss"
                >
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="nextDay"
              label="是否跨天"
              width="100"
            >

              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.nextDay"
                  active-color="#13ce66"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
            >
              <template slot-scope="scope">
                <span
                  class="el-icon-delete"
                  @click.prevent="removeTimeEl(scope.row,1)"
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- <el-form-item
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

        </el-form-item> -->
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
import { GetShiftApi, GetTimeApi, EditApi, AddApi, DelApi, DelWorkTimeApi } from '../../api/shift.js'
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
    _this.queryShift();
  },
  //注销window.onresize事件
  destroyed () {
    window.onresize = null;
  },
  data () {
    return {
      addTime: [{
        startTime: new Date(2020, 1, 1, 12, 0),
        endTime: new Date(2020, 1, 1, 12, 0),
        nextDay: false
      },
      {
        startTime: new Date(2020, 1, 1, 12, 0),
        endTime: new Date(2020, 1, 1, 12, 0),
        nextDay: false
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
      shiftData: [],
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
    queryShift () {
      GetShiftApi(myCompanyId)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.shiftData = JSON.parse(res.data.myData);
            //根据班次的第一个Id查询时间段
            this.queryTime(this.shiftData[0].shiftId);
            //默认选中第一个班次
            this.selectedShift = this.shiftData[0].shiftName;
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
    queryTime (shiftId) {
      this.tableLoading = true;
      GetTimeApi(myCompanyId, shiftId)
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
            message: '请输入班次名称', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddApi(myCompanyId, this.addForm.shiftName, JSON.stringify(this.addTime))
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加班次成功',
                message: '希望能够帮助您合理的安排生产时间~',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 201) {
              this.$notify({
                type: 'warning',
                title: '添加班次失败',
                message: '已存在此名称的班次,换一个吧~'
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
            this.queryShift();
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
          message: '请选中您要删除的班次',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该班次 , 是否继续?', '提示', {
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
              this.queryShift();
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
          message: '请选中您要编辑的班次',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.shiftName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入班次名称', duration: 1000
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
        this.$delete(item, 'shiftName');
        this.$delete(item, 'workingTimeId');
      })
      EditApi(myCompanyId, this.editForm.shiftId, this.editForm.shiftName, JSON.stringify(this.editTime))
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.shiftName + " 的班次信息编辑成功",
              type: 'success'
            });
            this.editLoading = false;
            this.dialogEditForm = false;
            this.queryShift();
            //初始化某个对象,用于清空表单
            this.editForm = this.$options.data().editForm;
            this.editTime = this.$options.data().editTime;
            return;
          }
          else if (res.data.stateCode == 201) {
            this.$notify({
              type: 'warning',
              title: '编辑班次信息失败',
              message: '已存在此名称的班次,换一个吧~'
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
            message: '每个班次至少有一个时间段', duration: 1000
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
            message: '每个班次至少有一个时间段', duration: 1000
          });
          return;
        }
        var index = this.editTime.indexOf(item)
        if (index !== -1) {
          this.editTime.splice(index, 1)
        }
        // else {
        //   this.$confirm('此操作将永久删除该班次 , 是否继续?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     console.log(1111);
        //     DelWorkTimeApi(item.workingTimeId)
        //       .then(response => {
        //         console.log(response);
        //         if (response.data.stateCode == 0) {
        //           this.$notify({
        //             title: '删除成功',
        //             message: "一个时间段被删除了",
        //             type: 'success'
        //           });
        //           var index = this.editTime.indexOf(item)
        //           if (index !== -1) {
        //             this.editTime.splice(index, 1)
        //           }
        //         }
        //         else {
        //           this.$notify.error({
        //             title: '删除失败',
        //             message: '错误信息' + response.data.message,
        //             duration: 0
        //           });
        //         }
        //       })
        //   })
        //     .catch(() => {
        //       this.$message({
        //         type: 'info',
        //         message: '已取消删除',
        //         duration: 1000
        //       });
        //     });
        // }

      }
    },
    addTimeEl (type) {
      //增加的时候添加时间段文本框
      if (type == 0) {
        this.addTime.push({
          startTime: new Date(2020, 1, 1, 12, 0),
          endTime: new Date(2020, 1, 1, 12, 0),
          nextDay: false
        });
      }
      //编辑的时候添加时间段文本框
      else {
        this.editTime.push({
          startTime: new Date(2020, 1, 1, 12, 0),
          endTime: new Date(2020, 1, 1, 12, 0),
          nextDay: false,
          workingTimeId: 0
        });
      }
    },
    /*日期处理*/
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return ''
      };
      return this.$moment(date).format("HH:mm:ss")
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
@import "../../styles/responseCss/BadType/Mobile.scss";
</style>