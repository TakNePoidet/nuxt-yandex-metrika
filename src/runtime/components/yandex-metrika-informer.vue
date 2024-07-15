<script setup lang="ts">
import { useYandexMetrika } from '../composables/useYandexMetrika';

const { id } = useYandexMetrika();
</script>

<template>
	<!-- Yandex.Metrika informer -->
	<a :href="`https://metrika.yandex.ru/stat/?id=${id}&amp;from=informer`" target="_blank" rel="nofollow"
		><img
			:src="`https://informer.yandex.ru/informer/${id}/3_1_FFFFFFFF_EFEFEFFF_0_pageviews`"
			style="width: 88px; height: 31px; border: 0"
			alt="Яндекс.Метрика"
			title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
			class="ym-advanced-informer"
			:data-cid="id"
			data-lang="ru"
	></a>
	<!-- /Yandex.Metrika informer -->
</template>
