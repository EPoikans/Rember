import type { v4 as uuidv4 } from 'uuid';

export type ReminderData = {
    name: string;
    id: typeof uuidv4;
    dates: Date[];
}

export interface ExposedCtx {
    addReminder: (reminder: ReminderData) => void;
    removeReminder: (reminderId: typeof uuidv4) => void;
    getReminders: () => ReminderData[];
    dismissReminder: (reminderId: typeof uuidv4) => void;
	onUpdate: (callback: () => void) => void;
}

