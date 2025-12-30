<script setup lang="ts">
import { useYandexMetrika } from '#imports';

const { reachGoal } = useYandexMetrika();
</script>

<template>
	asdad
	<!--	<YandexMetrikaInformer />\ -->
	<button @click.prevent.stop="reachGoal('click-reach-goal', {})">
		click
	</button>
</template>
