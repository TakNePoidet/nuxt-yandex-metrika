<!--
Find and replace all on all files (CMD+SHIFT+F):
- Name: Yandex Metrika
- Package name: nuxt-yandex-metrika
- Description: Yandex Metrika for Nuxt 4
-->

# Yandex Metrika for Nuxt 4

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Quick Setup

1. Add `nuxt-yandex-metrika` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-yandex-metrika

# Using yarn
yarn add --dev nuxt-yandex-metrika

# Using npm
npm install --save-dev nuxt-yandex-metrika
```

2. Add `nuxt-yandex-metrika` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
	modules: ['nuxt-yandex-metrika']
});
```

## Configure

```ts
{
  modules: ["nuxt-yandex-metrika"],
  yandexMetrika: {
    id: 'XXXXXX',
    // debug: process.env.NODE_ENV !== "production",
    // delay: 0,
    // cdn: false,
    // verification: null, // Verification in Yandex Webmaster
    // options: {
    //  webvisor: true
    // },
  }
}
```

| Name           | Default value | Type                             | Description                                                                                             |
|----------------|---------------|----------------------------------|---------------------------------------------------------------------------------------------------------|
| `id`           | —             | `string`                         | **Required.** Yandex Metrika counter ID                                                                 |
| `debug`        | `false`       | `boolean`                        | Enables debug mode. Useful during development. When enabled, additional logs are printed to the console |
| `delay`        | `0`           | `number`                         | Delay (in milliseconds) before initializing Yandex Metrika                                              |
| `cdn`          | `false`       | `boolean`                        | Load Metrika script from Yandex CDN instead of the default source                                       |
| `verification` | `null`        | `string \| null`                 | Verification code for **Yandex Webmaster** (adds `<meta name="yandex-verification">`)                   |
| `position`     | `'head'`      | `'head' \| 'body' \| 'bodyOpen'` | Script injection position in the HTML document                                                          |
| `options`      | `{}`          | `object`                         | Yandex Metrika initialization options (see table below)                                                 |


## Options

| Name                | Default value | Type    | Description |
|---------------------|---------------|---------|-------------|
| accurateTrackBounce | true          | Boolean / Number | Accurate bounce rate. Possible values: `true` — enable accurate bounce rate (non-bounce event after 15000 ms). `false` — disable accurate bounce rate. `<N>` (integer) — enable accurate bounce rate with non-bounce event after `<N>` ms. |
| childIframe         | false         | Boolean | Whether to record iframe contents without a tag in a child window |
| clickmap            | true          | Boolean | Whether to collect data for a click map |
| defer               | false         | Boolean | Whether to disable automatic data sending during tag initialization |
| ecommerce           | false         | Boolean / String / Array | Collect e-commerce data. `true` — data is sent via `window.dataLayer`. `false` — disable e-commerce. `<objectName>` (String) — data is sent via `window.<objectName>`. `<array>` (Array) — data is sent via a JavaScript array |
| params              | —             | Object / Array | Session parameters sent during tag initialization. To send later, use the `params` method |
| userParams          | —             | Object | User parameters sent during tag initialization. To send later, use the `userParams` method |
| trackHash           | false         | Boolean | Track URL hash changes in the browser address bar |
| trackLinks          | true          | Boolean | Track clicks on outbound links |
| trustedDomains      | —             | Array   | Trusted domains for recording child iframe contents |
| type                | 0             | Number  | Tag type. `1` — YAN |
| webvisor            | false         | Boolean | Enable Session Replay (WebVisor) |
| triggerEvent        | false         | Boolean | Whether to check if the tag is ready |


For more information:

- [Documentation for Ya.Metrika](https://yandex.com/support/metrica/code/counter-initialize.html)


### Methods

```vue
<script setup lang="ts">
import { useYandexMetrika } from '#imports';

const { reachGoal } = useYandexMetrika();
</script>

<template>
	<button @click.prevent.stop="reachGoal('click', {})">
		click
	</button>
</template>
```

- [For more information](https://yandex.com/support/metrica/objects/method-reference.html?lang=en)

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

# Contact

Yakin Nikita - [@TakNePoidet](https://t.me/TakNePoidet)

# Contributors

<a href="https://github.com/TakNePoidet/nuxt-yandex-metrika/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=TakNePoidet/nuxt-yandex-metrika" />
</a>

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-yandex-metrika/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-yandex-metrika
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-yandex-metrika.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-yandex-metrika
[license-src]: https://img.shields.io/npm/l/nuxt-yandex-metrika.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-yandex-metrika
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
