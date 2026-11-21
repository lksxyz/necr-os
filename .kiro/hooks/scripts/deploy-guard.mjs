let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
	let command = '';
	try {
		const event = JSON.parse(input);
		command = event?.tool_input?.command ?? event?.toolInput?.command ?? '';
	} catch {
		return;
	}
	if (typeof command !== 'string') return;

	// Only a real invocation: at the start of the command or after ;, &&, ||, |, or a newline.
	// Text that merely mentions the command (a heredoc, a commit message) is left alone.
	const invoked = /(^|[;&|\n]\s*)pnpm\s+(run\s+)?deploy(\s|$)/.test(command);
	if (invoked) {
		process.stderr.write(
			'Blocked: pnpm deploy waits for an approval prompt this shell cannot answer. Run `pnpm exec alchemy deploy --yes` instead.\n'
		);
		process.exit(2);
	}
});
