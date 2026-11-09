<script setup lang="ts">
import { useYandexMetrika } from '#imports';

const { reachGoal } = useYandexMetrika();
</script>

<template>
	<div>
		<h1>Главная</h1>
		<p>Это главная страница. Перейдите на другую — должен уйти хит.</p>
		<button @click="reachGoal('home_cta', { page: 'index' })">reachGoal('home_cta')</button>
	</div>
</template>