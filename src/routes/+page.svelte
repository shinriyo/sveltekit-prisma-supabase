<h1 class="text-3xl font-bold underline">
    Hello world!
</h1>
<script lang="ts">
    import type { PageData } from './$types';
  
    export let data: PageData;
    const { users } = data;
    import { Label } from 'flowbite-svelte'
    let files: FileList
</script>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style> 
<hr />
<div class="flex">
    <Label class="w-1/5 pb-2">アイコンアップロード</Label>
    <input
        class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
        accept="image/*"
        bind:value={files}
    />
</div>

{#if users.length > 0}
  <div>ある</div>
  <ul>
    {#each users as user}
      <li>id: {user.id}</li>
      <li>email: {user.email}</li>
      <li>name: {user.name}</li>
    {/each}
  </ul>
{:else}
  <div>ない</div>
{/if}
