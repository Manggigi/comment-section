export const load = async ({ params }) => {
	const { username } = params;
	return { username };
};
