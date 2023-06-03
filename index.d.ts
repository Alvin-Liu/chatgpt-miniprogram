/// <reference types="vite/client" />

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '*.less' {
  const resource: Record<string, string>
  export = resource
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production'
    VITE_OPEN_MOCK: string
  }
}
