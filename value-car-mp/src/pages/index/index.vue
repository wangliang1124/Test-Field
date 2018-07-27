<template>
    <div class="container" @click="clickHandle('test click', $event)">

        <div class="userinfo" @click="bindViewTap">
            <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
            <div class="userinfo-nickname">
                <card :text="userInfo.nickName"></card>
            </div>
        </div>

        <div class="usermotto">
            <div class="user-motto">
                <card :text="motto"></card>
            </div>
        </div>
        <car-picker></car-picker>
        <form class="form-container">
            <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
            <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
        </form>
        <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
        <som-btn radius="big">大圆角</som-btn>
        <a href="/pages/carSelector/main" class="counter">car-selector</a>
        <som-btn :delayTime="1000" @click="con">默认样式</som-btn>
    </div>
</template>

<script>
    import SomCitySelector from '@souche-ui/som-city-selector-b';
    import SomCarSelector from '@souche-ui/som-car-selector-b';
    import SomSelectorItem from '@souche-ui/som-selector-item';
    import card from '@/components/card';

    export default {
        data() {
            return {
                motto: 'Hello World',
                userInfo: {},
                selectedBrands: [],
                historyData: [{
                    code: 'brand-12',
                    name: '阿尔法罗密欧',
                    image: '//img.souche.com/files/carproduct/brand/brand-12.png'
                }],
                activedValue: [{
                    code: 'brand-12',
                    name: '阿尔法罗密欧',
                    series: [{
                        code: 'series-50440',
                        name: 'Stelvio',
                        model: [{
                            code: '200854',
                            name: '2017款 Stelvio 2.0T 200HP 豪华版'
                        }]
                    }]
                }]
            };
        },

        components: {
            card,
            SomCitySelector,
            SomCarSelector,
            SomSelectorItem,
        },

        methods: {
            bindViewTap() {
                const url = '../logs/main';
                wx.navigateTo({
                    url
                });
            },
            getUserInfo() {
                // 调用登录接口
                wx.login({
                    success: () => {
                        wx.getUserInfo({
                            success: (res) => {
                                this.userInfo = res.userInfo;
                            }
                        });
                    }
                });
            },
            clickHandle(msg, ev) {
                console.log('clickHandle:', msg, ev);
            }
        },

        created() {
            // 调用应用实例的方法获取全局数据
            this.getUserInfo();
        }
    };

</script>

<style scoped>
    .userinfo {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .userinfo-avatar {
        width: 128rpx;
        height: 128rpx;
        margin: 20rpx;
        border-radius: 50%;
    }

    .userinfo-nickname {
        color: #aaa;
    }

    .usermotto {
        margin-top: 150px;
    }

    .form-control {
        display: block;
        padding: 0 12px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
    }

    .counter {
        display: inline-block;
        margin: 10px auto;
        padding: 5px 10px;
        color: blue;
        border: 1px solid blue;
    }

</style>
