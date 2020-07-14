export class Waypoint {
    id: string;
    created_at: Date;
    updated_at: Date;
    route_id: string;
    name: string;
    question: string | null;
    answer: string | null;
    point: number | null;
    sequence: number;
    zoom: number | null;
    latitude: number;
    longitude: number;
    maptype: string | null;
}