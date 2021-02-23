<template>
  <div class="bigbox">

    <div class="left">
      <div class="carousel">
        <el-carousel
          :interval="4000"
          type="card"
          height="350px"
          trigger="click"
        >
          <el-carousel-item
            v-for="( item,index) in PhotoUrl"
            :key="index"
          >
            <img
              :src="PhotoUrl[index]"
              alt=""
            >
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="leftdown">
        <div class="base">
          <div class="titleFont"><i class="el-icon-monitor"></i> 系统</div>
          <div class="oneContent">
            <div class="col">
              <div class="smallTit">已授权设备</div>
              <countTo
                class="countFont"
                :endVal='parseInt(baseParam[8].baseParamValue)'
                :duration='2000'
              ></countTo>
            </div>
            <div class="col">
              <div class="smallTit">已计数</div>
              <countTo
                class="countFont"
                :endVal='parseInt(baseParam[1].baseParamValue)'
                :duration='2000'
              ></countTo>
            </div>
            <div class="col">
              <div class="smallTit">待计数</div>
              <countTo
                class="countFont"
                :endVal='parseInt(baseParam[3].baseParamValue)'
                :duration='2000'
              ></countTo>
            </div>

          </div>
          <div class="sysV">

            <div style="font-Size: 0.725rem;padding-top: 2px;">{{baseParam[0].baseParamValue}} </div>
            <div> 最后更新日期: {{baseParam[2].baseParamValue}}</div>
          </div>
        </div>
        <div class="base">
          <div class="titleFont"><i class="el-icon-sunny"></i> 天气</div>
          <div
            class="weatherContent"
            v-if="weatherRoot.daily"
          >
            <div class="weatherAddress">
              <div>
                <i class="el-icon-location-outline"></i>
                <span>{{cityName}}</span>
              </div>
              <div class="weatherState">
                {{weatherRoot.daily[0].textDay}}
              </div>
            </div>

            <div
              class="tempFont"
              v-if="weatherRoot.daily"
            >
              <div class="mainTemp">
                <countTo
                  :endVal='parseInt(weatherRoot.daily[0].tempMin)'
                  :duration='2000'
                  suffix='°'
                ></countTo>
                ~
                <countTo
                  :endVal='parseInt(weatherRoot.daily[0].tempMax)'
                  :duration='2000'
                  suffix='°'
                ></countTo>
              </div>
            </div>
            <div
              class="myFontCarousel"
              v-if="livingRoot.daily"
            >
              <el-carousel
                :interval="4000"
                arrow="never"
                indicator-position="none"
                height="55px"
              >
                <el-carousel-item
                  v-for="(item ,index ) in livingRoot.daily"
                  :key="index"
                >
                  <p>{{item.name+"："+item.text}}</p>
                </el-carousel-item>

              </el-carousel>
            </div>

          </div>
        </div>
        <div class="base">
          <div class="titleFont"><i class="el-icon-chat-dot-round"></i> 服务</div>
          <div class="relation">
            <div class="tel">业务相关 : <i class="el-icon-mobile-phone"></i><span>{{baseParam[4].baseParamValue}} </span></div>
            <div class="tel">软件相关 : <i class="el-icon-mobile-phone"></i><span>{{baseParam[5].baseParamValue}} </span></div>
            <div class="tel">硬件相关 : <i class="el-icon-mobile-phone"></i><span>{{baseParam[6].baseParamValue}} </span></div>
            <div class="tel">向开发者提出建议 : <i class="el-icon-message"> {{baseParam[7].baseParamValue}} </i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div>
        <div>
          <span class="Tittxt">更新日志 <i class="el-icon-warning-outline"></i></span>
        </div>
        <div class="infoCard">
          <el-timeline :reverse="true">
            <el-timeline-item
              v-for="(updateInfo, index) in updateInfo"
              :key="index"
              :timestamp="updateInfo.updateDate"
              :color="updateInfo.timeLineColor"
              placement="top"
              size="large"
            >
              <el-card shadow="hover">
                <h4>{{updateInfo.updateContent}}</h4>
                <p>{{updateInfo.updateRemark}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetUpdateInfoApi, GetBaseParamApi, GetSunpnWeather } from '../../api/home.js';

import countTo from 'vue-count-to';


