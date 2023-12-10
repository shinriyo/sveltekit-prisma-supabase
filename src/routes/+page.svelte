<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  const { users } = data;
</script>

<ul>
  {#each users as user}
    <li>id: {user.id}</li>
    <li>email: {user.email}</li>
    <li>name: {user.name}</li>
  {/each}
</ul>
  