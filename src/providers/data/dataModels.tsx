import configs from './dataConfigs.json';

interface FieldConfig {
    name: string;
    label: string;
    type: string;
    visible: boolean;
    required: boolean;
    editable: boolean;
    message?: string;
    props?: Record<string, any>;
}


/**
 * Represents a data field.
 * @property name - The name of the field.
 * @property label - The displayed label of the field.
 * @property type - The type of the field, used for parsing.
 * @property visible - Whether the field should be visible in the UI.
 * @property required - Whether the field is required when performing input on the database.
 * @property message - The message message to be displayed when the field does not pass validation.
 */
export class DataField {
    name: string;
    label: string;
    type: string;
    visible: boolean;
    required: boolean;
    editable: boolean;
    message?: string;
    value: string | number | boolean | Date;
    props: Record<string, any>;

    /**
     * Creates a new instance of DataField.
     * @param config - The configuration object for the field.
     * @param value - The initial value for the field.
     */
    constructor(config: FieldConfig, value: string | number | boolean | Date) {
        Object.assign(this, config);
        this.value = DataField.parse(config.type, value);

        if(!config.props) {
            this.props = {};
        }
    }

    /**
     * Parses the given value based on the field type.
     * @param type - The type of the field.
     * @param value - The value to be parsed.
     * @returns The parsed value.
     */
    static parse(type: string, value: string | number | boolean | Date) {
        switch (type) {
            case 'text' || 'password' || 'email':
                return value.toString();
            case 'number':
                return Number(value);
            case 'boolean':
                return Boolean(value);
            case 'date':
                return new Date(value.toString());
            default:
                return value;
        }
    }

    /**
     * Sets the value of the field.
     * @param value - The value to be set.
     */
    setValue(value: string | number | boolean | Date) {
        this.value = DataField.parse(this.type, value);
    }
}


/**
 * Represents a data row with JSON data and associated fields.
 */
export class DataRow {
    tableName: string;
    json: Record<string, string | number | boolean | Date>;
    fields: DataField[];
    
    /**
     * Constructs a DataRow object.
     * @param tableName - The name of the table this row belongs to.
     * @param json - The JSON data for the row.
     */
    constructor(tableName: string, json: Record<string, string | number | boolean | Date> = {}) {
        this.tableName = tableName;

        if (Object.keys(json).length === 0) {
            Object.keys(configs[tableName]).forEach((key) => {
                json[key] = configs[tableName][key].type === 'number' ? (0 || configs[tableName][key].props?.min) : '';
            });
        }
        this.json = json;

        this.fields = Object.keys(json).map((key) => {
            return new DataField(configs[tableName][key], json[key]);
        });
    }

    /**
     * Sets the value of a field.
     * @param name - The name of the field.
     * @param value - The value to be set.
     */
    setFieldValue(name: string, value: string | number | boolean | Date) {
        this.json[name] = value;
        this.fields.forEach((field) => {
            if (field.name === name) {
                field.setValue(value);
            }
        });
    }

    /**
     * Gets the visible fields of the data row.
     * @returns An array of visible fields.
     */
    getVisible() {
        return this.fields.filter((field) => {
            return field.visible;
        });
    }

    /**
     * Gets the required fields of the data row.
     * @returns An array of required fields.
     */
    getRequired() {
        return this.fields.filter((field) => {
            return field.required;
        });
    }

    /**
     * Gets the JSON data of the data row.
     * @returns The JSON data of the data row.
     */
    getJson() {
        return this.fields.reduce((acc, field) => {
            acc[field.name] = field.value;
            return acc;
        }, {} as Record<string, string | number | boolean | Date>);
    }
}


/**
 * Represents a data object that contains rows of data.
 */
export class DataObject {
    tableName: string;
    columns: string[] = [];
    json: Record<string, string | number | boolean | Date>[] = [];
    rows: DataRow[];

    /**
     * Creates a new instance of the DataObject class.
     * @param tableName - The name of the table.
     * @param json - An array of records containing the data.
     */
    constructor(tableName: string, json: Array<Record<string, string | number | boolean | Date>> = []) {
        this.tableName = tableName;
        this.columns = Object.keys(configs[tableName]);
        this.json = json;

        this.rows = json.map((obj) => {
            return new DataRow(tableName, obj);
        });
    }

    /**
     * Returns an array of visible columns based on the configuration for the current table.
     * @returns {string[]} An array of visible columns based on the configuration for the current table.
     */
    getVisibleColumns() {
        return this.columns.filter((column) => {
            return configs[this.tableName][column].visible;
        });
    }

    /**
     * Returns an array of required columns based on the configuration for the current table.
     * @returns {string[]} An array of required columns.
     */
    getRequiredColumns() {
        return this.columns.filter((column) => {
            return configs[this.tableName][column].required;
        });
    }

    /**
     * Gets the visible rows of the data object.
     * @returns An array of visible rows.
     */
    getVisible() {
        return this.rows.map((row) => {
            return row.getVisible();
        });
    }

    /**
     * Gets the required rows of the data object.
     * @returns An array of required rows.
     */
    getRequired() {
        return this.rows.map((row) => {
            return row.getRequired();
        });
    }

    /**
     * Gets the JSON data of the data object.
     * @returns An array of JSON data.
     */
    getJson() {
        return this.rows.map((row) => {
            return row.getJson();
        });
    }
}


export { configs }