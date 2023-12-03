export interface NewTravelSnap {
    id: string;
    title: string;
    description: string;
    hashtags: string[];
    imageUrls: string[];
    comments: string[];
  }
  
  export interface NewTravelSnapResponse {
    travel_snap_by_id: NewTravelSnap;
  }
  
  