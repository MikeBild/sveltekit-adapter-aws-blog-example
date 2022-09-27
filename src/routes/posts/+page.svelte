<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;
  $: posts = Object.entries(data.posts);

  async function addLike(id: string) {
    await fetch('/api/likes', {
      method: 'PUT',
      body: JSON.stringify({ id })
    });
    await invalidate('/api/likes');
  }
</script>

{#each posts as [url, metadata]}
  <article>
    <a href={url}>{metadata.title}</a>
    <footer>
      <div on:click={() => addLike(url)}>Likes: {data.likes[url] || 0}</div>
    </footer>
  </article>
{/each}
