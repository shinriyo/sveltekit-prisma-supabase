import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from "@sveltejs/kit";
// import { handle } from '../../src/hooks.server';

// 参考になる記事
// https://tech-blog.rakus.co.jp/entry/20230209/sveltekit

export const actions: Actions = {
	delPost: async ({request, locals, params}) => {
		const data = await request.formData();
        const itemId = data.get("itemId");
		try {
			const deletedPost = await prisma.post.delete({
				where: {
					id: parseInt(itemId?.toString()!),
				},
			});
			let content = deletedPost.content;
			if (content != null) {
				const pathSegments = content.split('/');
				const fileName = pathSegments[pathSegments.length - 1];
				const { data, error } = await locals.supabase.storage
					.from('avatars')
					.remove([fileName]);
				console.log(data);
				console.log(error);
			}

			return {
				body: {
					message: 'Postが削除されました。',
					user: deletedPost,
				},
			};
		} catch (error) {
			console.log(error)
			if (error instanceof Error) {
				return {
					status: 500,
					body: {
						message: 'Postの削除中にエラーが発生しました。',
						error: error.message,
					},
				};
			}
		}
	},
    editPost: async ({request, locals, params}) => {
		const data = await request.formData();
        const postId = data.get("postId");
        const title = data.get("title");
		if (title == null) {
			return
		 }

		try {
			const deletedUser = await prisma.post.update({
				where: {
					id: parseInt(postId?.toString()!),
				},
				data: {
					id: Number(postId),
					title: title.toString(),
				},
			});

			return {
				body: {
					message: 'ユーザーが削除されました。',
					user: deletedUser,
				},
			};
		} catch (error) {
			console.log(error)
			if (error instanceof Error) {
				return {
					status: 500,
					body: {
						message: 'ユーザーの削除中にエラーが発生しました。',
						error: error.message,
					},
				};
			}
		}
	},
    del: async ({request, locals, params}) => {
		const data = await request.formData();
        const userId = data.get("userId");
		// console.log(request.params)
		// const userId = request.params.userId; // 削除対象のユーザーID
		console.log(userId)

		try {
			const deletedUser = await prisma.user.delete({
				where: {
					id: parseInt(userId?.toString()!),
				},
			});

			return {
				body: {
					message: 'ユーザーが削除されました。',
					user: deletedUser,
				},
			};
		} catch (error) {
			console.log(error)
			if (error instanceof Error) {
				return {
					status: 500,
					body: {
						message: 'ユーザーの削除中にエラーが発生しました。',
						error: error.message,
					},
				};
			}
		}
	},
    register : async ({request}) => {
        const data = await request.formData();
        // const name = data.get("name");
        // const email = data.get("email");
        const content = data.get("content");
        const title = data.get("title");

        // if (typeof name !== "string" ||typeof email !== "string" || !name || !email) {
        //     return fail(400, { message: "名前・パスワードは必須です。" })
        // }
        if (typeof content !== "string" || !content || typeof title !== "string" || !title) {
        	return fail(400, { message: "contentは必須です。" })
		}

        // const user = await prisma.user.findUnique({
        //     where: {name}
        // })

        // if (user) {
        //     return fail(400, { message: "既に存在するユーザーです。" })
        // }
        
        // await prisma.user.create({
        await prisma.post.create({
            data: {
                // name,
                // email : await bcrypt.hash(password, 10),
				title,
				content,
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
