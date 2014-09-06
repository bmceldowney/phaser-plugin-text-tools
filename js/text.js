(function () {
    var tt;

    /* TextTools class */

    Phaser.Plugin.TextTools = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);
        Text.prototype = Object.create(this);
        Text.prototype.multiline = multiline;

        this._useBitmapFont = false;
        this._bitmapFontKey = '';
        this._font = 'Arial';
        this._size = '32';
        this._fill = '#ffffff';
        this._align = 'left';
    };

    tt = Phaser.Plugin.TextTools;

    tt.prototype = Object.create(Phaser.Plugin.prototype);
    tt.prototype.constructor = Phaser.Plugin.TextTools;

    tt.prototype.init = function (opts) {
        setOptions(this, opts);
    };

    tt.prototype.text = function (x, y, text, opts) {
        return new Text(x, y, text, opts);
    };

    /* Text class */

    function Text(x, y, text, opts) {
        setOptions(this, opts);
        this.x = x;
        this.y = y;
        this.value = text;

        var fontObj = {
            font: this._font,
            fontSize: this._size,
            fill: this._fill,
            align: this._align
        };

        if (this._useBitmapFont) {
            this.game.add.bitmapText(x, y, this._bitmapFontKey, text, this._size);
        } else {
            this.game.add.text(x, y, text, fontObj);
        }
    }

    function multiline(width) {
        //var words = this.value.split(' ');

        //if (this._useBitmapFont) {
            //PIXI.BitmapText.fonts[this._bitmapFontKey].chars[1];
        //} else {

        //}
    }

    /* Utility functions*/

    function setOptions(obj, opts) {
        if (!opts) return;

        if (!!opts.bitmapFont && !obj.game.cache._images[opts.bitmapFont]) {
            console.log("Phaser.Plugin.TextTools: bitmapFont '" + opts.bitmapFont + "' not found in cache");
        } else {
            obj._useBitmapFont = !!opts.bitmapFont;
            obj._bitmapFontKey = opts.bitmapFont;
        }
    }
})();
