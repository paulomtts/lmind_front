/**
 * Represents a form field.
 */
export class FormField {

    type: string;
    label: string;
    value: string | number | boolean;
    required: boolean;
    error?: string;

    /**
     * Creates a new instance of the FormField class.
     * @param label - The label of the form field.
     * @param value - The value of the form field.
     * @param required - Indicates if the form field is required.
     * @param error - The error message associated with the form field.
     */
    constructor(label: string, value: string | number | boolean = '', required: boolean = false, error?: string) {
        this.label = label;
        this.required = required;
        this.error = error;

        switch (typeof value) {
            case 'string':
                this.type = 'text';
                this.value = String(value);
                break;
            case 'number':
                this.type = 'number';
                this.value = Number(value);
                break;
            case 'boolean':
                this.type = 'checkbox';
                this.value = Boolean(value);
                break;
        }
    }
}
