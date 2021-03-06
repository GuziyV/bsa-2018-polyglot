import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '../../../../../node_modules/@angular/material';
import { SnotifyService, SnotifyPosition, SnotifyToastConfig } from 'ng-snotify';
import { ProjectService } from '../../../services/project.service';
import { TeamService } from '../../../services/teams.service';
import { TeamAssignComponent } from '../../../dialogs/team-assign/team-assign.component';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.sass']
})
export class ProjectTeamComponent implements OnInit {

  @Input() projectId: number;
  @Input() IsCurrentUserManager: boolean;
  public assignedTeams: Array<any> = [];
  public IsLoad: boolean = true;
  public IsLoading: any = {};
  public spinnerColor = '#F6182A';
  public desc: string = "Do you want to unassign this team from the project?";
  public btnOkText: string = "Сonfirm";
  public btnCancelText: string = "Cancel";
  answer: boolean;


  constructor(
    private projectService: ProjectService,
    private teamsService: TeamService,
    private snotifyService: SnotifyService,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.projectService.getProjectTeams(this.projectId)
      .subscribe(assignedTeams => {
        if (assignedTeams && assignedTeams.length > 0) {
          this.assignedTeams = assignedTeams;
          this.assignedTeams.sort(this.compareId);
        } else {
          this.assignedTeams = [];
          ///TODO: FIRE THE ASSIGN TEAM DIALOG
        }
        this.IsLoad = false;
      },
        err => {
          this.snotifyService.error("An error occurred while loading teams assigned to this project, please try again later", "Error!");
          this.IsLoad = false;
        });
  }

  isCurrentUserManager() {
    return this.userService.isCurrentUserManager();
  }

  assignTeam() {
    if (this.IsLoad)
      return;

    this.IsLoad = true;
    this.teamsService.getAllTeams()
      .subscribe(teams => {
        if (!teams || teams.length < 1) {
          this.snotifyService.error("No teams found!", "Error!");
          this.IsLoad = false;
          return;
        }

        const thisTeams = this.assignedTeams;
        let availableTeams = teams.filter(function (team) {
          let t = thisTeams.find(t => t.id === team.id);
          if (t)
            return team.id !== t.id;
          return true;
        })

        this.IsLoad = false;

        if (!availableTeams || availableTeams.length < 1) {
          this.snotifyService.error("No more teams avaible to assign!", "Error!");
          this.IsLoad = false;
          return;
        }
        let dialogRef = this.dialog.open(TeamAssignComponent, {
          hasBackdrop: true,
          width: '800px',
          data: {
            teams: availableTeams
          },
        });

        dialogRef.componentInstance.onAssign.subscribe((selectedTeams: Array<any>) => {
          this.IsLoad = true;

          if (selectedTeams && selectedTeams.length > 0) {
            this.projectService.assignTeamsToProject(this.projectId, selectedTeams.map(t => t.id))
              .subscribe(responce => {
                ///TODO: fire a progress notification//////////////////////////////////////////////////////////////

                if (responce) {
                  Array.prototype.push.apply(this.assignedTeams, selectedTeams.filter(function (team) {
                    let t = thisTeams.find(t => t.id === team.id);
                    if (t)
                      return team.id !== t.id;
                    return true;
                  }));
                  this.assignedTeams.sort(this.compareId);
                  this.IsLoad = false;
                  this.snotifyService.success("Teams successfully assigned!", "Success!");
                }
              },
                err => {

                  this.IsLoad = false;
                  this.snotifyService.error(err, "Error!");
                  console.log('err', err);
                });
          }
          else {
            //  this.snotifyService.error(data.message, "Error!");
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          dialogRef.componentInstance.onAssign.unsubscribe();
        });

      },
        err => {

          this.snotifyService.error("An error occurred while loading teams, please try again later", "Error!");
          console.log('err', err);

        });

  }

  dismissTeam(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { description: this.desc, btnOkText: this.btnOkText, btnCancelText: this.btnCancelText, answer: this.answer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.data.answer) {

        if (this.IsLoading[id])
          return;
        this.IsLoading[id] = true;
        this.projectService.dismissProjectTeam(this.projectId, id)
          .subscribe(responce => {
            this.IsLoading[id] = false;
            this.snotifyService.success("Team " + id + " succesfully unassigned!", "Success!");
            this.assignedTeams = this.assignedTeams.filter(t => t.id !== id);
          },
            err => {
              this.IsLoading[id] = false;
              this.snotifyService.error("Team " + id + " wasn`t unassigned!", "Error!");
            });
      }
    }
    );
  }

  getAvatarUrl(person): String {
    if (person.avatarUrl)
      return person.avatarUrl;
    else
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTsrMId-b7-CLWIw6S80BQZ6Xqd7jX0rmU9S7VSv_ngPOU7NO-6Q";
  }

  compareId(a, b) {
    if (a.id < b.id)
      return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }
}
