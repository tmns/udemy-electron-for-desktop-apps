const electron = require('electron');

const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
    constructor(url) {
        super({
            height: 500,
            width: 300,
            frame: false,
            resizable: false,
            show: false,
            skipTaskbar: true, // for windows
            webPreferences: { backgroundThrottling: false } // to run at full performance even when in background
        });
        
        this.loadURL(url);

        // hide app window anytime user clicks out of the app area
        this.on('blur', this.onBlur.bind(this));
    }

    onBlur() {
        this.hide();
    }
}

module.exports = MainWindow;