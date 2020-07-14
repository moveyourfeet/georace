import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(
    private http: HttpClient,
  ) { }

  public list(): Observable<Route[]> {
    return this.http.get<Route[]>(
      `${environment.apiUrl}/routes`,
    );
  }
}
