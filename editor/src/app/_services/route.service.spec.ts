import { TestBed } from '@angular/core/testing';

import { RouteService } from './route.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('RouteService', () => {
  let service: RouteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(RouteService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of routes', () => {
    service.list().subscribe(
      routes => {
        expect(routes.length).toBe(1);
        expect(routes[0].name).toEqual('dummy');
      }
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/routes/`);
    expect(req.request.method).toEqual('GET');
    req.flush([{
      id: 'de5d9442-273b-404a-aa64-aa59c2b164e4',
      created_at: '2020-02-08T16:34:19.437229Z',
      updated_at: '2020-02-08T16:34:19.437238Z',
      name: 'dummy',
    }]);
  });

  it('should return route', () => {
    service.show('de5d9442-273b-404a-aa64-aa59c2b164e4').subscribe(
      route => {
        expect(route).toBeTruthy();
        expect(route.id).toEqual('de5d9442-273b-404a-aa64-aa59c2b164e4');
        expect(route.name).toEqual('dummy');
      }
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/routes/de5d9442-273b-404a-aa64-aa59c2b164e4/`);
    expect(req.request.method).toEqual('GET');
    req.flush({
      id: 'de5d9442-273b-404a-aa64-aa59c2b164e4',
      created_at: '2020-02-08T16:34:19.437229Z',
      updated_at: '2020-02-08T16:34:19.437238Z',
      name: 'dummy',
    });
  });
});
