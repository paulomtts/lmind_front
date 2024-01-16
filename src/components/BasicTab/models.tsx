import { ReactNode } from "react";

export class TabModel {
    name: string;
    content: ReactNode;
    props?: any;

    constructor(name: string, content: ReactNode, props?: any) {
        this.name = name;
        this.content = content;
        this.props = props;
    }
}