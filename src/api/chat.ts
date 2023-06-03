import { baseUrl, OPEN_API_KEY } from '@/config';

export type RoleType = 'assistant' | 'user' | 'system';

export const completions = (messages: { role: RoleType; content?: string }[]) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/v1/chat/completions`,
      data: {
        model: 'gpt-3.5-turbo',
        messages,
      },
      method: 'POST',
      responseType: 'text',
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${OPEN_API_KEY}`,
      },
      success: (res: any) => {
        const result = res.data;

        if (!result) {
          uni.showToast({ icon: 'none', title: '系统繁忙，请重试' });

          return reject(res);
        }

        resolve(result);
      },
      fail: (err) => {
        if (!baseUrl) {
          console.error('请先配置 baseUrl', baseUrl);
        }

        uni.showToast({ icon: 'none', title: `服务请求错误` });

        reject(err);
      },
    })
  })
}