/// <reference types="electron" />
const { contextBridge, ipcRenderer } = require('electron');
import type { ExposedCtx } from "./shared/exposedCtx.cjs";

// TODO remove
const tommorow = new Date();
tommorow.setDate(tommorow.getDate() + 1);

const exposee: ExposedCtx = {
    addReminder: (reminder) => {
		ipcRenderer.send('addReminder', reminder);
	},
    removeReminder: (reminderId) => {
		ipcRenderer.send('removeReminder', reminderId);
	},
    getReminders: () => {
		return ipcRenderer.sendSync('getReminders');
	},
    dismissReminder: (reminderId) => {
        ipcRenderer.send('dismissReminder', reminderId);
		console.log('dismissed reminder', reminderId);
    },
	onUpdate: (callback) => {
		ipcRenderer.on('update', callback);
	}
};


contextBridge.exposeInMainWorld(
    'electron',
    exposee
);

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
});