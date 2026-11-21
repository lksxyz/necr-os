<script lang="ts">
	import { issuesUrl, operator } from '#lib/site.ts';
</script>

<svelte:head>
	<title>Privacy | NecrOS</title>
	<meta name="description" content="What NecrOS stores in your browser, and what passes through its servers." />
</svelte:head>

<article class="prose">
	<h1>Privacy</h1>
	<p class="updated">Last updated 21 November 2026.</p>
	<p>
		NecrOS has no accounts, no analytics, and no advertising. It sets no cookies. {operator} runs the
		site.
	</p>

	<h2>What stays in your browser</h2>
	<ul>
		<li>
			Your screen effect choice, in local storage under the key <code class="mono">necros:effect</code>.
		</li>
		<li>
			Whether you closed the notice bar at the top, under the key
			<code class="mono">necros:notice:v1</code>.
		</li>
		<li>
			Saved states, in the browser database <code class="mono">necros</code>. Each one holds a copy of a
			machine's memory and disks, including anything you typed into it.
		</li>
	</ul>
	<p>
		These are written only when you use those features, and none of them is sent anywhere. To remove a
		saved state, press its delete button on the machine page. To remove everything, clear this
		site's data in your browser settings.
	</p>

	<h2>What passes through the servers</h2>
	<p>
		The site runs on Cloudflare. Like any host, Cloudflare receives your IP address and browser
		details with each request to deliver the page and protect it from abuse. NecrOS does not read or
		keep those records.
	</p>
	<p>
		When Linux 2.6 or Linux 6.8 uses the network, its connections go through a relay that NecrOS runs
		on Cloudflare. The relay opens the connection the machine asks for and passes the data along. It
		does not log the addresses or the data.
	</p>

	<h2>Links to other sites</h2>
	<p>
		Links to GitHub, X, and the source of each machine leave NecrOS. Those sites have their own
		privacy policies.
	</p>

	<h2>Questions</h2>
	<p>
		<a href={issuesUrl}>Open an issue on GitHub</a>. Issues are public, so do not post personal
		details there.
	</p>
</article>
