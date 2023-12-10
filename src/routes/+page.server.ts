import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		users: await prisma.user.findMany()
	};
}) satisfies PageServerLoad;
