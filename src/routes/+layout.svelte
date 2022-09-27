<script lang="ts">
	import '@picocss/pico/scss/pico.scss';
	import '../app.scss';
	import Header from '$lib/components/Header.svelte';
</script>

<Header />

<main class="container">
	<slot />
</main>
