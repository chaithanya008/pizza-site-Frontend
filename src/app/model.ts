interface MenuData {
    data: Menu[];
}

interface Menu {
    id: number;
    name: string;
    items: Item[];
}

interface Item {
    description: string;
    id: number;
    img_url: string;
    name: string;
    price_eur: number;
    price_usd: number;
    type_id: number;
}