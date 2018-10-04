"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var inputtext_1 = require("../inputtext/inputtext");
var domhandler_1 = require("../dom/domhandler");
var forms_1 = require("@angular/forms");
exports.SPINNER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return Spinner; }),
    multi: true
};
var Spinner = /** @class */ (function () {
    function Spinner(el, domHandler) {
        this.el = el;
        this.domHandler = domHandler;
        this.onChange = new core_1.EventEmitter();
        this.onFocus = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.step = 1;
        this.type = 'text';
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
        this.keyPattern = /[0-9\+\-]/;
        this.negativeSeparator = '-';
    }
    Object.defineProperty(Spinner.prototype, "decimalSeparator", {
        set: function (value) {
            console.warn("decimalSeparator property is removed Spinner as Spinner does not format the value anymore.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinner.prototype, "thousandSeparator", {
        set: function (value) {
            console.warn("thousandSeparator property is removed Spinner as Spinner does not format the value anymore.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spinner.prototype, "formatInput", {
        set: function (value) {
            console.warn("formatInput property is removed Spinner as Spinner does not format the value anymore.");
        },
        enumerable: true,
        configurable: true
    });
    Spinner.prototype.ngOnInit = function () {
        if (Math.floor(this.step) === 0) {
            this.precision = this.step.toString().split(/[,]|[.]/)[1].length;
        }
    };
    Spinner.prototype.repeat = function (event, interval, dir) {
        var _this = this;
        var i = interval || 500;
        this.clearTimer();
        this.timer = setTimeout(function () {
            _this.repeat(event, 40, dir);
        }, i);
        this.spin(event, dir);
    };
    Spinner.prototype.spin = function (event, dir) {
        var step = this.step * dir;
        var currentValue;
        if (this.value)
            currentValue = (typeof this.value === 'string') ? this.parseValue(this.value) : this.value;
        else
            currentValue = 0;
        if (this.precision)
            this.value = parseFloat(this.toFixed(currentValue + step, this.precision));
        else
            this.value = currentValue + step;
        if (this.maxlength !== undefined && this.value.toString().length > this.maxlength) {
            this.value = currentValue;
        }
        if (this.min !== undefined && this.value < this.min) {
            this.value = this.min;
        }
        if (this.max !== undefined && this.value > this.max) {
            this.value = this.max;
        }
        this.onModelChange(this.value);
        this.onChange.emit(event);
    };
    Spinner.prototype.toFixed = function (value, precision) {
        var power = Math.pow(10, precision || 0);
        return String(Math.round(value * power) / power);
    };
    Spinner.prototype.onUpButtonMousedown = function (event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, 1);
            this.updateFilledState();
            event.preventDefault();
        }
    };
    Spinner.prototype.onUpButtonMouseup = function (event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    };
    Spinner.prototype.onUpButtonMouseleave = function (event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    };
    Spinner.prototype.onDownButtonMousedown = function (event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, -1);
            this.updateFilledState();
            event.preventDefault();
        }
    };
    Spinner.prototype.onDownButtonMouseup = function (event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    };
    Spinner.prototype.onDownButtonMouseleave = function (event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    };
    Spinner.prototype.onInputKeydown = function (event) {
        if (event.which == 38) {
            this.spin(event, 1);
            event.preventDefault();
        }
        else if (event.which == 40) {
            this.spin(event, -1);
            event.preventDefault();
        }
    };
    Spinner.prototype.onInputChange = function (event) {
        this.onChange.emit(event);
    };
    Spinner.prototype.onInput = function (event) {
        this.value = event.target.value;
        this.onModelChange(this.value);
    };
    Spinner.prototype.onInputBlur = function (event) {
        this.value = this.parseValue(event.target.value);
        this.onModelChange(this.value);
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    };
    Spinner.prototype.onInputFocus = function (event) {
        this.focus = true;
        this.onFocus.emit(event);
    };
    Spinner.prototype.parseValue = function (val) {
        var value;
        if (val.trim() === '') {
            value = this.min != null ? this.min : null;
        }
        else {
            if (this.precision)
                value = parseFloat(val.replace(',', '.'));
            else
                value = parseInt(val, 10);
            if (!isNaN(value)) {
                if (this.max !== null && value > this.max) {
                    value = this.max;
                }
                if (this.min !== null && value < this.min) {
                    value = this.min;
                }
            }
            else {
                value = null;
            }
        }
        return value;
    };
    Spinner.prototype.clearTimer = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };
    Spinner.prototype.writeValue = function (value) {
        this.value = value;
        this.updateFilledState();
    };
    Spinner.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    Spinner.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    Spinner.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    Spinner.prototype.updateFilledState = function () {
        this.filled = (this.value !== undefined && this.value != null);
    };
    Spinner.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-spinner',
                    template: "\n        <span class=\"ui-spinner ui-widget ui-corner-all\">\n            <input #inputfield [attr.type]=\"type\" [attr.id]=\"inputId\" [value]=\"value === 0 ? '0' : value||null\" [attr.name]=\"name\"\n            [attr.size]=\"size\" [attr.maxlength]=\"maxlength\" [attr.tabindex]=\"tabindex\" [attr.placeholder]=\"placeholder\" [disabled]=\"disabled\" [attr.readonly]=\"readonly\" [attr.required]=\"required\"\n            (keydown)=\"onInputKeydown($event)\" (blur)=\"onInputBlur($event)\" (input)=\"onInput($event)\" (change)=\"onInputChange($event)\" (focus)=\"onInputFocus($event)\"\n            [ngStyle]=\"inputStyle\" [class]=\"inputStyleClass\" [ngClass]=\"'ui-spinner-input ui-inputtext ui-widget ui-state-default ui-corner-all'\">\n            <button type=\"button\" [ngClass]=\"{'ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}\" [disabled]=\"disabled\" [attr.readonly]=\"readonly\"\n                (mouseleave)=\"onUpButtonMouseleave($event)\" (mousedown)=\"onUpButtonMousedown($event)\" (mouseup)=\"onUpButtonMouseup($event)\">\n                <span class=\"ui-spinner-button-icon pi pi-caret-up ui-clickable\"></span>\n            </button>\n            <button type=\"button\" [ngClass]=\"{'ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}\" [disabled]=\"disabled\" [attr.readonly]=\"readonly\"\n                (mouseleave)=\"onDownButtonMouseleave($event)\" (mousedown)=\"onDownButtonMousedown($event)\" (mouseup)=\"onDownButtonMouseup($event)\">\n                <span class=\"ui-spinner-button-icon pi pi-caret-down ui-clickable\"></span>\n            </button>\n        </span>\n    ",
                    host: {
                        '[class.ui-inputwrapper-filled]': 'filled',
                        '[class.ui-inputwrapper-focus]': 'focus'
                    },
                    providers: [domhandler_1.DomHandler, exports.SPINNER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    Spinner.ctorParameters = function () { return [
        { type: core_1.ElementRef },
        { type: domhandler_1.DomHandler }
    ]; };
    Spinner.propDecorators = {
        onChange: [{ type: core_1.Output }],
        onFocus: [{ type: core_1.Output }],
        onBlur: [{ type: core_1.Output }],
        step: [{ type: core_1.Input }],
        min: [{ type: core_1.Input }],
        max: [{ type: core_1.Input }],
        maxlength: [{ type: core_1.Input }],
        size: [{ type: core_1.Input }],
        placeholder: [{ type: core_1.Input }],
        inputId: [{ type: core_1.Input }],
        disabled: [{ type: core_1.Input }],
        readonly: [{ type: core_1.Input }],
        tabindex: [{ type: core_1.Input }],
        type: [{ type: core_1.Input }],
        required: [{ type: core_1.Input }],
        name: [{ type: core_1.Input }],
        inputStyle: [{ type: core_1.Input }],
        inputStyleClass: [{ type: core_1.Input }],
        inputfieldViewChild: [{ type: core_1.ViewChild, args: ['inputfield',] }],
        decimalSeparator: [{ type: core_1.Input }],
        thousandSeparator: [{ type: core_1.Input }],
        formatInput: [{ type: core_1.Input }]
    };
    return Spinner;
}());
exports.Spinner = Spinner;
var SpinnerModule = /** @class */ (function () {
    function SpinnerModule() {
    }
    SpinnerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule, inputtext_1.InputTextModule],
                    exports: [Spinner],
                    declarations: [Spinner]
                },] },
    ];
    return SpinnerModule;
}());
exports.SpinnerModule = SpinnerModule;
//# sourceMappingURL=spinner.js.map