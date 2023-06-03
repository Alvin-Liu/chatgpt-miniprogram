<template>
  <view class="demo demo-home">
    <vin-searchbar v-model="searchValue">
      <template v-slot:leftin>
        <vin-icon size="14" name="search2"></vin-icon>
      </template>
    </vin-searchbar>

    <scroll-view class="tag-list" scroll-x="true" show-scrollbar="false" :scroll-left="0">
      <vin-tag
        v-for="(tag, index) in tags"
        type="primary"
        :custom-class="['category-tag', { active: tag.category === activeCategory }]"
        :key="index"
        @click="onClickCategory(tag.category)"
        >{{ tag.categoryName }}</vin-tag
      >
    </scroll-view>

    <view class="cols-2">
      <view class="item" v-for="(nav, navindex) in showPromptList" :key="navindex">
        <app-card :data="nav"></app-card>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, reactive, toRefs, watch } from 'vue';
import { createPage } from '@/utils/createPage';
import { promptList, categories } from '@/const/prompts';
import { onLoad } from '@dcloudio/uni-app';

const allPromptList = promptList.map((prompt) => {
  return {
    ...prompt,
    path: `/pages/message/index?id=${prompt.id}&category=${prompt.category}`,
  };
});

// 乱序
const shuffle = (arr: any[]) => {
  for (let i = arr.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
};

const ALL = 'all';

export default createPage({
  setup() {
    const state = reactive({
      searchValue: '',
      nav: allPromptList,
      tags: [
        {
          category: ALL,
          categoryName: '全部',
        },
      ].concat(categories),
      activeCategory: ALL,
      query: {} as any,
    });

    onLoad((e) => {
      state.query = e;
    });

    const filterCategories = (val: string) => {
      if (ALL === val) {
        state.nav = allPromptList;
        return;
      }

      state.nav = allPromptList.filter(
        (item) => item.category === val || item.prompt.includes(val) || item.name.includes(val)
      );
    };

    watch(() => state.searchValue, filterCategories);

    const onClickCategory = (category: string) => {
      state.activeCategory = category;

      filterCategories(category);
    };

    const showPromptList = computed(() => {
      return shuffle(state.nav);
    });

    return {
      ...toRefs(state),
      onClickCategory,
      showPromptList,
    };
  },
});
</script>

<style lang="scss" scoped>
$desc-text-color: #909ca4;

.demo-home {
  --vin-searchbar-padding: 9px 10px;
  --vin-searchbar-background: transparent;
  --vin-searchbar-input-background: #fff;
  min-height: 10vh;
  padding: 0;
  color: $desc-text-color;

  .tag-list {
    box-sizing: border-box;
    white-space: nowrap;
    width: 100%;
    padding: 5px 10px;

    :deep .category-tag {
      padding: 4px 12px;
      border-radius: 14px;
      background: #fff;
      color: #f87d09;

      &.active {
        background: #f87d09;
        color: #fff;
      }

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

.cols-2 {
  display: flex;
  flex-wrap: wrap;

  .item {
    box-sizing: border-box;
    width: calc(100% / 2);
    padding: 10px;
  }
}
</style>
