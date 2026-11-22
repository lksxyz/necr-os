<script lang="ts">
	import { issuesUrl } from '#lib/site.ts';
</script>

<svelte:head>
	<title>Help | NecrOS</title>
	<meta name="description" content="How to boot a machine, use the mouse and keyboard, and save your progress." />
</svelte:head>

<article class="prose">
	<h1>Help</h1>
	<p>
		Each machine page has a short hint for its first step. This page covers the controls that every
		machine shares.
	</p>

	<h2>Boot a machine</h2>
	<p>
		Open a machine from the <a href="/os">catalog</a> and press its Boot button. The machine downloads
		its disk first; the label shows how big the download is. Disks loaded in parts download only
		what the machine reads, so they start sooner than their full size suggests.
	</p>

	<h2>Mouse and keyboard</h2>
	<ul>
		<li>Click the screen to capture the mouse. Press Esc to release it.</li>
		<li>Keys go to the machine, except while you type in the serial console.</li>
		<li>
			Use Send Ctrl+Alt+Del instead of pressing those keys, because your own computer would catch the
			shortcut first.
		</li>
	</ul>

	<h2>Layouts and the serial console</h2>
	<p>
		The Screen, Screen and console, and Console tabs choose what fills the stage. Some machines write
		to their serial port instead of the screen. Click inside the serial console to type into it.
	</p>

	<h2>Saved state</h2>
	<p>
		Save state stores the running machine's memory and disks in this browser, one state per machine.
		Load state brings it back later, even after you close the tab. The delete button next to them
		removes it. Saved states can be tens of megabytes, and the browser may refuse one that does not
		fit in its storage.
	</p>

	<h2>Screen and sound</h2>
	<ul>
		<li>Screen effect switches between Sharp, CRT, and Green phosphor. The site remembers your choice.</li>
		<li>Drive noise plays a synthesized drive sound while the disk is read.</li>
		<li>Mute sound and the volume slider control everything the machine plays.</li>
		<li>Fullscreen fills your whole display with the machine's screen.</li>
	</ul>

	<h2>Network</h2>
	<p>Linux 2.6 and Linux 6.8 can reach the internet. On Linux 6.8:</p>
	<ul>
		<li>
			Log in as <code class="mono">root</code>, no password. The shell runs on the serial console.
		</li>
		<li>
			Run <code class="mono">udhcpc -i eth0</code>. The emulator's own DHCP server answers with
			192.168.86.100; DNS is 192.168.86.1. <code class="mono">ip a show eth0</code> shows the
			address.
		</li>
		<li>
			Fetch a page with plain HTTP:
			<code class="mono">wget -O - http://httpbin.org/robots.txt</code>. The image's BusyBox has no
			TLS, so <code class="mono">https://</code> URLs fail.
		</li>
		<li>
			<code class="mono">/mnt</code> is a 9p share mounted read-write. This site has no file
			transfer controls, so it stays empty.
		</li>
	</ul>
	<p>
		TCP leaves through a relay this site runs on Cloudflare Workers. Mail ports and private networks
		are blocked. The <a href="/terms">terms</a> list what the network may be used for.
	</p>

	<h2>Something does not work</h2>
	<p>
		<a href={issuesUrl}>Open an issue on GitHub</a>. Say which machine you booted, which browser you
		used, and what you saw on the screen.
	</p>
</article>
