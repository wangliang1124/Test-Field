<template>
    <div class="som-car-selector-b">
        <som-selector-cascader
            @close-cascader-group="closeCascaderGroup">
            <som-selector-group 
                ref="group"
                :multiple="shouldShowFooterButton(group.type)"
                :multipleSelected="multipleSelected"
                :isFirstGroup="groupIndex===0"
                :showAlphaToast="showAlphaToast"
                v-for="(group, groupIndex) in groups"
                :key="groupIndex"
                :label="group.label">
                <div v-if="groupIndex===0">
                    <slot></slot>
                </div>
                <som-selector-item 
                    v-for="groupSection in group.childrens"
                    :key="groupSection.name"
                    :title="groupSection.label" 
                    :index="groupSection.label">
                    <som-selector-list-item 
                        v-for="(item, groupSectionIndex) in groupSection.childrens"
                        :key="groupSectionIndex"
                        :label="item.name"
                        :value="item"
                        :image="item.image"
                        :itemMode="!item.code.indexOf('all') > -1 ? group.itemMode : 1"
                        :showCheckboxButton="shouldItemShowCheckboxButton(group.type)"
                        :selected="item.isSelected"
                        :goNextGroupText="group.goNextGroupText"
                        @click="itemSelected(group.type, $event)"
                        @clickItemEnd="itemSelected(group.type, $event, true)">
                    </som-selector-list-item>
                </som-selector-item>
            </som-selector-group>
        </som-selector-cascader>
    </div>
</template>

<script>
import SomSelectorItem from './../../selector-item';
import SomSelectorCascader from './../../selector-b/selector-cascader';
import SomSelectorGroup from './../../selector-b/selector-group';
import SomSelectorListItem from './../../selector-b/selector-list-item';

const BRAND = 'brand';
const SERIES = 'series';
const MODEL = 'model';
const SERIES_OR_MODEL = 'seriesOrModel';
const ITEM_NORMAL_MODE = 1; //选中当前item触发click事件
const ITEM_HAVE_TWO_STATE_MODE = 2; //选中item触发selectEnd()或者选择右侧触发click事件
// const GROUP_ORDER_ARRAY = [BRAND, SERIES, MODEL];
const SINGLE_BRAND_SINGLE_SERIES_SINGLE_MODEL = 1;
const SINGLE_BRAND_SINGLE_SERIES_MULTIPLE_MODEL = 2;
const SINGLE_BRAND_MULTIPLE_SERIES = 3;
const MULTIPLE_BRAND = 4;
const MULTIPLE_BRAND_MULTIPLE_SERIES = 5;

