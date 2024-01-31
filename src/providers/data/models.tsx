import configs from './configs.json';

interface FieldConfig {
    _name: string;
    _label: string;
    _type: string;
    _visible: boolean;
    _required: boolean;
    _editable: boolean;
    _errorMessage?: string;
    _helperMessage?: string;
    _props: Record<string, any>;
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
    private _name: string;
    private _label: string;
    private _type: string;
    private _visible: boolean;
    private _required: boolean;
    private _editable: boolean;
    private _errorMessage?: string;
    private _helperMessage?: string;
    private _props: Record<string, any>;
    private _value: string | number | boolean | Date;

    /**
     * Creates a new instance of DataField.
     * @param config - The configuration object for the field.
     * @param value - The initial value for the field.
     */
    constructor(config: FieldConfig, value: string | number | boolean | Date = '') {
        this._name = config._name;
        this._label = config._label;
        this._type = config._type;
        this._visible = config._visible;
        this._required = config._required;
        this._editable = config._editable;
        this._errorMessage = config._errorMessage;
        this._helperMessage = config._helperMessage;
        this._props = config._props || {};
        this._value = DataField.parse(config._type, value);
    }


    /* Methods */
    static parse(type: string, value: string | number | boolean | Date) {
        switch (type) {
            case 'text':
            case 'password':
            case 'email':
                return String(value);
            case 'number':
                return Number(value);
            case 'key':
                if (Number(value) === 0) {
                    return '';
                } else {
                    return Number(value);
                }
                
            case 'boolean':
                return Boolean(value);
            case 'date':
            case 'datetime':
                return new Date(String(value));
            default:
                return value;
        }
    }

    
    /* Getters and Setters */
    get name() {
        return this._name;
    }

    get label() {
        return this._label;
    }

    get type() {
        return this._type;
    }

    get visible() {
        return this._visible;
    }

    get required() {
        return this._required;
    }

    get editable() {
        return this._editable;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    get helperMessage() {
        return this._helperMessage;
    }

    get props() {
        return this._props;
    }    

    get value() {
        return this._value;
    }

    set value(value: string | number | boolean | Date) {
        this._value = DataField.parse(this.type, value);
    }
}


/**
 * Represents a data row with JSON data and associated fields.
 */
export class DataRow {
    private _tableName: string;
    private _json: Record<string, string | number | boolean | Date>;
    private _fields: DataField[];
    
    /**
     * Constructs a DataRow object.
     * @param tableName - The name of the table this row belongs to.
     * @param json - The JSON data for the row.
     */
    constructor(tableName: string, json: Record<string, string | number | boolean | Date> = {}) {
        this._tableName = tableName;

        if (!configs[tableName]) throw new Error(`Table ${tableName} was not specified in dataConfigs.json`);

        if (Object.keys(json).length === 0) {
            Object.keys(configs[tableName]).forEach((key) => {
                let value: string | number | boolean | Date = '';

                switch (configs[tableName][key].type) {
                    case 'number':
                        value = 0 || configs[tableName][key].props?.min;
                        break;
                    case 'boolean':
                        value = false || configs[tableName][key].props?.default;
                        break;
                    case 'date':
                        value = new Date();
                        break;
                }

                json[key] = value;
            });
        }
        this._json = json;

        this._fields = Object.keys(json).map((key) => {
            if (!configs[tableName][key]) return null;
            return new DataField(configs[tableName][key], json[key]);
        }).filter((field) => {
            return field !== null;
        }) as DataField[];
    }


    /* Getters and Setters */
    get tableName() {
        return this._tableName;
    }

    get json() {
        return this._json;
    }

    get fields() {
        return this._fields;
    }

    /* Methods */
    getVisibleFields() {
        return this._fields.filter((field) => {
            return field.visible;
        });
    }

    getFieldObject(name: string) {
        const field =  this._fields.find((field) => {
            return field.name === name;
        });

        if (!field) return new DataField(configs[this.tableName][name]);
        return field;
    }

    setFieldValue(field: DataField, value: string | number | boolean | Date) {
        const ownedField = this.getFieldObject(field.name);

        if (ownedField) {
            ownedField.value = value;
            this._json[ownedField.name] = ownedField.value;
        }
    }

    popEmpties() {
        return Object.keys(this._json).reduce((acc, key) => {
            if (this._json[key] !== '') {
                acc[key] = this._json[key];
            }
            return acc;
        }, {} as Record<string, string | number | boolean | Date>);
    }
        
}


/**
 * Represents a data object that contains rows of data.
 */
export class DataObject {
    private _tableName: string;
    private _columns: string[] = [];
    private _json: Record<string, string | number | boolean | Date>[] = [];
    private _rows: DataRow[];

    /**
     * Creates a new instance of the DataObject class.
     * @param tableName - The name of the table.
     * @param json - An array of records containing the data.
     */
    constructor(tableName: string, json: Array<Record<string, string | number | boolean | Date>> = []) {
        this._tableName = tableName;
        this._columns = Object.keys(configs[tableName]??{});
        this._json = json;

        this._rows = json.map((obj) => {
            return new DataRow(tableName, obj);
        });
    }


    /* Getters and Setters */
    get tableName() {
        return this._tableName;
    }

    get columns() {
        return this._columns;
    }

    get json() {
        return this._json;
    }

    get rows() {
        return this._rows;
    }
}


export function getConfigsAsFields(tableName: string) {
    return Object.keys(configs[tableName]).filter((field) => {
        return configs[tableName][field]._visible;
    }).map((field) => {
        return new DataField(configs[tableName][field]);
    });
}

export { configs }