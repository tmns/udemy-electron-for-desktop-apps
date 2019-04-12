const electron = require('electron');

const { Tray, Menu, app } = electron;

const path = require('path');

class TimerTray extends Tray {
    constructor(iconPath, mainWindow) {
        super(iconPath);

        this.mainWindow = mainWindow;

        // for linux
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Toggle Timer App',
                click: () => {
                    this.mainWindow.setBounds({x: 1400, y: 0, width: 300, height: 500})
                    this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show()
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => app.quit()
            }
        ])
        this.setContextMenu(contextMenu);

        // below for mac & windows, as they are ignored by linux
        // when conctext menu is configured
        this.on('click', this.onClick.bind(this));
        this.on('rightclick', this.onRightClick.bind(this));
        this.setToolTip('Timer App')
    }

    onClick(event, bounds) {
        // click event bounds
        const { x, y } = bounds;

        // window height & width
        const { height, width } = this.mainWindow.getBounds();

        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        } else {
            this.mainWindow.setBounds({
                x: x - width / 2,
                y,
                height,
                width
            })
            this.mainWindow.show();

        }
    }

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => app.quit()
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = TimerTray;