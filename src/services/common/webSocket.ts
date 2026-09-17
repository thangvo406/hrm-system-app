import { Environment } from '@constants';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

class WebSocketService {
  private client: Client | undefined = undefined;
  private subscriptions = new Map<string, StompSubscription>();

  connect(token?: string) {
    if (this.client?.active) {
      return;
    }

    this.client = new Client({
      // React Native's WebSocket may strip the NULL octet terminating STOMP
      // frames and mangle text frames, so the parser never sees the broker's
      // CONNECTED frame and onConnect never fires. These two flags are the
      // official stomp-js workaround for React Native.
      appendMissingNULLonIncoming: true,
      forceBinaryWSFrames: true,
      brokerURL: Environment.SOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      // React Native does not expose a browser-compatible WebSocket to stompjs,
      // must pass a factory explicitly so the STOMP handshake completes.
      // webSocketFactory: () =>
      //   new WebSocket('wss://coop-mobile-dev.specominc.com/ws'),
    });

    this.client.onConnect = () => {
      console.warn('[STOMP] Connected');
      this.subscribe('/user/queue/notifications', message => {
        console.warn('notification:', JSON.parse(message.body));
      });
    };

    this.client.onDisconnect = () => {
      console.warn('[STOMP] Disconnected');
    };

    this.client.activate();
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    if (!this.client?.connected) {
      console.warn('Cannot subscribe. STOMP not connected.');
      return;
    }

    if (this.subscriptions.has(destination)) {
      return;
    }

    const sub = this.client.subscribe(destination, callback);

    this.subscriptions.set(destination, sub);
  }

  unsubscribe(destination: string) {
    const sub = this.subscriptions.get(destination);

    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send(destination: string, body: any) {
    if (!this.client?.connected) {
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  disconnect() {
    for (const sub of this.subscriptions.values()) {
      sub.unsubscribe();
    }

    this.subscriptions.clear();

    void this.client?.deactivate();
    this.client = undefined;
  }
}

export default new WebSocketService();
