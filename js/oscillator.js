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

function Oscillator (context, opt) {
    'use strict';

    console.log('Creating new oscillator...');

    if (!context) {
        console.log('ERROR: Siren cannot be started.');
        return -1;
    }

    context.resume().then(function () {
        console.log('Audio context playback resumed successfully');
    });

    var defaults = {
        'type': 'sine',
        'volume': 80,
        'detune': 0,
        'freq': 110
    };

    var options = Object.assign({}, defaults, opt);

    // Analizer
    var analyser = new Analyser(context);

    // Master
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    gainNode.gain.value = 1;
    gainNode.connect(analyser._analyser);

    // Oscillator
    var oscillatorNode = context.createOscillator();
    oscillatorNode.type = 'sine';
    oscillatorNode.frequency.setValueAtTime(100, context.currentTime); // value in hertz
    oscillatorNode.connect(gainNode);
    oscillatorNode.start();

    // Creating UI elements
    var container = document.createElement('div');
    container.classList.add('oscillator');

    var visualizer = analyser.node();
    visualizer.id = 'visualizer';
    visualizer.style.width = '100%';
    visualizer.style.height = '100px';
    visualizer.style.display = 'block';

    var oscillatorTypes = [
        'sine',
        'square',
        'sawtooth',
        'triangle'
    ];

    var oscillatorTypeSelector = document.createElement('div');

    [].forEach.call(oscillatorTypes, function (e) {
        var rad = document.createElement('input');
        rad.type = 'radio';
        rad.name = 'oscillatorType';
        rad.value = e;
        if (e === 'sine') {
            rad.checked = true;
        }
        rad.classList.add('option-' + e);
        rad.onclick = function () {
            osc._oscillatorNode.type = this.value;
        };
        oscillatorTypeSelector.appendChild(rad);
    });

    var frequencySelector = document.createElement('input');
    frequencySelector.type = 'range';
    frequencySelector.min = 0;
    frequencySelector.max = 2000;
    var onchangeFrequency = function () {
        osc._oscillatorNode.frequency.setValueAtTime(this.value, siren._context.currentTime);
    };
    frequencySelector.addEventListener('input', onchangeFrequency);
    frequencySelector.addEventListener('click', onchangeFrequency);

    var detuneSelector = document.createElement('input');
    detuneSelector.type = 'range';
    detuneSelector.min = -100;
    detuneSelector.max = 100;
    detuneSelector.value = 0;
    var onchangeDetune = function () {
        osc._oscillatorNode.detune.setValueAtTime(this.value, osc._context.currentTime);
    };
    detuneSelector.addEventListener('input', onchangeDetune);
    detuneSelector.addEventListener('click', onchangeDetune);

    var volumeSelector = document.createElement('input');
    volumeSelector.type = 'range';
    volumeSelector.min = 0;
    volumeSelector.max = 100;
    volumeSelector.value = 100;
    var onchangeVolume = function () {
        osc._gainNode.gain.value = this.value / 100;
    };
    volumeSelector.addEventListener('input', onchangeVolume);
    volumeSelector.addEventListener('click', onchangeVolume);

    var osc = {
        '_context': context,
        '_gainNode': gainNode,
        '_container': container,
        '_analyser': analyser,
        '_oscillatorNode': oscillatorNode,
        '_frequencySelector': frequencySelector,
        '_oscillatorTypeSelector': oscillatorTypeSelector,


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

        /*
		 * Update the view.
		 */
		'redraw': function() {
			this._frequencySelector.value = this._properties.freq;
            this._oscillatorTypeSelector.value = this._properties.type;
		},

        'node': function () {
            return this._container;
        },

        'connect': function (source) {
            return this._gainNode.connect(source);
        },

        'setVolume': function (value) {
            this._properties.volume = value;
            this._gainNode.gain.value = value / 100;
        }
    };

    container.appendChild(visualizer);
    container.appendChild(oscillatorTypeSelector);
    container.appendChild(frequencySelector);
    container.appendChild(detuneSelector);
    container.appendChild(volumeSelector);

    // Finish initialize
    // osc.setVolume(0);
    // osc.visualize();

    return osc;
}
