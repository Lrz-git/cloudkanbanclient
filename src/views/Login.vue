<template>
  <div class="bigbox">
    <div class="main">
      <div class="top">
        <div class="header">
          <h1 class="logo">
            <a href="http://www.sunpn.com/">Sunpn</a>
          </h1>
          <!-- <div class="login">
          <form>
            <input type="email" placeholder="Email" name required />
            <input type="password" placeholder="Password" name required />
            <button type="submit">Login</button>
          </form>
        </div> -->
        </div>

        <h2><span class="moveDownElement"><i>用智慧促进生产力</i></span></h2>
        <h3><span class="moveDownElement two_Span"><i>助力生产型企业数字化转型</i></span></h3>
      </div>
      <div
        class="signup"
        v-loading="loading"
      >
        <h4>登录</h4>
        <form>
          <div class="field">
            <input
              type="text"
              name
              required
              v-model="loginData.userPhone"
              maxlength="11"
            />
            <span class="label">您的手机号</span>
          </div>
          <div
            class="field"
            v-show="!isCode"
          >
            <input
              type="password"
              name
              required
              v-model="loginData.passWord"
              maxlength="12"
            />
            <span class="label">您的密码</span>
          </div>


          <div
            class="field CheckCodeBox"
            v-show="isCode"
          >
            <input
              type="text"
              name
              required
              v-model="loginData.captcha"
              maxlength="6" 
            />
            <span class="label">短信验证码</span>
            <!-- <el-tag type="success" effect="dark" class="getCode" >获取</el-tag> -->
            <div  class="getCode" @click="GetCaptcha">
              <span>{{getCode}}</span>
            </div>
          </div> 
          


          <div class="field cut">
            <!-- <input type="password" name required >
          <span class="label">Your captcha</span> -->
            <div
              v-show="!isCode"
              @click="isCode=!isCode"
            >验证码登录</div>
            <div
              v-show="isCode"
              @click="isCode=!isCode"
            >密码登录</div>
            <!-- <div>记住密码</div> -->
            <el-checkbox
              class="remember"
              v-model="isRemember"
            >记住密码</el-checkbox>
            <!-- <el-radio>记住密码</el-radio> -->
          </div>
          <div class="field">
            <el-button @click="Judge()">确认</el-button>
          </div>
        </form>
      </div>
    </div>

  </div>

</template>
<script>
var _this;
import { LoginApi, MenuApi,SendCaptchaApi } from '../api/login.js'
import { initDynamicRoutes } from '../router/index.js'


export default {
  data: function () {
    return {
      loading: false,
      isCode: false,
      isRemember: true,
      loginData: {
        userPhone: '17724663156',
        passWord: '888888',
        captcha: ''
      },
      MsgCaptcha:'555555',
      getCode:'获取'
    }
  },
  mounted: function () {
    _this = this;
  },
  methods: {
    Judge(){
      if(_this.isCode){
        _this.CaptchaLogin();
      }
      else{
        _this.Login();
      }
    },
    Login () {
      if (_this.loginData.userPhone.length != 11) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请输入正确的手机号',
          type: 'warning',
          offset: 130
        });
        return;
      }
      if (_this.loginData.passWord.length == 0) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请输入密码',
          type: 'warning',
          offset: 130
        });
        return;
      }
      if (_this.loginData.passWord.length < 6) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '密码在6-12位之间',
          type: 'warning',
          offset: 130
        });
        return;
      }
      _this.loading = true;
      //密码登录
      LoginApi(_this.loginData.userPhone, _this.loginData.passWord)
        .then(response => {
          if (response.data.stateCode != 0) {
            _this.loading = false;
            this.$message({
              showClose: true,
              center: true,
              duration: 1500,
              message: response.data.message,
              type: 'warning',
              offset: 130
            });
            return;
          }
          else {
            let myData = JSON.parse(response.data.myData);
            this.$store.commit('setUserInfo', response.data.myData)
            let timer = setTimeout(() => {
              _this.loading = false;
              this.$message({
                showClose: true,
                center: true,
                duration: 1000,
                message: "验证通过。欢迎您，" + myData[0].userName,
                type: 'success',
                offset: 130
              });
              //请求菜单数据
              MenuApi(myData[0].userId).then(res => {
                //将菜单数据存入Vuex
                this.$store.commit('setRightList', res.data.menulist)
              })

              //延时跳转
              let timerPush = setTimeout(() => {
                //动态添加路由
                initDynamicRoutes();
                this.$router.push({
                  name: 'Layout'
                });
                clearTimeout(timerPush);
              }, 1200)
              clearTimeout(timer);
            }, 1000);
          }
        })
        .catch(error => {
        });
    },
    CaptchaLogin () {
      if (_this.loginData.userPhone.length != 11) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请输入正确的手机号',
          type: 'warning',
          offset: 130
        });
        return;
      }
      if (_this.MsgCaptcha=='') {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请先获取验证码',
          type: 'error',
          offset: 130
        });
        return;
      }
      if (_this.loginData.captcha.length==0) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请输入验证码',
          type: 'error',
          offset: 130
        });
        return;
      }
      if (_this.MsgCaptcha != _this.loginData.captcha) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '验证码错误',
          type: 'error',
          offset: 130
        });
        return;
      }
      _this.loading = true;
      //开始登录
      LoginApi(_this.loginData.userPhone, -1)
        .then(response => {
          if (response.data.stateCode != 0) {
            _this.loading = false;
            this.$message({
              showClose: true,
              center: true,
              duration: 1500,
              message: response.data.message,
              type: 'warning',
              offset: 130
            });
            return;
          }
          else {
            let myData = JSON.parse(response.data.myData);
            this.$store.commit('setUserInfo', response.data.myData)
            let timer = setTimeout(() => {
              _this.loading = false;
              this.$message({
                showClose: true,
                center: true,
                duration: 1000,
                message: "验证通过。欢迎您，" + myData[0].userName,
                type: 'success',
                offset: 130
              });
              //请求菜单数据
              MenuApi(myData[0].userId).then(res => {
                //将菜单数据存入Vuex
                this.$store.commit('setRightList', res.data.menulist)
              })

              //延时跳转
              let timerPush = setTimeout(() => {
                //动态添加路由
                initDynamicRoutes();
                this.$router.push({
                  name: 'Layout'
                });
                clearTimeout(timerPush);
              }, 1200)
              clearTimeout(timer);
            }, 1000);
          }
        })
        .catch(error => {
        });
    },
    GetCaptcha(){
      if(_this.getCode!="获取"){
        return;
      }
      if (_this.loginData.userPhone.length != 11) {
        this.$message({
          showClose: true,
          center: true,
          duration: 1500,
          message: '请输入正确的手机号',
          type: 'warning',
          offset: 130
        });
        return;
      }
      SendCaptchaApi(_this.loginData.userPhone)
      .then(res=>{
        if(res.data.stateCode=='0'){
          _this.MsgCaptcha=res.data.captcha;
          this.$message({
              showClose: true,
              center: true,
              duration: 1500,
              message: "发送成功，请查收",
              type: 'success',
              offset: 130
            });
        var time=60;
				 _this.getCode=time+"s";
			 	 var mySetInterval=setInterval(()=> {
					if(time>0) {
						time--;
						_this.getCode=time+"s";
					}
					if(time==0){
						_this.getCode="获取";
						clearInterval(mySetInterval);
					}
					if(_this.isCode==false){
						_this.getCode="获取";
						clearInterval(mySetInterval);
					}
        }, 1000);

        }
        else{
           this.$message({
              showClose: true,
              center: true,
              duration: 1500,
              message: res.data.message,
              type: 'warning',
              offset: 130
            });
            return;
        }
      })
    }
  }
}
</script>



