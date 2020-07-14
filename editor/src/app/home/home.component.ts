import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from '../_models';
import { RouteService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public routes: Observable<Route[]>;

  constructor(
    private routeService: RouteService,
  ) { }

  ngOnInit(): void {
    this.routes = this.routeService.list();
  }

}
