export const normalize = (text: string): string  => {
	return text.toLowerCase().normalize("NFKD");
}

export const scoreMatch = (query: string, target: string): number => {
	if (!query) return 0;
	const q = normalize(query);
	const t = normalize(target);
	if (t.includes(q)) return q.length / t.length + 0.5;
	let qi = 0;
	for (let ti = 0; ti < t.length && qi < q.length; ti++) {
		if (t[ti] === q[qi]) qi++;
	}
	return qi === q.length ? q.length / t.length : -1;
}
