import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


export class Sorter {
    name: string;
    label: string;
    direction: string;
    icon?: IconDefinition;

    constructor(name: string, label: string, direction: string, icon?: IconDefinition) {
        this.name = name;
        this.label = label;
        this.direction = direction;
        this.icon = icon;
    }
}

export class Filter {
    label: string;
    type: 'interval' | 'exact' | 'exclude';
    value?: string;
    min?: number;
    max?: number;

    constructor(label: string, type: 'interval' | 'exact' | 'exclude', min?: number, max?: number) {
        this.label = label;
        this.type = type;
        this.min = min;
        this.max = max;
    }
}