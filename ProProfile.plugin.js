/**
 * @name ProProfile
 * @author EhsanDavari
 * @authorId 553139953597677568
 * @version 1.0.5
 * @description  Single Click: Copy User Avatar/Banner/Name Tag/About ME | Double Click: Copy Server Icon/Banner
 * @invite xfvHwqXXKs
 * @website https://sana14.com
 * @source https://github.com/iamehsandvr/ProProfile
 * @updateUrl https://raw.githubusercontent.com/iamehsandvr/ProBanner/main/ProProfile.plugin.js
 */
const request = require("request");
const fs = require("fs");
const path = require("path");

const config = {
    info: {
        name: "ProProfile",
        authors: [{
            name: "EhsanDavari",
        },],
        version: "1.0.5",
        description: "Single Click: Copy User Avatar/Banner/Name Tag/About ME | Double Click: Copy Server Icon/Banner",
    },
};

module.exports = !global.ZeresPluginLibrary ?
    class {
        constructor() {
            this._config = config;
        }

        load() {
            BdApi.showConfirmationModal(
                "Library plugin is needed",
                `The library plugin needed for AQWERT'sPluginBuilder is missing. Please click Download Now to install it.`, {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    request.get(
                        "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                        (error, response, body) => {
                            if (error)
                                return electron.shell.openExternal(
                                    "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                                );

                            fs.writeFileSync(
                                path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
                                body
                            );
                        }
                    );
                },
            }
            );
        }

        start() { }

        stop() { }
    } :
    (([Plugin, Library]) => {
        const {
            DiscordModules,
            WebpackModules,
            Patcher,
            Toasts,
        } = Library;
        const {
            ElectronModule,
        } = DiscordModules;
        class plugin extends Plugin {
            constructor() {
                super();
            }
            onStart() {
                this.ProProfile();
            }

            onStop() {
                document.removeEventListener("dblclick");
                document.removeEventListener("click");
                Patcher.unpatchAll();
            }
            ProProfile() {
                const UserProfileModalHeader = WebpackModules.find((m) => m?.default?.displayName === "UserProfileModalHeader");
                const NavItem = WebpackModules.find((m) => m?.default?.displayName === "NavItem");
                const GuildSubheader = WebpackModules.find((m) => m?.default?.displayName === "GuildSubheader")
                const NameTag = WebpackModules.find((m) => m?.default?.displayName === "NameTag");
                const UserBio = WebpackModules.find((m) => m?.default?.displayName === "UserBio");
                const CustomStatus = WebpackModules.find((m) => m?.default?.displayName === "CustomStatus");
                Patcher.after(UserProfileModalHeader, "default", (_, [props], ret) => {
                    ret.props.onClick = (_) => {
                        if (_.target.classList.contains(WebpackModules.find((m) => m?.mask && m?.wrapper && m?.avatar).wrapper)) {
                            ElectronModule.copy((props.user.getAvatarURL()).replace(/([0-9]+)$/, "4096"));
                            return Toasts.success(
                                `User profile image link successfully copied`
                            );
                        } else if (_.target.classList.contains(WebpackModules.find((m) => m?.bannerHeightProfile === "106px").banner)) {
                            ElectronModule.copy(ret.props.children[0].props.bannerSrc ? ret.props.children[0].props.bannerSrc.replace(/([0-9]+)$/, "4096") : (() => {
                                let ColorCode = document.getElementsByClassName(WebpackModules.find((m) => m?.bannerHeightProfile === "106px").banner)[0].style.backgroundColor
                                var RGBColorCode = ColorCode.replaceAll(
                                    /[a-z() ]+/gi,
                                    ""
                                ).split(",");
                                const RGB2HEX = {
                                    r: Number(RGBColorCode[0]).toString(16),
                                    g: Number(RGBColorCode[1]).toString(16),
                                    b: Number(RGBColorCode[2]).toString(16),
                                };
                                const ColorHexCode =
                                    "#" +
                                    (RGB2HEX.r.length == 1 ? 0 + RGB2HEX.r : RGB2HEX.r) +
                                    (RGB2HEX.g.length == 1 ? 0 + RGB2HEX.g : RGB2HEX.g) +
                                    (RGB2HEX.b.length == 1 ? 0 + RGB2HEX.b : RGB2HEX.b);
                                ElectronModule.copy(ColorHexCode);
                                return Toasts.success(
                                    `Hex color code : ${ColorHexCode} was successfully copied`
                                );
                            })());
                            return Toasts.success(
                                `Banner link was successfully copied`
                            );
                        }

                    };
                })
                Patcher.after(NavItem, "default", (_, [props], ret) => {
                    ret.props.onDoubleClick = (_) => {
                        global.ZLibrary.DiscordModules.ElectronModule.copy(
                            props.icon.replace(/([0-9]+)$/, "4096")
                        );
                        return BdApi.showToast(`Server icon link successfully copied`, {
                            type: "success",
                        });
                    }
                })
                Patcher.after(GuildSubheader, "default", (_, [props], ret) => {
                    ret.ref.current.parentElement.childNodes[0].ondblclick = (_) => {
                        global.ZLibrary.DiscordModules.ElectronModule.copy(
                            WebpackModules.find((m) => m?.getGuildBannerURL).getGuildBannerURL(props.guild, false).replace(/([0-9]+)$/, "4096")
                        );
                        return BdApi.showToast(`Server banner link successfully copied`, {
                            type: "success",
                        });
                    }
                })
                Patcher.after(NameTag, "default", (_, [props], ret) => {
                    ret.props.onClick = (_) => {
                        global.ZLibrary.DiscordModules.ElectronModule.copy(`${props.name}#${props.discriminator}`)
                        return BdApi.showToast(`Name tag successfully copied`, {
                            type: "success",
                        });
                    }
                })
                Patcher.after(UserBio, "default", (_, [props], ret) => {
                    ret.props.onClick = (_) => {
                        global.ZLibrary.DiscordModules.ElectronModule.copy(props.userBio)
                        return BdApi.showToast(`User bio successfully copied`, {
                            type: "success",
                        });
                    }
                })
                Patcher.after(CustomStatus, "default", (_, [props], ret) => {
                    ret.props.onClick = (_) => {
                        global.ZLibrary.DiscordModules.ElectronModule.copy((props.activity.emoji ? props.activity.emoji.animated ? `<:${props.activity.emoji.name}:${props.activity.emoji.id}>` : props.activity.emoji.name : "") + " " + props.activity.state)
                        return BdApi.showToast(`User status successfully copied`, {
                            type: "success",
                        });
                    }
                });
            }
        }

        return plugin;
    })(global.ZeresPluginLibrary.buildPlugin(config));
