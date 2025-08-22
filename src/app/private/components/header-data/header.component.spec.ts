import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderResultsComponent } from './header.component';

describe('HeaderResultsComponent', () => {
  let component: HeaderResultsComponent;
  let fixture: ComponentFixture<HeaderResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
