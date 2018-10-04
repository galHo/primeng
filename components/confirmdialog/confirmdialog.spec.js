"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var confirmdialog_1 = require("./confirmdialog");
var animations_1 = require("@angular/platform-browser/animations");
var core_1 = require("@angular/core");
var api_1 = require("../common/api");
var TestConfirmDialogComponent = /** @class */ (function () {
    function TestConfirmDialogComponent(confirmationService) {
        this.confirmationService = confirmationService;
        this.msgs = [];
    }
    TestConfirmDialogComponent.prototype.confirm1 = function () {
        var _this = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: function () {
                _this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
            },
            reject: function () {
                _this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
            }
        });
    };
    TestConfirmDialogComponent.decorators = [
        { type: core_1.Component, args: [{
                    template: "<p-confirmDialog></p-confirmDialog>\n\n  <button type=\"button\" (click)=\"confirm1()\" pButton icon=\"pi pi-check\" label=\"Confirm\"></button>\n    \n  <p-messages [value]=\"msgs\"></p-messages>"
                },] },
    ];
    /** @nocollapse */
    TestConfirmDialogComponent.ctorParameters = function () { return [
        { type: api_1.ConfirmationService }
    ]; };
    return TestConfirmDialogComponent;
}());
describe('ConfirmDialog', function () {
    var confirmDialog;
    var testComponent;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            schemas: [core_1.NO_ERRORS_SCHEMA],
            imports: [
                animations_1.NoopAnimationsModule
            ],
            declarations: [
                confirmdialog_1.ConfirmDialog,
                TestConfirmDialogComponent,
            ],
            providers: [
                api_1.ConfirmationService
            ]
        });
        fixture = testing_1.TestBed.createComponent(TestConfirmDialogComponent);
        confirmDialog = fixture.debugElement.query(platform_browser_1.By.css('p-confirmDialog')).componentInstance;
        testComponent = fixture.debugElement.componentInstance;
    });
    it('should display the header', function () {
        confirmDialog.header = "PrimengRocks!";
        confirmDialog.visible = true;
        fixture.detectChanges();
        var confirmDialogEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-title')).nativeElement;
        expect(confirmDialogEl).toBeTruthy();
        expect(confirmDialogEl.textContent).toContain('PrimengRocks!');
    });
    it('should display the close icon when closable is true', function () {
        confirmDialog.visible = true;
        fixture.detectChanges();
        var closeEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-titlebar-icon'));
        expect(closeEl).not.toBeNull();
    });
    it('should not create the container element by default', function () {
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog'))).toBeFalsy;
        expect(confirmDialog.visible).toEqual(undefined);
    });
    it('should add rtl class when rtl is enabled', function () {
        confirmDialog.visible = true;
        confirmDialog.rtl = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('div')).classes['ui-dialog-rtl']).toEqual(true);
    });
    it('should not have a close icon', function () {
        confirmDialog.visible = true;
        confirmDialog.closable = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('a'))).toBeFalsy();
    });
    it('should change buttonStyles', function () {
        confirmDialog.visible = true;
        confirmDialog.rejectButtonStyleClass = "Primeng ROCKS!";
        confirmDialog.acceptButtonStyleClass = "Primeng ROCKS!";
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[0].nativeElement.className).toContain("Primeng ROCKS!");
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[1].nativeElement.className).toContain("Primeng ROCKS!");
    });
    it('should change icons', function () {
        confirmDialog.visible = true;
        confirmDialog.icon = "Primeng ROCKS!";
        confirmDialog.acceptIcon = "Primeng ROCKS!";
        confirmDialog.rejectIcon = "Primeng ROCKS!";
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-confirmdialog-icon')).nativeElement.className).toContain("Primeng ROCKS!");
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[0].nativeElement.icon).toContain("Primeng ROCKS!");
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[1].nativeElement.icon).toContain("Primeng ROCKS!");
    });
    it('should not show accept button', function () {
        confirmDialog.visible = true;
        confirmDialog.acceptVisible = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[1]).toBeFalsy();
    });
    it('should not show reject button', function () {
        confirmDialog.visible = true;
        confirmDialog.rejectVisible = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[1]).toBeFalsy();
    });
    it('should run accept', function () {
        var messagesEl = fixture.debugElement.query(platform_browser_1.By.css('p-messages'));
        var confirmEl = fixture.debugElement.query(platform_browser_1.By.css('button')).nativeElement;
        confirmEl.click();
        fixture.detectChanges();
        var acceptButtonEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[0].nativeElement;
        acceptButtonEl.click();
        fixture.detectChanges();
        expect(messagesEl.nativeElement.value[0]).toBeTruthy();
        expect(messagesEl.nativeElement.value[0].summary).toContain("Confirmed");
        expect(messagesEl.nativeElement.value[0].detail).toContain("You have accepted");
    });
    it('should run reject', function () {
        var messagesEl = fixture.debugElement.query(platform_browser_1.By.css('p-messages'));
        var confirmEl = fixture.debugElement.query(platform_browser_1.By.css('button')).nativeElement;
        confirmEl.click();
        fixture.detectChanges();
        var acceptButtonEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-footer')).children[1].nativeElement;
        acceptButtonEl.click();
        fixture.detectChanges();
        expect(messagesEl.nativeElement.value[0]).toBeTruthy();
        expect(messagesEl.nativeElement.value[0].summary).toContain("Rejected");
        expect(messagesEl.nativeElement.value[0].detail).toContain("You have rejected");
    });
});
//# sourceMappingURL=confirmdialog.spec.js.map