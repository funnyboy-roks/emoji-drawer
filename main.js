// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, globalShortcut, Menu, MenuItem } = require('electron');
const path = require('path');

let mainWindow = null;
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		title: 'Emoji Drawer',
		closable: false,
		width: 575,
		height: 800,
		// frame: false,
		// minimizable: false,
		// maximizable: false,
		backgroundColor: '#23272A',
		// titleBarStyle: 'hidden',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
		autoHideMenuBar: true,
		// alwaysOnTop: true,
	});

	// and load the index.html of the app.
	mainWindow.loadFile('index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow();

	globalShortcut.register('Super+.', toggleWindowVisisble);

	let tray = new Tray('./icons/icon.png');
	const contextMenu = Menu.buildFromTemplate([
		new MenuItem(
			label='Close Emoji Drawer',
			click=() => {
        console.log('help me')
				app.quit();
			},
		),
	]);

	tray.setContextMenu(contextMenu);

	contextMenu.getMenuItemById('closeApp').click = () => {
		app.quit();
	};

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
	tray.on('click', toggleWindowVisisble);

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

	mainWindow.on('close', (e) => {
		e.preventDefault();
	});
});

const toggleWindowVisisble = () =>
	mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
