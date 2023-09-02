import { ReminderData } from "./shared/exposedCtx.cjs";
/// <reference types="electron-store" />

const Store = require('electron-store');
const { truncateToDay } = require('./helpers.cjs');
const store = new Store();

class ReminderStorage {
	private reminders: ReminderData[];

	constructor() {
		this.getReminders();
	}

	private saveReminders() {
		console.log('saving reminders', this.reminders);
		const serialized = this.reminders.map((reminder) => {
			return {
				name: reminder.name,
				dates: reminder.dates.map((date) => date.toISOString())
			};
		});
		store.set('reminders', serialized);
	}

	getReminders() {
		const serialized = store.get('reminders');
		if (serialized) {
			this.reminders = serialized.map((reminder) => {
				console.log(reminder.name.length);
				if((reminder.name).length >= 90){
					return {
						name: (reminder.name).substring(0,90),
						dates: reminder.dates.map((date) => new Date(date))
					}
				} else {
					return {
						name: reminder.name,
						dates: reminder.dates.map((date) => new Date(date))
					};
				}
			});
		} else {
			this.reminders = [];
		}
		this.saveReminders();
		return this.reminders;
	}

	addReminder(reminder: ReminderData) {
		console.log('adding reminder', reminder);
		this.reminders.push(reminder);
		this.saveReminders();
	}
	
	removeReminder(reminderName: string) {
		this.reminders = this.reminders.filter((reminder) => reminder.name !== reminderName);
		this.saveReminders();
	}

	dismissReminder(reminderName: string) {
		this.getReminders();
		
		const reminder = this.reminders.find((reminder) => reminder.name === reminderName);
		if (reminder) {
			// filter all dates that are in the past (or today)
			const today = truncateToDay(new Date());

			reminder.dates = reminder.dates.filter(
				(date) => truncateToDay(date) > today
			);
			if(reminder.dates.length === 0) {
				this.removeReminder(reminderName);
			}
			this.saveReminders();
		} else {
			console.log('reminder not found');
		}
	}
}

export const reminderStorage = new ReminderStorage();