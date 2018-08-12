import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { SignupDialogComponent } from 'src/app/dialogs/signup-dialog/signup-dialog.component';
import { StringDialogComponent } from 'src/app/dialogs/string-dialog/string-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models';
import { map } from 'rxjs/operators';


@Component({
  providers: [AuthService],
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  manager : UserProfile;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit(): void {
    debugger
    if (!this.userService.getCurrrentUser()) {
      this.userService.getUser().subscribe(
        (d: UserProfile)=> {
          this.userService.saveUser(d);   
          this.manager = d;
        },
        err => {
          console.log('err', err);
        }
      );
    }
  }


  onLoginClick() {
    this.dialog.open(LoginDialogComponent);
  }

  onSignUpClick() {
    this.dialog.open(SignupDialogComponent);
  }

  onNewStrClick() {
    this.dialog.open(StringDialogComponent);
  }

  onLogoutClick() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }



  
}
