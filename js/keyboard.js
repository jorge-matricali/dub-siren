/*
Copyright (c) 2018 Jorge Matricali <jorgematricali@gmail.com>
All rights reserved.

This code is licensed under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function Keyboard (opt) {
    'use strict';

    console.log('Creating new note keyboard...');

    var defaults = {
        'width': '100%',
        'height': '100px',
        'notes': [
            16.35,
            17.32,
            18.35,
            19.45,
            20.60,
            21.83,
            23.12,
            24.50,
            25.96,
            27.50,
            29.14,
            30.87,
            32.70,
            34.65,
            36.71,
            38.89,
            41.20,
            43.65,
            46.25,
            49.00,
            51.91,
            55.00,
            58.27,
            61.74,
            65.41,
            69.30,
            73.42,
            77.78,
            82.41,
            87.31,
            92.50,
            98.00,
            103.83,
            110.00,
            116.54,
            123.47,
            130.81,
            138.59,
            146.83,
            155.56,
            164.81,
            174.61,
            185.00,
            196.00,
            207.65,
            220.00,
            233.08,
            246.94,
            261.63,
            277.18,
            293.66,
            311.13,
            329.63,
            349.23,
            369.99,
            392.00,
            415.30,
            440.00,
            466.16,
            493.88,
            523.25,
            554.37,
            587.33,
            622.25,
            659.25,
            698.46,
            739.99,
            783.99,
            830.61,
            880.00,
            932.33,
            987.77,
            1046.50,
            1108.73,
            1174.66,
            1244.51,
            1318.51,
            1396.91,
            1479.98,
            1567.98,
            1661.22,
            1760.00,
            1864.66,
            1975.53,
            2093.00,
            2217.46,
            2349.32,
            2489.02,
            2637.02,
            2793.83,
            2959.96,
            3135.96,
            3322.44,
            3520.00,
            3729.31,
            3951.07,
            4186.01,
            4434.92,
            4698.63,
            4978.03,
            5274.04,
            5587.65,
            5919.91,
            6271.93,
            6644.88,
            7040.00,
            7458.62,
            7902.13
        ]
    };

    var options = Object.assign({}, defaults, opt);

    // Creating UI elements
    var container = document.createElement('div');
    container.classList.add('keyboard');

    var keyboard = {
        '_container': container,
        '_listeners': {
            'pressed': [],
            'released': []
        },

        /*
		 * Properties of this oscillator.
		 */
		'_properties': options,

        /*
		 * Returns the value of a property of this pad.
		 */
		'getProperty': function(key) {
			return this._properties[key];
		},

        /*
		 * Sets the value of a property of this pad.
		 */
		'setProperty': function(key, value) {
			this._properties[key] = value;
			this.redraw();
		},

        'node': function () {
            return this._container;
        },

        /*
		 * Update the view.
		 */
        'redraw': function () {
            // :D
        },

        /*
         * Adds an event listener.
         */
        'addListener': function(type, listener) {
            var listeners = this._listeners;
            listeners[type].push(listener);
        },

        /*
         * Notify listeners about pressed key.
         */
        '_notifyKeypress': function(freq) {
            var listeners = this._listeners.pressed;
            var numListeners = listeners.length;

            /*
             * Call all listeners.
             */
            for (var i = 0; i < numListeners; i++) {
                var listener = listeners[i];

                /*
                 * Call listener, if it exists.
                 */
                if (listener !== null) {
                    listener(this, freq);
                }
            }

        },

        /*
         * Notify listeners about released key.
         */
        '_notifyKeyrelease': function(freq) {
            var listeners = this._listeners.released;
            var numListeners = listeners.length;

            /*
             * Call all listeners.
             */
            for (var i = 0; i < numListeners; i++) {
                var listener = listeners[i];

                /*
                 * Call listener, if it exists.
                 */
                if (listener !== null) {
                    listener(this, freq);
                }
            }

        },
    };

    var onkeypress = function (e) {
        if (e.buttons === 1) {
            keyboard._notifyKeypress(e.target.dataset.note);
        }
    };

    var onkeyrelease = function (e) {
        keyboard._notifyKeyrelease(e.target.dataset.note);
    };

    // Finish initialize
    var n = 1;
    [].forEach.call(options.notes, function (f) {
        var button = document.createElement('button');
        button.title = f;
        button.dataset.note = f;
        button.classList.add('key');
        console.log(n);
        if (n === 2 || n === 4 || n === 7 || n === 9 || n === 11) {
            button.classList.add('sharp');
        }
        button.addEventListener('mousedown', onkeypress);
        button.addEventListener('mouseup', onkeyrelease);
        container.appendChild(button);
        n = n + 1;
        if (n > 12) {
            n = 1;
        }
    });

    keyboard.redraw();

    return keyboard;
}
