export interface MenuData {
    data: Menu[];
}

export interface Menu {
    id: number;
    name: string;
    items: Item[];
}

export interface Item {
    description: string;
    id: number;
    img_url: string;
    name: string;
    price_eur: number;
    price_usd: number;
    type_id: number;
}