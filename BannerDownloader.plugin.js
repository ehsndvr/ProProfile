/**
 * @name BannerDownloader
 * @author EhsanDavari
 * @authorId 553139953597677568
 * @version 1
 * @description نمایش دکمه دانلود بنر در قسمت های پنجره ایی و کادر مشخصات کاربر
 * @invite xfvHwqXXKs
 * @website https://www.beheshtmarket.com
 * @source https://github.com/iamehsandvr/BannerDownloader
 */

module.exports = (_ => {
    const config = {
        "info": {
            "name": "DownloadBanner",
            "author": "EhsanDavari",
            "version": "1.0.0",
            "description": "نمایش دکمه دانلود بنر در قسمت های پنجره ایی و کادر مشخصات کاربر"
        },
    };
    return (window.Lightcord && !Node.prototype.isPrototypeOf(window.Lightcord) || window.LightCord && !Node.prototype.isPrototypeOf(window.LightCord) || window.Astra && !Node.prototype.isPrototypeOf(window.Astra)) ? class {
        getName() { return config.info.name; }
        getAuthor() { return config.info.author; }
        getVersion() { return config.info.version; }
        getDescription() { return "Do not use LightCord!"; }
        load() { BdApi.alert("Attention!", "By using LightCord you are risking your Discord Account, due to using a 3rd Party Client. Switch to an official Discord Client (https://discord.com/) with the proper BD Injection (https://betterdiscord.app/)"); }
        start() { }
        stop() { }
    } : !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
        getName() { return config.info.name; }
        getAuthor() { return config.info.author; }
        getVersion() { return config.info.version; }
        getDescription() { return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`; }

        downloadLibrary() {
            require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", { type: "success" }));
                else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
            });
        }

        load() {
            if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, { pluginQueue: [] });
            if (!window.BDFDB_Global.downloadModal) {
                window.BDFDB_Global.downloadModal = true;
                BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onCancel: _ => { delete window.BDFDB_Global.downloadModal; },
                    onConfirm: _ => {
                        delete window.BDFDB_Global.downloadModal;
                        this.downloadLibrary();
                    }
                });
            }
            if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
        }
        start() { this.load(); }
        stop() { }
        getSettingsPanel() {
            let template = document.createElement("template");
            template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
            template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
            return template.content.firstElementChild;
        }
    } : (([Plugin, BDFDB]) => {
        return class CreationDate extends Plugin {
            onLoad() {
                this.defaults = {
                    places: {
                        userPopout: { value: true, description: "پنجره مشخصات کاربر" },
                        userProfile: { value: true, description: "کادر مشخصات کاربر" }
                    },
                };
                this.patchedModules = {
                    after: {
                        UserPopoutInfo: "UserPopoutInfo",
                        UserProfileModalHeader: "default"
                    }
                };

            }

            onStart() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }

            onStop() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }
            getSettingsPanel(collapseStates = {}) {
                let settingsPanel;
                return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
                    collapseStates: collapseStates,
                    children: _ => {
                        let settingsItems = [];
                        settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
                            title: "نمایش دکمه دانلود در :",
                            children: Object.keys(this.defaults.places).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                                type: "Switch",
                                plugin: this,
                                keys: ["places", key],
                                label: this.defaults.places[key].description,
                                value: this.settings.places[key]
                            }))
                        }));
                        settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
                            className: BDFDB.disCN.marginbottom8
                        }));
                        settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
                            title: "برای حمایت از من عضو سرورمون بشید",
                            children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Button, {
                                type: "Button",
                                size: BDFDB.LibraryComponents.Button.Sizes.SMALL,
                                color: BDFDB.LibraryComponents.Button.Colors.WHITE,
                                label: "Join Server",
                                onClick: _ => window.open("https://discord.gg/xfvHwqXXKs"),
                                children: "عضو سرور شوید",
                            })
                        }));
                        settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
                            className: BDFDB.disCN.marginbottom8
                        }));
                        return settingsItems.flat(10);

                    }
                });
            }

            onSettingsClosed() {
                if (this.SettingsUpdated) {
                    delete this.SettingsUpdated;
                    BDFDB.PatchUtils.forceAllUpdates(this);
                }
            }

            processUserPopoutInfo(e) {
                if (e.instance.props.user && this.settings.places.userPopout) {
                    let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, { name: ["DiscordTag", "ColoredFluxTag"] });
                    if (index > -1) this.injectDate(children, index + 1, e.instance.props.user);
                }
            }

            processUserProfileModalHeader(e) {
                if (e.instance.props.user && this.settings.places.userProfile) {
                    let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, { name: ["DiscordTag", "ColoredFluxTag"] });
                    if (index > -1) this.injectDate(children, index + 1, e.instance.props.user);
                }
            }
            injectDate(children, index, user) {
                const UserBanner = user.bannerURL || `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`;
                children.splice(index, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
                    className: BDFDB.disCNS._creationdatedate + BDFDB.disCNS.userinfodate + BDFDB.disCN.textrow,
                    children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Button, {
                        type: "Button",
                        size: BDFDB.LibraryComponents.Button.Sizes.SMALL,
                        color: BDFDB.LibraryComponents.Button.Colors.GREEN,
                        label: "Enable for all Servers",
                        onClick: _ => window.open(UserBanner.replace(/[0-9]+$/, 4096)),
                        children: "دانلود بنر",
                    })
                }));
            }
        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
