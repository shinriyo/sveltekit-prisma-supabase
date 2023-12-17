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
            }
        } catch(error) {
            alert(error.message)
            // if (error instanceof Error) {
            //     alert(error.message)
            // }
        } finally {
            //
                
            // TODO: 画像のURLをDBに保存
            // const { error: databaseError } = await supabase
            //   .from('my_table')
            //   .insert({ imageUrl: imageUrl })
        }
    }

    let loadedData = []


    async function loadData() {
        const { data: result } = await data.supabase.from('test').select('*').limit(20)
        loadedData = result
    }

    $: if (data.session) {
        loadData()
    }

    // FIXME: 後で消す
    const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
      ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得
    const filePath = `my_folder/${file.name}` // 画像の保存先のpathを指定
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    if (error) {
      // ここでエラーハンドリング
    }

    // 画像のURLを取得
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const imageUrl = data.publicUrl
    console.log(imageUrl)
    
    // TODO: 画像のURLをDBに保存
    // const { error: databaseError } = await supabase
    //   .from('my_table')
    //   .insert({ imageUrl: imageUrl })
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
        <input type="file" onChange={handleImageChange} />
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