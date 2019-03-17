export function createID(argument) {
	return ((new Date()).getTime().toString(16).slice(2))
}