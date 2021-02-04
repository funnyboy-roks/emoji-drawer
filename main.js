// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		title: 'Emoji Drawer',
		// closable: true,
		width: 600,
		height: 800,
		frame: false,
		// minimizable: false,
		// maximizable: false,
		// backgroundColor: '#FFFFFF',
		titleBarStyle: 'hidden',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		autoHideMenuBar: true,
		// alwaysOnTop: true,
	});

	// and load the index.html of the app.
	mainWindow.loadFile('index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// let tray = null;
app.whenReady().then(() => {
	createWindow();

	let tray = new Tray('./icons/icon.png');

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
	tray.on('click', () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});

	mainWindow.on('show', () => {
		const bounds = tray.getBounds();
		let y = 0;
		let x = bounds.x;
		if (process.platform !== 'darwin') {
			const [windowWidth, windowHeight] = mainWindow.getSize();
			if (bounds.y === 0) {
				// windows taskbar top
				y = bounds.height;
			} else {
				// windows taskbar bottom
				y = bounds.y - windowHeight;
			}
			mainWindow.setPosition(x, y);
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
