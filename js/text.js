(function () {
    var tt;

    /* TextTools class */

    Phaser.Plugin.TextTools = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);
        Text.prototype = Object.create(this);
        Text.prototype.wrap = wrap;
        Text.prototype.type = type;

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

    function Text (x, y, text, opts) {
        setOptions(this, opts);
        this.x = x;
        this.y = y;
        this.value = text;
        this.letterTyped = new Phaser.Signal();

        var fontObj = {
            font: this._size + 'pt ' + this._font,
            fill: this._fill,
            align: this._align
        };

        if (this._useBitmapFont) {
            this._text = this.game.add.bitmapText(x, y, this._bitmapFontKey, text, this._size);
        } else {
            this._text = this.game.add.text(x, y, text, fontObj);
        }
    }

    function type (typeSpeed) {
        var text = this._text.text;
        this._text.text = '';
        var textIndex = 0;
        var interval = setInterval(function (that) {
            if (textIndex === text.length) {
                clearInterval(interval);
                return;
            }

            that.letterTyped.dispatch();
            
            // an empty text property actually contains a space
            if (that._text.text === ' ') {
                that._text.text = text[textIndex];
            } else {
                that._text.text += text[textIndex];
            }

            textIndex++;
        }, typeSpeed, this);

        return this;
    }

    function wrap (wrapWidth) {
        if (this._useBitmapFont) {
            this._text.wrap(wrapWidth);
        } else {
            var style = {
                font: this._size + 'pt ' + this._font,
                fill: this._fill,
                wordWrapWidth: wrapWidth
            };

            this._text.setStyle(style);
            var wrappedText = this._text.runWordWrap(this._text.text);
            this._text.setText(wrappedText);
        }

        return this;
    }

    /* Utility functions*/

    function setOptions (obj, opts) {
        if (!opts) return;

        opts.size && (obj._size = opts.size);
        opts.font && (obj._font = opts.font);
        opts.fill && (obj._fill = opts.fill);
        opts.align && (obj._align = opts.align);

        if (!!opts.bitmapFont && !obj.game.cache._images[opts.bitmapFont]) {
            console.log("Phaser.Plugin.TextTools: bitmapFont '" + opts.bitmapFont + "' not found in cache");
        } else {
            obj._useBitmapFont = !!opts.bitmapFont;
            obj._bitmapFontKey = opts.bitmapFont;
        }
    }
})();

// assume no line breaks
PIXI.BitmapText.prototype.measureWidth = function (text) {
	var data = PIXI.BitmapText.fonts[this.fontName];
	var charData;
	var pos = new PIXI.Point();
	var prevCharCode = null;
	var charCode;
	var scale = this.fontSize / data.size;

	for (var i = 0; i < text.length; i++) {
		charCode = this.text.charCodeAt(i);
		charData = data.chars[charCode];
		if(!charData) continue;

		if(prevCharCode && charData[prevCharCode]) {
			pos.x += charData.kerning[prevCharCode];
		}

		pos.x += charData.xAdvance;
		prevCharCode = charCode;
	}

	return pos.x * scale;
};

PIXI.BitmapText.prototype.measureWords = function (text) {
	if (!text) text = this.text;

	var words = text.split(' ');
	var wordLengths = [];

	for (var i = 0; i < words.length; i++) {
		wordLengths.push({ word: words[i], length: this.measureWidth(words[i]) });
	}

	return wordLengths;
};
    
PIXI.BitmapText.prototype.wrap = function (width, height) {
	var words = this.measureWords(this.text);
	var currentLine = words[0].word;
	var lines = [];

	for (var i = 1; i < words.length; i++) {
		var newLine = currentLine + ' ' + words[i].word;
		var lineWidth = this.measureWidth(newLine);
		if (lineWidth < width) {
			currentLine = newLine;
		} else {
			lines.push(currentLine);
			currentLine = words[i].word;
		}
	}

	lines.push(currentLine);

	this.text = lines.join('\r');
};