var myCompanyId;
export default {
  components: { countTo },
  mounted () {
    myCompanyId = JSON.parse(this.$store.state.userInfo)[0].companyId
    this.GetBaseParam();
    this.GetUpdateInfo();
    this.GetSunpnWeather();
  },
  data () {
    return {
      updateInfo: {
        updateInfoId: '',
        updateContent: '',
        updateRemark: '',
        updateDate: '',
        timeLineColor: '',
      },
      PhotoUrl: [],
      cityName: null,
      weatherRoot: {},
      livingRoot: {},
      baseParam: [
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" },
        { baseParamId: 1, baseParamName: "", baseParamValue: "" }
      ]
    }
  },
  methods: {
    async GetUpdateInfo () {
      GetUpdateInfoApi()
        .then(res => {
          if (res.data.stateCode == '0') {
            this.updateInfo = JSON.parse(res.data.myData);
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
    async GetBaseParam () {
      GetBaseParamApi(myCompanyId)
        .then(res => {
          if (res.data.stateCode == '0') {
            //轮播图
            let imgData = JSON.parse(res.data.myData).Table;
            console.log(res);
            for (let index = 0; index < imgData.length; index++) {
              //this.PhotoUrl.push("http://192.168.0.144:8886/StaticFile/HomePage-CompanySlideshow/" + imgData[index].slideshowUrl)
              this.PhotoUrl.push("https://www.sunpn-cloud.com:8886/StaticFile/HomePage-CompanySlideshow/" + imgData[index].slideshowUrl)
            }
            // console.log(JSON.parse(res.data.myData).Table1);
            this.baseParam = JSON.parse(res.data.myData).Table1;
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
    async GetSunpnWeather () {
      GetSunpnWeather()
        .then(res => {
          if (res.data.stateCode == '0') {
            this.cityName = res.data.cityName;
            this.weatherRoot = res.data.weatherRoot;
            this.livingRoot = res.data.livingRoot;
          }
        })
    }
  }
}
</script>


<style lang="scss" scoped>
.el-timeline {
  padding: 15px;
}
.bigbox {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.right {
  width: 22%;
  padding-right: 0.5rem;
  .Tittxt {
    margin-left: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.infoCard {
  margin-top: 0.5rem;
  height: 700px;
  // padding-right: 0.5rem;
  //   width: 320px;
  overflow: auto;
}
.infoCard::-webkit-scrollbar-thumb {
  background-color: #e8e8e8 !important;
  border-radius: 1rem;
}

.left {
  width: 75%;
  margin: 0.5rem;
  .carousel {
    width: 100%;
    img {
      height: 350px;
      width: 650px;
      object-fit: cover;
    }
  }
}
.leftdown {
  display: flex;
  justify-content: space-between;
  .base {
    padding: 0rem 0.8rem;
    margin-top: 4rem;
    height: 230px;
    width: 30%;
    border-radius: 1.2rem;
    background: linear-gradient(90deg, #60b2fb, #6485f6);
    box-shadow: 0rem 0.69rem 2rem -1rem rgba(0, 0, 0, 0.7); //重阴影#5E5E5E
    color: white;
    .titleFont {
      font-size: 1rem;
      font-weight: bold;
      padding: 0.725rem;
      border-bottom: 2px solid white;
      margin-bottom: 0.5rem;
    }
    .oneContent {
      display: flex;
      .col {
        display: flex;
        flex-direction: column;
        height: 150px;
        flex: 1;
        justify-content: center;
        .smallTit {
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          justify-content: center;
          margin-bottom: 1.2rem;
        }
        .countFont {
          color: white;
          font-size: 1.6rem;
          font-weight: bold;
          display: flex;
          justify-content: center;
        }
      }
    }
    .sysV {
      display: flex;
      justify-content: space-between;
      font-size: 0.5rem;
    }
    .weatherContent {
      width: 100%;
      .weatherAddress {
        display: flex;
        justify-content: space-between;
        i {
          font-size: 1.6rem;
        }
        span {
          font-size: 1.5rem;
        }
        .weatherState {
          font-size: 1.5rem;
          font-weight: 500;
          //   display: flex;
          //   justify-content: flex-end;
        }
      }
      .tempFont {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        .mainTemp {
          font-size: 2.5rem;
          // font-weight: bold;
          letter-spacing: 1px;
          margin: 0.625rem 0;
        }
      }
      p {
        height: 38px;
      }
    }
    .relation {
      width: 100%;
      display: flex;
      flex-direction: column;
      //   justify-content: space-between;
      align-items: center;
      .tel {
        font-size: 1rem;
        font-weight: 530;
        margin: 0.6rem 0;
      }
    }
  }

  .base:nth-child(2) {
    background: linear-gradient(90deg, #6485f6, #8ddebe);
  }
  .base:nth-child(3) {
    background: linear-gradient(90deg, #78bbbb, #60b2fb);
  }
}

//关闭底部滚动条
#main-wrap[data-v-41745067]::-webkit-scrollbar-thumb {
  background-color: transparent !important;
}
</style>
