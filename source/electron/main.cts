/// <reference types="electron" />
export function Rember(app: Electron.App) {
	const { BrowserWindow, Menu, Tray, nativeImage } = require('electron');
	const path = require('path');
	require('./ipcHandler.cjs');

	let tray: Electron.CrossProcessExports.Tray | null = null;
	let mainWindow: Electron.BrowserWindow | null = null;
	function getMainWindow() {
		return mainWindow;
	}
	function clearMainWindow() {
		mainWindow = null;
	}
	function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
		preload: path.join(__dirname, 'preload.cjs')
		},
		
	});
	mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
	mainWindow.on('closed', (event) => {
		event.preventDefault();
		console.log('closed main window');
		clearMainWindow();
		console.log('checking close');
	});
	}

	function checkClose() {
	if(BrowserWindow.getAllWindows().length===0 && tray.isDestroyed()){
		console.log('quitting because no windows and no tray');
		app.quit();
	}
	}



	app.whenReady().then(() => {
		if(!app.requestSingleInstanceLock()) {
			console.log('quitting because request for single instance lock denied');
			app.quit();
			return;
		}
		if(!app.hasSingleInstanceLock()) {
			console.log('quitting because no single instance lock');
			app.quit();
			return;
		}
		app.on('second-instance', () => {
			let mainWindow = getMainWindow();
			if (mainWindow!==null) {
				if (mainWindow.isMinimized()) mainWindow.restore();
				mainWindow.focus();
			} else {
				createWindow();
			}
		});
		

		createWindow();
		
		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
			}
		});

		app.on('before-quit', (event) => {
			console.log('before quit');
		});

		app.on('window-all-closed', (event) => {
			event.preventDefault();
			console.log('window all closed');
			checkClose();
		});

		let natImage = nativeImage.createFromPath(path.join(__dirname, './public/favicon.ico'));
		tray = new Tray(natImage);
		const contextMenu = Menu.buildFromTemplate([
			{ label: 'Quit', type: 'normal', 
			click: () => { 
				console.log('destroying tray');
				tray.destroy();
				BrowserWindow.getAllWindows().forEach((v)=>v.close());
				checkClose();
			}
			}
		]);
		tray.setToolTip('Rember');
		tray.setContextMenu(contextMenu);
		tray.on('click', () => {
			if(BrowserWindow.getAllWindows().length===0){
				createWindow();
			}
		});
	});

	const { ipcMain } = require('electron');
	const { reminderStorage } = require('./reminderStorage.cjs');

	ipcMain.on('dismissReminder', (event, reminderName) => {
		let mainWindow = getMainWindow();
		reminderStorage.dismissReminder(reminderName);
		mainWindow.webContents.send('update');
	});

	ipcMain.on('getReminders', (event) => {
		event.returnValue = reminderStorage.getReminders();
	});

	ipcMain.on('addReminder', (event, reminder) => {
		console.log('addReminder', reminder);
		let mainWindow = getMainWindow();
		reminderStorage.addReminder(reminder);
		mainWindow.webContents.send('update');
	});

	ipcMain.on('removeReminder', (event, reminder) => {
		let mainWindow = getMainWindow();
		reminderStorage.removeReminder(reminder);
		mainWindow.webContents.send('update');
	});

	// Send update every hour
	setInterval(() => {
		let mainWindow = getMainWindow();
		if(mainWindow !==null) {
			mainWindow.webContents.send('update');
		}
	}, 1000 * 60 * 60); // every hour
}
