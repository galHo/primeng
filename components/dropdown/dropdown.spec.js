"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dropdown_1 = require("./dropdown");
var animations_1 = require("@angular/platform-browser/animations");
var forms_1 = require("../../../../node_modules/@angular/forms");
describe('Dropdown', function () {
    var dropdown;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                animations_1.NoopAnimationsModule,
                forms_1.FormsModule
            ],
            declarations: [
                dropdown_1.Dropdown,
            ]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(dropdown_1.Dropdown);
        dropdown = fixture.componentInstance;
    });
    it('should disabled', function () {
        dropdown.disabled = true;
        dropdown.editable = true;
        fixture.detectChanges();
        var containerEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        var hiddenEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.ui-helper-hidden-accessible'))[1].children[0].nativeElement;
        var editableInputEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).children[2].nativeElement;
        expect(containerEl.className).toContain('ui-state-disabled');
        expect(hiddenEl.disabled).toEqual(true);
        expect(editableInputEl.disabled).toEqual(true);
    });
    it('should get a name', function () {
        dropdown.name = "Primeng";
        fixture.detectChanges();
        var selectEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-helper-hidden-accessible')).children[0].nativeElement;
        expect(selectEl.name).toEqual("Primeng");
    });
    it('should change dropdown icon', function () {
        dropdown.dropdownIcon = "Primeng";
        fixture.detectChanges();
        var dropdownSpanEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-trigger-icon.ui-clickable')).nativeElement;
        expect(dropdownSpanEl.className).toContain("Primeng");
    });
    it('should change style and styleClass', function () {
        dropdown.styleClass = "Primeng";
        dropdown.style = { 'primeng': 'rocks' };
        fixture.detectChanges();
        var containerEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown'));
        expect(containerEl.nativeElement.className).toContain("Primeng");
        expect(containerEl.nativeElement.style.primeng).toEqual("rocks");
    });
    it('should change panelStyleClass', function () {
        dropdown.panelStyleClass = "Primeng";
        dropdown.options = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        var container = fixture.debugElement.query(platform_browser_1.By.css('div')).nativeElement;
        container.click();
        fixture.detectChanges();
        var dropdownPanel = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-panel'));
        expect(dropdownPanel).toBeTruthy();
        expect(dropdownPanel.nativeElement.className).toContain("Primeng");
    });
    it('should open when clicked', function () {
        dropdown.options = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        var dropdownPanel = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-panel'));
        expect(container.className).toContain('ui-dropdown-open');
        expect(dropdownPanel).toBeTruthy();
    });
    it('should close', function () {
        dropdown.options = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        container.click();
        fixture.detectChanges();
        var dropdownPanel = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-panel'));
        expect(container.className).not.toContain('ui-dropdown-open');
        expect(dropdownPanel).toBeFalsy();
    });
    it('should item selected', function () {
        dropdown.options = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        var items = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-items'));
        items.children[2].nativeElement.click();
        fixture.detectChanges();
        expect(dropdown.selectedOption.name).toEqual('London');
        expect(items.children[2].nativeElement.className).toContain('ui-state-highlight');
    });
    it('should item clear', function () {
        dropdown.options = [
            { label: 'Select City', value: null },
            { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
            { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
            { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
            { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
        ];
        dropdown.showClear = true;
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        var items = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-items'));
        items.children[2].nativeElement.click();
        fixture.detectChanges();
        var itemCloseIcon = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-clear-icon'));
        itemCloseIcon.nativeElement.click();
        fixture.detectChanges();
        expect(dropdown.selectedOption).toEqual({ label: 'Select City', value: null });
        expect(items.children[2].nativeElement.className).not.toContain('ui-state-highlight');
    });
    it('should filtered', testing_1.async(function () {
        dropdown.options = [
            { label: 'New York', code: 'NY' },
            { label: 'Rome', code: 'RM' },
            { label: 'London', code: 'LDN' },
            { label: 'Istanbul', code: 'IST' },
            { label: 'Paris', code: 'PRS' }
        ];
        dropdown.filter = true;
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        var filterDiv = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-filter-container'));
        expect(filterDiv).toBeTruthy();
        var filterInputEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-filter'));
        filterInputEl.nativeElement.value = "n";
        filterInputEl.nativeElement.dispatchEvent(new Event('keydown'));
        var event = { 'target': { 'value': 'n' } };
        dropdown.onFilter(event);
        fixture.detectChanges();
        var items = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-items'));
        expect(items.nativeElement.children.length).toEqual(3);
    }));
    it('should filtered and display not found warning', testing_1.async(function () {
        dropdown.options = [
            { label: 'New York', code: 'NY' },
            { label: 'Rome', code: 'RM' },
            { label: 'London', code: 'LDN' },
            { label: 'Istanbul', code: 'IST' },
            { label: 'Paris', code: 'PRS' }
        ];
        dropdown.filter = true;
        fixture.detectChanges();
        var container = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown')).nativeElement;
        container.click();
        fixture.detectChanges();
        var filterDiv = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-filter-container'));
        expect(filterDiv).toBeTruthy();
        var filterInputEl = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-filter'));
        filterInputEl.nativeElement.value = "primeng";
        filterInputEl.nativeElement.dispatchEvent(new Event('keydown'));
        var event = { 'target': { 'value': 'primeng' } };
        dropdown.onFilter(event);
        fixture.detectChanges();
        var items = fixture.debugElement.query(platform_browser_1.By.css('.ui-dropdown-items'));
        var emptyMesage = items.children[0];
        expect(items.nativeElement.children.length).toEqual(1);
        expect(emptyMesage).toBeTruthy();
        expect(emptyMesage.nativeElement.textContent).toEqual("No results found");
    }));
});
//# sourceMappingURL=dropdown.spec.js.map