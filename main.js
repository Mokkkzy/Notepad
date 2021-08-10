import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();

// #ifdef APP-PLUS
let main = plus.android.runtimeMainActivity();
//为了防止快速点按返回键导致程序退出重写quit方法改为隐藏至后台
plus.runtime.quit = function() {
    main.moveTaskToBack(false);
};
//重写toast方法如果内容为 ‘再次返回退出应用’ 就隐藏应用，其他正常toast
plus.nativeUI.toast = (function(str) {
    if (str == '再次返回退出应用') {
        plus.runtime.quit();
    } else {
        uni.showToast({
            title: '再次返回退出应用', //可以自定义其他弹出显示的内容
            icon: 'none'
        })
    }
});
// #endif
