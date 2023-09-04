<template>
	<YandexMetrikaInformer />
	<YandexVerification />
	<button @click.prevent.stop="reachGoal('click-reach-goal', {})">click</button>
</template>
<script setup lang="ts">
import { useYandexMetrika } from '#imports';

const { reachGoal } = useYandexMetrika();
</script>
