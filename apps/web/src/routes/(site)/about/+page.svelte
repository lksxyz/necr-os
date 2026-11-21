<svelte:head>
	<title>About | NecrOS</title>
</svelte:head>

<article>
	<h1>About NecrOS</h1>
	<p>
		NecrOS is a catalog of old operating systems that still boot. Each machine gets its own page at
		<code class="mono">/os/name</code> that fills the window, so using it feels like sitting at the
		computer.
	</p>
	<p>
		The machines run on <a href="https://github.com/copy/v86">v86</a>, an x86 emulator compiled to
		WebAssembly. Disk images are served from this site, and large disks are split into parts so a
		machine downloads only what it reads.
	</p>
	<p>
		Each label in the catalog lists the license of the system it describes. Images come from the v86
		project's image collection.
	</p>
</article>

<style>
	article {
		display: grid;
		gap: 20px;
		max-width: 60ch;
	}

	h1 {
		font-size: clamp(2.25rem, 5vw, 3.25rem);
		font-weight: 700;
		margin-bottom: 12px;
	}

	p {
		font-size: 17px;
		line-height: 1.6;
	}

	code {
		background: var(--surface);
		padding: 1px 5px;
		border-radius: var(--r-badge);
		font-size: 0.9em;
	}
</style>
