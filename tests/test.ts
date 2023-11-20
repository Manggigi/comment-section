import { expect, test } from '@playwright/test';

// test('index page has expected h1', async ({ page }) => {
// 	await page.goto('/');
// 	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
// });

test.describe('UserPost component', () => {
	test('renders UserPost component with correct content', async ({ page }) => {
		await page.goto('/');

		// Check for avatar image
		const avatar = await page.$('img[src="/avatar.webp"]');
		expect(avatar).toBeTruthy();

		// Check for user name
		const userName = await page.$('text=Gian Denorte');
		expect(userName).toBeTruthy();

		// Check for user description
		const userDescription = await page.$(
			"text=I'm Gian, a Manila-based software engineer specializing in front-end development. I excel in Svelte, React, and modern web tech, crafting engaging interfaces and seamless user experiences to bring designs to life and solve complex challenges."
		);
		expect(userDescription).toBeTruthy();

		// Check for time ago
		const timeAgo = await page.$('text=' + '23 years ago');
		expect(timeAgo).toBeTruthy();
	});
});

// TODO: test for comment component

// TODO: test for reply component

// TODO: test for comment form component
