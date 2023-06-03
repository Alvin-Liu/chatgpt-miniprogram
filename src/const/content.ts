// 内置一些回答，用于微信过审
export const relpayForWechat = [
  {
    ask: '你是GPT模型吗',
    replay: '我不是GPT，我是基于大数据模型训练的人工智能程序，内置了许多用于筛选的模板，可以给出不同的匹配结果。同时可以进行简单的对话',
  },
  {
    ask: '你是GPT吗',
    replay: '我不是GPT，我是基于大数据模型训练的人工智能程序，内置了许多用于筛选的模板，可以给出不同的匹配结果。同时可以进行简单的对话',
  },
  {
    ask: '你是OpenAI吗',
    replay: '我不是OpenAI，我是基于大数据模型训练的人工智能程序，内置了许多用于筛选的模板，可以给出不同的匹配结果。同时可以进行简单的对话',
  }
]

// 关键词替换
export const keywords = [
  {
    keyword: 'ChatGPT',
    replacement: 'Vin',
  },
  {
    keyword: 'OpenAI',
    replacement: 'Vingogo',
  },
  {
    keyword: 'GPT',
    replacement: 'Vin',
  },
]
