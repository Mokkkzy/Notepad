<template>
    <view>

        <!-- 新增按钮 -->
        <view class="add" @click="doAdd()">
            +
        </view>

        <!-- 列表 -->
        <view class="list">
            <view class="item" v-for='(item,key) in list' :key="key" @click="openEditor(item)"
                @longpress='doDelete(key,item.key)'>
                <view class='editor' @click.stop="updateTitle(key,item.name)">
                    修改标题
                </view>
                <view class="title">
                    {{item.name}}
                </view>
                <view class="time">
                    {{new Date(item.key).toLocaleDateString()}}
                </view>
            </view>
        </view>

        <!-- 弹框输入 -->
        <view class="dialog" v-show='dialogFlag'>
            <view>
                <view class='title'>
                    请输入标题
                </view>
                <input type="text" v-model='helpTitleInput' />
                <view class="btn-list">
                    <button type="default" @click="doDialogClose()">取消</button>
                    <button type="warn" @click="doDialogback()">确认</button>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
    let callback = null;
    export default {
        data() {
            return {
                list: [],
                helpTitleInput: "",
                dialogFlag: false
            }
        },
        onLoad() {
            this.list = JSON.parse(uni.getStorageSync('notepad-content-list') || "[]");
        },
        methods: {

            // 删除
            doDelete(index, key) {
                uni.showModal({
                    title: '温馨提示',
                    content: '是否删除此备忘页',
                    success: res => {
                        if (res.confirm) {
                            this.list.splice(index, 1);
                            uni.setStorageSync('notepad-content-list', JSON.stringify(this.list));
                            uni.removeStorageSync('notepad-content-' + key);
                        }
                    }
                });
            },

            // 修改标题
            updateTitle(index, oldtitle) {
                this.unpateTitle(titleName => {
                    this.list[index].name = titleName;
                    this.$forceUpdate();
                    uni.setStorageSync('notepad-content-list', JSON.stringify(this.list));
                }), oldtitle;
            },

            // 弹框打开输入框
            unpateTitle(_callback, initTitle = "") {
                this.helpTitleInput = initTitle;
                this.dialogFlag = true;
                callback = _callback;
            },

            // 弹框确定按钮
            doDialogback() {
                callback(this.helpTitleInput);
                this.doDialogClose();
            },

            // 弹框取消按钮
            doDialogClose() {
                this.dialogFlag = false;
                this.helpTitleInput = "";
            },

            // 新增
            doAdd() {

                this.unpateTitle(titleName => {

                    let newKey = new Date().valueOf();
                    this.list.push({
                        key: newKey,
                        name: titleName
                    });

                    // 存储起来
                    uni.setStorageSync('notepad-content-list', JSON.stringify(this.list));
                    uni.setStorageSync('notepad-content-' + newKey, '')
                });
            },

            // 打开
            openEditor(item) {
                uni.navigateTo({
                    url: `/pages/editor/editor?key=${item.key}&name=${item.name}`,
                    fail: error => {
                        console.log(error);
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .add {
        position: fixed;
        bottom: 20rpx;
        right: 20rpx;
        width: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        border-radius: 50%;
        background-color: black;
        color: white;
        text-align: center;
        font-size: 80rpx;
        font-family: cursive;
    }

    .list {
        &>.item {
            background-color: #d3cdcd;
            margin: 20rpx;
            padding: 20rpx;
            color: white;
            display: inline-block;
            width: 295rpx;
            font-size: 12px;
            vertical-align: top;
            position: relative;

            &>.title {
                color: #000000;
                font-weight: 200;
                margin-bottom: 40rpx;
                margin-right: 30px;
                overflow: auto;
            }

            &>.editor {
                position: absolute;
                right: 5px;
                top: 5px;
                width: 25px;
                height: 25px;
                font-size: 0;
                background-image: url('../../static/editor.png');
                background-size: 100% auto;
            }
        }
    }

    .dialog {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-image: url(../../static/bg.png);
        background-repeat: repeat;

        &>view {
            background-color: white;
            width: 600rpx;
            margin-left: 75rpx;
            margin-top: 30vh;
            text-align: center;

            &>.title {
                padding-top: 30rpx;
            }

            &>input {
                border-bottom: 1px solid gray;
                margin: 40rpx;
                padding: 10rpx;
                font-size: 30rpx;
                text-align: left;
            }

            &>.btn-list {
                padding-top: 40rpx;

                &>button {
                    display: inline-block;
                    width: 200rpx;
                    margin: 0 20rpx 30rpx 20rpx;
                }
            }
        }
    }
</style>
