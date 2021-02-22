<template>
  <div class="bigbox">
    <div class="OperatingArea">
      <div class="changeArea">
        <div
          class="buttomGroup"
          @click="dialogForm = true"
        >新增产品</div>
        <div
          class="buttomGroup"
          @click="OpenEditDialog()"
        >编辑产品</div>

        <div
          slot="reference"
          class="buttomGroup btnRightBorder"
          @click="DelProduct ()"
        >
          删除产品
        </div>

      </div>

      <div class="searchArea">
        <el-input
          placeholder="产品名称"
          v-model="productName_like"
          clearable
          class="like_name"
        >
        </el-input>
        <el-input
          placeholder="产品型号"
          v-model="productModel_like"
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
          prop="productName"
          label="产品名称"
        />
        <el-table-column
          prop="productModel"
          label="产品型号"
        />
        <el-table-column
          prop="sumNum"
          label="累计生产数量"
        />
        <el-table-column
          prop="remark"
          label="备注"
        />

        <el-table-column
          label="productId"
          prop="productId"
          v-if="false"
        />
      </el-table>
    </div>
    <!-- 新增窗体 -->
    <el-dialog
      v-loading="addLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="新增产品"
      :visible.sync="dialogForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="产品名称">
          <el-input
            v-model="addForm.productName"
            clearable
            placeholder="请输入产品名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="产品型号">
          <el-input
            v-model="addForm.productModel"
            clearable
            placeholder="请输入产品型号(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            clearable
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="AddProduct(1)">取 消</el-button>

        <el-button
          type="primary"
          @click="AddProduct(0)"
        >确 定</el-button>

      </div>
    </el-dialog>
    <!-- 修改窗体 -->
    <el-dialog
      v-loading="editLoading"
      :modal-append-to-body="true"
      :append-to-body="true"
      title="编辑产品"
      :visible.sync="dialogEditForm"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="产品名称">
          <el-input
            v-model="editForm.productName"
            clearable
            placeholder="请输入产品名称(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="产品型号">
          <el-input
            v-model="editForm.productModel"
            clearable
            placeholder="请输入产品型号(必填)"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="editForm.remark"
            clearable
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
import { GetProApi, EditProApi, AddProApi, DelProApi } from '../../api/product.js'
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
      productName_like: '',
      productModel_like: '',
      tableData: [],
      addForm: {
        productName: '',
        productModel: '',
        remark: ''
      },
      editForm: {
        productId: '',
        productName: '',
        productModel: '',
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
      GetProApi(myCompanyId, this.productName_like, this.productModel_like)
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
    AddProduct (type) {
      //取消
      if (type == 1) {
        this.dialogForm = false;
        //初始化某个对象,用于清空表单
        this.addForm = this.$options.data().addForm;
        //初始化整个Data: Object.assign(this.$data, this.$options.data())
      }
      //确定添加
      else {
        if (this.addForm.productName == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入产品名称', duration: 1000
          });
          return;
        }
        if (this.addForm.productModel == '') {
          this.$message({
            showClose: true, center: true, type: 'warning',
            message: '请输入产品型号', duration: 1000
          });
          return;
        }
        this.addLoading = true;
        AddProApi(myCompanyId, this.addForm.productName, this.addForm.productModel, this.addForm.remark)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '添加产品成功',
                message: '快去生产 ' + this.addForm.productName + ' 吧',
                type: 'success'
              });
            }
            else if (response.data.stateCode == 201) {
              this.$notify.error({
                title: '添加产品失败',
                message: '已存在此名称的产品,换一个吧~'
              });
              this.addLoading = false;
              return;
            }
            else if (response.data.stateCode == 202) {
              this.$notify.error({
                title: '添加产品失败',
                message: '已存在此型号的产品,换一个吧~'
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
      }
      this.addLoading = false;
    },
    DelProduct () {
      if (this.currentRow == null) {
        this.$message({
          showClose: true,
          center: true,
          type: 'warning',
          message: '请选中您要删除的产品',
          duration: 1000
        });
        return;
      }
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelProApi(myCompanyId, this.currentRow.productId)
          .then(response => {
            if (response.data.stateCode == 0) {
              this.$notify({
                title: '删除成功',
                message: this.currentRow.productName + " 被删除了",
                type: 'success'
              });
              this.query();
            }
            else if (response.data.stateCode == 1) {
              this.$notify({
                title: '删除失败',
                message: '无法删除 ' + this.currentRow.productName + ' ,因为此产品正在生产,请先将计划结束再进行删除操作',
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
          message: '请选中您要编辑的产品',
          duration: 1000
        });
        return;
      }
    },
    SaveChanges () {
      if (this.editForm.productName == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入产品名称', duration: 1000
        });
        return;
      }
      if (this.editForm.productModel == '') {
        this.$message({
          showClose: true, center: true, type: 'warning',
          message: '请输入产品型号', duration: 1000
        });
        return;
      }
      this.editLoading = true;
      EditProApi(myCompanyId, this.editForm.productId, this.editForm.productName, this.editForm.productModel, this.editForm.remark)
        .then(res => {
          if (res.data.stateCode == 0) {
            this.$notify({
              title: '编辑成功',
              message: this.editForm.productName + " 的产品信息编辑成功",
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
              title: '编辑产品信息失败',
              message: '已存在此名称的产品,换一个吧~'
            });
            this.editLoading = false;
            return;
          }
          else if (res.data.stateCode == 202) {
            this.$notify.error({
              title: '编辑产品信息失败',
              message: '已存在此型号的产品,换一个吧~'
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
            title: '编辑产品信息失败',
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
  padding-right: 1.5rem;
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