import {
  ComponentPropsOptions,
  ExtractPropTypes,
  SetupContext,
  RenderFunction,
  Component,
} from 'vue';

export function createPage<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  Props extends Readonly<ExtractPropTypes<PropsOptions>>
>(options: {
  name?: string;
  props?: PropsOptions;
  components?: Record<string, Component>;
  setup?: (
    props: Props,
    setupContext: SetupContext
  ) => RenderFunction | Record<string, any> | any;
  [optionKey: string]: any;
}) {
  const entryPath = '/pages/index/index';

  return {
    onShareAppMessage: () => {
      return {
        title: 'AI智能私人小助理:AI助手，智能办公小程序，小红书、大众点评、日报、节日祝福等',
        path: entryPath,
        success: (res: any) => {
          // 转发成功
          console.log('转发成功', res);
        },
        fail: (error: any) => {
          // 转发失败
          console.log('转发失败', error);
        },
      };
    },

    onShareTimeline: () => {
      return {
        title: 'AI智能私人小助理',
        path: entryPath,
      };
    },

    ...options
  }
}