import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthnComponent } from './authn.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthnComponent', () => {
  let component: AuthnComponent;
  let fixture: ComponentFixture<AuthnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AuthnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login button when not authenticated', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a').textContent).toContain('Log ind');
  });

  it('should not show login button when authenticated', () => {

  });
});
