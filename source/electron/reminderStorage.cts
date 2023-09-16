import { ReminderData } from "./shared/exposedCtx.cjs";
import { v4 as uuidv4 } from 'uuid';
/// <reference types="electron-store" />

import Store = require('electron-store');
import Helpers = require('./helpers.cjs');
const { truncateToDay } = Helpers;
const globalStore = new Store();

export class ReminderStorage {
	private reminders: ReminderData[];
	private store: Store;
	constructor(store: Store) {
		this.store = store;
		this.reminders = [];
		//throw this.store['mock'];
		this.getReminders();
	}

	private saveReminders() {
		console.log('saving reminders', this.reminders);
		const serialized = this.reminders.map((reminder) => {
			return {
				name: reminder.name,
				id: reminder.id,
				dates: reminder.dates.map((date) => date.toISOString())
			};
		});
		this.store.set('reminders', serialized);
	}

	getReminders() {
		const serialized = this.store.get('reminders');
		if(serialized === undefined) {
			this.saveReminders();
			return this.reminders;
		}
		if(!Array.isArray(serialized)) throw new Error('reminders is not an array, it is ' + JSON.stringify(serialized));
		if (serialized) {
			this.reminders = serialized.map((reminder) => {
				if (reminder.id !== null && reminder.id !== undefined) {
					return {
						name: reminder.name,
						id: reminder.id,
						dates: reminder.dates.map((date) => new Date(date))
					};
				} else if (reminder.id === null || reminder.id === undefined) {
					reminder.id = uuidv4();
					return {
						name: reminder.name,
						id: reminder.id,
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
	
	removeReminder(reminderId: typeof uuidv4) {
		this.reminders = this.reminders.filter((reminder) => reminder.id !== reminderId);
		this.saveReminders();
	}

	dismissReminder(reminderId: typeof uuidv4) {
		this.getReminders();
		
		const reminder = this.reminders.find((reminder) => reminder.id === reminderId);
		if (reminder) {
			// filter all dates that are in the past (or today)
			const today = truncateToDay(new Date());

			reminder.dates = reminder.dates.filter(
				(date) => truncateToDay(date) > today
			);
			if(reminder.dates.length === 0) {
				this.removeReminder(reminderId);
			}
			this.saveReminders();
		} else {
			console.log('reminder not found');
		}
	}
}

export const reminderStorage = new ReminderStorage(globalStore);