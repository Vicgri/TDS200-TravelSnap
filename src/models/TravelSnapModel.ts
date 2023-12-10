
// Represents the structure of a travelsnap using TypeScript interfaces.
// Each property defines a characteristic of the TravelSnap, TravelComments and TravelLocation.
export interface NewTravelSnap {
    id: string;
    title: string;
    description: string;
    hashtags: string[];
    imageUrls: string[];
    comments: TravelComments[];
    location: TravelLocation;
  }

  // Response containing a single NewTravelSnap
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



  