<script lang="ts">
    // import type { ChangeEventHandler } from 'svelte/elements';
    import type { PageData } from './$types';
    // import type { SupabaseClient } from '@supabase/supabase-js'
    // export let supabase: SupabaseClient
    export let data: PageData;
    const { users, supabase } = data;

    // アップロード
    import { Label } from 'flowbite-svelte'

    // const updateUser = async () => {
    //     const update_data = {
    //         id: $session.user.id,
    //         avatar_url: url
    //     }

    //     await supabase
    //     .from('profiles')
    //     .update(update_data)
    // }
    let errorText = "";
    // https://github.com/supabase/supabase/blob/master/examples/todo-list/sveltejs-todo-list/src/lib/TodoList.svelte
    const addTodo = async (taskText: string, name: string) => {
        let email = taskText.trim();
        if (email.length) {
            // 大文字小文字区別されれる
            let { data: todo, error } = await supabase
            .from("User")
            .insert({ email, name: name })
            .select()
            .single();

            if (error) {
                errorText = error.message;
                console.log(errorText);
            } else {
                todos = [...todos, todo];
                newTaskText = "";
            }
        }
    };

    // const uploadIcon = async (event: Event, customArgument: number) => {
    const uploadIcon = async (event: Event) => {
        const inputElement = event.target as HTMLInputElement;
        // if (!files || files.length === 0) {
        //     return
        // }
        try {
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
                // const filePath = `${Math.random()}.${fileExt}`;
                console.log(filePath)
                // const filePath = `${session.user.id}/${Math.random()}.${fileExt}`
                // console.log(customArgument)
                const { data, error } = await supabase.storage.from('avatars').upload(filePath, file)

                if (error) {
                    throw error
                }

                // 画像のURLを取得
                // https://srubwrrvsvnxdktwmuxj.supabase.co/storage/v1/object/public/avatars/file-2/0.39026193822758937.png
                // const pugData = supabase.storage.from('avatars').getPublicUrl('file-2/0.39026193822758937.png')
                const pugData = supabase.storage.from('avatars').getPublicUrl(filePath)
                const imageUrl = pugData.data.publicUrl
                console.log(imageUrl)
                
                // TODO: 画像のURLをDBに保存
                // const { error: databaseError } = await supabase
                //   .from('avatars')
                //   .insert({ imageUrl: imageUrl })
            }
        } catch(error) {
            alert(error.message)
            // if (error instanceof Error) {
            //     alert(error.message)
            // }
        } finally {
            //
        }
    }

    let loadedData = []
    let newTaskText = "";
    let email = "";


    async function loadData() {
        const { data: result } = await data.supabase.from('test').select('*').limit(20)
        loadedData = result
    }

    $: if (data.session) {
        loadData()
    }
</script>
{#if data.session}
<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(loadedData, null, 2)}</pre>
{/if}

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
        <form
            on:submit|preventDefault={() => addTodo(newTaskText, email)}
            class="flex gap-2 my-2"
        >
            <input
                class="rounded w-full p-2"
                type="text"
                placeholder="Eめーる"
                bind:value={email}
            />
            <input
                class="rounded w-full p-2"
                type="text"
                placeholder="make coffee"
                bind:value={newTaskText}
            />
            <button type="submit" class="btn-black"> Add </button>
        </form>
        <div>
            <hr />
            {#if users.length > 0}
            <div>userある</div>
            <ul>
                {#each users as user}
                <div class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white-50 dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400">
                <li>id: {user.id}</li>
                <li>email: {user.email}</li>
                <li>name: {user.name}</li>
                <hr />
                <Label class="w-4/5 pb-2">アイコンアップロード</Label>
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