# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


# prismaをいい感じに

npx prisma format

https://zenn.dev/shimabukuromeg/scraps/51ea9b884fc607


デバッグコンソールで　front.js:8 Uncaught ReferenceError: browser is not defined　出る。
プラグインのせいらしい。


# Auth

Sveltekit × supabase で認証機能を作る


```
#       modified:   src/hooks.server.ts
#       modified:   src/routes/+page.svelte
#       new file:   src/routes/api/protected-route/+server.ts
#       new file:   src/routes/auth/+page.svelte
#       new file:   src/routes/auth/callback/+server.ts
#       new file:   src/routes/login/+page.server.ts
#       new file:   src/routes/login/+page.svelte
#       new file:   src/routes/posts/+page.server.ts
#       new file:   src/routes/profile/+page.svelte
#       new file:   src/routes/profile/+page.ts
``

管理画面

https://supabase.com/dashboard/project/srubwrrvsvnxdktwmuxj/auth/users


# ログインここ参考にした

https://supabase.com/docs/guides/auth/auth-helpers/sveltekit



http://localhost:5173/auth

# カラムの追加

https://zenn.dev/thirosue/books/49a4ee418743ed/viewer/57d161

```
npx prisma migrate dev --name add_tel_to_user
```

userにtel追加したい

# buildする

```
npm run build
```

いかにできる
```
.svelte-kit/
```

参考:
https://qiita.com/jwnr/items/740335cfb7d8e000c749
