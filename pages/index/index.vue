<template>
    <view class="menu-view">
        <web-view v-bind:src="url" @message="handleMessage"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url: ""
            }
        },
        onLoad() {
            this.url = "/hybrid/html/local.html?" + uni.getStorageSync('notepad-content');
        },
        methods: {
            handleMessage(event) {
                uni.setStorageSync('notepad-content', event.detail.data.value);
            }
        }
    }
</script>

<style>

</style>
