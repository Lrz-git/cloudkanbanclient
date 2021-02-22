<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="searchArea">

        <el-date-picker
          v-model="Condition.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>

        <el-select
          class="interval"
          v-model="Condition.shiftId"
          placeholder="请选择班次"
          multiple
          filterable
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
          filterable
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
          filterable
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
      <!-- icon="el-icon-download" -->
    </div>
    <div class="content">

      <el-table
        v-loading="tableLoading"
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 55%"
        :height="tableHeight"
        empty-text="这儿什么都没有~"
        :lazy="true"
        @current-change="handleCurrentChange"
      >

        <el-table-column
          label="序号"
          type="index"
        />
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
          width="100"
        />
        <el-table-column
          prop="startDate"
          label="开始日期"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="state"
          label="计划状态"
          width="80"
        />
        <el-table-column
          label="planId"
          prop="planId"
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
          label="达成率"
          width="90"
        />
        <el-table-column
          prop="fpy"
          label="合格率"
          width="90"
        />
        <el-table-column
          prop="state"
          label="状态"
          width="80"
        >
          <!-- <template slot-scope="scope">
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
          </template> -->
        </el-table-column>
        <el-table-column
          label="planDetailId"
          prop="planDetailId"
          v-if="false"
        />
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange_Pagination"
      @current-change="handleCurrentChange_Pagination"
      :current-page="currentPage"
      :page-sizes="[15, 30,50,100]"
      :page-size="pageSize"
      layout="prev, pager, next, total, sizes, jumper"
      :total="totalNum"
    >
    </el-pagination>
  </div>
</template>

<script>
import { GetConditionApi, GetApi, GetDetailApi } from '../../api/report.js'
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
        productId: '',
        date: ''
      },
      currentPage: 1,//默认显示第一页
      pageSize: 15,//默认每页显示10条
      totalNum: 1000, //总页数
      currentRow: null,
      dialogForm: false,
      tableLoading: false,
      detailLoading: false,
      tableHeight: window.innerHeight - 300,
      tableData: [],
      detailData: [],
      shiftInfo: [],
      lineInfo: [],
      productInfo: [],
      pickerOptions: {
        shortcuts: [{
          text: '昨日',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
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
      if (this.Condition.date == null) {
        this.Condition.date = '';
      }

      GetApi(myCompanyId, this.Condition.lineId.join(','), this.Condition.shiftId.join(','), this.Condition.productId.join(','), this.Condition.orderOn, this.Condition.date[0], this.Condition.date[1])
        .then(response => {
          if (response.data.stateCode == 0) {
            this.tableData = JSON.parse(response.data.myData);
            if (this.tableData != null) {
              this.totalNum = this.tableData.length;
            }
            else {
              this.totalNum = 0;
              this.tableData = [];
            }
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

    handleCurrentChange (val) {
      if (val == null) {
        return;
      }
      this.detailLoading = true;
      this.currentRow = val;
      console.log(val.planId);
      GetDetailApi(myCompanyId, val.planId)
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
      return this.$moment(date).format("yyyy年MM月DD日")
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
    handleSizeChange_Pagination (val) {
      this.pageSize = val;    //动态改变
    },
    handleCurrentChange_Pagination (val) {
      this.currentPage = val;    //动态改变
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
.interval:nth-child(2) {
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

//日期选择器的宽度
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  margin-right: 1.5rem;
  width: 320px !important;
}
@import "../../styles/responseCss/BadType/Mobile.scss";
</style>