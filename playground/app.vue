<script setup lang="ts">
import { onMounted, onUnmounted, ref, useRoute, useRouter, useYandexMetrika } from '#imports';

const { reachGoal } = useYandexMetrika();

const route = useRoute();
const router = useRouter();

const initializedId = ref<string | null>(null);
const ymCalls = ref<any[]>([]);
const hits = ref<Array<{ url: string; title: string; referer?: string }>>([]);

let interval: ReturnType<typeof setInterval> | undefined;

function refresh() {
	const ymAny = window.ym as any;
	if (!ymAny?.a) return;

	ymCalls.value = [...ymAny.a];

	// Каждый вызов — объект с числовыми ключами: { 0: id, 1: method, 2: ..., 3: ... }
	const calls = Array.from(ymAny.a).map((call: any) => {
		// Если это уже массив — вернуть как есть
		if (Array.isArray(call)) return call;
		// Если объект с числовыми ключами — преобразовать
		const keys = Object.keys(call).filter((k) => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
		return keys.map((k) => call[k]);
	});

	// Первый вызов: ['123123', 'init', {...}]
	const first = calls[0];
	if (first && typeof first[0] === 'string') {
		initializedId.value = first[0];
	} else {
		initializedId.value = null;
	}

	// Собираем хиты: [id, 'hit', url, options]
	hits.value = calls
		.filter((call) => call[1] === 'hit')
		.map((call) => ({
			url: call[2] ?? '',
			title: call[3]?.title ?? '',
			referer: call[3]?.referer
		}));
}

onMounted(() => {
	refresh();
	interval = setInterval(refresh, 500);
});

onUnmounted(() => {
	if (interval) clearInterval(interval);
});

function handleGoal() {
	reachGoal('playground_test', { from: 'app.vue' });
	console.log('[playground] reachGoal вызван');
}

function reload() {
	window.location.reload();
}

const links = [
	{ to: '/', label: 'Главная' },
	{ to: '/about', label: 'О нас' },
	{ to: '/contact', label: 'Контакты' }
];
</script>

<template>
	<div style="padding: 2rem; font-family: sans-serif; max-width: 900px; margin: 0 auto">
		<h1>nuxt-yandex-metrika playground</h1>

		<!-- Навигация -->
		<nav style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
			<NuxtLink
				v-for="link in links"
				:key="link.to"
				:to="link.to"
				:style="{
					padding: '0.5rem 1rem',
					background: route.path === link.to ? '#333' : '#eee',
					color: route.path === link.to ? '#fff' : '#000',
					borderRadius: '4px',
					textDecoration: 'none'
				}"
			>
				{{ link.label }}
			</NuxtLink>
		</nav>

		<!-- Текущий маршрут -->
		<section style="margin-bottom: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px">
			<strong>Текущий маршрут:</strong> <code>{{ route.fullPath }}</code>
		</section>

		<!-- Фактический id -->
		<section style="margin-bottom: 1rem">
			<h2>Фактический id в window.ym</h2>
			<p><strong>{{ initializedId ?? '— (ещё не инициализирован)' }}</strong></p>
		</section>

		<!-- Хиты -->
		<section style="margin-bottom: 1rem">
			<h2>Отправленные хиты ({{ hits.length }})</h2>
			<p v-if="hits.length === 0" style="color: #999">Пока нет хитов. Перейдите на другую страницу.</p>
			<table v-else style="width: 100%; border-collapse: collapse; font-size: 0.9rem">
				<thead>
					<tr style="background: #f0f0f0">
						<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd">#</th>
						<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd">URL</th>
						<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd">Title</th>
						<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd">Referer</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(hit, i) in hits" :key="i">
						<td style="padding: 0.5rem; border: 1px solid #ddd">{{ i + 1 }}</td>
						<td style="padding: 0.5rem; border: 1px solid #ddd"><code>{{ hit.url }}</code></td>
						<td style="padding: 0.5rem; border: 1px solid #ddd">{{ hit.title }}</td>
						<td style="padding: 0.5rem; border: 1px solid #ddd">
							<code v-if="hit.referer">{{ hit.referer }}</code>
							<span v-else style="color: #999">—</span>
						</td>
					</tr>
				</tbody>
			</table>
		</section>

		<!-- Кнопки -->
		<section style="margin-bottom: 1rem">
			<button @click="handleGoal">reachGoal('playground_test')</button>
			<button style="margin-left: 1rem" @click="reload">Перезагрузить</button>
		</section>

		<!-- Контент страницы -->
		<section style="padding: 1rem; border: 2px dashed #ccc; border-radius: 4px">
			<NuxtPage />
		</section>

		<!-- Полный лог window.ym.a -->
		<details style="margin-top: 2rem">
			<summary>window.ym.a (полный лог)</summary>
			<pre style="background: #f5f5f5; padding: 1rem; overflow: auto; max-height: 400px">{{
				JSON.stringify(ymCalls, null, 2)
			}}</pre>
		</details>
	</div>
</template>