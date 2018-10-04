"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var domhandler_1 = require("../dom/domhandler");
exports.INPUTSWITCH_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return InputSwitch; }),
    multi: true
};
var InputSwitch = /** @class */ (function () {
    function InputSwitch(cd) {
        this.cd = cd;
        this.onChange = new core_1.EventEmitter();
        this.checked = false;
        this.focused = false;
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    InputSwitch.prototype.onClick = function (event, cb) {
        this.toggle(event);
        cb.focus();
    };
    InputSwitch.prototype.onInputChange = function (event) {
        var inputChecked = event.target.checked;
        this.updateModel(event, inputChecked);
    };
    InputSwitch.prototype.toggle = function (event) {
        if (!this.disabled) {
            this.updateModel(event, !this.checked);
        }
    };
    InputSwitch.prototype.updateModel = function (event, value) {
        this.checked = value;
        this.onModelChange(this.checked);
        this.onChange.emit({
            originalEvent: event,
            checked: this.checked
        });
    };
    InputSwitch.prototype.onFocus = function (event) {
        this.focused = true;
    };
    InputSwitch.prototype.onBlur = function (event) {
        this.focused = false;
        this.onModelTouched();
    };
    InputSwitch.prototype.writeValue = function (checked) {
        this.checked = checked;
        this.cd.markForCheck();
    };
    InputSwitch.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    InputSwitch.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    InputSwitch.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    InputSwitch.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-inputSwitch',
                    template: "\n        <div [ngClass]=\"{'ui-inputswitch ui-widget': true, 'ui-inputswitch-checked': checked, 'ui-state-disabled': disabled, 'ui-inputswitch-focus': focused}\" \n            [ngStyle]=\"style\" [class]=\"styleClass\" (click)=\"onClick($event, cb)\" role=\"checkbox\" [attr.aria-checked]=\"checked\">\n            <div class=\"ui-helper-hidden-accessible\">\n                <input #cb type=\"checkbox\" [attr.id]=\"inputId\" [attr.name]=\"name\" [attr.tabindex]=\"tabindex\" [checked]=\"checked\" (change)=\"onInputChange($event)\"\n                        (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [disabled]=\"disabled\" />\n            </div>\n            <span class=\"ui-inputswitch-slider\"></span>\n        </div>\n    ",
                    providers: [exports.INPUTSWITCH_VALUE_ACCESSOR, domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    InputSwitch.ctorParameters = function () { return [
        { type: core_1.ChangeDetectorRef }
    ]; };
    InputSwitch.propDecorators = {
        style: [{ type: core_1.Input }],
        styleClass: [{ type: core_1.Input }],
        tabindex: [{ type: core_1.Input }],
        inputId: [{ type: core_1.Input }],
        name: [{ type: core_1.Input }],
        disabled: [{ type: core_1.Input }],
        onChange: [{ type: core_1.Output }]
    };
    return InputSwitch;
}());
exports.InputSwitch = InputSwitch;
var InputSwitchModule = /** @class */ (function () {
    function InputSwitchModule() {
    }
    InputSwitchModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    exports: [InputSwitch],
                    declarations: [InputSwitch]
                },] },
    ];
    return InputSwitchModule;
}());
exports.InputSwitchModule = InputSwitchModule;
//# sourceMappingURL=inputswitch.js.map