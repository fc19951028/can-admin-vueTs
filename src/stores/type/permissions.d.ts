


interface permissions {
    path: string;
    name: string;
    component?: any | (() => Promise<any>);
    meta?: {
        label: string;
        isMenu?: number;
        type?: string;
        status?: number;
        icon?: string;
    };
    children?: permissions[]
}