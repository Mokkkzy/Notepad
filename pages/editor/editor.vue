<template>
    <view class="menu-view">
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
            this.url = "/hybrid/html/local.html?" + uni.getStorageSync('notepad-content-' + this.key);
        },
        onReady() {
            uni.setNavigationBarTitle({
                title: this.title
            });
        },
        methods: {
            handleMessage(event) {
                uni.setStorageSync('notepad-content-' + this.key, event.detail.data[0].value);
            }
        }
    }
</script>

<style>

</style>
