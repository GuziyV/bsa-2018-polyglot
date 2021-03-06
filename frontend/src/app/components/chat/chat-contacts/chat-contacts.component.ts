import { Component, OnInit, EventEmitter, Output, SimpleChanges, Input } from "@angular/core";
import { ChatService } from "../../../services/chat.service";
import { ChatUser, UserProfile } from "../../../models";
import { ChatDialog } from "../../../models/chat/chatDialog";
import { AppStateService } from "../../../services/app-state.service";
import { SignalrService } from "../../../services/signalr.service";
import { SignalrGroups } from "../../../models/signalrModels/signalr-groups";
import { Hub } from "../../../models/signalrModels/hub";
import { ChatActions } from "../../../models/signalrModels/chat-actions";
import { UserService } from "../../../services/user.service";
import { UserState } from "../../../models/chat/userState";

@Component({
    selector: "app-chat-contacts",
    templateUrl: "./chat-contacts.component.html",
    styleUrls: ["./chat-contacts.component.sass"]
})
export class ChatContactsComponent implements OnInit {
    @Output()
    onItemSelect = new EventEmitter<any>(true);
    @Input()
    person: ChatUser;
    isSearchMode = false;
    public isOnPersonsPage: boolean;
    currentUserId: number;
    selectedDialogId: number;
    filterInput: string;
    timeOutFilter: boolean = false;
    searchUsers: UserProfile[];

    private signalRConnection;

    unreadMessagesTotal = {
        persons: 0,
        groups: 0,
        teams: 0,
        projects: 0
    };

    private dialogs: ChatDialog[] = []; //ChatUser[];
    private projects: ChatDialog[] = [];
    private teams: ChatDialog[] = [];

    constructor(
        private chatService: ChatService,
        private appState: AppStateService,
        private signalRService: SignalrService,
        private userService: UserService
    ) {
        
    }

    ngOnInit() {
        this.currentUserId = this.appState.currentDatabaseUser.id;
        this.signalRConnection = this.signalRService.connect(
            `${SignalrGroups[SignalrGroups.direct]}${this.currentUserId}`,
            Hub.chatHub
        );
        this.subscribeChatEvents();

        this.chatService
            .getProjectsList()
            .subscribe((dialogs: ChatDialog[]) => {
                if (dialogs) {
                    this.projects = dialogs;
                }
            });

        this.chatService.getDialogs().subscribe((dialogs: ChatDialog[]) => {
            if (dialogs && dialogs.length > 0) {
                this.dialogs = dialogs.filter(d => d.participants.length > 0);
                this.unreadMessagesTotal["persons"] = this.dialogs
                    .map(d => d.unreadMessagesCount)
                    .reduce((acc, current) => acc + current);
            }
        });

        this.chatService.getTeamsList().subscribe((teams: ChatDialog[]) => {
            if (teams) {
                this.teams = teams;
            }
        });
    }

    ngOnDestroy() {
        this.signalRService.leaveGroup(
            `${SignalrGroups[SignalrGroups.direct]}${this.currentUserId}`,
            Hub.chatHub
        );
    }

