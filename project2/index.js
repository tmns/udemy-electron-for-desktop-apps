const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // any time user closes main window, entire app closes
    mainWindow.on('closed', () => app.quit())

    // use our menuTemplate
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    // for JS garbage collection
    addWindow.on('closed', () => addWindow = null)
}

// listen for todo:add event
ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
})

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New Todo', 
                // can use a ternary here to check for OS
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() { createAddWindow(); }
            },
            {
                label: 'Clear Todos',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+C' : 'Ctrl+Shift+C',
                click() { mainWindow.webContents.send('todo:clear'); }
            },
            { 
                label: 'Quit',
                // or can also use an IIFE for OS check
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command+Q';
                    }
                    return 'Ctrl+Q';
                })(),
                click() { app.quit(); }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    // avoid the merge of File and App Name menu items behavior on Mac
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            {
                label: 'Dev Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) { focusedWindow.toggleDevTools() }
            }
        ]
    })
}
