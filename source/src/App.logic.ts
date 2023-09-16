
import type { ExposedCtx, ReminderData } from "../electron/shared/exposedCtx.cjs";
import Swal from '../node_modules/sweetalert2/dist/sweetalert2.js';
import { v4 as uuidv4 } from '../node_modules/uuid';

function makeSchedule(dates: Date[], endDate: Date, today: Date, step: number){
	while (dates[dates.length - 1] < new Date(endDate)) {
		const lastDate = dates[dates.length - 1];
		const nextDate = new Date(lastDate);
		nextDate.setDate(nextDate.getDate() + step);
		dates.push(nextDate);
	}
	return dates;
}

export function makeNewReminder(ctx: ExposedCtx): ReminderData[] {
	const name = (document.getElementById('reminderName') as HTMLInputElement).value;
		const schedule = (document.getElementById('schedule') as HTMLInputElement).value;
		const now = new Date();
		const endDate = new Date((document.getElementById('reminderDate') as HTMLInputElement).value);
		const dates: Date[] = [];
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		dates.push(today);
		if (schedule === "1-2-3-7-30_schedule") {	
			const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			const fourthDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
			const seventhDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
			dates.push(tomorrow);
			dates.push(fourthDay);
			dates.push(seventhDay);
			makeSchedule(dates, endDate, today, 30);
		} else if (schedule === "daily_schedule"){
			makeSchedule(dates, endDate, today, 1);
		} else if (schedule === "otherday_schedule"){
			makeSchedule(dates, endDate, today, 2);
		} else if (schedule === "weekly_schedule"){
			makeSchedule(dates, endDate, today, 7);
		} else if (schedule === "biweekly_schedule"){
			makeSchedule(dates, endDate, today, 14);
		} else if (schedule === "monthly_schedule"){
			makeSchedule(dates, endDate, today, 30);
		}
		const filteredDates: Date[] = dates.filter(date => date < endDate);
	if (filteredDates.length !== 0) {
		const reminderId = uuidv4();
		ctx.addReminder({name, id: reminderId, dates: filteredDates});
		console.log({name, reminderId, dates: filteredDates});
	} else {
		Swal.fire({
			title: "Warning",
			text: "Date is invalid",
			confirmButtonClass: "btn btn-warning",
			icon: "error"
		});
	}
	return ctx.getReminders();
}