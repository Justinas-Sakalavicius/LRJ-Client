import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import {
  HUB_CONNECT_ERROR,
  HUB_DISCONNECT_ERROR,
  HUB_TARGET,
  HUB_URL,
} from '../constants/constants';

const baseUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class HubService {
  public hasRemoteConnection: boolean = false;
  private hubConnection!: signalR.HubConnection;
  private messageReceived = new Subject<string>();

  constructor() {
    this.build();
    this.connect();
  }

  disconnect(): void {
    this.hubConnection
      .stop()
      .then()
      .catch((err) => console.error(HUB_DISCONNECT_ERROR, err));
  }

  getMessages(): Observable<string> {
    return this.messageReceived.asObservable();
  }

  connect(): void {
    this.hubConnection
      .start()
      .then(() => this.addReceivedMessageListener())
      .catch((err) => console.error(HUB_CONNECT_ERROR, err));
  }

  private build(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${HUB_URL}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
  }

  private addReceivedMessageListener = () => {
    this.hubConnection.on(HUB_TARGET, (message: string) => {
      this.messageReceived.next(message);
    });
  };
}
