
<script lang='ts'>
	
	import Card from './components/Card.svelte';
	import type { ExposedCtx, ReminderData } from '../electron/shared/exposedCtx.cjs';
	import { ctx } from './context.js';
	import { makeNewReminder } from './App.logic.js';
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
	<button id="" type="button" on:click={() => rems = makeNewReminder(ctx)}>Make new reminder</button>
	<label for="schedule">Choose a schedule</label>
	<select name="schedule" id="schedule">
		<option value="1-2-3-7-30_schedule">1-2-4-7-30</option>
		<option value="daily_schedule">Every day</option>
		<option value="otherday_schedule">Every other day</option>
		<option value="weekly_schedule">Every week</option>
		<option value="biweekly_schedule">Every other week</option>
		<option value="monthly_schedule">Every month</option>
	</select>
	
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