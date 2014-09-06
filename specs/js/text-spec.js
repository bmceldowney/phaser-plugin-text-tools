Phaser = { Plugin: function (game, parent) { this.game = game; } };
Phaser.Plugin.prototype = { protoTest: 'protoTest' };
require('../../js/text.js');

describe('text', function() {
    var textTools;
    var pluginSpy;
    var gameObj;
    var logSpy;
    var textSpy;
    var bitmapTextSpy;

    beforeEach(function () {
        console = { log: function () {} };
        logSpy = spyOn(console, 'log');
        
        gameObj = {
            cache: {_images: { font: 'font' }},
            add: {
                text: function () {
                },
                bitmapText: function () {
                    
                }
            }
        };

        textSpy = spyOn(gameObj.add, 'text');
        bitmapTextSpy = spyOn(gameObj.add, 'bitmapText');
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
                size: '32',
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
            expect(textTools._useBitmapFont).toBe(false);
            expect(textTools._bitmapFontKey).toBe('');
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
        var testText = "Bacon ipsum dolor sit amet beef ribs spare ribs pork loin swine ground round. Pancetta landjaeger leberkas andouille brisket beef ribs. Ham sirloin pancetta hamburger, meatloaf beef ribs flank pastrami pork capicola drumstick doner jowl ball tip.".toUpperCase();

        beforeEach(function () {
            text = textTools.text(10, 20, testText);
        });

        it('should return a new text object instance that inherits from the TextTools object', function () {
            expect(text.x).toBe(10);
            expect(text.y).toBe(20);
            expect(text.value).toBe(testText);
            expect(text._font).toBe('Arial');
        });

        describe('when _useBitmapFont is true', function () {
            it('should use the bitmapText method', function () {
                var opts = {
                    bitmapFont: 'font'
                };

                text = textTools.text(10, 20, testText, opts);
                expect(bitmapTextSpy).toHaveBeenCalledWith(10, 20, 'font', testText, '32');
            });
        });

        describe('when _useBitmapFont is false', function () {
            it('should use the text method', function () {
                expect(textSpy).toHaveBeenCalledWith(10, 20, testText, jasmine.any(Object));
            });
        });

        xdescribe('multiline', function () {
            it('should return a string with line breaks if the string is longer than the given width', function () {
                text.multiline(100);
                expect(text.value).toContain("\n");
            });
        });
    });
});