    subscribeChatEvents() {
        this.signalRConnection.on(
            ChatActions[ChatActions.messageReceived],
            (responce: any) => {
                if (this.signalRService.validateChatResponse(responce)) {
                    let targetDialogIndex = this.dialogs.findIndex(
                        d => d.id == responce.dialogId
                    );
                    if (targetDialogIndex >= 0) {
                        this.dialogs[targetDialogIndex].lastMessageText =
                            responce.text;
                        if (
                            !this.selectedDialogId ||
                            this.selectedDialogId != responce.dialogId
                        ) {
                            this.dialogs[targetDialogIndex]
                                .unreadMessagesCount++;
                            this.unreadMessagesTotal["persons"]++;
                        }
                    }
                }
            }
        );
        this.signalRConnection.on(
            ChatActions[ChatActions.dialogsChanged],
            (responce: any) => {
                this.chatService.getDialogs().subscribe(dialogs => {
                    this.dialogs = dialogs.filter(
                        d => d.participants.length > 0
                    );
                    this.unreadMessagesTotal["persons"] = this.dialogs
                        .map(d => d.unreadMessagesCount)
                        .reduce((acc, current) => acc + current);
                });
            }
        );
        this.signalRConnection.on(
            ChatActions[ChatActions.userStateUpdated],
            (userStateId: number) => {
                if (userStateId) {
                    this.chatService
                        .getUserState(userStateId)
                        .subscribe((state: UserState) => {
                            this.dialogs
                                .map<ChatUser[]>(d => d.participants)
                                .forEach(chatUserGroup => {
                                    var targetUser = chatUserGroup.find(
                                        u => u.id === state.chatUserId
                                    );
                                    if (targetUser) {
                                        targetUser.isOnline = state.isOnline;
                                        targetUser.lastSeen = state.lastSeen;
                                    }
                                });

                            this.projects
                                .map<ChatUser[]>(d => d.participants)
                                .forEach(chatUserGroup => {
                                    var targetUser = chatUserGroup.find(
                                        u => u.id === state.chatUserId
                                    );
                                    if (targetUser) {
                                        targetUser.isOnline = state.isOnline;
                                        targetUser.lastSeen = state.lastSeen;
                                    }
                                });

                            this.teams
                                .map<ChatUser[]>(d => d.participants)
                                .forEach(chatUserGroup => {
                                    var targetUser = chatUserGroup.find(
                                        u => u.id === state.chatUserId
                                    );
                                    if (targetUser) {
                                        targetUser.isOnline = state.isOnline;
                                        targetUser.lastSeen = state.lastSeen;
                                    }
                                });
                        });
                }
            }
        );
    }

    selectDialog(dialog: ChatDialog) {
        this.unreadMessagesTotal["persons"] -= dialog.unreadMessagesCount;
        dialog.unreadMessagesCount = 0;
        this.selectedDialogId = dialog.id;
        this.onItemSelect.emit(dialog);
    }

    toggle() {
        this.isSearchMode = !this.isSearchMode;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.person.currentValue) {
            let person: ChatUser = changes.person.currentValue;
            let targetId = person.hash +  (13 * 25 + this.currentUserId);
            let targetDialog = this.dialogs.filter(
                d =>
                    d.identifier == targetId &&
                    !d.dialogName &&
                    d.participants.length === 1
            );
            if (targetDialog && targetDialog.length > 0) {
                this.onItemSelect.emit(targetDialog[0]);
            } else {
                let dialog: ChatDialog = {
                    id: -1,
                    lastMessageText: "",
                    unreadMessagesCount: 0,
                    participants: [person],
                    identifier: 0,
                    dialogName: ""
                };
                this.chatService
                    .addDialog(dialog)
                    .subscribe((dialog: ChatDialog) => {
                        if (dialog) {
                            this.dialogs.push(dialog);
                            this.onItemSelect.emit(dialog);
                        }
                    });
            }
        }
    }

    deleteDialog(dialog) {
        this.chatService
            .deleteDialog(dialog.id)
            .subscribe((success: boolean) => {
                if (success) {
                    this.dialogs = this.dialogs.filter(d => d.id !== dialog.id);
                }
            });
    }

    filterChange(event) {
        if (event.target.value.length > 0) {
            this.isSearchMode = true;
            this.searchUsers = [];
            if (!this.timeOutFilter) {
                this.timeOutFilter = true;
                setTimeout(() => {
                    this.filterInput = event.target.value;
                    this.timeOutFilter = false;
                    if (this.filterInput.length > 0) {
                        this.userService
                            .getUserProfilesByNameStartWith(this.filterInput)
                            .subscribe(users => {
                                this.searchUsers = users;
                                this.timeOutFilter = false;
                            });
                    }
                }, 1000);
            }
        } else {
            this.isSearchMode = false;
        }
    }

    setDialog(user: UserProfile) {
        let dialog = this.getDialogByUserId(user.id);
        if (dialog) {
            this.selectedDialogId = dialog.id;
            this.onItemSelect.emit(dialog);
        } else {
            this.chatService.startChatWithUser(user).subscribe(dialog => {
                this.selectedDialogId = dialog.id;
                this.dialogs.push(dialog);
                this.onItemSelect.emit(dialog);
            });
        }
    }

    private getDialogByUserId(id: number) {
        let chosenDialog = null;
        this.dialogs.forEach((dialog: ChatDialog) => {
            dialog.participants.forEach((participant: ChatUser) => {
                if (participant.id == id) {
                    chosenDialog = dialog;
                }
            });
        });
        return chosenDialog;
    }

    resetFilterInput() {
        this.isSearchMode = false;
    }
}
