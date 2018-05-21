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

function Mixer (context, opt) {
    'use strict';

    console.log('Creating new mixer...');

    if (!context) {
        console.log('ERROR: Mixer cannot be started.');
        return -1;
    }

    var defaults = {};
    var options = Object.assign({}, defaults, opt);

    // Master Output
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    gainNode.gain.value = 1;

    // Creating UI elements
    var container = document.createElement('div');
    container.classList.add('mixer');

    var masterVolume = document.createElement('div');
    masterVolume.classList.add('vertical-fader-container');
    var masterVolumeFader = document.createElement('input');
    masterVolumeFader.classList.add('vertical-fader');
    masterVolumeFader.type = 'range';
    masterVolumeFader.min = 0;
    masterVolumeFader.max = 100;
    masterVolumeFader.value = 80;
    var onchangeVolume = function () {
        mixer._gainNode.gain.value = this.value / 100;
    };
    masterVolumeFader.addEventListener('input', onchangeVolume);
    masterVolumeFader.addEventListener('click', onchangeVolume);
    masterVolume.appendChild(masterVolumeFader);

    var mixer = {
        '_context': context,
        '_gainNode': gainNode,
        '_container': container,

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
            if (key === 'volume') {
                this._gainNode.gain.value = value / 100;
            }
			this.redraw();
		},

        /*
		 * Update the view.
		 */
		'redraw': function() {
			// :D
		},

        'node': function () {
            return this._container;
        },

        'connect': function (source) {
            return this._gainNode.connect(source);
        },

        'setMasterVolume': function (value) {
            this.setProperty('volume', value);
        }
    };

    container.appendChild(masterVolume);

    // Finish initialize
    // osc.setVolume(0);
    // osc.visualize();

    return mixer;
}
