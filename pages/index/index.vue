<template>
    <view class="menu-view">

        <view class="nav">
            <text :class='{active:active=="all"}' @click='active="all"'>全部</text>
            <text v-for="(value,key) in types" :key='key' :class='{active:active==key}'
                @click='active=key'>{{value}}</text>

            <!-- 新增按钮 -->
            <text class='btn' @click="openAddDialog"></text>
        </view>

        <!-- 列表 -->
        <view class="list">
            <view class="list-item" v-for="(item,index) in menulist" :key='index'
                v-if='item.type==active || active=="all"' @click="openEditor(index)">
                <view class="title" :class="item.type">
                    {{item.title}}
                </view>
                <view class="info">
                    {{item.remark}}
                </view>
                <view class="date">
                    {{item.date}}
                </view>

                <!-- 操作按钮 -->
                <view class="btn delete" @click.stop="openDeleteDialog(index,item.key)">
                    删除
                </view>
                <view class="btn editor" @click.stop="openEditorDialog(index)">
                    编辑
                </view>
            </view>
        </view>

        <!-- 弹框(新增、编辑) -->
        <view class="dialog" v-if="dialog.isOpen">
            <view class="view">
                <view class="title">
                    {{dialog.title}}
                </view>
                <view class="input-item">
                    <text class='sub-title'>标题：</text>
                    <input class='input text' type="text" v-model="dialog.value.title" />
                </view>
                <view class="input-item">
                    <text class='sub-title'>说明：</text>
                    <textarea class='input text' v-model="dialog.value.remark" />
                </view>
                <view class="input-item">
                    <text class='sub-title'>分类：</text>
                    <radio-group class='input' @change="e=>{dialog.value.type=e.detail.value}">
                        <label class="radio" v-for="(value,key) in types" :key='key'>
                            <radio :value="key" :checked="dialog.value.type==key" />
                            <text>{{value}}</text>
                        </label>
                    </radio-group>
                </view>
                <view class="btn-list">
                    <button type="default" @click="dialog.isOpen=false">取消</button>
                    <button type="primary" @click="doBack()">确认</button>
                </view>
            </view>
        </view>

    </view>
</template>
<script>
    import dateToString from '../../tool/dateToString.js';
    let _index = -1;
    export default {
        data() {
            return {
                menulist: [],
                active: "all",
                dialog: {
                    isOpen: false,
                    title: "",
                    type: "",
                    value: {
                        title: "",
                        remark: "",
                        type: ""
                    }
                },
                types: {
                    remark: "随笔",
                    work: "工作",
                    study: "学习",
                    willdo: "代办"
                }
            }
        },
        onLoad() {
            this.menulist = JSON.parse(uni.getStorageSync('notepad-menu') || "[]");
        },
        methods: {

            // 弹框确认
            doBack() {
                this.dialog.isOpen = false;

                // type=add 新增
                if (this.dialog.type == 'add') {
                    let newKey = new Date().valueOf();
                    this.menulist.push({
                        key: newKey,
                        title: this.dialog.value.title,
                        remark: this.dialog.value.remark,
                        type: this.dialog.value.type,
                        date: dateToString()
                    });
                    uni.setStorageSync('notepad-editor-' + newKey, '');
                }

                // type=editor修改
                else if (this.dialog.type == 'editor') {
                    this.menulist[_index].title = this.dialog.value.title;
                    this.menulist[_index].remark = this.dialog.value.remark;
                    this.menulist[_index].type = this.dialog.value.type;
                    this.menulist[_index].date = dateToString();
                }

                // 存储起来
                uni.setStorageSync('notepad-menu', JSON.stringify(this.menulist));

            },

            // 打开删除弹框
            openDeleteDialog(index, key) {

                uni.showModal({
                    title: '温馨提示',
                    content: '是否删除此备忘页',
                    success: res => {
                        if (res.confirm) {
                            this.menulist.splice(index, 1);
                            uni.setStorageSync('notepad-menu', JSON.stringify(this.menulist));
                            uni.removeStorageSync('notepad-editor-' + key);
                        }
                    }
                });

            },

            // 打开编辑弹框
            openEditorDialog(index) {
                _index = index;
                let curItem = this.menulist[_index];
                this.dialog = {
                    isOpen: true,
                    title: "编辑",
                    type: "editor",
                    value: {
                        title: curItem.title,
                        remark: curItem.remark,
                        type: curItem.type
                    }
                }
            },

            // 打开新增弹框
            openAddDialog() {
                this.dialog = {
                    isOpen: true,
                    title: "新增",
                    type: "add",
                    value: {
                        title: "",
                        remark: "",
                        type: this.active == 'all' ? "remark" : this.active
                    }
                }
            },

            // 打开编辑内容界面
            openEditor(index) {
                let item = this.menulist[index];
                uni.navigateTo({
                    url: `/pages/editor/editor?key=${item.key}&name=${item.title}`,
                    fail: error => {
                        console.log(error);
                    }
                });
            }

        }
    }
