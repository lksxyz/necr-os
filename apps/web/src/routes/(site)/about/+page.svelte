<script lang="ts">
	import { operator, repoUrl } from '#lib/site.ts';
</script>

<svelte:head>
	<title>About | NecrOS</title>
	<meta name="description" content="What NecrOS is, how the machines run, and who built it." />
</svelte:head>

<article class="prose">
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
		Each label in the catalog lists the license of the system it describes. The
		<a href="/licenses">licenses page</a> links to the source of every machine and every library the
		site uses.
	</p>
	<p>
		{operator} built NecrOS for the Kiroween 2026 hackathon. The source code is on
		<a href={repoUrl}>GitHub</a> under the MIT license.
	</p>
</article>