<style lang="scss" scoped>
.bigbox {
  height: 100vh;
  box-sizing: border-box;
  font-size: 1rem;
  margin: 0;
  padding: 0;
  font-weight: normal;
  background-color: #3c5b9a;
  padding: 4rem;
  font-family: tahoma;
}
html {
  box-sizing: border-box;
  font-size: 1rem;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

body,
h1,
h2,
h3 {
  margin: 0;
  padding: 0;
  font-weight: normal;
  cursor: default;
}

a {
  text-decoration: none;
}

.main {
  width: 100%;
  height: 85%;
  background-color: #e9eaef;
  box-shadow: 0 0 1.25rem #143477;
}

.top {
  background-color: #3c5b9a;
  height: 50%;
}
.cut {
  display: flex;
  justify-content: space-between;
  div {
    cursor: pointer;
  }
}
.header {
  display: flex;
  justify-content: space-between;
}

.logo {
  padding-left: 1.25rem;
  padding-top: 0.625rem;
  a {
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

h2 {
  color: white;
  text-align: center;
  font-size: 3rem;
  padding: 2rem 0 1rem;
  letter-spacing: 0.625rem;
}

h3 {
  color: white;
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 0.3rem;
}
.moveDownElement {
  display: inline-block;
  //   background-color: #666;
  opacity: 0;
  animation: 1.2s fade-in ease-in-out forwards;
  overflow: hidden;
  i {
    font-style: normal;
    position: relative;
    top: 4.5rem;
    animation: 1s font-up ease-in-out forwards;
  }
}
.two_Span {
  animation-delay: 0.3s;
  i {
    animation-delay: 0.3s;
  }
}

@keyframes font-up {
  to {
    top: 0rem;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.signup {
  width: 25rem;
  //   height: 340px;
  margin: auto;
  background-color: white;
  position: relative;
  top: -4.438rem;
  padding: 1.9rem;
  box-shadow: 0px 1.56rem 1.875rem -0.8rem rgba(0, 0, 0, 0.8);
}

.signup h4 {
  color: gray;
  font-size: 1.4rem;
  text-align: center;
  margin: 0;
}

.signup .field {
  margin-top: 2.2rem;
  position: relative;
}

.signup input {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  border-bottom: 0.13rem solid #999;
  color: gray;
  font-size: 1.2rem;
}
.CheckCodeBox{
  display: flex;
  justify-content: space-between;
  input{
  width: 80%;
  }
  .getCode{
    cursor: pointer;
    background-color: #67C23A;
    border-radius: 2px;
    padding: 2px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      color: white;
      font-size: 0.625rem;
    }
  }
}
.signup button {
  display: block;
  width: 90%;
  margin: auto;
  outline: none;
  background-color: #4277b2;
  border: 0px solid #29487d;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.625rem;
  transition: all 0.2s;
}
.signup button:hover {
  width: 100%;
}

.signup .label {
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  transition: 0.2s ease all;
  color: #757575;
  font-size: 1rem;
  // letter-spacing:1px;
}

.sign {
  color: white;
}

.signup input:focus ~ .label,
.signup input:not(:focus):valid ~ .label {
  top: -1.05rem;
  font-size: 0.8rem;
  opacity: 1;
}
@import "../styles/responseCss/Login/Mobile.scss";
</style>
