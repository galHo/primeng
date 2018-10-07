"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var objectutils_1 = require("../utils/objectutils");
var shared_1 = require("../common/shared");
var forms_1 = require("@angular/forms");
var util_1 = require("util");
exports.MULTISELECT_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MultiSelect; }),
    multi: true
};
var MultiSelect = /** @class */ (function () {
    function MultiSelect(el, domHandler, renderer, objectUtils, cd) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.objectUtils = objectUtils;
        this.cd = cd;
        this.scrollHeight = '200px';
        this.defaultLabel = 'Choose';
        this.filter = true;
        this.displaySelectedLabel = true;
        this.maxSelectedLabels = 3;
        this.selectedItemsLabel = '{0} items selected';
        this.showToggleAll = true;
        this.resetFilterOnHide = false;
        this.dropdownIcon = 'pi pi-caret-down';
        this.showHeader = true;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.onChange = new core_1.EventEmitter();
        this.onFocus = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.onPanelShow = new core_1.EventEmitter();
        this.onPanelHide = new core_1.EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    Object.defineProperty(MultiSelect.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (val) {
            var opts = this.optionLabel ? this.objectUtils.generateSelectItems(val, this.optionLabel) : val;
            this._options = opts;
            this.updateLabel();
        },
        enumerable: true,
        configurable: true
    });
    MultiSelect.prototype.ngOnInit = function () {
        this.updateLabel();
    };
    MultiSelect.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'item':
                    _this.itemTemplate = item.template;
                    break;
                case 'selectedItems':
                    _this.selectedItemsTemplate = item.template;
                    break;
                default:
                    _this.itemTemplate = item.template;
                    break;
            }
        });
    };
    MultiSelect.prototype.ngAfterViewInit = function () {
        if (this.overlayVisible) {
            this.show();
        }
    };
    MultiSelect.prototype.ngAfterViewChecked = function () {
        if (this.filtered) {
            this.alignOverlay();
            this.filtered = false;
        }
    };
    MultiSelect.prototype.writeValue = function (value) {
        this.value = value;
        this.updateLabel();
        this.updateFilledState();
        this.cd.markForCheck();
    };
    MultiSelect.prototype.updateFilledState = function () {
        this.filled = (this.valuesAsString != null && this.valuesAsString.length > 0);
    };
    MultiSelect.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    MultiSelect.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    MultiSelect.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    MultiSelect.prototype.onItemClick = function (event, option) {
        if (option.disabled) {
            return;
        }
        var value = option.value;
        var selectionIndex = this.findSelectionIndex(value);
        if (selectionIndex != -1) {
            this.value = this.value.filter(function (val, i) { return i != selectionIndex; });
            if (this.selectionLimit) {
                this.maxSelectionLimitReached = false;
            }
        }
        else {
            if (!this.selectionLimit || (this.value.length < this.selectionLimit)) {
                this.value = (this.value || []).concat([value]);
            }
            if (this.selectionLimit && this.value.length === this.selectionLimit) {
                this.maxSelectionLimitReached = true;
            }
        }
        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value, itemValue: value });
        this.updateLabel();
        this.updateFilledState();
    };
    MultiSelect.prototype.isSelected = function (value) {
        return this.findSelectionIndex(value) != -1;
    };
    MultiSelect.prototype.findSelectionIndex = function (val) {
        var index = -1;
        if (this.value) {
            for (var i = 0; i < this.value.length; i++) {
                if (this.objectUtils.equals(this.value[i], val, this.dataKey)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };
    MultiSelect.prototype.toggleAll = function (event, checkbox) {
        if (checkbox.checked) {
            this.value = [];
        }
        else {
            var opts = this.getVisibleOptions();
            if (opts) {
                this.value = [];
                for (var i = 0; i < opts.length; i++) {
                    var option = opts[i];
                    if (!option.disabled) {
                        this.value.push(opts[i].value);
                    }
                }
            }
        }
        checkbox.checked = !checkbox.checked;
        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value });
        this.updateLabel();
    };
    MultiSelect.prototype.isAllChecked = function () {
        if (this.filterValue && this.filterValue.trim().length) {
            return this.value && this.visibleOptions && this.visibleOptions.length && (this.value.length == this.visibleOptions.length);
        }
        else {
            var optionCount = this.getEnabledOptionCount();
            return this.value && this.options && (this.value.length > 0 && this.value.length == optionCount);
        }
    };
    MultiSelect.prototype.getEnabledOptionCount = function () {
        if (this.options) {
            var count = 0;
            for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                var opt = _a[_i];
                if (!opt.disabled) {
                    count++;
                }
            }
            return count;
        }
        else {
            return 0;
        }
    };
    MultiSelect.prototype.show = function () {
        var _this = this;
        this.overlayVisible = true;
        if (this.showHeader) {
            setTimeout(function () {
                _this.header.nativeElement.focus();
            });
        }
        this.bindDocumentClickListener();
    };
    MultiSelect.prototype.onOverlayAnimationStart = function (event) {
        switch (event.toState) {
            case 'visible':
                this.overlay = event.element;
                this.appendOverlay();
                if (this.autoZIndex) {
                    this.overlay.style.zIndex = String(this.baseZIndex + (++domhandler_1.DomHandler.zindex));
                }
                this.alignOverlay();
                this.bindDocumentClickListener();
                this.onPanelShow.emit();
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    };
    MultiSelect.prototype.appendOverlay = function () {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                this.domHandler.appendChild(this.overlay, this.appendTo);
            this.overlay.style.minWidth = this.domHandler.getWidth(this.containerViewChild.nativeElement) + 'px';
        }
    };
    MultiSelect.prototype.restoreOverlayAppend = function () {
        if (this.overlay && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    };
    MultiSelect.prototype.alignOverlay = function () {
        if (this.overlay) {
            if (this.appendTo)
                this.domHandler.absolutePosition(this.overlay, this.containerViewChild.nativeElement);
            else
                this.domHandler.relativePosition(this.overlay, this.containerViewChild.nativeElement);
        }
    };
    MultiSelect.prototype.hide = function () {
        this.overlayVisible = false;
        this.unbindDocumentClickListener();
        if (this.resetFilterOnHide) {
            this.filterValue = null;
            this.filterInputChild.nativeElement.value = null;
        }
        this.onPanelHide.emit();
    };
    MultiSelect.prototype.close = function (event) {
        this.hide();
        event.preventDefault();
        event.stopPropagation();
    };
    MultiSelect.prototype.onMouseclick = function (event, input) {
        if (this.disabled) {
            return;
        }
        if (!this.panelClick) {
            if (this.overlayVisible) {
                this.hide();
            }
            else {
                input.focus();
                this.show();
            }
        }
        this.selfClick = true;
    };
    MultiSelect.prototype.onInputFocus = function (event) {
        this.focus = true;
        this.onFocus.emit({ originalEvent: event });
    };
    MultiSelect.prototype.onInputBlur = function (event) {
        this.focus = false;
        this.onBlur.emit({ originalEvent: event });
        this.onModelTouched();
    };
    MultiSelect.prototype.onInputKeydown = function (event) {
        var _this = this;
        switch (event.which) {
            //down
            case 40:
                if (!this.overlayVisible && event.altKey) {
                    this.show();
                }
                else {
                    var nextEnabledOptionIndex_1 = this.findNextEnabledOption(this.focusedOptionIndex);
                    this.itemcb.forEach(function (d, i) {
                        if (i === nextEnabledOptionIndex_1) {
                            d.nativeElement.focus();
                        }
                    });
                }
                event.preventDefault();
                break;
            //up
            case 38:
                if (!this.overlayVisible && event.altKey) {
                    this.show();
                }
                else {
                    var previousEnabledOptionIndex_1 = this.findPreviousEnabledOption(this.focusedOptionIndex);
                    this.itemcb.forEach(function (d, i) {
                        if (i === previousEnabledOptionIndex_1) {
                            d.nativeElement.focus();
                        }
                    });
                }
                event.preventDefault();
                break;
            //escape
            case 27:
                this.hide();
                break;
            //space
            case 32:
                if (!this.overlayVisible) {
                    this.show();
                    event.preventDefault();
                }
                break;
            // enter
            case 13:
                if (this.overlayVisible) {
                    var option = this.options[this.focusedOptionIndex];
                    if (option && !option.disabled) {
                        this.itemcb.forEach(function (d, i) {
                            if (i === _this.focusedOptionIndex) {
                                d.nativeElement.click();
                            }
                        });
                    }
                    this.hide();
                    event.preventDefault();
                }
                break;
        }
    };
    MultiSelect.prototype.findNextEnabledOption = function (index) {
        var nextEnabledOptionIndex = null;
        if (!util_1.isNumber(index)) {
            return 0;
        }
        if (this.options.length) {
            for (var i = (index + 1); index < (this.options.length - 1); i++) {
                var option = this.options[i];
                if (option.disabled) {
                    continue;
                }
                else {
                    nextEnabledOptionIndex = i;
                    break;
                }
            }
            if (!nextEnabledOptionIndex) {
                for (var i = 0; i < index; i++) {
                    var option = this.options[i];
                    if (option.disabled) {
                        continue;
                    }
                    else {
                        nextEnabledOptionIndex = i;
                        break;
                    }
                }
            }
        }
        return nextEnabledOptionIndex;
    };
    MultiSelect.prototype.findPreviousEnabledOption = function (index) {
        var previousEnabledOptionIndex = null;
        if (!util_1.isNumber(index)) {
            return 0;
        }
        if (this.options.length) {
            for (var i = (index - 1); index > 0; i--) {
                var option = this.options[i];
                if (option.disabled) {
                    continue;
                }
                else {
                    previousEnabledOptionIndex = i;
                    break;
                }
            }
            if (!util_1.isNumber(previousEnabledOptionIndex)) {
                for (var i = (this.options.length - 1); i >= 0; i--) {
                    var option = this.options[i];
                    if (option.disabled) {
                        continue;
                    }
                    else {
                        previousEnabledOptionIndex = i;
                        break;
                    }
                }
            }
        }
        return previousEnabledOptionIndex;
    };
    MultiSelect.prototype.updateLabel = function () {
        if (this.value && this.options && this.value.length && this.displaySelectedLabel) {
            var label = '';
            for (var i = 0; i < this.value.length; i++) {
                var itemLabel = this.findLabelByValue(this.value[i]);
                if (itemLabel) {
                    if (label.length > 0) {
                        label = label + ', ';
                    }
                    label = label + itemLabel;
                }
            }
            if (this.value.length <= this.maxSelectedLabels) {
                this.valuesAsString = label;
            }
            else {
                var pattern = /{(.*?)}/;
                if (pattern.test(this.selectedItemsLabel)) {
                    this.valuesAsString = this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.value.length + '');
                }
            }
        }
        else {
            this.valuesAsString = this.defaultLabel;
        }
    };
    MultiSelect.prototype.findLabelByValue = function (val) {
        var label = null;
        for (var i = 0; i < this.options.length; i++) {
            var option = this.options[i];
            if (val == null && option.value == null || this.objectUtils.equals(val, option.value, this.dataKey)) {
                label = option.label;
                break;
            }
        }
        return label;
    };
    MultiSelect.prototype.onFilter = function (event) {
        this.filterValue = event.target.value.trim().toLowerCase();
        this.visibleOptions = [];
        for (var i = 0; i < this.options.length; i++) {
            var option = this.options[i];
            if (option.label.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1) {
                this.visibleOptions.push(option);
            }
        }
        this.filtered = true;
    };
    MultiSelect.prototype.isItemVisible = function (option) {
        if (this.filterValue && this.filterValue.trim().length) {
            for (var i = 0; i < this.visibleOptions.length; i++) {
                if (this.visibleOptions[i].value == option.value) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    };
    MultiSelect.prototype.getVisibleOptions = function () {
        if (this.visibleOptions && this.visibleOptions.length) {
            return this.visibleOptions;
        }
        else {
            return this.options;
        }
    };
    MultiSelect.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.selfClick && !_this.panelClick && _this.overlayVisible) {
                    _this.hide();
                }
                _this.selfClick = false;
                _this.panelClick = false;
                _this.cd.markForCheck();
            });
        }
    };
    MultiSelect.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    MultiSelect.prototype.onOverlayHide = function () {
        this.unbindDocumentClickListener();
        this.overlay = null;
    };
    MultiSelect.prototype.ngOnDestroy = function () {
        this.restoreOverlayAppend();
        this.onOverlayHide();
    };
    MultiSelect.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-multiSelect',
                    template: "\n        <div #container [ngClass]=\"{'ui-multiselect ui-widget ui-state-default ui-corner-all':true,'ui-multiselect-open':overlayVisible,'ui-state-focus':focus,'ui-state-disabled': disabled}\" [ngStyle]=\"style\" [class]=\"styleClass\"\n             (click)=\"onMouseclick($event,in)\">\n            <div class=\"ui-helper-hidden-accessible\">\n                <input #in type=\"text\" readonly=\"readonly\" [attr.id]=\"inputId\" [attr.name]=\"name\" (focus)=\"onInputFocus($event)\" (blur)=\"onInputBlur($event)\" [disabled]=\"disabled\" [attr.tabindex]=\"tabindex\" (keydown)=\"onInputKeydown($event)\">\n            </div>\n            <div class=\"ui-multiselect-label-container\" [title]=\"valuesAsString\">\n                <label class=\"ui-multiselect-label ui-corner-all\">\n                    <ng-container *ngIf=\"!selectedItemsTemplate\">{{valuesAsString}}</ng-container>\n                    <ng-container *ngTemplateOutlet=\"selectedItemsTemplate; context: {$implicit: value}\"></ng-container>\n                </label>\n            </div>\n            <div [ngClass]=\"{'ui-multiselect-trigger ui-state-default ui-corner-right':true}\">\n                <span class=\"ui-multiselect-trigger-icon ui-clickable\" [ngClass]=\"dropdownIcon\"></span>\n            </div>\n            <div *ngIf=\"overlayVisible\" [ngClass]=\"['ui-multiselect-panel ui-widget ui-widget-content ui-corner-all ui-shadow']\"\n                 [@overlayAnimation]=\"'visible'\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\"\n                 [ngStyle]=\"panelStyle\" [class]=\"panelStyleClass\" (click)=\"panelClick=true\"\n                 (keydown)=\"onInputKeydown($event)\">\n                <div #header class=\"ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix\"\n                     [ngClass]=\"{'ui-multiselect-header-no-toggleall': !showToggleAll}\" *ngIf=\"showHeader\">\n                    <div class=\"ui-chkbox ui-widget\" *ngIf=\"showToggleAll && !selectionLimit\">\n                        <div class=\"ui-helper-hidden-accessible\">\n                            <input #cb type=\"checkbox\" readonly=\"readonly\" [checked]=\"isAllChecked()\">\n                        </div>\n                        <div class=\"ui-chkbox-box ui-widget ui-corner-all ui-state-default\" [ngClass]=\"{'ui-state-active':isAllChecked()}\" (click)=\"toggleAll($event,cb)\">\n                            <span class=\"ui-chkbox-icon ui-clickable\" [ngClass]=\"{'pi pi-check':isAllChecked()}\"></span>\n                        </div>\n                    </div>\n                    <div class=\"ui-multiselect-filter-container\" *ngIf=\"filter\">\n                        <input #filterInput type=\"text\" role=\"textbox\" [value]=\"filterValue||''\" (input)=\"onFilter($event)\" class=\"ui-inputtext ui-widget ui-state-default ui-corner-all\" [attr.placeholder]=\"filterPlaceHolder\">\n                        <span class=\"ui-multiselect-filter-icon pi pi-search\"></span>\n                    </div>\n                    <a class=\"ui-multiselect-close ui-corner-all\" href=\"#\" (click)=\"close($event)\">\n                        <span class=\"pi pi-times\"></span>\n                    </a>\n                </div>\n                <div class=\"ui-multiselect-items-wrapper\" [style.max-height]=\"scrollHeight||'auto'\">\n                    <ul class=\"ui-multiselect-items ui-multiselect-list ui-widget-content ui-widget ui-corner-all ui-helper-reset\">\n                        <li *ngFor=\"let option of options; let i = index\" class=\"ui-multiselect-item ui-corner-all\" (click)=\"onItemClick($event,option)\"\n                            [style.display]=\"isItemVisible(option) ? 'block' : 'none'\"\n                            [ngClass]=\"{'ui-state-highlight': isSelected(option.value), 'ui-state-disabled': option.disabled || (maxSelectionLimitReached && !isSelected(option.value))}\">\n                            <div class=\"ui-chkbox ui-widget\">\n                                <div class=\"ui-helper-hidden-accessible\">\n                                    <input #itemcb type=\"checkbox\" readonly=\"readonly\" [checked]=\"isSelected(option.value)\"\n                                           (focus)=\"focusedItemCheckbox=itemcb; focusedOptionIndex=i\"\n                                           (blur)=\"focusedItemCheckbox=null; focusedOptionIndex=null\"\n                                           [attr.aria-label]=\"option.label\"\n                                           [disabled]=\"option.disabled || (maxSelectionLimitReached && !isSelected(option.value))\">\n                                </div>\n                                <div class=\"ui-chkbox-box ui-widget ui-corner-all ui-state-default\"\n                                     [ngClass]=\"{'ui-state-active': isSelected(option.value),\n                                                'ui-state-focus': (focusedItemCheckbox === itemcb)}\">\n                                    <span class=\"ui-chkbox-icon ui-clickable\" [ngClass]=\"{'pi pi-check':isSelected(option.value)}\"></span>\n                                </div>\n                            </div>\n                            <label *ngIf=\"!itemTemplate\">{{option.label}}</label>\n                            <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: option, index: i}\"></ng-container>\n                        </li>\n                    </ul>\n                </div>\n                <div class=\"ui-multiselect-footer ui-widget-content\" *ngIf=\"footerFacet\">\n                    <ng-content select=\"p-footer\"></ng-content>\n                </div>\n            </div>\n        </div>\n    ",
                    animations: [
                        animations_1.trigger('overlayAnimation', [
                            animations_1.state('void', animations_1.style({
                                transform: 'translateY(5%)',
                                opacity: 0
                            })),
                            animations_1.state('visible', animations_1.style({
                                transform: 'translateY(0)',
                                opacity: 1
                            })),
                            animations_1.transition('void => visible', animations_1.animate('225ms ease-out')),
                            animations_1.transition('visible => void', animations_1.animate('195ms ease-in'))
                        ])
                    ],
                    host: {
                        '[class.ui-inputwrapper-filled]': 'filled',
                        '[class.ui-inputwrapper-focus]': 'focus'
                    },
                    providers: [domhandler_1.DomHandler, objectutils_1.ObjectUtils, exports.MULTISELECT_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    MultiSelect.ctorParameters = function () { return [
        { type: core_1.ElementRef },
        { type: domhandler_1.DomHandler },
        { type: core_1.Renderer2 },
        { type: objectutils_1.ObjectUtils },
        { type: core_1.ChangeDetectorRef }
    ]; };
    MultiSelect.propDecorators = {
        scrollHeight: [{ type: core_1.Input }],
        defaultLabel: [{ type: core_1.Input }],
        style: [{ type: core_1.Input }],
        styleClass: [{ type: core_1.Input }],
        panelStyle: [{ type: core_1.Input }],
        panelStyleClass: [{ type: core_1.Input }],
        inputId: [{ type: core_1.Input }],
        disabled: [{ type: core_1.Input }],
        filter: [{ type: core_1.Input }],
        filterPlaceHolder: [{ type: core_1.Input }],
        overlayVisible: [{ type: core_1.Input }],
        tabindex: [{ type: core_1.Input }],
        appendTo: [{ type: core_1.Input }],
        dataKey: [{ type: core_1.Input }],
        name: [{ type: core_1.Input }],
        displaySelectedLabel: [{ type: core_1.Input }],
        maxSelectedLabels: [{ type: core_1.Input }],
        selectionLimit: [{ type: core_1.Input }],
        selectedItemsLabel: [{ type: core_1.Input }],
        showToggleAll: [{ type: core_1.Input }],
        resetFilterOnHide: [{ type: core_1.Input }],
        dropdownIcon: [{ type: core_1.Input }],
        optionLabel: [{ type: core_1.Input }],
        showHeader: [{ type: core_1.Input }],
        autoZIndex: [{ type: core_1.Input }],
        baseZIndex: [{ type: core_1.Input }],
        containerViewChild: [{ type: core_1.ViewChild, args: ['container',] }],
        filterInputChild: [{ type: core_1.ViewChild, args: ['filterInput',] }],
        header: [{ type: core_1.ViewChild, args: ['header',] }],
        itemcb: [{ type: core_1.ViewChildren, args: ['itemcb',] }],
        footerFacet: [{ type: core_1.ContentChild, args: [shared_1.Footer,] }],
        templates: [{ type: core_1.ContentChildren, args: [shared_1.PrimeTemplate,] }],
        onChange: [{ type: core_1.Output }],
        onFocus: [{ type: core_1.Output }],
        onBlur: [{ type: core_1.Output }],
        onPanelShow: [{ type: core_1.Output }],
        onPanelHide: [{ type: core_1.Output }],
        options: [{ type: core_1.Input }]
    };
    return MultiSelect;
}());
exports.MultiSelect = MultiSelect;
var MultiSelectModule = /** @class */ (function () {
    function MultiSelectModule() {
    }
    MultiSelectModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule, shared_1.SharedModule],
                    exports: [MultiSelect, shared_1.SharedModule],
                    declarations: [MultiSelect]
                },] },
    ];
    return MultiSelectModule;
}());
exports.MultiSelectModule = MultiSelectModule;
//# sourceMappingURL=multiselect.js.map