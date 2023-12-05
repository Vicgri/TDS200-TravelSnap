export interface NewTravelSnap {
    id: string;
    title: string;
    description: string;
    hashtags: string[];
    imageUrls: string[];
    comments: TravelComments[];
  }
  
  export interface NewTravelSnapResponse {
    travel_snap_by_id: NewTravelSnap;
  }

  export interface TravelComments {
    id: number; 
    userId: string;
    text: string;
  }
  
  