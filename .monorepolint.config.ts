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
						build: 'swc --config-file ../../.swcrc ./src -d dist',
						test: 'jest --passWithNoTests',
						tsc: 'rm -rf dist && tsc',
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
						package: 'npm run prepare-workspace && npm run docker',
						'prepare-workspace':
							'pnpm-isolate-workspace . --src-less-disable --src-less-prod-disable --workspaces-exclude-glob=src --src-files-exclude-glob=src --src-files-enable',
						docker: 'DOCKER_BUILDKIT=1 docker build -t ${npm_package_config_docker}:${npm_package_version} . && docker tag ${npm_package_config_docker}:${npm_package_version} ${npm_package_config_docker}:latest',
					},
				},
				includePackages: getPackagesMatching('./components/*'),
			},
			{
				options: {
					scripts: {
						'publish-package': 'pnpm publish --no-git-checks',
					},
				},
				includePackages: getPackagesMatching('./packages/*'),
			},
		],
		':package-order': true,
		':alphabetical-dependencies': true,
	},
};
