Phaser = { Plugin: function (game, parent) { this.game = game; } };
Phaser.Plugin.prototype = { protoTest: 'protoTest' };
require('../../js/text.js');

describe('text', function() {
    var textTools;
    var pluginSpy;
    var gameObj;
    var logSpy;

    beforeEach(function () {
        console = { log: function () {} };
        logSpy = spyOn(console, 'log');

        gameObj = {
            cache: {_images: { font: 'font' }}
        };
        pluginSpy = spyOn(Phaser.Plugin, 'call').andCallThrough();
        textTools = new Phaser.Plugin.TextTools(gameObj, 'parent');
    });

    it('should define the TextTools plugin', function () {
        expect(Phaser.Plugin.TextTools).toBeDefined();
    });

    describe('#ctor', function () {
        it('should inherit from Phaser.Plugin', function () {
            expect(pluginSpy).toHaveBeenCalledWith(textTools, gameObj, 'parent');
            expect(Phaser.Plugin.TextTools.prototype.protoTest).toBe('protoTest');
            expect(Phaser.Plugin.TextTools.prototype.constructor).toBe(Phaser.Plugin.TextTools);
        });
    });

    describe('init', function () {
        var defaults;

        beforeEach(function () {
            defaults = {
                font: 'Arial',
                size: '32px',
                fill: '#ffffff',
                align: 'left'
            };
            
            textTools.init();
        });

        it('should initialize the default settings', function () {
            expect(textTools._font).toBe(defaults.font);
            expect(textTools._size).toBe(defaults.size);
            expect(textTools._fill).toBe(defaults.fill);
            expect(textTools._align).toBe(defaults.align);
            expect(textTools._useBitmapFont).toBeFalsy();
            expect(textTools._bitmapFontKey).toBeUndefined();
        });

        describe('when bitmapFont key is valid', function () {
            beforeEach(function () {
                var opts = {
                    bitmapFont: 'font'
                };

                textTools.init(opts);
            });

            it('should use a bitmap font if one is provided', function () {
                expect(textTools._useBitmapFont).toBeTruthy();
                expect(textTools._bitmapFontKey).toBe('font');
            });
        });

        describe('when bitmapFont key is invalid', function () {
            beforeEach(function () {
                var opts = {
                    bitmapFont: 'badFont'
                };

                textTools.init(opts);
            });

            it('should log a message if the bitmap font key is invalid', function () {
                expect(logSpy).toHaveBeenCalledWith("Phaser.Plugin.TextTools: bitmapFont 'badFont' not found in cache");
            });

            it('should fall back to the default font if the bitmap font key is invalid', function () {
                expect(textTools._useBitmapFont).toBeFalsy();
                expect(textTools._font).toBe(defaults.font);
            });
        });
    });

    describe('text', function () {
        var text;

        beforeEach(function () {
            text = textTools.text(10, 20, 'test text');
        });

        it('should return a new text object instance that inherits from the TextTools object', function () {
            expect(text.x).toBe(10);
            expect(text.y).toBe(20);
            expect(text.value).toBe('test text');
            expect(text._font).toBe('Arial');
        });
    });
});
