/// <reference types="vite/client" />

interface ImportMetaEnv{
    readonly VITE_CLIENT_SECRET: string,
    readonly VITE_CLIENT_ID: string
}

interface ImportMeta{
    readonly env: ImportMetaEnv
}
