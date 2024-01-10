import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Represents a sorter used in a virtualized table.
 */
export class Sorter {
    label: string;
    direction: string;
    icon?: IconDefinition;

    /**
     * Creates a new Sorter instance.
     * @param label The label of the sorter.
     * @param direction The direction of the sorter.
     * @param icon The icon associated with the sorter (optional).
     */
    constructor(label: string, direction: string, icon?: IconDefinition) {
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