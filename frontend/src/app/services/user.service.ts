import { Injectable } from '@angular/core';
import { HttpService, RequestMethod } from './http.service';
import { Observable } from 'rxjs';
import { UserProfile, Rating, Team } from '../models';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api: string;
  private endpoint: string = "userprofiles";
  constructor(private dataService: HttpService, private appState: AppStateService) {
    this.api = "userprofiles";
   }

  isCurrentUserManager(): boolean{
    return this.getCurrentUser().userRole == 1;
   }

  getCurrentUser(){
    let user = this.appState.currentDatabaseUser;

    if (user) {
      if (!user.avatarUrl || user.avatarUrl == '') {
        user.avatarUrl = '/assets/images/default-avatar.jpg';
      }
    }
    
    return user;
  }

  getAndUpdate() {
    this.getUser().subscribe(
      (user)=> {
        this.updateCurrentUser(user);
      },
      err => {
        console.log('err', err);
      }
    );
  }

  // use this when logout
  removeCurrentUser() {
    this.appState.currentDatabaseUser = undefined;
  }

  updateCurrentUser (userProfile: any) {
    if (userProfile.avatarUrl == undefined || userProfile.avatarUrl == null || userProfile.avatarUrl == '') {
      userProfile.avatarUrl = '/assets/images/default-avatar.jpg';
    }
    // can add more default values
    
    this.appState.currentDatabaseUser = userProfile;
  }

  getUser() : Observable<UserProfile> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api + '/user');
  }

  getUserRatings(id: number) : Observable<Rating[]> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api + '/' + id + '/ratings');
  }

  getUserTeams(id) : Observable<Team[]> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api + '/' + id + '/teams');
  }

  getOne(id: number) : Observable<any> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api, id);
  }

  isUserInDb() : Observable<boolean> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api + '/isInDb');
  }

  getAll() : Observable<any[]> {
    return this.dataService.sendRequest(RequestMethod.Get, this.api);
  }

  create(body) : Observable<UserProfile>{
    return this.dataService.sendRequest(RequestMethod.Post, this.api, undefined, body);
  }

  update(id: number, body) : Observable<UserProfile>{
    return this.dataService.sendRequest(RequestMethod.Put, this.api, id, body);
  }

  updatePhoto(photo: FormData) : Observable<UserProfile>{
    return this.dataService.sendRequest(RequestMethod.Put, this.api + '/photo', undefined, photo, undefined, 'form-data');
  }

  delete(id: number) : Observable<UserProfile>{
    return this.dataService.sendRequest(RequestMethod.Delete, this.api, id);
  }
}
