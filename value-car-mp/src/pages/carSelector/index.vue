<template>
    <som-car-selector-b
        ref="carSelector"
        :scene="1"
        :activedValue="activedValue"
        :getBrandData="getBrandData"
        :getSeriesData="getSeriesData"
        :getModelData="getModelData"
        @onSelected="onSelected"
        @onSelectedBrand="onSelectedBrand"
        >
        <som-selector-item title="我的历史" index="历">
            <div class="selector-item-body-custom">
                <div 
                v-for="brandItem in historyData"
                @click="openSeriesSection(brandItem)"
                :key="brandItem.code"
                :class="['card-item', {'card-item-selected': selectedBrands.filter(selectedBrandItem => selectedBrandItem.code === brandItem.code).length > 0}]">
                    <img class="card-item-image" :src="brandItem.image">
                    <span class="card-item-span">{{brandItem.name}}</span>
                </div>
            </div>
        </som-selector-item>
    </som-car-selector-b>
</template>
<script>
// 切换到 device 模式试试，记得刷新哦。
// import SomCitySelector from '@souche-ui/som-city-selector-b';
// import HttpRequest from 'flyio';

import SomCarSelector from '../../components/car-selector-b';
import SomSelectorItem from '../../components/selector-item';

const Fly = require('flyio/dist/npm/wx');

const HttpRequest = new Fly();

export default {
    data() {
        return {
            selectedBrands: [],
            historyData: [{
                code: 'brand-12',
                name: '阿尔法罗密欧',
                image: '//img.souche.com/files/carproduct/brand/brand-12.png'
            }],
            activedValue: [
                {
                    code: 'brand-12',
                    name: '阿尔法罗密欧',
                    series: [
                        {
                            code: 'series-50440',
                            name: 'Stelvio',
                            model: [{
                                code: '200854',
                                name: '2017款 Stelvio 2.0T 200HP 豪华版'
                            }]
                        }
                    ]
                }
            ]
        };
    },
    components: {
        SomCarSelector,
        SomSelectorItem,
    },
    methods: {
        getBrandData() {
            let url = '//car-model.souche.com/brand/brands.jsonp';
            return HttpRequest.get(url).then((result) => {
                console.log('xxx');
                return result.data;
            });
        },
        // getSeriesData(brandCode) {
        //     let url = '//car-model.souche.com/series/getSeriesByBrand.jsonp';
        //     return HttpRequest.jsonp(url, {
        //         brand_code: brandCode
        //     }).then((result) => {
        //         console.log('xxx');
        //         return result.data;
        //     });
        // },
        // getModelData(seriesCode) {
        //     let url = '//car-model.souche.com/model/getModelBySeries.jsonp';
        //     return HttpRequest.jsonp(url, {
        //         series_code: seriesCode
        //     }).then((result) => {
        //         console.log('xxx');
        //         return result.data;
        //     });
        // },
        onSelected(data) {
            console.log('选中结束');
            console.log(data);
        },
        onSelectedBrand(data) {
            this.selectedBrands = data;
            console.log('省份变化');
            console.log(data);
        },
        openSeriesSection(brandItem) {
            this.$refs.carSelector.openSeriesSection(brandItem);
        }
    }
};
</script>
<style scoped>
.selector-item-body-custom {
    padding: 16px;
}
.card-item{
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 48px;
}
.card-item-span{
    font-size: 12px;
    margin-top: 10px;
    color: #1A1A1A;
}
.card-item-image{
    width: 32px;
}
.card-item-selected .card-item-span {
    color: #FF571A;
}
</style>