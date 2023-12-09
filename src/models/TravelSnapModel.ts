
export interface NewTravelSnap {
    id: string;
    title: string;
    description: string;
    hashtags: string[];
    imageUrls: string[];
    comments: TravelComments[];
    location: TravelLocation;
  }
  
  export interface NewTravelSnapResponse {
    travel_snap_by_id: NewTravelSnap;
  }

  export interface TravelComments {
    id: number; 
    userId: string;
    text: string;
  }

  export interface TravelLocation {
    latitude: number;
    longitude: number;
  }



  