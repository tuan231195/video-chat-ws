declare let navigator: any;
export const getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia).bind(
	navigator
);
