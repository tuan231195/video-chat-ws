export function generateAvatar(seed: string, type = 'icons') {
	return `https://api.dicebear.com/5.x/${type}/svg?seed=${seed}`;
}
