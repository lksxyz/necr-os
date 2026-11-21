<script lang="ts">
	import { issuesUrl, operator } from '#lib/site.ts';
</script>

<svelte:head>
	<title>Terms | NecrOS</title>
	<meta name="description" content="The terms for using NecrOS and its machines." />
</svelte:head>

<article class="prose">
	<h1>Terms of use</h1>
	<p class="updated">Last updated 21 November 2026.</p>
	<p>By using NecrOS you agree to these terms. {operator} runs the site.</p>

	<h2>Use of the site</h2>
	<p>
		NecrOS is free to use. It is provided as is, without any warranty. Machines can crash, saved
		states can be lost, and the site can change or go offline at any time. Do not keep anything in a
		machine that you cannot afford to lose.
	</p>

	<h2>Network use</h2>
	<p>Machines with network access must not be used to:</p>
	<ul>
		<li>send spam or bulk messages,</li>
		<li>scan, attack, or overload other systems,</li>
		<li>reach systems you are not allowed to reach,</li>
		<li>break the law where you or the target are.</li>
	</ul>
	<p>
		Mail ports and private networks are blocked. The relay may be limited or turned off if it is
		misused.
	</p>

	<h2>The machines and their software</h2>
	<p>
		Each operating system keeps its own license, listed on its label and on the
		<a href="/licenses">licenses page</a>. NecrOS is not affiliated with Microsoft, Bell Labs, ETH
		Zurich, or any other maker in the catalog. Product names belong to their owners.
	</p>

	<h2>The NecrOS code</h2>
	<p>The code of this site is released under the MIT license.</p>

	<h2>Takedown requests</h2>
	<p>
		If you hold rights to something served here and want it removed,
		<a href={issuesUrl}>open an issue on GitHub</a> naming the file.
	</p>
</article>
