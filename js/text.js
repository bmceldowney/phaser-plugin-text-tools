(function () {
    var tt;

    Phaser.Plugin.TextTools = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);

        this._font = 'Arial';
        this._size = '32px';
        this._fill = '#ffffff';
        this._align = 'left';
    };

    tt = Phaser.Plugin.TextTools;

    tt.prototype = Object.create(Phaser.Plugin.prototype);
    tt.prototype.constructor = Phaser.Plugin.TextTools;

    tt.prototype.init = function (opts) {
        if (!opts) return;

        if (!!opts.bitmapFont && !this.game.cache._images[opts.bitmapFont]) {
            console.log("Phaser.Plugin.TextTools: bitmapFont '" + opts.bitmapFont + "' not found in cache");
        } else {
            this._useBitmapFont = !!opts.bitmapFont;
            this._bitmapFontKey = opts.bitmapFont;
        }
    };

    tt.prototype.text = function (x, y, text) {
        var that = this;
        var textObj = function () {
            this.x = x;
            this.y = y;
            this.value = text;
        };

        textObj.prototype = this;

        return new textObj();
    };
})();
