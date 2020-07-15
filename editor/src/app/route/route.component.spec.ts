import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteComponent } from './route.component';
import { RouteService } from '../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Route } from '../_models';

describe('RouteComponent', () => {
  let component: RouteComponent;
  let fixture: ComponentFixture<RouteComponent>;

  beforeEach(async(() => {
    const mockParamMap: Partial<ParamMap> = {
      get(name: string) { return 'dummy'; }
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
      get paramMap() { return of(mockParamMap as ParamMap); }
    };
    const mockRouteService: Partial<RouteService> = {
      show(id: string) { return of(null); }
    };

    TestBed.configureTestingModule({
      declarations: [ RouteComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RouteService, useValue: mockRouteService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start new route if no id provided', () => {
    const paramMap: Partial<ParamMap> = {
      get(name: string) { return undefined; }
    };
    const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    const spy = spyOnProperty(activatedRoute, 'paramMap', 'get').and.returnValue(of(paramMap as ParamMap));
    const routeService = fixture.debugElement.injector.get(RouteService);
    const serviceSpy = spyOn(routeService, 'show');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.route.name).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it('should get route if id provided', () => {
    const routeService = fixture.debugElement.injector.get(RouteService);
    const spy = spyOn(routeService, 'show').and.returnValue(of({ name: 'Dummy' } as Route));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.route.name).toEqual('Dummy');
    expect(spy).toHaveBeenCalled();
  });
});
