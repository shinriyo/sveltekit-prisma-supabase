<script lang="ts">
    // import type { ChangeEventHandler } from 'svelte/elements';
    import type { PageData } from './$types';
    // import type { SupabaseClient } from '@supabase/supabase-js'
    // export let supabase: SupabaseClient
    export let data: PageData;
    const { users, supabase } = data;

    // アップロード
    import { Label, Button } from 'flowbite-svelte'
    // let files: FileList | null = null;

    // const updateUser = async () => {
    //     const update_data = {
    //         id: $session.user.id,
    //         avatar_url: url
    //     }

    //     await supabase
    //     .from('profiles')
    //     .update(update_data)
    // }

    // const uploadIcon = async (event: Event, customArgument: number) => {
    const uploadIcon = async (event: Event) => {
        const inputElement = event.target as HTMLInputElement;
        // if (!files || files.length === 0) {
        //     return
        // }
        if (inputElement instanceof HTMLInputElement) {
            if (!inputElement.files) {
                return
            }

            const files = inputElement.files;
            const file = files[0]
            if (file.name.split('.').length < 1) {
                return;
            }

            const fileExt = file.name.split('.').pop()
            const filePath = `${inputElement.id}/${Math.random()}.${fileExt}`;
            console.log(filePath)
            // const filePath = `${session.user.id}/${Math.random()}.${fileExt}`
            // console.log(customArgument)
            await supabase.storage.from('avatars').upload(filePath, file)
        }
    }
</script>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style> 
<hr />
<div class="flex">
    <div>
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>
        <div>
        {#if users.length > 0}
        <div>ある</div>
        <ul>
            {#each users as user}
            <div class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white-50 dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400">
            <li>id: {user.id}</li>
            <li>email: {user.email}</li>
            <li>name: {user.name}</li>
            <hr />
            <Label class="w-1/5 pb-2">アイコンアップロード</Label>
            <input
                id="file-{user.id.toString()}"
                class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                accept="image/*"
                on:change={uploadIcon}
            />
            </div>
            {/each}
        </ul>
        {:else}
        <div>ない</div>
        {/if}
        </div>
    </div>
</div>