export default {
    name: 'SomCarSelectorB',
    props: {
        // 数据已经分好组了：数据已经按品牌的首字母，车系的子车系，
        // 车型的年份分好组了或者根据其他字段分好组了，不需要组件内部进行分组。
        dataHaveBeenGrouped: {
            type: Boolean,
            default: false
        },
        scene: {
            type: [String, Number],
            default: 1
        },
        activedValue: Array,
        getBrandData: {
            type: Function
        },
        getSeriesData: {
            type: Function
        },
        getModelData: {
            type: Function
        },
        modelSelectText: {
            type: String,
            default: '选车型'
        },
        showAlphaToast: {
            type: Boolean,
            default: true
        },
        //显示不限品牌选项，目前只在单选情况下允许配置
        showUnlimitBrand: {
            type: Boolean,
            default: false
        }
    },
    components: {
        SomSelectorItem,
        SomSelectorGroup,
        SomSelectorListItem,
        SomSelectorCascader
    },
    data() {
        return {
            sceneNumber: Number.parseInt(this.scene),
            groups: [],
            selectedData: [],
            brandMultiple: false,
            seriesMultiple: false,
            modelMultiple: false,
            type: MODEL,
            BRAND: BRAND,
            multipleConfig: {},
            clickItemEnd: false,
            allData: [],
            noLimitDataShowCtrl: {
                [BRAND]: false,
                [SERIES]: false,
                [MODEL]: false
            },
            noLimitData: {
                [BRAND]: {
                    code: 'brand-all',
                    initialsLetter: '*',
                    name: '不限品牌',
                    image: false
                },
                [SERIES]: {
                    name: '不限车系',
                    code: 'series-all',
                    subBrandName: ''
                },
                [MODEL]: {
                    name: '不限车型',
                    code: 'model-all',
                    modelYear: 'null'
                }
            },
            currentBrandGroupAll: null,
            currentSeriesGroupAll: null,
            currentModelGroupAll: null,
            singleSelectionLastSelectedData: {},
            lastClickBrandData: {},
            lastClickSeriesData: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        closeCascaderGroup(index) {
            //关闭上第二级时，需要将后面的关闭掉；
            this.groups = this.groups.splice(0, index);
        },
        init() {
            // dataHaveBeenGrouped这种情况，强制场景类型为单车品牌，单车系，单车型;
            if (this.dataHaveBeenGrouped) {
                this.sceneNumber = SINGLE_BRAND_SINGLE_SERIES_SINGLE_MODEL;
            }
            switch (this.sceneNumber) {
                case SINGLE_BRAND_SINGLE_SERIES_SINGLE_MODEL:
                    this.brandMultiple = false;
                    this.seriesMultiple = false;
                    this.modelMultiple = false;
                    this.noLimitDataShowCtrl[BRAND] = this.showUnlimitBrand;
                    this.type = MODEL;
                    break;
                case SINGLE_BRAND_SINGLE_SERIES_MULTIPLE_MODEL:
                    this.brandMultiple = false;
                    this.seriesMultiple = false;
                    this.modelMultiple = true;
                    this.noLimitDataShowCtrl[BRAND] = true;
                    this.noLimitDataShowCtrl[SERIES] = true;
                    this.noLimitDataShowCtrl[MODEL] = true;
                    this.type = SERIES_OR_MODEL;
                    break;
                case SINGLE_BRAND_MULTIPLE_SERIES:
                    this.brandMultiple = false;
                    this.seriesMultiple = true;
                    this.noLimitDataShowCtrl[BRAND] = true;
                    this.noLimitDataShowCtrl[SERIES] = true;
                    this.type = SERIES;
                    break;
                case MULTIPLE_BRAND:
                    this.brandMultiple = true;
                    this.noLimitDataShowCtrl[BRAND] = true;
                    this.type = BRAND;
                    break;
                case MULTIPLE_BRAND_MULTIPLE_SERIES:
                    this.brandMultiple = true;
                    this.seriesMultiple = true;
                    this.noLimitDataShowCtrl[BRAND] = true;
                    this.noLimitDataShowCtrl[SERIES] = true;
                    this.type = SERIES;
                    break;
                default: throw new Error('scene 值只能为1，2，3，4，5');
            }
            this.multipleConfig[BRAND] = this.brandMultiple;
            this.multipleConfig[SERIES] = this.seriesMultiple;
            this.multipleConfig[MODEL] = this.modelMultiple;
            this.getBrand((brandData) => {
                this.setBrand(brandData);
                if (this.dataHaveBeenGrouped) return;
                this.setActivedValue();
            });
        },
        setActivedValue() {
            if (this.activedValue && this.activedValue.length > 0) {
                let activedValueExceptLast = this.activedValue.slice(0, -1);
                //如果是多选的情况下，设置activedValue中其他的品牌也高亮
                if (activedValueExceptLast.length > 0 && this.multipleConfig[BRAND]) {
                    activedValueExceptLast.forEach((activedBrandItem) => {
                        this.allData.forEach((brandItem) => {
                            if (brandItem.code === activedBrandItem.code) {
                                brandItem.isSelected = true;
                                brandItem.activedValue = activedBrandItem[SERIES];
                            }
                        });
                    });
                }
                let lastBrandItem = this.activedValue[this.activedValue.length - 1];
                let lastBrandIndexInAllData = this.allData.filter(brand => lastBrandItem.code === brand.code)[0];
                lastBrandIndexInAllData.activedValue = lastBrandItem[SERIES];
                if (!lastBrandIndexInAllData) return;
                this.itemSelected(BRAND, lastBrandIndexInAllData);
            }
        },
        multipleSelected() {
            this.setSelectedEnd();
        },
        itemSelected(type, data, isClickEnd) {
            let currentSelectItemType = type;
            if (currentSelectItemType === BRAND) {
                this.setBrandSelected(data);
            } else if (currentSelectItemType === SERIES) {
                this.setSeriesSelected(data, isClickEnd);
            } else if (currentSelectItemType === MODEL) {
                this.setModelSelected(data);
            }
            if (isClickEnd) {
                this.setSelectedEnd(isClickEnd);
            } else if (this.isEndState(currentSelectItemType, data)) {
                this.setSelectedEnd();
            }
        },
        isEndState(currentSelectItemType, data) {
            if (this.sceneNumber === SINGLE_BRAND_SINGLE_SERIES_SINGLE_MODEL) {
                return currentSelectItemType === MODEL || data.code === this.noLimitData[BRAND].code;
            } else if (this.sceneNumber === SINGLE_BRAND_SINGLE_SERIES_MULTIPLE_MODEL) {
                return data.code === this.noLimitData[BRAND].code || data.code === this.noLimitData[SERIES].code;
            } else if (this.sceneNumber === SINGLE_BRAND_MULTIPLE_SERIES) {
                return data.code === this.noLimitData[BRAND].code;
            } else if (this.sceneNumber === MULTIPLE_BRAND_MULTIPLE_SERIES) {
                return data.code === this.noLimitData[BRAND].code || currentSelectItemType === SERIES;
            }
            return false;
        },
        setSelectedEnd(isClickEnd) {
            let selectedDataAfterDealing = this.dealingSelectedData(isClickEnd);
            this.$emit('onSelected', selectedDataAfterDealing);
        },
        dealingSelectedData(isClickEnd) {
            if (!this.dataHaveBeenGrouped) {
                let allDataCopy = this.copyObj(this.allData);
                let selectedData = [];
                for (let i = 0, len = allDataCopy.length; i < len; i += 1) {
                    let brandItem = allDataCopy[i];
                    if (brandItem.isSelected) {
                        if (brandItem.code === this.noLimitData[BRAND].code) {
                            selectedData = [this.noLimitData[BRAND]];
                            break;
                        } else {
                            let selectedSeries = this.buildSelectedSeriesData(brandItem, isClickEnd);
                            brandItem[SERIES] = selectedSeries;
                            selectedData.push(brandItem);
                        }
                    }
                }
                return selectedData;
            } else {
                return this.singleSelectionLastSelectedData;
            }
        },
        buildSelectedBrandData() {
            let allDataCopy = this.copyObj(this.allData);
            let selectedData = [];
            for (let i = 0, len = allDataCopy.length; i < len; i += 1) {
                let brandItem = allDataCopy[i];
                if (brandItem.isSelected) {
                    selectedData.push(brandItem);
                }
            }
            return selectedData;
        },
        buildSelectedSeriesData(parentBrandObj, isClickEnd) {
            let brandItem = this.copyObj(parentBrandObj);
            let selectedSeries = null;
            if (brandItem[SERIES]) {
                selectedSeries = [];
                for (let j = 0, len = brandItem[SERIES].length; j < len; j += 1) {
                    let seriesItem = brandItem[SERIES][j];
                    if (seriesItem.isSelected) {
                        if (seriesItem.code === this.noLimitData[SERIES].code) {
                            selectedSeries = [this.noLimitData[SERIES]];
                            break;
                        } else {
                            selectedSeries.push(seriesItem);
                            if (!isClickEnd) {
                                seriesItem[MODEL] = this.buildSelectedModelData(seriesItem);
                            } else {
                                delete seriesItem[MODEL];
                            }
                        }
                    }
                }
            }
            return selectedSeries;
        },
        buildSelectedModelData(parentSeriesObj) {
            let seriesItem = this.copyObj(parentSeriesObj);
            let selectedModel = null;
            if (seriesItem[MODEL]) {
                selectedModel = [];
                for (let k = 0, len = seriesItem[MODEL].length; k < len; k += 1) {
                    let modelItem = seriesItem[MODEL][k];
                    if (modelItem.isSelected) {
                        if (modelItem.code === this.noLimitData[MODEL].code) {
                            selectedModel = [modelItem];
                            break;
                        } else {
                            selectedModel.push(modelItem);
                        }
                    }
                }
            }
            return selectedModel;
        },
        setGroupData({type, parentCode, label, childrens}) {
            // 如果重新设置了品牌的话，后面的车系和车型的栏要删除隐藏；
            let groupIndex;
            if (type === BRAND) {
                groupIndex = 0;
            } else if (type === SERIES) {
                groupIndex = 1;
            } else if (type === MODEL) {
                groupIndex = 2;
            }
            let groupData = {
                type: type,
                label: label,
                goNextGroupText: this.getGoNextGroupText(type),
                itemMode: this.getListItemMode(type),
                parentCode: parentCode,
                childrens: childrens
            };
            //删除该类型后面的子类型，例如，设置车系时，删除后面的车型；
            let dataIndexInGroup;
            for (let i = 0, len = this.groups.length; i < len; i += 1) {
                if (this.groups[i].type === type) {
                    dataIndexInGroup = i;
                    break;
                }
            }
            if (dataIndexInGroup !== undefined) {
                this.groups = this.groups.slice(0, dataIndexInGroup + 1);
            }
            this.groups.splice(groupIndex, 1, groupData);
        },
        getGoNextGroupText(type) {
            if (type === SERIES && this.sceneNumber === 2) {
                return this.modelSelectText;
            }
        },
        getListItemMode(type) {
            if (type === SERIES && this.sceneNumber === 2) {
                return ITEM_HAVE_TWO_STATE_MODE;
            } else {
                return ITEM_NORMAL_MODE;
            }
        },
        setBrand(brandData) {
            // this.noLimitDataShowCtrl[BRAND] && brandData.unshift(this.copyObj(this.noLimitData[BRAND]));
            this.currentBrandGroupAll = brandData;
            let brandDataAfterBuild = this.dataHaveBeenGrouped ? brandData : this.buildBrand(brandData);
            this.setGroupData({
                type: BRAND,
                label: '',
                parentCode: null,
                childrens: brandDataAfterBuild
            });
        },
        buildBrand(brandData) {
            const obj = {};
            brandData.forEach((v) => {
                if (obj[v.initialsLetter] === undefined) {
                    obj[v.initialsLetter] = [];
                }
                obj[v.initialsLetter].push(v);
            });
            return Object.keys(obj).map((v) => {
                return {
                    label: v,
                    childrens: obj[v]
                };
            });
        },
        getBrand(callback) {
            if (this.allData && this.allData.length > 0) {
                callback(this.allData);
            } else {
                Promise.resolve(this.getBrandData()).then((result) => {
                    if (this.dataHaveBeenGrouped) {
                        //该段代码将传进来的品牌数据处理成未分组的，用于分组的情况下，调用openSeriesSection生效，以及省份变化时能emit时传出正确数据。
                        //该方法并不是很好，之后考虑用其他方法处理；todo
                        let flattenArray = [];
                        result.forEach((brandGroup) => {
                            let labelChildrens = brandGroup.childrens;
                            labelChildrens.forEach((brandItem) => {
                                brandItem.initialsLetter = brandGroup.label;
                                flattenArray.push(brandItem);
                            });
                        });
                        this.allData = flattenArray;
                    } else {
                        this.noLimitDataShowCtrl[BRAND] && result.unshift(this.copyObj(this.noLimitData[BRAND]));
                        this.allData = result;
                    }
                    callback(result);
                });
            }
        },
        setSeries(parentBrandObj, seriesData) {
            // this.noLimitDataShowCtrl[SERIES] && seriesData.unshift(this.copyObj(this.noLimitData[SERIES]));
            this.currentSeriesGroupAll = seriesData;
            let seriesDataAfterBuild = this.dataHaveBeenGrouped ? seriesData : this.buildSeries(seriesData);
            this.setGroupData({
                type: SERIES,
                label: parentBrandObj.name,
                parentCode: parentBrandObj.code,
                childrens: seriesDataAfterBuild
            });
        },
        buildSeries(seriesData) {
            const obj = {};
            seriesData.forEach((v) => {
                if (obj[v.subBrandName] === undefined) {
                    obj[v.subBrandName] = [];
                }
                v.image = false;
                obj[v.subBrandName].push(v);
            });
            return Object.keys(obj).map((v) => {
                return {
                    label: v,
                    childrens: obj[v]
                };
            });
        },
        getSeries(parentBrandObj, callback) {
            if (!this.dataHaveBeenGrouped) {
                let seriesDataInfo = this.getBrandSeriesDataFromAllData(parentBrandObj.code);
                let seriesParentBrandObj = seriesDataInfo.seriesParentBrandObj;
                let localSeriesData = seriesDataInfo.seriesData;
                if (this.multipleConfig[BRAND] && localSeriesData) {
                    callback(parentBrandObj, localSeriesData);
                } else {
                    Promise.resolve(this.getSeriesData(parentBrandObj.code)).then((result) => {
                        this.noLimitDataShowCtrl[SERIES] && result.unshift(this.copyObj(this.noLimitData[SERIES]));
                        result = this.dealingSeriesDataHasActivedSeries(seriesParentBrandObj, result);
                        seriesParentBrandObj[SERIES] = result;
                        callback(parentBrandObj, result);
                    });
                }
            } else {
                Promise.resolve(this.getSeriesData(parentBrandObj.code)).then((result) => {
                    callback(parentBrandObj, result);
                });
            }
        },
        dealingSeriesDataHasActivedSeries(seriesParentBrandObj, seriesData) {
            if (seriesParentBrandObj.activedValue) {
                let lastSeriesItem = seriesParentBrandObj.activedValue[seriesParentBrandObj.activedValue.length - 1];
                let lastSeriesItemInAllData = seriesData.filter(seriesItem => seriesItem.code === lastSeriesItem.code)[0];
                if (!lastSeriesItemInAllData) return;
                if (this.multipleConfig[SERIES]) {
                    let seriesItemExceptLast = seriesParentBrandObj.activedValue.slice(0, -1);
                    seriesItemExceptLast.forEach((activeSeriesItem) => {
                        seriesData.forEach((seriesItem) => {
                            if (activeSeriesItem.code === seriesItem.code) {
                                seriesItem.isSelected = true;
                                seriesItem.activedValue = activeSeriesItem[MODEL];
                            }
                        });
                    });
                }

                lastSeriesItemInAllData.activedValue = lastSeriesItem[MODEL];

                //保存当前展示的序列的索引值，之后通过这个对象控制展示
                this.currentSeriesGroupAll = seriesData;
                seriesParentBrandObj[SERIES] = seriesData;

                let isEnd = this.sceneNumber === SINGLE_BRAND_SINGLE_SERIES_MULTIPLE_MODEL && !lastSeriesItem.model; //在场景二的情况下，判断是选择了车系，还是选择了选车型
                this.itemSelected(SERIES, lastSeriesItemInAllData, isEnd);
                seriesParentBrandObj.activedValue = null;
            }
            return seriesData;
        },
        removeChildDataWhenBrandSelected() {
            this.groups = this.groups.slice(0, 1);
        },
        setBrandSelectedInSingleSelection(brand) {
            this.lastClickBrandData = brand;
            if (this.singleSelectionLastSelectedData[BRAND]) {
                this.$set(this.singleSelectionLastSelectedData[BRAND], 'isSelected', false);
            }
            this.$set(brand, 'isSelected', true);
            this.singleSelectionLastSelectedData[BRAND] = brand;
        },
        setBrandSelectNoLimitOptions() {
            this.lastClickBrandData = this.noLimitData[BRAND];
            if (this.type === BRAND) {
                let willSelected = !this.currentBrandGroupAll[0].isSelected;
                this.currentBrandGroupAll.forEach((brandItem) => {
                    this.$set(brandItem, 'isSelected', willSelected);
                });
            } else {
                this.currentBrandGroupAll.forEach((brandItem) => {
                    if (brandItem.isSelected) {
                        this.$set(brandItem, 'isSelected', false);
                        brandItem[SERIES] = null;
                    }
                });
                this.$set(this.currentBrandGroupAll[0], 'isSelected', true);
            }
        },
        setBrandSelectedInMultipleSelection(brand) {
            this.lastClickBrandData = brand;
            if (brand.code === this.noLimitData[BRAND].code) {
                this.setBrandSelectNoLimitOptions();
            } else {
                let noLimitBrandOptions = this.currentBrandGroupAll[0];
                if (noLimitBrandOptions.isSelected) {
                    this.$set(noLimitBrandOptions, 'isSelected', false);
                }
                if (brand.isSelected) {
                    if (this.type !== BRAND || !this.multipleConfig[BRAND]) return;
                    this.$set(brand, 'isSelected', false);
                } else {
                    this.$set(brand, 'isSelected', true);
                    //不限选项联动
                    let isAllSelected = true;
                    let brandData = this.allData;
                    for (let i = 0, len = brandData.length; i < len; i += 1) {
                        if (!brandData[i].isSelected
                            && brandData[i].code !== this.noLimitData[BRAND].code) {
                            isAllSelected = false;
                            break;
                        }
                    }
                    isAllSelected && this.$set(noLimitBrandOptions, 'isSelected', isAllSelected);
                }
            }
        },
        setBrandSelected(brandObj) {
            this.removeChildDataWhenBrandSelected();
            if (!this.multipleConfig[BRAND]) {
                this.setBrandSelectedInSingleSelection(brandObj);
            } else {
                this.setBrandSelectedInMultipleSelection(brandObj);
            }
            this.$emit('onSelectedBrand', this.buildSelectedBrandData());
            if (!this.brandObjHasNextGroup(brandObj)) return;
            this.getSeries(brandObj, this.setSeries.bind(this));
        },
        brandObjHasNextGroup(brandObj) {
            return this.type !== BRAND && brandObj.code !== this.noLimitData[BRAND].code;
        },
        removeChildDataWhenSeriesSelected() {
            this.groups = this.groups.slice(0, 2);
            if (!this.multipleConfig[SERIES]) {
                this.lastClickSeriesData.isSelected = false;
            }
        },
        setSeriesSelectedInSingleSelection(seriesObj, isEnd) {
            if (this.singleSelectionLastSelectedData[SERIES]) {
                this.$set(this.singleSelectionLastSelectedData[SERIES], 'isSelected', false);
            }
            if (this.sceneNumber === SINGLE_BRAND_SINGLE_SERIES_MULTIPLE_MODEL && !isEnd) {
                this.$set(seriesObj, 'isSelected', {
                    isSelected: true,
                    rightSpanSelect: true
                });
            } else {
                this.$set(seriesObj, 'isSelected', true);
            }
            //记住上次选中的序列数据索引
            this.singleSelectionLastSelectedData[SERIES] = seriesObj;
            this.lastClickSeriesData = seriesObj;
        },
        setSeriesSelectNoLimitOptions() {
            let willSelected = !this.currentSeriesGroupAll[0].isSelected;
            if (this.type === SERIES) {
                this.currentSeriesGroupAll.forEach((serie) => {
                    this.$set(serie, 'isSelected', willSelected);
                });
            } else {
                this.$set(this.currentSeriesGroupAll[0], 'isSelected', true);
            }
        },
        setSeriesSelectedInMultipleSelection(seriesObj) {
            let parentBrandObj = this.lastClickBrandData;
            if (seriesObj.code === this.noLimitData[SERIES].code) {
                this.setSeriesSelectNoLimitOptions(parentBrandObj);
            } else {
                let noLimitSeriesOptions = this.currentSeriesGroupAll[0];
                if (noLimitSeriesOptions.isSelected) {
                    this.$set(noLimitSeriesOptions, 'isSelected', false);
                }
                if (seriesObj.isSelected) {
                    if (this.type !== SERIES || !this.multipleConfig[this.type]) return;
                    this.$set(seriesObj, 'isSelected', false);
                } else {
                    this.$set(seriesObj, 'isSelected', true);
                    //不限选项联动
                    let isAllSelected = true;
                    let seriesData = parentBrandObj[SERIES];
                    for (let i = 0, len = seriesData.length; i < len; i += 1) {
                        if (!seriesData[i].isSelected
                            && seriesData[i].code !== this.noLimitData[SERIES].code) {
                            isAllSelected = false;
                            break;
                        }
                    }
                    isAllSelected && this.$set(noLimitSeriesOptions, 'isSelected', isAllSelected);
                }
            }
            this.lastClickSeriesData = seriesObj;
        },
        setSeriesSelected(seriesObj, isEnd) {
            this.removeChildDataWhenSeriesSelected();
            if (!this.multipleConfig[SERIES]) {
                this.setSeriesSelectedInSingleSelection(seriesObj, isEnd);
            } else {
                this.setSeriesSelectedInMultipleSelection(seriesObj);
            }
            // if (this.type === SERIES || seriesObj.code === this.noLimitData[SERIES].code || isEnd) return;
            if (!this.seriesObjHasNextGroup(seriesObj, isEnd)) return;
            this.getModel(seriesObj, this.setModel.bind(this));
        },
        seriesObjHasNextGroup(seriesObj, isEnd) {
            return this.type !== SERIES && seriesObj.code !== this.noLimitData[SERIES].code && !isEnd;
        },
        setModel(seriesObj, modelData) {
            this.currentModelGroupAll = modelData;
            let modelDataAfterBuild = this.dataHaveBeenGrouped ? modelData : this.buildModel(modelData);
            this.setGroupData({
                type: MODEL,
                label: seriesObj.name,
                parentCode: seriesObj.code,
                childrens: modelDataAfterBuild
            });
        },
        buildModel(modelData) {
            const obj = {};
            modelData.forEach((v) => {
                if (obj[v.modelYear] === undefined) {
                    obj[v.modelYear] = [];
                }
                v.image = false;
                obj[v.modelYear].push(v);
            });
            let unOrderResult = Object.keys(obj).map((v) => {
                return {
                    label: v === this.noLimitData[MODEL].modelYear ? '' : v,
                    modelYear: v,
                    childrens: obj[v]
                };
            });
            return unOrderResult.sort((a, b) => {
                if (a.modelYear === this.noLimitData[MODEL].modelYear) return -1;
                if (b.modelYear === this.noLimitData[MODEL].modelYear) return 1;
                return Number.parseInt(b.modelYear) - Number.parseInt(a.modelYear);
            });
        },
        getModel(seriesObj, callback) {
            if (!this.dataHaveBeenGrouped) {
                let seriesModelInfo = this.getModelDataFromParentSeries(this.currentSeriesGroupAll, seriesObj.code);
                let localModelData = seriesModelInfo.modelData;
                let modelParentSeriesObj = seriesModelInfo.modelParentSeriesObj;
                if (this.multipleConfig[SERIES] && localModelData) {
                    callback(seriesObj, localModelData);
                } else {
                    Promise.resolve(this.getModelData(seriesObj.code))
                    .then((data) => {
                        this.noLimitDataShowCtrl[MODEL] && data.unshift(this.copyObj(this.noLimitData[MODEL]));
                        data = this.dealingModelDataHasActivedModel(modelParentSeriesObj, data);
                        modelParentSeriesObj[MODEL] = data;
                        callback(seriesObj, data);
                    })
                    .catch((error) => {
                        console.error(`getModelData, ${error}`);
                    });
                }
            } else {
                Promise.resolve(this.getModelData(seriesObj.code))
                    .then((data) => {
                        callback(seriesObj, data);
                    })
                .catch((error) => {
                    console.error(`getModelData, ${error}`);
                });
            }
        },
        dealingModelDataHasActivedModel(modelParentSeriesObj, modelData) {
            if (modelParentSeriesObj.activedValue) {
                let lastModelItem = modelParentSeriesObj.activedValue[modelParentSeriesObj.activedValue.length - 1];
                let lastModelItemInAllData = modelData.filter(modelItem => modelItem.code === lastModelItem.code)[0];
                if (!lastModelItemInAllData) return;
                if (this.multipleConfig[MODEL]) {
                    let modelItemExceptLast = modelParentSeriesObj.activedValue.slice(0, -1);
                    modelItemExceptLast.forEach((activeModelItem) => {
                        modelData.forEach((modelItem) => {
                            if (activeModelItem.code === modelItem.code) {
                                modelItem.isSelected = true;
                                modelItem.activedValue = activeModelItem[MODEL];
                            }
                        });
                    });
                }
                //保存当前展示的序列的索引值，之后通过这个对象控制展示
                this.currentModelGroupAll = modelData;
                modelParentSeriesObj[MODEL] = modelData;

                this.itemSelected(MODEL, lastModelItemInAllData);
                modelParentSeriesObj.activedValue = null;
            }
            return modelData;
        },
        setModelSelectedInSingleSelection(modelObj) {
            if (this.singleSelectionLastSelectedData[MODEL]) {
                this.$set(this.singleSelectionLastSelectedData[MODEL], 'isSelected', false);
            }
            this.$set(modelObj, 'isSelected', true);
            this.singleSelectionLastSelectedData[MODEL] = modelObj;
        },
        setModelSelectedNoLimitOptions() {
            let willSelected = !this.currentModelGroupAll[0].isSelected;
            this.currentModelGroupAll.forEach((model) => {
                this.$set(model, 'isSelected', willSelected);
            });
        },
        setModelSelectedInMultipleSelection(modelObj) {
            let modelParentSeriesObj = this.lastClickSeriesData;
            if (modelObj.code === this.noLimitData[MODEL].code) {
                this.setModelSelectedNoLimitOptions();
            } else {
                let noLimitModelOptions = this.currentModelGroupAll[0];
                if (noLimitModelOptions.isSelected) {
                    this.$set(noLimitModelOptions, 'isSelected', false);
                }
                if (modelObj.isSelected) {
                    this.$set(modelObj, 'isSelected', false);
                } else {
                    this.$set(modelObj, 'isSelected', true);
                    //不限选项联动
                    let isAllSelected = true;
                    let modelData = modelParentSeriesObj[MODEL];
                    for (let i = 0, len = modelData.length; i < len; i += 1) {
                        if (!modelData[i].isSelected
                            && modelData[i].code !== this.noLimitData[MODEL].code) {
                            isAllSelected = false;
                            break;
                        }
                    }
                    isAllSelected && this.$set(noLimitModelOptions, 'isSelected', isAllSelected);
                }
            }
        },
        setModelSelected(data) {
            if (!this.multipleConfig[MODEL]) {
                this.setModelSelectedInSingleSelection(data);
            } else {
                this.setModelSelectedInMultipleSelection(data);
            }
        },
        shouldItemShowCheckboxButton(groupType) {
            if (groupType === MODEL) {
                return this.type === SERIES_OR_MODEL;
            } else {
                return this.multipleConfig[groupType] && groupType === this.type;
            }
        },
        shouldShowFooterButton(groupType) {
            if (groupType === MODEL) {
                return this.type === SERIES_OR_MODEL;
            } else {
                return groupType === this.type
                    && this.multipleConfig[groupType]
                    && this.sceneNumber !== MULTIPLE_BRAND_MULTIPLE_SERIES;
            }
        },
        getBrandSeriesDataFromAllData(brandCode) {
            let hasSeriesData = false;
            let brandIndex;
            let allData = this.allData;
            for (let i = 0, len = allData.length; i < len; i += 1) {
                if (brandCode === allData[i].code) {
                    brandIndex = i;
                    break;
                }
            }
            hasSeriesData = allData[brandIndex][SERIES] && Array.isArray(allData[brandIndex][SERIES]);
            return {
                seriesData: hasSeriesData ? allData[brandIndex][SERIES] : null,
                seriesParentBrandObj: allData[brandIndex]
            };
        },
        getModelDataFromParentSeries(currentSeriesGroupAll, seriesCode) {
            let hasModelData = false;
            let seriesIndex;
            for (let i = 0, len = currentSeriesGroupAll.length; i < len; i += 1) {
                if (seriesCode === currentSeriesGroupAll[i].code) {
                    seriesIndex = i;
                    break;
                }
            }
            hasModelData = currentSeriesGroupAll[seriesIndex][MODEL] && Array.isArray(currentSeriesGroupAll[seriesIndex][MODEL]);
            return {
                modelData: hasModelData ? currentSeriesGroupAll[seriesIndex][MODEL] : null,
                modelParentSeriesObj: currentSeriesGroupAll[seriesIndex]
            };
        },
        copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        openSeriesSection(brandItem) {
            let brandIndexInAllData = this.allData.filter(brand => brandItem.code === brand.code)[0];
            if (!brandIndexInAllData) return;
            this.itemSelected(
                BRAND,
                brandIndexInAllData
            );
        }
    }
};
</script>
