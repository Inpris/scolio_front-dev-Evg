import { Injectable, NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType, JsonHubProtocol } from '@aspnet/signalr';
import { Subject } from 'rxjs/Subject';

const protocol = new JsonHubProtocol();

const hubConnection: HubConnection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Trace)
  .withUrl('/signalr')
  .withHubProtocol(protocol)
  .build();

(function () {
  let isConnecting = false;

  hubConnection.onclose(() => {
    setTimeout(() => start(), 2000);
  });

  function start() {
    if (isConnecting) {
      return;
    }
    isConnecting = true;
    hubConnection
      .start()
      .then(() => { console.log('signalr connection started!'); isConnecting = false; })
      .catch(() => { isConnecting = false; });
  }

  start();
})();

interface SignalRSubscriptions {
  [methodName: string]: Subject<any>;
}

interface ProcessedEvents {
  data: string;
  methodName: string;
}

@Injectable()
export class SignalR {
  private subscriptions: SignalRSubscriptions = {};

  private processedEvents: ProcessedEvents[] = [];

  constructor(private zone: NgZone) {
  }

  on<T>(methodName: string) {
    const subscriptions = this.subscriptions;
    if (subscriptions[methodName] == null) {
      const subject = new Subject();
      const method = (data: any) => {
        if (subscriptions[methodName].observers.length === 0) {
          delete subscriptions[methodName];
          hubConnection.off(methodName, method);
        }
        this.zone.run(() => { this.processEvent(methodName, data); });
      };
      hubConnection.on(methodName, method);
      subscriptions[methodName] = subject;
    }
    return subscriptions[methodName];
  }

  call<T>(methodName: string, data: any) {
    const subscriptions = this.subscriptions;
    if (subscriptions[methodName] != null && subscriptions[methodName] != null) {
      this.zone.run(() => { this.processEvent(methodName, data); });
    }
  }

  private processEvent(methodName: string, data: any) {
    if (this.eventCanBeProcessed(methodName, data)) {
      const event = { methodName, data: JSON.stringify(data) };
      this.processedEvents.push(event);
      setTimeout(() => { this.removeEvent(event); }, 1000);
      this.subscriptions[methodName].next(data);
    }
  }

  private removeEvent(event: ProcessedEvents) {
    const index = this.processedEvents.indexOf(event);
    this.processedEvents.splice(index, 1);
  }

  private eventCanBeProcessed(methodName: string, data: any) {
    const dataString = JSON.stringify(data);
    return this.processedEvents.filter(e => e.methodName === methodName && e.data === dataString).length === 0;
  }
}
