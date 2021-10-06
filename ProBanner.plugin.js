/**
 * @name ProBanner
 * @author EhsanDavari
 * @authorId 553139953597677568
 * @version 1.0.0
 * @description Allows you to click on a user's banner to copied download link or hex color it in the browser | پلاگین کپی کردن لینک دانلود یا رنگ بنر کاربر
 * @invite xfvHwqXXKs
 * @website https://www.beheshtmarket.com
 * @source https://github.com/iamehsandvr/ProBanner
 */

module.exports = class ProBanner {
    load() {
        if (!global.ZeresPluginLibrary) {
            BdApi.showConfirmationModal("Library plugin is needed",
                `The library plugin needed for AQWERT'sPluginBuilder is missing. Please click Download Now to install it.`, {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
                        if (error)
                            return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");

                        require("fs").writeFileSync(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                    });
                }
            });
        }
    }

    start() {
        document.addEventListener("click", this.link);
    }
    stop() {
        document.removeEventListener("click", this.link);
    }
    link({ target }) {
        let ClassBanner = BdApi.findModuleByProps("banner", "bannerOverlay").banner
        if (target.classList.contains(ClassBanner) && target.style.backgroundImage) {
            let BannerUrl = target.style.backgroundImage
            BannerUrl = BannerUrl.substring(4, BannerUrl.length - 1).replace(/["']/g, "")
            BannerUrl = BannerUrl.replace(/(?:\?size=\d{3,4})?$/, "?size=4096");
            global.ZLibrary.DiscordModules.ElectronModule.copy(BannerUrl);
            return BdApi.showToast(`Banner link was successfully copied`, { type: "success" });
        } else if (target.style.backgroundColor) {
            const ColorCode = target.style.backgroundColor
            var RGBColorCode = ColorCode.replaceAll(/[a-z()]+/ig, '').replaceAll(' ', '').split(',');
            const RGB2HEX = {
                r: Number(RGBColorCode[0]).toString(16),
                g: Number(RGBColorCode[1]).toString(16),
                b: Number(RGBColorCode[2]).toString(16)
            };
            const ColorHexCode = "#" + ((RGB2HEX.r.length == 1) ? 0 + RGB2HEX.r : RGB2HEX.r) + ((RGB2HEX.g.length == 1) ? 0 + RGB2HEX.g : RGB2HEX.g) + ((RGB2HEX.b.length == 1) ? 0 + RGB2HEX.b : RGB2HEX.b);
            global.ZLibrary.DiscordModules.ElectronModule.copy(ColorHexCode);
            return BdApi.showToast(`Hex color code : ${ColorHexCode} was successfully copied`, { type: "success" });

        }
    }

}