</script>
<style lang="scss" scoped>
    .menu-view {

        // 顶部导航
        &>.nav {
            background-color: white;
            padding: 10rpx;
            padding-left: 30rpx;
            position: relative;

            &>text {
                padding: 20rpx;
                display: inline-block;
                font-weight: 200;
                font-size: 30rpx;
                vertical-align: top;

                &.active {
                    color: #2196f3;
                    font-weight: 400;
                    border-bottom: 4rpx solid #2196f3;
                }

                &.btn {
                    position: absolute;
                    right: 20rpx;
                    top: 0;
                    width: 70rpx;
                    font-weight: 800;
                    font-size: 40rpx;
                    height: 100%;
                    padding: 0;
                    background-image: url(../../static/add.png);
                    background-size: 100% auto;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }
        }

        // 弹框
        &>.dialog {
            position: fixed;
            width: 100vw;
            height: 100vh;
            left: 0;
            top: 0;
            background-color: #e3e3e8b0;

            &>.view {
                background-color: white;
                width: 650rpx;
                position: fixed;
                left: 50rpx;
                top: 300rpx;

                &>.title {
                    text-align: center;
                    margin-top: 40rpx;
                }

                &>.input-item {
                    font-size: 28rpx;
                    margin: 40rpx 20rpx;
                    white-space: nowrap;

                    &>.sub-title {
                        vertical-align: top;
                    }

                    &>.input {
                        display: inline-block;
                        font-size: 26rpx;

                        &.text {
                            border-bottom: 2rpx solid #dadadf;
                            margin-left: 26rpx;
                            width: calc(100% - 140rpx);
                            padding: 10rpx;
                        }

                        .radio {
                            margin-left: 7rpx;

                            &>radio {
                                transform: scale(0.5);
                            }

                            &>text {
                                margin-left: -7rpx;
                            }
                        }
                    }
                }

                &>.btn-list {
                    text-align: center;

                    &>button {
                        width: 30%;
                        display: inline-block;
                        font-size: 28rpx;
                        margin: 20rpx;
                    }
                }
            }
        }

        // 列表
        .list {
            &>.list-item {
                background-color: white;
                margin: 40rpx;
                padding: 20rpx;
                border-radius: 10rpx;
                padding-right: 120rpx;
                position: relative;

                &>.title {
                    padding: 10rpx;
                    padding-left: 50rpx;
                    background-repeat: no-repeat;
                    background-position: left center;

                    &.remark {
                        background-image: url(../../static/ico3.png);
                    }

                    &.study,
                    &.work {
                        background-image: url(../../static/ico1.png);
                    }

                    &.willdo {
                        background-image: url(../../static/ico2.png);
                    }
                }

                &>.info {
                    color: gray;
                    font-size: 27rpx;
                    margin-top: 10rpx;
                }

                &>.date {
                    font-size: 24rpx;
                    margin-top: 10rpx;
                }

                &>.btn {
                    position: absolute;
                    right: 0;
                    color: white;
                    font-size: 24rpx;
                    padding: 5rpx 10rpx;

                    &.delete {
                        top: 20rpx;
                        background-color: #ff9800;
                    }

                    &.editor {
                        top: 80rpx;
                        background-color: #2196f3;
                    }
                }
            }
        }

    }
</style>
