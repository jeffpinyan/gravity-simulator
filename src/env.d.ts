/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}