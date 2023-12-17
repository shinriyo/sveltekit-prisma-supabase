<!-- // src/routes/auth/+page.svelte -->
<script>
  export let data
  let { supabase } = data
  $: ({ supabase } = data)

  let email
  let password

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

<form on:submit="{handleSignUp}">
  <input type="text" name="email" bind:value="{email}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
  <input type="password" name="password" bind:value="{password}"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
  <button>Sign up</button>
</form>

<button on:click="{handleSignIn}">Sign in</button>
<button on:click="{handleSignOut}">Sign out</button>
