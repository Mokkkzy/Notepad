<template>
    <view>
        <web-view v-bind:src="url" @message="handleMessage"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url: "",
                key: "",
                title: ""
            }
        },
        onLoad(options) {
            this.key = options.key;
            this.title = options.name;
            this.url = "/hybrid/html/local.html?" + uni.getStorageSync('notepad-editor-' + this.key);
        },
        onReady() {
            // 使用默认的（后续可能改动，先注释）
            // uni.setNavigationBarTitle({
            //     title: this.title
            // });
        },
        methods: {
            handleMessage(event) {
                uni.setStorageSync('notepad-editor-' + this.key, event.detail.data[0].value);
            }
        }
    }
</script>
