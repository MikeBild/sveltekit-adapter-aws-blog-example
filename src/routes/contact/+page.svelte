<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<form method="post">
	<input
		type="email"
		name="email"
		value={form?.email || ''}
		required
		placeholder="hello@example.com"
	/>
	<textarea name="message" value={form?.message || ''} placeholder="your message" />
	{#if form?.missing}<p>The message field is required</p>{/if}

	<input type="submit" value="submit" />
</form>
