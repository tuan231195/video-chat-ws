import { CONFIG_TOKEN, createApp, RootLogger } from '@vdtn359/nestjs-bootstrap';
import { AppModule } from 'src/app.module';
import { Config as ConfigType } from 'src/config';
import { INestApplicationContext } from '@nestjs/common';

export async function bootstrap() {
	const app = await createApp(AppModule);
	const config: ConfigType = app.get(CONFIG_TOKEN);
	const logger = app.get(RootLogger);
	logger.info(`Config: ${config.toString()}`);

	return app;
}

let cachedApp: Promise<INestApplicationContext>;
export async function getApplication() {
	if (cachedApp) {
		return cachedApp;
	}
	cachedApp = bootstrap();

	return cachedApp;
}
