<script setup lang="ts">
import chalk from 'chalk';

import { useYandexMetrika } from '../composables/useYandexMetrika';

const { verification } = useYandexMetrika();

if (!verification) {
	console.error(`${chalk.bgRed(chalk.black('[yandex-metrika]'))} ${chalk.red('Verification key not found')}`);
}
</script>

<template>
	<Meta v-if="verification" name="yandex-verification" :content="verification" />
</template>

<style scoped></style>
