import { Waypoint } from './waypoint';

export class Route {
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    waypoints: Waypoint[];
    name: string;
    public: boolean;
    finish_message: string | null;
}