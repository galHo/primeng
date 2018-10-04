"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var shared_1 = require("../common/shared");
var messageservice_1 = require("../common/messageservice");
var animations_1 = require("@angular/animations");
var ToastItem = /** @class */ (function () {
    function ToastItem() {
        this.onClose = new core_1.EventEmitter();
    }
    ToastItem.prototype.ngAfterViewInit = function () {
        this.initTimeout();
    };
    ToastItem.prototype.initTimeout = function () {
        var _this = this;
        if (!this.message.sticky) {
            this.timeout = setTimeout(function () {
                _this.onClose.emit({
                    index: _this.index,
                    message: _this.message
                });
            }, this.message.life || 3000);
        }
    };
    ToastItem.prototype.clearTimeout = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    ToastItem.prototype.onMouseEnter = function () {
        this.clearTimeout();
    };
    ToastItem.prototype.onMouseLeave = function () {
        this.initTimeout();
    };
    ToastItem.prototype.onCloseIconClick = function (event) {
        this.clearTimeout();
        this.onClose.emit({
            index: this.index,
            message: this.message
        });
        event.preventDefault();
    };
    ToastItem.prototype.ngOnDestroy = function () {
        this.clearTimeout();
    };
    ToastItem.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-toastItem',
                    template: "\n        <div #container class=\"ui-toast-message ui-shadow\" [@messageState]=\"'visible'\"\n            [ngClass]=\"{'ui-toast-message-info': message.severity == 'info','ui-toast-message-warn': message.severity == 'warn',\n                'ui-toast-message-error': message.severity == 'error','ui-toast-message-success': message.severity == 'success'}\"\n                (mouseenter)=\"onMouseEnter()\" (mouseleave)=\"onMouseLeave()\">\n            <div class=\"ui-toast-message-content\">\n                <a href=\"#\" class=\"ui-toast-close-icon pi pi-times\" (click)=\"onCloseIconClick($event)\" *ngIf=\"message.closable !== false\"></a>\n                <ng-container *ngIf=\"!template\">\n                    <span class=\"ui-toast-icon pi\"\n                        [ngClass]=\"{'pi-info-circle': message.severity == 'info', 'pi-exclamation-triangle': message.severity == 'warn',\n                            'pi-times': message.severity == 'error', 'pi-check' :message.severity == 'success'}\"></span>\n                    <div class=\"ui-toast-message-text-content\">\n                        <div class=\"ui-toast-summary\">{{message.summary}}</div>\n                        <div class=\"ui-toast-detail\">{{message.detail}}</div>\n                    </div>\n                </ng-container>\n                <ng-container *ngTemplateOutlet=\"template; context: {$implicit: message}\"></ng-container>\n            </div>\n        </div>\n    ",
                    animations: [
                        animations_1.trigger('messageState', [
                            animations_1.state('visible', animations_1.style({
                                transform: 'translateY(0)',
                                opacity: 1
                            })),
                            animations_1.transition('void => *', [
                                animations_1.style({ transform: 'translateY(100%)', opacity: 0 }),
                                animations_1.animate('300ms ease-out')
                            ]),
                            animations_1.transition('* => void', [
                                animations_1.animate(('250ms ease-in'), animations_1.style({
                                    height: 0,
                                    opacity: 0,
                                    transform: 'translateY(-100%)'
                                }))
                            ])
                        ])
                    ],
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    ToastItem.propDecorators = {
        message: [{ type: core_1.Input }],
        index: [{ type: core_1.Input }],
        template: [{ type: core_1.Input }],
        onClose: [{ type: core_1.Output }],
        containerViewChild: [{ type: core_1.ViewChild, args: ['container',] }]
    };
    return ToastItem;
}());
exports.ToastItem = ToastItem;
var Toast = /** @class */ (function () {
    function Toast(messageService, domHandler) {
        this.messageService = messageService;
        this.domHandler = domHandler;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.position = 'top-right';
        this.onClose = new core_1.EventEmitter();
    }
    Toast.prototype.ngOnInit = function () {
        var _this = this;
        this.messageSubscription = this.messageService.messageObserver.subscribe(function (messages) {
            if (messages) {
                if (messages instanceof Array) {
                    var filteredMessages = messages.filter(function (m) { return _this.key === m.key; });
                    _this.messages = _this.messages ? _this.messages.concat(filteredMessages) : filteredMessages.slice();
                }
                else if (_this.key === messages.key) {
                    _this.messages = _this.messages ? _this.messages.concat([messages]) : [messages];
                }
                if (_this.modal && _this.messages && _this.messages.length) {
                    _this.enableModality();
                }
            }
        });
        this.clearSubscription = this.messageService.clearObserver.subscribe(function (key) {
            if (key) {
                if (_this.key === key) {
                    _this.messages = null;
                }
            }
            else {
                _this.messages = null;
            }
            if (_this.modal) {
                _this.disableModality();
            }
        });
    };
    Toast.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'message':
                    _this.template = item.template;
                    break;
                default:
                    _this.template = item.template;
                    break;
            }
        });
    };
    Toast.prototype.ngAfterViewInit = function () {
        if (this.autoZIndex) {
            this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++domhandler_1.DomHandler.zindex));
        }
    };
    Toast.prototype.onMessageClose = function (event) {
        this.messages.splice(event.index, 1);
        if (this.messages.length === 0) {
            this.disableModality();
        }
        this.onClose.emit({
            message: event.message
        });
    };
    Toast.prototype.enableModality = function () {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.containerViewChild.nativeElement.style.zIndex) - 1);
            var maskStyleClass = 'ui-widget-overlay ui-dialog-mask';
            this.domHandler.addMultipleClasses(this.mask, maskStyleClass);
            document.body.appendChild(this.mask);
        }
    };
    Toast.prototype.disableModality = function () {
        if (this.mask) {
            document.body.removeChild(this.mask);
            this.mask = null;
        }
    };
    Toast.prototype.ngOnDestroy = function () {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }
        this.disableModality();
    };
    Toast.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-toast',
                    template: "\n        <div #container [ngClass]=\"{'ui-toast ui-widget': true, \n                'ui-toast-top-right': position === 'top-right',\n                'ui-toast-top-left': position === 'top-left',\n                'ui-toast-bottom-right': position === 'bottom-right',\n                'ui-toast-bottom-left': position === 'bottom-left',\n                'ui-toast-top-center': position === 'top-center',\n                'ui-toast-bottom-center': position === 'bottom-center',\n                'ui-toast-center': position === 'center'}\" \n                [ngStyle]=\"style\" [class]=\"styleClass\">\n            <p-toastItem *ngFor=\"let msg of messages; let i=index\" [message]=\"msg\" [index]=\"i\" (onClose)=\"onMessageClose($event)\" [template]=\"template\" @toastAnimation></p-toastItem>\n        </div>\n    ",
                    animations: [
                        animations_1.trigger('toastAnimation', [
                            animations_1.transition(':enter, :leave', [
                                animations_1.query('@*', animations_1.animateChild())
                            ])
                        ])
                    ],
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    Toast.ctorParameters = function () { return [
        { type: messageservice_1.MessageService },
        { type: domhandler_1.DomHandler }
    ]; };
    Toast.propDecorators = {
        key: [{ type: core_1.Input }],
        autoZIndex: [{ type: core_1.Input }],
        baseZIndex: [{ type: core_1.Input }],
        style: [{ type: core_1.Input }],
        styleClass: [{ type: core_1.Input }],
        position: [{ type: core_1.Input }],
        modal: [{ type: core_1.Input }],
        onClose: [{ type: core_1.Output }],
        containerViewChild: [{ type: core_1.ViewChild, args: ['container',] }],
        templates: [{ type: core_1.ContentChildren, args: [shared_1.PrimeTemplate,] }]
    };
    return Toast;
}());
exports.Toast = Toast;
var ToastModule = /** @class */ (function () {
    function ToastModule() {
    }
    ToastModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    exports: [Toast, shared_1.SharedModule],
                    declarations: [Toast, ToastItem]
                },] },
    ];
    return ToastModule;
}());
exports.ToastModule = ToastModule;
//# sourceMappingURL=toast.js.map