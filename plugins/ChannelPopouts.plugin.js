//META{"name":"ChannelPopouts","displayName":"ChannelPopouts","website":"https://github.com/Curtis-D","source":"https://github.com/Curtis-D/ChannelPopouts/blob/master/ChannelPopouts.plugin.js"}*//

function ChannelPopoutOnMouseEnter(){
    let wrapper = document.createElement('div');
    let buttonLeft = parseInt(document.getElementsByName('ChannelPopout')[0].getBoundingClientRect().left) - 36;
    let buttonTop = parseInt(document.getElementsByName('ChannelPopout')[0].getBoundingClientRect().top) + 32;
    wrapper.innerHTML = `<div class='layer-v9HyYc da-layer ChannelPopoutIcon' style='left: ` + buttonLeft.toString() + `px; top: ` + buttonTop.toString() + `px;'><div class="tooltip-2QfLtc tooltipBottom-3ARrEK tooltipBlack-PPG47z"><div class="tooltipPointer-3ZfirK da-tooltipPointer"></div>Popout Chat</div></div>`;
    document.querySelector('[data-no-focus-lock] .layerContainer-yqaFcK').appendChild(wrapper.firstChild);
};

function ChannelPopoutOnMouseLeave(){
    document.querySelector('.ChannelPopoutIcon').remove();
};

function ChannelPopoutOnMouseClick(){
    const BrowserWindow = require("electron").remote.BrowserWindow;
    const isMac = !require('process').platform === 'darwin';
    const isLinux = !require('process').platform === 'linux';
    const win = new BrowserWindow({webPreferences: {preload: require("path").join(require("electron").remote.require(require("path").join(require("electron").remote.app.getAppPath(), "common/paths")).getModulePath(), "discord_desktop_core/core.asar/app/mainScreenPreload.js")}, title: "Discord", frame: isLinux ? true : false, width: 800, height: 600 });


    if(!isMac){
        win.on('close', () => {
            win.destroy();
        });
    }
    let chatPopoutLoaded = () => {
        // Hides server and channel list along w/ ensuring the chat itself takes up the full width of the window
        win.webContents.executeJavaScript(`var head = document.getElementsByTagName("head")[0];
        var popoutStyle = document.createElement('style');
        popoutStyle.innerText = '.sidebar-2K8pFh, .wrapper-1Rf91z {display: none!important;} .base-3dtUhz {left: 0!important;}';
        head.appendChild(popoutStyle)`);
        if(isMac){
            win.webContents.executeJavaScript('document.getElementsByClassName("macButtonClose-MwZ2nf")[0].addEventListener("click", _ => {const w = require("electron").remote.getCurrentWindow(); w.close(); w.destroy();})');
        }
    };
    // Incase someone refreshes the popout, did-navigate is used instead of did-finish-load
    win.webContents.on('did-navigate', chatPopoutLoaded);
    win.loadURL(window.location.href);
};

const ChannelPopoutInjectHTML = function injectHTML(icon){
    let wrapper = document.createElement('div');

    if(icon && !document.getElementsByName("ChannelPopout")[0]){
        wrapper.innerHTML = `<div tabindex="0" class="iconWrapper-2OrFZ1 da-iconWrapper clickable-3rdHwn da-clickable" role="button">
            <svg class="icon-22AiRD da-icon" name="ChannelPopout" width="16" height="16" viewBox="-8 -8 80 80" fill = "currentColor">
                <g>
                    <g>
                        <g>
                            <polygon points="53,56 8,56 8,11 30,11 30,3 0,3 0,64 61,64 61,34 53,34"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <polygon points="42,0 50,8 33,25 39,31 56,14 64,23 64,0"/>
                        </g>
                    </g>
                </g>
            </svg>
        </div>`;
        icon.prepend(wrapper.firstChild);
        document.getElementsByName("ChannelPopout")[0].onmouseenter = ChannelPopoutOnMouseEnter;
        document.getElementsByName("ChannelPopout")[0].onmouseleave = ChannelPopoutOnMouseLeave;
        document.getElementsByName("ChannelPopout")[0].onmouseup = ChannelPopoutOnMouseClick;
    }
}

const ChannelPopoutRemoveHTML = function removeHTML(){
    document.getElementsByName("ChannelPopout")[0].parentNode.remove();
}


var ChannelPopouts = (() => {
    const config = {"info":{"name":"ChannelPopouts","authors":[{"name":"Green","discord_id":"80593258903773184","github_username":"Curtis-D"}],"version":"1.1.6","description":"Allows you to popout DMs/Servers to view more than one DM/Server at a time.","github":"","github_raw":"https://raw.githubusercontent.com/Curtis-D/ChannelPopouts/master/ChannelPopouts.plugin.js"},"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;}
        showAlert() {window.mainCore.alert("Library Missing",`The Library needed for this plugin is missing, please download it from here: <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ZeresPluginLibrary/0PluginLibrary.plugin.js">https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ZeresPluginLibrary</a>`);} load() {this.showAlert();} start() {this.showAlert();} stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

    const {Logger, Patcher, Settings} = Library;

    let pinIconPath = "M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z";


    return class ChannelPopouts extends Plugin {
        constructor() {
            super();
        }

        onStart() {
            Logger.log("Started");
            Library.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
            if(document.querySelector(".toolbar-1t6TWx [d='" + pinIconPath + "']") && !document.getElementsByName("ChannelPopout")[0]){
                ChannelPopoutInjectHTML(document.getElementsByClassName("toolbar-1t6TWx")[0]);
            }
        }

        onStop() {
            ChannelPopoutRemoveHTML();
            Logger.log("Stopped");
        }

        observer(e){
            if(e.target.querySelector(".toolbar-1t6TWx [d='" + pinIconPath + "']") && !document.getElementsByName("ChannelPopout")[0]){
                let wrapper = document.createElement('div');
                ChannelPopoutInjectHTML(document.getElementsByClassName("toolbar-1t6TWx")[0]);
            }
        }
    };

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();