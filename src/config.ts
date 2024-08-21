export const getApiUrl = {
	production: false,
	apiUrl:
		window.location.protocol +
		'//' +
		(window.location.hostname === 'localhost' ? window.location.hostname + ':3000' : 'api.' + window.location.hostname),
};
