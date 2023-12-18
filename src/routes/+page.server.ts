import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from "@sveltejs/kit";

// 参考になる記事
// https://tech-blog.rakus.co.jp/entry/20230209/sveltekit

export const actions: Actions = {
    del: async ({request}) => {
		const userId = request.params.userId; // 削除対象のユーザーID

		try {
			const deletedUser = await prisma.user.delete({
				where: {
					id: userId,
				},
			});

			return {
				body: {
					message: 'ユーザーが削除されました。',
					user: deletedUser,
				},
			};
		} catch (error) {
			return {
				status: 500,
				body: {
					message: 'ユーザーの削除中にエラーが発生しました。',
					error: error.message,
				},
			};
		}
	},
    register : async ({request}) => {
        const data = await request.formData();
        const name = data.get("name");
        const email = data.get("email");

        if (typeof name !== "string" ||typeof email !== "string" || !name || !email) {
            return fail(400, { message: "名前・パスワードは必須です。" })
        }

        // const user = await prisma.user.findUnique({
        //     where: {name}
        // })

        // if (user) {
        //     return fail(400, { message: "既に存在するユーザーです。" })
        // }
        
        await prisma.user.create({
            data: {
                name,
                // email : await bcrypt.hash(password, 10),
                email
                // authToken: crypto.randomUUID(),
            },
        })

        // throw redirect(303, '/login')
    }
}

export const load = (async () => {
	return {
		users: await prisma.user.findMany()
	};
}) satisfies PageServerLoad;
