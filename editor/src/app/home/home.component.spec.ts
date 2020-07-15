import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouteService } from '../_services';
import { Route } from '../_models';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    const mockRouteService: Partial<RouteService> = {
      list() { return of([]); }
    };

    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: RouteService, useValue: mockRouteService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list routes', () => {
    const routeService = fixture.debugElement.injector.get(RouteService);
    const spy = spyOn(routeService, 'list').and.returnValue(of([{id: 'uuid', name: 'dummy'} as Route]));
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ul > li:first-child > a').textContent).toContain('dummy');
    expect(spy).toHaveBeenCalled();
  });
});
