"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dialog_1 = require("./dialog");
var animations_1 = require("@angular/platform-browser/animations");
describe('Dialog', function () {
    var dialog;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                animations_1.NoopAnimationsModule
            ],
            declarations: [
                dialog_1.Dialog
            ]
        });
        fixture = testing_1.TestBed.createComponent(dialog_1.Dialog);
        dialog = fixture.componentInstance;
    });
    it('should display the header', function () {
        dialog.visible = true;
        dialog.header = 'PrimeNG Dialog Header';
        fixture.detectChanges();
        var headerEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-title'));
        expect(headerEl.nativeElement.textContent).toContain('PrimeNG Dialog Header');
    });
    it('should display the close icon when closable', function () {
        dialog.visible = true;
        fixture.detectChanges();
        var closeEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dialog-titlebar-close'));
        expect(closeEl).not.toBeNull();
    });
    it('should display the resizer when resizable is true', function () {
        dialog.visible = true;
        fixture.detectChanges();
        var resizeEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-resizable-handle'));
        expect(resizeEl).not.toBeNull();
    });
    it('should not create the container element by default', function () {
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.childElementCount).toEqual(0);
        expect(dialog.visible).toEqual(undefined);
    });
    it('should add rtl class when rtl is enabled', function () {
        dialog.visible = true;
        dialog.rtl = true;
        fixture.detectChanges();
        expect(fixture.debugElement.children[0].classes['ui-dialog-rtl']).toEqual(true);
    });
    it('should add draggable class when dragging is enabled', function () {
        dialog.visible = true;
        fixture.detectChanges();
        expect(fixture.debugElement.children[0].classes['ui-dialog-draggable']).toEqual(true);
    });
    it('should update visible as false binding when close icon is clicked', function () {
        var show = true;
        dialog.visible = show;
        fixture.detectChanges();
        dialog.visibleChange.subscribe(function (value) { return show = value; });
        var closeEl = fixture.nativeElement.querySelector('.ui-dialog-titlebar-close');
        closeEl.click();
        expect(show).toEqual(false);
    });
});
//# sourceMappingURL=dialog.spec.js.map