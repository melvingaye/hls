export function camelCase(value: string): string {
	const camelUpper = (a: string) =>
		a
			.split('_')
			.map((entry, index) => (index > 0 ? entry[0].toUpperCase() + entry.slice(1) : entry))
			.join('');
	return value.includes('_') ? camelUpper(value) : value;
}
