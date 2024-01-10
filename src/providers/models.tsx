export class ToastModel {
    title: string;
    description: string;
    status: string;
    duration: number;
    isClosable: boolean;
    
    constructor(title: string = 'Success', description: string = 'Operation succeeded.', status: string = 'success', duration: number = 4000, isClosable: boolean = true) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.duration = duration;
        this.isClosable = isClosable;
    }
}