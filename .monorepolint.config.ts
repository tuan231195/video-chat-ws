/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-explicit-any,  sonarjs/no-duplicate-string, no-template-curly-in-string */
const { exec } = require('shelljs');

const getPackagesMatching = (glob: string) => {
	try {
		const packages = JSON.parse(exec(`pnpm ls --filter '${glob}' --json`, { silent: true }).stdout);
		return packages.map((p: any) => p.name);
	} catch (err) {
		return [];
	}
};

module.exports = {
	rules: {
		':file-contents': [
			{
				options: {
					file: 'jest.config.cjs',
					templateFile: '.monorepolint/templates/jest.config.cjs',
				},
			},
			{
				options: {
					file: '.eslintignore',
					templateFile: '.monorepolint/templates/.eslintignore',
				},
			},
			{
				options: {
					file: '.eslintrc.cjs',
					templateFile: '.monorepolint/templates/.eslintrc.cjs',
				},
			},
			{
				options: {
					file: '.release-it.cjs',
					templateFile: '.monorepolint/templates/.release-it.cjs',
				},
			},
			{
				options: {
					file: 'Dockerfile',
					templateFile: '.monorepolint/templates/Dockerfile',
				},
			},
			{
				options: {
					file: 'tsconfig.json',
					templateFile: '.monorepolint/templates/tsconfig.json',
				},
			},
			{
				options: {
					file: '.node-dev.json',
					templateFile: '.monorepolint/templates/.node-dev.json',
				},
				includePackages: getPackagesMatching('./components/*'),
			},
		],
		':package-script': [
			{
				options: {
					scripts: {
						clean: 'rm -rf dist',
						default: 'echo default',
						lint: 'eslint . --max-warnings=0',
						test: 'jest --passWithNoTests',
						patch: 'release-it -i patch --ci -VV',
						release: 'release-it --ci -VV',
						'plan-release': 'release-it --ci --dry-run -VV',
						watch: 'rm -rf dist && swc --config-file ../../.swcrc ./src -d dist -w',
					},
				},
			},
			{
				options: {
					scripts: {
						build: 'swc --config-file ../../.swcrc ./src -d dist',
						tsc: 'rm -rf dist && tsc',
					},
				},
				includePackages: getPackagesMatching('./packages/*'),
			},
			{
				options: {
					scripts: {
						'publish-package': 'pnpm publish --no-git-checks',
						start: 'npm run watch',
						build: 'swc --config-file ../../.swcrc ./src -d dist',
						tsc: 'rm -rf dist && tsc',
					},
				},
				includePackages: getPackagesMatching('./packages/*'),
			},
		],
		':package-order': true,
		':alphabetical-dependencies': true,
	},
};
