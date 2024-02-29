import Toast from "../NotificationProvider";

export interface PayloadInterface {
    method: string;
    credentials: string;
    headers: {
        'Content-Type': string;
    }
    body: any;
}

export interface NotificationProviderInterface {
    spawn(toast: Toast): void;
}

export interface OverlayProviderInterface {
    show(): void;
    hide(): void;
}