import { LandingGuard } from './components/landing/landing.guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LandingComponent } from './components/landing/landing.component';



import { DataService } from './services/data.service';
import { AppMaterialModule } from './common/app-material/app-material.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { TeamsComponent } from './components/teams/teams.component';
import { GlossariesComponent } from './components/glossaries/glossaries.component';
import { AppRoutingModule } from 'src/app/common/app-routing-module/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoFoundComponent } from './components/no-found/no-found.component';
import { UserService } from './services/user.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/landing/home/home.component';
import { AboutUsComponent } from './components/landing/about-us/about-us.component';
import { ContactComponent } from './components/landing/contact/contact.component';
import { NavigationComponent } from './components/landing/navigation/navigation.component';



@NgModule({
  declarations: [
    LandingComponent,
    NavigationComponent,
    ProjectsComponent,
    TeamsComponent,
    GlossariesComponent,
    DashboardComponent,
    NoFoundComponent,
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule,
    HttpClientModule,
    AppRoutingModule
    
  ],
  providers: [UserService, LandingGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
