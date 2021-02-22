<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增计划</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑计划</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="Del()"
        >
          删除计划
        </div>
      </div>
      <div class="changeArea">
        <el-button
          type="primary"
          class="btnSearch"
          @click="sendPlan()"
        >下发计划</el-button>

        <el-button
          type="danger"
          class="btnReset"
        >暂停计划</el-button>

        <el-button
          type="warning"
          class="btnfreeze"
          @click="endPlan()"
        >结束计划</el-button>
      </div>

    </div>
    <div class="OperatingArea">
      <div class="searchArea">
        <el-select
          class="interval"
          v-model="Condition.shiftId"
          placeholder="请选择班次"
          multiple
          collapse-tags
          filterable
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
          filterable
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
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in productInfo"
            :key="item.productId"
            :label="item.productName + '( '+item.productModel+' )'"
            :value="item.productId"
          >
          </el-option>
        </el-select>

        <el-input
          placeholder="订单号"
          v-model="Condition.orderNo"
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

      <el-table
        v-loading="tableLoading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 55%"
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
          prop="orderNo"
          label="订单编号"
          width="160"
        />
        <el-table-column
          prop="lineName"
          label="所属产线"
        />
        <el-table-column
          prop="shiftName"
          label="班次"
          width="130"
        />
        <el-table-column
          prop="startDate"
          label="开始日期"
          :formatter="dateFormat"
          width="120"
        />

        <el-table-column
          prop="state"
          label="计划状态"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag
              type="danger"
              effect="dark"
              v-if="scope.row.state=='执行中'"
            >
              {{ scope.row.state }}
            </el-tag>
            <el-tag
              type="success"
              effect="dark"
              v-if="scope.row.state=='等待中'"
            >
              {{ scope.row.state }}
            </el-tag>
            <el-tag
              type="info"
              effect="dark"
              v-if="scope.row.state=='已完成'"
            >
              {{ scope.row.state }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="planId"
          prop="planId"
          v-if="false"
        />
        <el-table-column
          label="lineId"
          prop="lineId"
          v-if="false"
        />

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
              style="display:flex;flex-wrap: wrap;align-content: space-between;"
            >
              <el-form-item
                class="expansionWidth"
                label="产品名称:"
              >
                <span>{{ props.row.productName }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth2"
                label="总计划数 :"
              >
                <span>{{ props.row.sumPlanNum }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth"
                label="产品型号:"
              >
                <span>{{ props.row.productModel }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth2"
                label="总实际数 :"
              >
                <span>{{ props.row.sumActualNum }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth"
                label="产线负责人 :"
              >
                <span>{{ props.row.userName }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth2"
                label="总不良数 :"
              >
                <span>{{ props.row.sumBadNum }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth"
                label="负责人联系方式 :"
              >
                <span>{{ props.row.userPhone }}</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth2"
                label="生产进度 :"
              >
                <span v-if="props.row.sumPlanNum>0">{{ numFilter((props.row.sumActualNum/props.row.sumPlanNum)*100)+'%' }}</span>
                <span v-if="props.row.sumPlanNum==0">0%</span>
              </el-form-item>

              <el-form-item
                class="expansionWidth"
                label="计数方案 :"
              >
                <el-popover
                  placement="right"
                  :title="'步长: '+props.row.stepSize"
                  width="200"
                  trigger="hover"
                  :content="'延时时间: '+props.row.intervalTime +'s , 闭合时间: '+props.row.delayTime + 's'"
                >
                  <el-tag slot="reference">{{ props.row.countPreceptName }}</el-tag>
                </el-popover>

              </el-form-item>

              <el-form-item
                class="expansionWidth2"
                label="合格比率 :"
              >
                <span v-if="props.row.sumActualNum > 0">{{ numFilter(( (props.row.sumActualNum-props.row.sumBadNum)/props.row.sumActualNum)*100)+'%'  }}</span>
                <span v-if="props.row.sumActualNum ==0">100%</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-loading="detailLoading"
        ref="multipleTable"
        :data="detailData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 40%"
        :height="tableHeight"
        empty-text="请选中左侧的计划以查看计划明细~"
        :lazy="true"
      >
        <el-table-column
          label="序号"
          type="index"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          :formatter="dateFormatDetail"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          :formatter="dateFormatDetail"
        />
        <el-table-column
          prop="planNum"
          label="计划数"
          width="80"
        />
        <el-table-column
          prop="actualNum"
          label="实际数"
          width="80"
        />
        <el-table-column
          prop="badNum"
          label="不良数"
          width="80"
        />
        <el-table-column
          prop="schedule"
          label="生产进度"
          width="90"
        />
        <el-table-column
          prop="fpy"
          label="合格比率"
          width="90"
        />
        <el-table-column
          prop="state"
          label="状态"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag
              type="danger"
              effect="dark"
              v-if="scope.row.state=='执行中'"
            >
              {{ scope.row.state }}
            </el-tag>
            <el-tag
              type="success"
              effect="dark"
              v-if="scope.row.state=='等待中'"
            >
              {{ scope.row.state }}
            </el-tag>
            <el-tag
              type="info"
              effect="dark"
              v-if="scope.row.state=='已完成'"
            >
              {{ scope.row.state }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="planDetailId"
          prop="planDetailId"
          v-if="false"
        />
      </el-table>
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
        <el-form-item label="订单编号">
          <el-input
            v-model="addForm.orderNo"
            clearable
            placeholder="请输入订单编号(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="所属产线">
          <el-select
            class="interval"
            v-model="addForm.lineId"
            placeholder="请选择产线(必选)"
            filterable
          >
            <el-option
              v-for="item in lineInfo"
              :key="item.lineId"
              :label="item.lineName"
              :value="item.lineId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属班次">
          <el-select
            class="interval"
            v-model="addForm.shiftId"
            placeholder="请选择班次(必选)"
            @change="shiftChange(addForm.shiftId)"
            filterable
          >
            <el-option
              v-for="item in shiftInfo"
              :key="item.shiftId"
              :label="item.shiftName"
              :value="item.shiftId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称">
          <el-select
            class="interval interval2"
            v-model="addForm.productId"
            placeholder="请选择产品(必选)"
            filterable
          >
            <el-option
              v-for="item in productInfo"
              :key="item.productId"
              :label="item.productName + '( '+item.productModel+' )'"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计数方案">
          <el-select
            class="interval"
            v-model="addForm.countPreceptId"
            placeholder="请选择计数方案(必选)"
            filterable
          >
            <el-option
              v-for="item in countPreceptInfo"
              :key="item.countPreceptId"
              :label="item.countPreceptName+'( 步长: '+item.stepSize+' )'"
              :value="item.countPreceptId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总计划数">
          <el-input
            v-model="addSumPlanNum"
            disabled
            placeholder="(自动计算)"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="计划明细"
          style="width:100%"
        >
          <el-table
            ref="multipleTable"
            :data="addDetailTable"
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
                <el-date-picker
                  type="datetime"
                  placeholder="选择开始时间"
                  v-model="scope.row.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="unifyDate(scope.row.serial,scope.row.startTime,0)"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  type="datetime"
                  placeholder="选择结束时间"
                  v-model="scope.row.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="planNum"
              label="计划数"
              width="100"
            >

              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-model="scope.row.planNum"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
            >
              <template slot-scope="scope">
                <span
                  class="el-icon-delete"
                  @click.prevent="removeDetail(scope.row,0)"
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="insertDetail(0)"
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
        <el-form-item label="订单编号">
          <el-input
            v-model="editForm.orderNo"
            clearable
            placeholder="请输入订单编号(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="所属产线">
          <el-select
            class="interval"
            v-model="editForm.lineId"
            placeholder="请选择产线(必选)"
            filterable
          >
            <el-option
              v-for="item in lineInfo"
              :key="item.lineId"
              :label="item.lineName"
              :value="item.lineId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属班次">
          <el-select
            class="interval"
            v-model="editForm.shiftId"
            placeholder="请选择班次(必选)"
            @change="shiftChange(editForm.shiftId)"
            disabled
          >
            <el-option
              v-for="item in shiftInfo"
              :key="item.shiftId"
              :label="item.shiftName"
              :value="item.shiftId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称">
          <el-select
            class="interval interval2"
            v-model="editForm.productId"
            placeholder="请选择产品(必选)"
            filterable
          >
            <el-option
              v-for="item in productInfo"
              :key="item.productId"
              :label="item.productName + '( '+item.productModel+' )'"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计数方案">
          <el-select
            class="interval"
            v-model="editForm.countPreceptId"
            placeholder="请选择计数方案(必选)"
            filterable
            disabled
          >
            <el-option
              v-for="item in countPreceptInfo"
              :key="item.countPreceptId"
              :label="item.countPreceptName+'( 步长: '+item.stepSize+' )'"
              :value="item.countPreceptId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="总计划数">
          <el-input
            v-model="editSumPlanNum"
            disabled
            placeholder="(自动计算)"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="计划明细"
          style="width:100%"
        >
          <el-table
            ref="multipleTable"
            :data="editDetailTable"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            empty-text="请选中班次以编辑计划明细~"
          >

            <el-table-column
              prop="planDetailId"
              label="planDetailId"
              v-if="false"
            >
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  type="datetime"
                  placeholder="选择开始时间"
                  v-model="scope.row.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="unifyDate(scope.row.serial,scope.row.startTime,1)"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  type="datetime"
                  placeholder="选择结束时间"
                  v-model="scope.row.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="planNum"
              label="计划数"
              width="100"
            >

              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-model="scope.row.planNum"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
            >
              <template slot-scope="scope">

                <span
                  class="el-icon-delete"
                  @click.prevent="removeDetail(scope.row,1)"
                ></span>

              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="insertDetail(1)"
        ></el-button>
        <el-button @click="SaveChanges(0)">取 消</el-button>
        <el-button
          type="primary"
          @click="SaveChanges(1)"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { LoginApi } from '../../api/login.js';
import { GetConditionApi, GetApi, GetDetailApi, GetworkingTimeApi, GetEditApi, EditApi, AddApi, DelDetailApi, DelApi, SendApi, EndApi } from '../../api/plan.js'
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
        orderNo: '',
        productId: ''
      },
      currentRow: null,
      dialogForm: false,
      dialogEditForm: false,
      tableLoading: false,
      detailLoading: false,
      addLoading: false,
      editLoading: false,
      tableHeight: window.innerHeight - 300,
      selectedShift: '',
      tableData: [],
      detailData: [],
      addDetailTable: [],
      editDetailTable: [],
      shiftInfo: [],
      lineInfo: [],
      productInfo: [],
      countPreceptInfo: [],
      addForm: {
        orderNo: '',
        lineId: '',
        shiftId: '',
        productId: '',
        countPreceptId: '',
        startDate: ''
        // sumPlanNum: '' 已经用计算属性addSumPlanNum代替
      },
      addDetail: [],
      editForm: {
        planId: '',
        orderNo: '',
        lineId: '',
        shiftId: '',
        productId: '',
        countPreceptId: '',
        startDate: '',
        planState: ''
        // sumPlanNum: '' 已经用计算属性addSumPlanNum代替
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
            this.tableHeight = window.innerHeight - 350 - 230
          }
        }
        else if (w > 1023 && w < 1367) {
          //   console.log('3');
          this.tableHeight = window.innerHeight - 360 - 60
        }
        else {
          //   console.log('4');
          this.tableHeight = window.innerHeight - 250 - 60
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
            this.countPreceptInfo = JSON.parse(res.data.myData).Table3;
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
      GetApi(myCompanyId, this.Condition.lineId.join(','), this.Condition.shiftId.join(','), this.Condition.productId.join(','), this.Condition.orderNo)
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
      this.detailData = null;
    },
    Add (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        this.addDetailTable = this.$options.data().addDetailTable;
      }
      //确定添加
      else {
        if (this.addForm.orderNo == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入订单编号', duration: 1000
          });
          return;
        }
        if (this.addForm.lineId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择产线', duration: 1000
          });
          return;
        }
        if (this.addForm.shiftId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择班次', duration: 1000
          });
          return;
        }
        if (this.addForm.productId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择班次', duration: 1000
          });
          return;
        }
        if (this.addSumPlanNum == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请在计划明细内输入大于0的计划数', duration: 1000
          });
          return;
        }
        for (let i = 0; i < this.addDetailTable.length; i++) {
          if (this.addDetailTable[i].planNum === 0 || this.addDetailTable[i].planNum === '' || this.addDetailTable[i].planNum === null) {
            this.$message({
              showClose: true, center: true, type: 'warning',
              message: '计划明细内的计划数不能为0,不能为空', duration: 1000
            });
            return;
          }
        }

        this.addLoading = true;
        AddApi(myCompanyId, this.addForm.orderNo, this.addForm.lineId, this.addForm.shiftId, this.addForm.productId, this.addForm.countPreceptId, JSON.stringify(this.addDetailTable))
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加计划成功',
                message: '开始生产吧~',
                type: 'success'
              });
              this.dialogForm = false;
              //初始化某个对象,用于清空表单
              this.addForm = this.$options.data().addForm;
              this.addDetailTable = this.$options.data().addDetailTable;
              this.query();
            }
            else if (response.data.stateCode == 201) {
              this.$notify({
                type: 'warning',
                title: '添加计划失败',
                message: '该产线在当日已经存在此班次的计划,试试其他班次吧~'
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
              return;
            }
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
          message: '请选中您要删除的计划',
          duration: 1000
        });
        return;
      }
      if (this.currentRow.state == '执行中' || this.currentRow.state == '暂停中') {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '执行中或暂停中的计划无法删除,请先结束计划再进行删除操作',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该计划,并且无法恢复,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelApi(this.currentRow.planId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: '一条计划被删除了',
                type: 'success'
              });
              this.query();
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
    endPlan () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要结束的计划',
          duration: 1000
        });
        return;
      }
      if (this.currentRow.state == '等待中') {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '该计划还没有开始噢,无法结束',
          duration: 1000
        });
        return;
      }
      EndApi(myCompanyId, this.currentRow.planId)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '结束成功',
              message: '快去报表内查看这个计划的生产情况把~',
              type: 'success'
            });
            this.query();
          }
          else {
            this.$notify.error({
              title: '结束失败',
              message: '错误信息' + res.data.message,
              duration: 0
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: '结束失败',
            message: error,
            duration: 0
          });
        })
    },
    sendPlan () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要下发的计划',
          duration: 1000
        });
        return;
      }
      if (this.currentRow.state == '执行中') {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '该计划已经在执行中啦,无需重复操作',
          duration: 1000
        });
        return;
      }
      SendApi(myCompanyId, this.currentRow.planId, this.currentRow.lineId)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '下发成功',
              message: '快开始生产吧~',
              type: 'success'
            });
            this.query();
          }
          else if (res.data.stateCode == 1) {
            this.$notify({
              title: '下发失败',
              message: '此产线已经存在执行中的计划了,请先结束',
              type: 'warning'
            });
          }
          else {
            this.$notify.error({
              title: '下发失败',
              message: '错误信息' + res.data.message,
              duration: 0
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: '结束失败',
            message: error,
            duration: 0
          });
        })
    },
    dblclick () {
      this.OpenEditDialog();
    },
    OpenEditDialog () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要编辑的计划',
          duration: 1000
        });
        return;
      }
      else {
        this.dialogEditForm = true;
        // this.editDetailTable = { ...this.detailData };
        GetEditApi(myCompanyId, this.currentRow.planId)
          .then(res => {
            if (res.data.stateCode == 0) {
              this.editForm = JSON.parse(res.data.myData).Table[0];
              this.editDetailTable = JSON.parse(res.data.myData).Table1;
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
          .catch(error => {
            this.$notify.error({
              title: '提示',
              message: error,
              duration: 0
            });
            return;
          })
      }
    },
    SaveChanges (type) {
      if (type == 1) {
        if (this.editForm.orderNo == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入订单编号', duration: 1000
          });
          return;
        }
        if (this.editForm.lineId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择产线', duration: 1000
          });
          return;
        }
        if (this.editForm.shiftId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择班次', duration: 1000
          });
          return;
        }
        if (this.editForm.productId == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请选择班次', duration: 1000
          });
          return;
        }
        if (this.editSumPlanNum == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请在计划明细内输入大于0的计划数', duration: 1000
          });
          return;
        }
        for (let i = 0; i < this.editDetailTable.length; i++) {
          if (this.editDetailTable[i].planNum === 0 || this.editDetailTable[i].planNum === '' || this.editDetailTable[i].planNum === null) {
            this.$message({
              showClose: true, center: true, type: 'warning',
              message: '计划明细内的计划数不能为0,不能为空', duration: 1000
            });
            return;
          }
        }

        this.editDetailTable.forEach(item => {
          this.$delete(item, 'serial');
          this.$delete(item, 'state');
        })
        this.editLoading = true;
        EditApi(myCompanyId, this.editForm.planId, this.editForm.orderNo, this.editForm.lineId, this.editForm.shiftId, this.editForm.productId, this.editForm.countPreceptId, JSON.stringify(this.editDetailTable))
          .then(res => {
            if (res.data.stateCode == 0) {
              this.$notify({
                title: '编辑成功',
                message: "计划信息编辑成功",
                type: 'success'
              });
              this.editLoading = false;
              this.dialogEditForm = false;

              //初始化某个对象,用于清空表单
              this.editForm = this.$options.data().editForm;
              this.editTime = this.$options.data().editTime;
              this.query();
              this.queryDetai();
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
      }
      else {
        this.dialogEditForm = false;
        this.editForm = this.$options.data().editForm;
        this.editDetailTable = this.$options.data().editDetailTable;
      }
    },
    handleCurrentChange (val) {
      if (val == null) {
        return;
      }
      this.currentRow = val;
      this.queryDetai();
    },
    queryDetai () {
      this.detailLoading = true;
      GetDetailApi(myCompanyId, this.currentRow.planId)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.detailData = JSON.parse(response.data.myData);
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
      this.detailLoading = false;
    },
    /*日期处理*/
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return ''
      };
      return this.$moment(date).format("MM月DD日")
    },
    /*日期处理*/
    dateFormatDetail: function (row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return ''
      };
      return this.$moment(date).format("MM-DD hh:mm")
    },
    // 截取当前数据到小数点后两位
    numFilter (value) {
      const realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
    //班次下拉框选中事件,查询班次的时间段
    shiftChange (shiftId) {
      GetworkingTimeApi(myCompanyId, shiftId)
        .then(response => {
          if (response.data.stateCode == 0) {
            this.addDetailTable = JSON.parse(response.data.myData);
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
    removeDetail (item, type) {
      if (type == 0) {
        if (this.addDetailTable.length == 1) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '每个计划至少有一个计划明细', duration: 1000
          });
          return;
        }
        var index = this.addDetailTable.indexOf(item)
        if (index !== -1) {
          this.addDetailTable.splice(index, 1)
        }
      }
      else {
        //编辑时的删除明细
        if (item.planDetailId == 0) {
          var index = this.editDetailTable.indexOf(item)
          if (index !== -1) {
            this.editDetailTable.splice(index, 1)
            return;
          }
        }
        if (this.editDetailTable.length == 1) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '每个计划至少有一个计划明细', duration: 1000
          });
          return;
        }
        if (item.state == 0) {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '执行中的计划明细无法删除', duration: 1000
          });
          return;
        }
        this.$confirm('此操作将永久删除该计划明细,并且无法恢复,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            DelDetailApi(item.planDetailId)
              .then(response => {
                if (response.data.stateCode == 0) {
                  this.$notify({
                    title: '删除成功',
                    message: '一条计划明细被删除了',
                    type: 'success'
                  });
                  var index = this.editDetailTable.indexOf(item)
                  if (index !== -1) {
                    this.editDetailTable.splice(index, 1)
                  }
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


      }
    },
    insertDetail (type) {
      //增加的时候添加行
      if (type == 0) {
        if (this.addDetailTable == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请先选择班次,再添加计划明细', duration: 1000
          });
          return;
        }
        this.addDetailTable.push({
          startTime: '',
          endTime: '',
          planNum: ''
        });
      }
      //编辑的时候添加行
      else {
        if (this.editDetailTable == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请先选择班次,再添加计划明细', duration: 1000
          });
          return;
        }
        this.editDetailTable.push({
          planDetailId: 0,
          startTime: '',
          endTime: '',
          planNum: ''
        });
      }
    },
    unifyDate (serial, dateTime, type) {
      console.log(serial, dateTime, type);
      if (serial != 1) {
        return;
      }
      let date = dateTime.substr(0, 10);
      if (type == 0) {
        this.addDetailTable.forEach(item => {
          item.startTime = date + item.startTime.substr(10, 9);
          item.endTime = date + item.endTime.substr(10, 9);
          if (item.nextDay == true) {

          }
        })
      }
      else if (type == 1) {
        this.editDetailTable.forEach(item => {
          item.startTime = date + item.startTime.substr(10, 9);
          item.endTime = date + item.endTime.substr(10, 9);
          if (item.nextDay == true) {

          }
        })
      }
    }
  },
  computed: {
    addSumPlanNum: function () {
      let sum = 0;
      this.addDetailTable.forEach(item => {
        if (item.planNum != '') {
          sum += parseInt(item.planNum);
        }
      });
      return sum;
    },
    editSumPlanNum: function () {
      let sum = 0;
      this.editDetailTable.forEach(item => {
        if (item.planNum != '') {
          sum += parseInt(item.planNum);
        }
      });
      return sum;
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
.interval {
  margin-right: 1.5rem;
  width: 17rem;
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
  display: flex;
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
.expansionWidth {
  width: 60%;
}
.expansionWidth2 {
  width: 35%;
}

@import "../../styles/responseCss/BadType/Mobile.scss";
</style>