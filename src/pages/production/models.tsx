export class Task {
    id?: number;
    name: string;
    description?: string;
    duration: number;
    id_timesymbol: number;
    errormargin: number;
    interruptible: boolean;
    id_skill: number;

    constructor(
        name: string,
        duration: number,
        id_timesymbol: number,
        errormargin: number,
        interruptible: boolean,
        id_skill: number,
    ) {
        this.name = name;
        this.duration = duration;
        this.id_timesymbol = id_timesymbol;
        this.errormargin = errormargin;
        this.interruptible = interruptible;
        this.id_skill = id_skill;
    }
}
