import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../_models';
import { RouteService } from '../_services';
import { first, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {
  public route: Route;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly routeService: RouteService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.routeService.show(id) : of(new Route());
      })
    ).subscribe(r => {
      this.route = (r) ? r : new Route();
    });
  }

}
