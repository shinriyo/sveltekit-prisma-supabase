<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
  export let data
  let { supabase } = data
  $: ({ supabase } = data)

  import { Heading, Input, Label } from "flowbite-svelte";
  import FaRegEyeSlash from 'svelte-icons/fa/FaRegEyeSlash.svelte'
  import FaRegEye from 'svelte-icons/fa/FaRegEye.svelte'
  let email = ''
  let password = ''
  let passwordFormType: 'password' | 'text' = 'password'
  let viewPassword = false

  const clickHandler = (): void => {
    viewPassword = !viewPassword
    if (viewPassword) passwordFormType = 'text'
    else passwordFormType = 'password'
  }

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
</script>

<!-- ログインフォーム後で参考にしたい -->
<!-- https://qiita.com/maaaashi/items/fbeb32b4ec1663fc1383 -->
<form on:submit="{handleSignUp}">
  <input type="text" name="email" bind:value="{email}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
  <input type="password" name="password" bind:value="{password}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
  <button>Sign up</button>
</form>

<button on:click="{handleSignIn}">Sign in</button>
<button on:click="{handleSignOut}">Sign out</button>

<div class="h-full w-4/5 mx-auto mt-10 p-5 border bg-gray-100 rounded-lg">
  <form action="login">
    <div class="text-center">
      <Heading tag="h3">SignIn</Heading>
    </div>
    <Label for="email">email</Label>
    <Input
      id="email"
      bind:value={email}
      type="email"
    />

    <Label for="password">password</Label>
    <Input
      id="password"
      bind:value={password}
      type={passwordFormType}
    >
      <button type="button" class="h-1/2" slot="right" on:click={clickHandler}>
        {#if viewPassword}
          <FaRegEye />
          {:else}
          <FaRegEyeSlash />
        {/if}
      </button>
    </Input>
  </form>
</div>
