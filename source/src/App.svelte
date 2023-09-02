
<script lang='ts'>
	
	import Card from './components/Card.svelte';
	import Swal from '../node_modules/sweetalert2/dist/sweetalert2.js';
	import type { ExposedCtx, ReminderData } from '../electron/shared/exposedCtx.cjs';
	import { ctx } from './context.js';
	let rems = ctx.getReminders();
	const now = new Date();
	let remindersWithNextDate: Array<ReminderData & { nextReminderDate:Date }> = [];
	$: remindersWithNextDate = rems.map(rem => {
		let nextReminderDate: Date = rem.dates[0];
		return {
			...rem,
			nextReminderDate
		}
	});
	ctx.onUpdate(() => {
		console.log('update');
		rems = ctx.getReminders();
	});
	function makeNewReminder() {
		const name = (document.getElementById('reminderName') as HTMLInputElement).value;
		if(name.length >= 90) {
			name.substring(0, 90);
		}
		const now = new Date();
		const endDate = new Date((document.getElementById('reminderDate') as HTMLInputElement).value);
		const dates: Date[] = [];
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const fourthDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
		const seventhDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
		dates.push(today);
		dates.push(tomorrow);
		dates.push(fourthDay);
		dates.push(seventhDay);
		while (dates[dates.length - 1] < new Date(endDate)) {
			const lastDate = dates[dates.length - 1];
			const nextDate = new Date(lastDate);
			nextDate.setDate(nextDate.getDate() + 30);
			dates.push(nextDate);
		}
		const filteredDates: Date[] = dates.filter(date => date < endDate);
		if (filteredDates.length !== 0) {
			ctx.addReminder({name, dates: filteredDates});
			console.log({name, dates: filteredDates});
			rems = ctx.getReminders();
		} else {
			Swal.fire({
				title: "Warning",
				text: "Date is invalid",
				confirmButtonClass: "btn btn-warning",
				icon: "error"
			});
		}
	}
</script>

<base href="./">
<main>
	<h1>Reminders due</h1>
	<div class="card-list">
		{#each remindersWithNextDate as rem}
			<!--
				Check if the next reminder date is today or before today.
			-->
			{#if rem.nextReminderDate <= now}
				<Card data={rem} dismissable={true} />
			{/if}
		{/each}
	</div>
	<h1>All reminders</h1>
	<div class="card-list">
		{#each remindersWithNextDate as rem}
			<Card data={rem} dismissable={false} />
		{/each}
	</div>
	<label for="reminderName">Reminder's name</label>
	<input type="text" name="reminderName" id="reminderName" placeholder="Name"><br>
	<label for="reminderDate">Reminder's end date</label>
	<input type="date" name="reminderDate" id="reminderDate"><br>
	<button id="" type="button" on:click={makeNewReminder}>Make new reminder</button>
	
</main>
<style>
	main {
		text-align: center;
		width: 100%;
		margin: 0 auto;
	}
	
	.card-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>