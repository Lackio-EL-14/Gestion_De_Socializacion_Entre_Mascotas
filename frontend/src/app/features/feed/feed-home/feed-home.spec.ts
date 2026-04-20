import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { FeedHome } from './feed-home';

describe('FeedHome', () => {
  let component: FeedHome;
  let fixture: ComponentFixture<FeedHome>;

  beforeEach(async () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [FeedHome],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
