<script lang="ts">
	import type { ExposedCtx, ReminderData } from "../../electron/shared/exposedCtx.cjs";
	import Swal from '../../node_modules/sweetalert2/dist/sweetalert2.js';
	export let data: ReminderData & { nextReminderDate: Date | undefined } | undefined;
	export let dismissable: boolean | undefined;
	if (dismissable === undefined) {
		dismissable = false;
	}
	const currentDate = new Date();
	let nextReminderDate: Date;
	$: nextReminderDate = data?.nextReminderDate;
	if (nextReminderDate === undefined) {
		nextReminderDate = new Date();
	}
	console.log(data, nextReminderDate);
	function dismissReminder() {
		console.log('DISMISSIUM REMINDIUM');
		let audio = <HTMLAudioElement> document.getElementById('audioding');
		audio.play();
		audio.currentTime = 0;
		window.electron.dismissReminder(data.id);
		Swal.fire({
			toast: true,
			showConfirmButton: false,
			position: 'top',
			timer: '3000',
			icon: 'success',
			title: 'Reminder dismissed'
		});
	}

	let delBtn: HTMLButtonElement;
	let delCheck: HTMLInputElement;
	function updateDelBtn() {
		delBtn.disabled = !delCheck.checked;
	}
	function deleteReminder() {
		Swal.fire({
			text: 'Are you sure you want to delete',
			icon: 'question',
			confirmButtonText: 'DELETE',
			denyButtonText: 'Cancel',
			showDenyButton: 'true'
		}).then((result) => {
			if(result.isConfirmed) {
				console.log('DELETIUM REMINDIUM');
				window.electron.removeReminder(data.id);
			} else {
				console.log('Deletion canceled');
			}
		})
		delCheck.checked = false;
	}
</script>

<div class="card">
	<h2>{data.name}</h2>
	<div class="carddata">
		<p>Next reminder: {nextReminderDate.toLocaleDateString()}</p>
		{#if dismissable }
			<div>
				<button on:click={dismissReminder} type="button">Dismiss</button>
			</div>
		{/if}
		<button bind:this={delBtn} on:click={deleteReminder} value="1" disabled type="button" id="delBtn">Delete</button>
		<input bind:this={delCheck} on:click={updateDelBtn} type="checkbox" id="delCheck">
	</div>
</div>

<style>
	div.card {
		border: 1px solid black;
		border-radius: 5px;
		padding: 10px;
		margin: 10px;
		box-shadow: 3px 3px 3px 3px #888888;
		transition: 0.5s;
		width: 210px;
		height: 400px;
	}
	div.card h2 {
		margin-bottom: 20%;
		height: 50%;
		align-self: center;
		overflow-wrap: break-word;
	}
	div.carddata {
		height:50%;
	}
	div.card:hover {
		box-shadow: 5px 5px 3px 3px #888888;
		transform: translate(-2px, -2px);
	}
</style>