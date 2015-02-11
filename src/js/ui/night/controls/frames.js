"use strict";
/*!
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import Control from "./control";
import SimpleSlider from "../lib/simple-slider";
import ColorPicker from "../lib/color-picker";
let fs = require("fs");

class FramesControls extends Control {
  /**
   * Entry point for this control
   */
  init () {
    super();

    let controlsTemplate = fs.readFileSync(__dirname + "/../../../templates/night/operations/frames_controls.jst", "utf-8");
    this._controlsTemplate = controlsTemplate;
    this._partialTemplates.push(SimpleSlider.template);
    this._partialTemplates.push(ColorPicker.template);
  }

  /**
   * Gets called when this control is activated
   * @override
   */
  _onEnter () {
    super();

    // Remember initial identity state
    this._initialIdentity = this._operation.isIdentity;

    this._initialOptions = {
      thickness: this._operation.getThickness(),
      color: this._operation.getColor()
    };

    this._operation.isIdentity = false;
    this._ui.canvas.render();

    // Init slider
    let sliderElement = this._controls.querySelector(".imglykit-slider");
    this._slider = new SimpleSlider(sliderElement, {
      minValue: 0.0,
      maxValue: 0.5
    });
    this._slider.on("update", this._onThicknessUpdate.bind(this));
    this._slider.setValue(this._initialOptions.thickness);

    // Init colorpicker
    let colorPickerElement = this._controls.querySelector(".imglykit-color-picker");
    this._colorPicker = new ColorPicker(this._ui, colorPickerElement);
    this._colorPicker.on("update", this._onColorUpdate.bind(this));
    this._colorPicker.setValue(this._initialOptions.color);
  }

  /**
   * Gets called when the back button has been clicked
   * @override
   */
  _onBack () {
    if (!this._initialIdentity) {
      this._operation.set(this._initialOptions);
    } else {
      this._operation.isIdentity = this._initialIdentity;
      this._ui.canvas.render();
    }
  }

  /**
   * Gets called when the thickness has been changed
   * @override
   */
  _onThicknessUpdate (value) {
    this._operation.setThickness(value);
  }

  /**
   * Gets called when the color has been changed
   * @override
   */
  _onColorUpdate (value) {
    this._operation.setColor(value);
  }
}

export default FramesControls;
