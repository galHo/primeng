"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var slider_1 = require("./slider");
var animations_1 = require("@angular/platform-browser/animations");
describe('Slider', function () {
    var slider;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                animations_1.NoopAnimationsModule
            ],
            declarations: [
                slider_1.Slider
            ]
        });
        fixture = testing_1.TestBed.createComponent(slider_1.Slider);
        slider = fixture.componentInstance;
    });
    it('should created by default', function () {
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        expect(sliderEl).toBeTruthy();
    });
    it('should disable', function () {
        slider.disabled = true;
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        var clickSpy = spyOn(slider, 'updateDomData').and.callThrough();
        sliderEl.click();
        expect(sliderEl.className).toContain('ui-state-disabled');
        expect(clickSpy).not.toHaveBeenCalled();
    });
    it('should animate', function () {
        slider.animate = true;
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        sliderEl.click();
        expect(sliderEl.className).toContain('ui-slider-animate');
    });
    it('should change styles', function () {
        slider.style = { 'primeng': 'rocks!' };
        slider.styleClass = "Primeng ROCKS!";
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        expect(sliderEl.className).toContain("Primeng ROCKS!");
        expect(sliderEl.style.primeng).toEqual("rocks!");
    });
    it('should change orientation', function () {
        slider.orientation = "vertical";
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        expect(sliderEl.className).toContain("ui-slider-vertical");
    });
    it('should have a range', function () {
        slider.range = true;
        fixture.detectChanges();
        var sliderEl = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        expect(sliderEl.children.length).toEqual(3);
    });
    it('should set min', function () {
        slider.min = 20;
        fixture.detectChanges();
        slider.updateValue(19);
        fixture.detectChanges();
        var spanEl = fixture.debugElement.query(platform_browser_1.By.css('span')).nativeElement;
        expect(slider.handleValue).toEqual(0);
        expect(spanEl.style.width).toEqual('0%');
    });
    it('should set max', function () {
        slider.max = 90;
        fixture.detectChanges();
        slider.updateValue(91);
        fixture.detectChanges();
        var spanEl = fixture.debugElement.query(platform_browser_1.By.css('span')).nativeElement;
        expect(slider.handleValue).toEqual(100);
        expect(spanEl.style.width).toEqual('100%');
    });
    it('should listen onChange', function () {
        var value = 1;
        slider.onChange.subscribe(function (data) { return value = data.value; });
        slider.updateValue(91);
        fixture.detectChanges();
        expect(value).toEqual(91);
    });
});
//# sourceMappingURL=slider.spec.js.map