export interface ITravelSnap {
    id: number;
    title: string;
    description: string;
    //hashtags: string[];
    image: string[];
    //comments: string[];
  }
  
  export interface ITravelSnapResponse {
    camp_spots_by_id: ITravelSnap;
  }
  
  export interface ITravelSnapResponse {
    camp_spots: ITravelSnap[];
  }
  
  export interface ITravelSnap {
    id: number;
    title: string;
    description: string;
    //hashtags: string[];
    image: string[];
  }
  