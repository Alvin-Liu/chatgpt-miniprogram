<template>
  <view class="message">
    <view
      :class="[
        'message__wrap',
        'animate__animated',
        'animate__fadeInUp',
        { 'message__layout--reverse': role === 'user' },
      ]"
    >
      <view :class="['message__box', `message__box--${role}`]">
        <text class="message__box--text" user-select v-if="content">{{ content }}</text>
        <slot v-else></slot>
      </view>
      <view class="message__avatar"></view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
  props: {
    role: {
      type: String,
      default: 'assistant',
    },
    content: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.message {
  padding: 20rpx;
  font-size: 30rpx;

  &__wrap {
    display: flex;
    gap: 18rpx;
  }

  &__box {
    overflow-wrap: break-word;
    color: #333;
    overflow: hidden;
    max-width: calc(100% - 80px);
    border-radius: 20rpx;
    padding: 18rpx 30rpx;
    font-size: 14px;

    &--text {
      vertical-align: middle;
    }

    &--assistant {
      background-color: #fff;
    }

    &--user {
      background-color: var(--primary-lite-color);
    }
  }

  &__layout--reverse {
    flex-direction: row-reverse;
  }
}
</style>
