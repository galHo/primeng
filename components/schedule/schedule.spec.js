"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var schedule_1 = require("./schedule");
var animations_1 = require("@angular/platform-browser/animations");
describe('Schedule', function () {
    var schedule;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                animations_1.NoopAnimationsModule
            ],
            declarations: [
                schedule_1.Schedule
            ]
        });
        fixture = testing_1.TestBed.createComponent(schedule_1.Schedule);
        schedule = fixture.componentInstance;
    });
    it('should render events on component init', testing_1.async(function () {
        schedule.defaultDate = '2016-01-01';
        schedule.events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            }
        ];
        fixture.detectChanges();
        fixture.whenRenderingDone().then(function () {
            var element = fixture.nativeElement.querySelector('.fc-event');
            expect(element).toBeTruthy();
        });
    }));
});
//# sourceMappingURL=schedule.spec.js.map