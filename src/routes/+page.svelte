<script lang="ts">
    // import type { ChangeEventHandler } from 'svelte/elements';
    import type { PageData } from './$types';
    // import type { SupabaseClient } from '@supabase/supabase-js'
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
    //
    // https://github.com/supabase/supabase/blob/master/examples/todo-list/sveltejs-todo-list/src/lib/TodoList.svelte
    const addTodo = async (taskText: string, name: string) => {
        let email = taskText.trim();
        if (email.length) {
            // 大文字小文字区別されれる
            let { data: todo, error } = await supabase
                .from("User")
                .insert({ email, name })
                .select()
                .single();

            if (error) {
                errorText = error.message;
                console.log(errorText);
            } else {
                // todos = [...todos, todo];
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
                // const filePath = `${inputElement.id}/${Math.random()}.${fileExt}`;
                const filePath = `${inputElement.id}.${fileExt}`;
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
               
                let myId = inputElement.id.toString()
                console.log(myId)
                // 画像のURLをDBに保存
                const { error: databaseError } = await supabase
                  .from('Post')
                  // .insert({ title: imageUrl, content: '画像', published: true })
                  .update({ content: imageUrl, published: true })
                  .eq('id', myId)
            }
        } catch(error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            //
            loadData()
        }
    }

    let loadedData: string | any[] = []
    let newTaskText = "";
    let email = "";


    async function loadData() {
        const { data: result } = await data.supabase.from('Post').select('*').limit(20)
        if (result != null) {
            loadedData = result
        }
    }

    $: if (data.session) {
        loadData()
    }
</script>
{#if data.session}
<p>client-side data fetching with RLS</p>
<!-- <pre>{JSON.stringify(loadedData, null, 2)}</pre> -->
{/if}

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style> 
<hr />
<a href="./auth" class="btn-black">ろぐいんだお</a>
<div class="flex">
    <div>
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>
        <form method="post" action="?/register" class="flex gap-2 my-2">
            <input
                class="rounded w-full p-2"
                type="text"
                placeholder="タイトル"
                name="title"
            />
            <input
                class="rounded w-full p-2"
                type="text"
                placeholder="ないよう"
                name="content"
            />
            <button type="submit" class="btn-black"> Add </button>
        </form>

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
            {#if loadedData.length > 0}
            <div>userある</div>
            <ul>
                {#each loadedData as item}
                <div class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white-50 dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400">
                    <li>title: {item.title}</li>
                    <li>content: {item.content}</li>
                    {#if item.content}
                      <!-- imageUrlがnullでない場合、画像を表示 -->
                      <img src={item.content} width="90" height="90" alt="がぞお" />
                    {:else}
                      <!-- imageUrlがnullの場合、代替のコンテンツを表示 -->
                      <p>画像はありません</p>
                    {/if}
                    <hr />
                    <form method="post" action="?/editPost" class="flex gap-2 my-2">
                        <input
                            class="rounded w-full p-2"
                            type="text"
                            name="postId"
                            value="{item.id.toString()}"
                            hidden
                        />
                        <input
                            class="rounded w-full p-2"
                            type="text"
                            placeholder="タイトル"
                            name="title"
                        />
                        <button type="submit" class="btn-black"> 編集 </button>
                    </form>
                    <hr />
                    <Label class="w-4/5 pb-2">アイコンアップロード</Label>
                    <input
                        id="{item.id.toString()}"
                        class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        accept="image/*"
                        on:change={uploadIcon}
                    />

                    <form method="post" action="?/delPost" class="flex gap-2 my-2">
                        <input type="hidden" name="_method" value="DELETE">
                        <input
                            class="rounded w-full p-2"
                            type="text"
                            placeholder="おなまえ"
                            name="itemId"
                            value="{item.id}"
                            hidden
                        />
                        <button type="submit" class="btn-black">画像削除</button>
                    </form>
                </div>
                {/each}
            </ul>
            {:else}
                <div>ない</div>
            {/if}
            <hr />
            <div>=============</div>
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
                        id="{user.id.toString()}"
                        class="w-4/5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        accept="image/*"
                        on:change={uploadIcon}
                    />

                    <form method="post" action="?/del" class="flex gap-2 my-2">
                        <input type="hidden" name="_method" value="DELETE">
                        <input
                            class="rounded w-full p-2"
                            type="text"
                            name="userId"
                            value="{user.id}"
                            hidden
                        />
                        <button type="submit" class="btn-black">削除する</button>
                    </form>
                </div>
                {/each}
            </ul>
            {:else}
                <div>ない</div>
            {/if}
        </div>
    </div>
</div>