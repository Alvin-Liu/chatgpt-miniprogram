<template>
  <view class="demo demo-message">
    <scroll-view
      scroll-y="true"
      :style="{ height: `calc(100vh - 96px)` }"
      scroll-with-animation="true"
      class="content"
      :scroll-into-view="`item-${currentItem}`"
    >
      <app-message role="user">
        <text>{{ currentPrompt.prompt }}</text>
      </app-message>
      <view v-for="item in messageList" :key="item.id" :id="`item-${item.id}`">
        <app-message :role="item.role" :content="item.prompt" />
      </view>
      <app-message role="assistant" v-if="thinking">
        <div class="bubble">
          <div class="bubble__circle"></div>
          <div class="bubble__circle"></div>
          <div class="bubble__circle"></div>
        </div>
      </app-message>
    </scroll-view>

    <view class="footer">
      <view class="footer__btns">
        <vin-button
          custom-class="btn"
          size="mini"
          icon="refresh2"
          type="primary"
          :disabled="messageList.length < 1 || loading || thinking"
          @click="handleClear"
          >开启新对话</vin-button
        >
      </view>
      <view class="footer__content">
        <vin-input
          v-model="inputValue"
          custom-class="footer__input"
          adjust-position
          clearable
          placeholder="向我提问..."
          @confirm="handleSendClick"
        >
          <template #button>
            <vin-button
              :disabled="inputValue.trim().length < 1 || loading || thinking"
              size="mini"
              type="primary"
              @click="handleSendClick"
            >
              发送</vin-button
            >
          </template>
        </vin-input>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, toRefs } from 'vue';
import { createPage } from '@/utils/createPage';
import { promptList, defaultPrompt } from '@/const/prompts';
import { useShareAppMessage, useShareTimeline } from '@/hooks/useShare';
import { completions } from '@/api/chat';
import { relpayForWechat, keywords } from '@/const/content';

import type { RoleType } from '@/api/chat';

export default createPage({
  setup() {
    const state = reactive({
      currentItem: 0,
      inputValue: '',
      messageList: [] as { id: number; role: RoleType; prompt?: string }[],
      loading: false,
      thinking: false,
      currentPrompt: defaultPrompt,
    });

    onLoad(({ id }) => {
      const currentPrompt = promptList.find?.((item) => item.id === id);
      uni.setNavigationBarTitle({
        title: currentPrompt?.name || '智能助理',
      });

      if (currentPrompt) {
        state.currentPrompt = currentPrompt;

        const title = `${currentPrompt?.name || 'AI智能私人小助理'}:${currentPrompt?.prompt}`;

        useShareTimeline({ title });
        useShareAppMessage({ title });
      }
    });

    const handleClear = () => {
      if (state.loading || state.thinking) return;

      state.messageList = [];
    };

    onShow(() => {
      handleClear();

      uni.updateShareMenu({ withShareTicket: true });
    });

    const writing = (value: string) => {
      const length = value.length;

      let key = 0;
      let timer = 0;

      state.thinking = false;

      const id = Date.now();
      state.messageList.push({
        id,
        role: 'assistant' as RoleType,
        prompt: '',
      });

      state.currentItem = id;

      const currentPrompt = state.messageList[state.messageList.length - 1];

      const showText = () => {
        if (key >= length) {
          state.loading = false;
          clearInterval(timer);
          return;
        }

        currentPrompt.prompt += value[key];
        key += 1;
      };

      timer = setInterval(() => showText(), 30);
    };

    const onRequestMessage = (prompt: string) => {
      state.loading = true;
      state.thinking = true;

      const matchContent = relpayForWechat.find(
        ({ ask }) => prompt.replaceAll(/\s/g, '').search(new RegExp(ask, 'gi')) > -1
      );

      if (matchContent) {
        // 设置一个延时，模拟请求的效果
        setTimeout(() => writing(matchContent.replay), 1000);

        return;
      }

      const messages = state.messageList
        .map((item) => {
          return {
            role: item.role,
            content: item.prompt,
          };
        })
        .slice(-4); // 默认只取后4条

      const currentPrompt = state.currentPrompt;
      if (currentPrompt.prompt) {
        messages.unshift({ role: 'system', content: currentPrompt.prompt });
      }

      completions(messages)
        .then((data: any) => {
          const result: string = data?.choices?.[0]?.message?.content?.trim() || '';
          const finalContent = keywords.reduce(
            (prev, next) => prev.replaceAll(new RegExp(next.keyword, 'gi'), next.replacement),
            result
          );

          writing(finalContent);
        })
        .catch(() => {
          state.thinking = false;
          state.loading = false;
        });
    };

    const handleSendClick = async () => {
      const question = state.inputValue.trim();
      if (question.trim() === '') return;

      state.messageList.push({
        id: Date.now(),
        role: 'user' as RoleType,
        prompt: question,
      });

      state.inputValue = '';
      onRequestMessage(question);
    };

    return {
      ...toRefs(state),
      handleSendClick,
      handleClear,
    };
  },
});
</script>

<style lang="scss" scoped>
$desc-text-color: #909ca4;

.demo-message {
  padding: 0;
  color: #fff;
  background-color: #eee;

  .chat {
    background-color: #ededed;
    height: 100vh;
    font-family: 'PingFang SC', system-ui, -apple-system, BlinkMacSystemFont, segoe ui, Roboto,
      Helvetica, Arial, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol;
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f6f6f6;
    box-sizing: border-box;
    padding: 16rpx;
    color: $desc-text-color;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 8px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 8px);

    :deep(.footer__input) {
      padding: 20rpx 22rpx !important;
      border-radius: 10rpx;
    }

    &__btns {
      padding: 5rpx 0;

      :deep(.btn) {
        padding: 25rpx 20rpx 25rpx 15rpx;

        .vin-icon {
          font-size: 24rpx;
        }

        .vin-button__warp > .text {
          margin-left: 0;
        }
      }
    }

    &__content {
      display: flex;
      align-content: center;
      gap: 10rpx;

      &--clear {
        width: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  @-webkit-keyframes fade_in_out {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.25;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fade_in_out {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.25;
    }

    100% {
      opacity: 1;
    }
  }

  .bubble {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-around;
    gap: 10rpx;

    &__circle {
      width: 15rpx;
      height: 15rpx;
      border-radius: 100%;
      background-color: #bbb;
      -webkit-animation: fade_in_out 1.5s infinite;
      animation: fade_in_out 1.5s infinite;
      -webkit-animation-delay: 0.25s;
      animation-delay: 0.25s;

      &:first-of-type {
        margin-left: 20.8333333333px;
        -webkit-animation-delay: 0s;
        animation-delay: 0s;
      }

      &:last-of-type {
        margin-right: 20.8333333333px;
        -webkit-animation-delay: 0.5s;
        animation-delay: 0.5s;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
