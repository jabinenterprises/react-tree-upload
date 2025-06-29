export interface Tree {
  id: number;
  common_name: string;
  species: string | null;
  family: string | null;
  description: string | null;
  qr_code_url?: string;
  qr_code_path?: string;
  logoUrl?: string;
  secondaryLogoUrl?: string;
  created_at: string;
}

export interface TreeImage {
  id: string;
  tree_id: number;
  image_path: string;
  caption?: string;
}

export interface TreeAudio {
  id: string;
  tree_id: number;
  audio_path: string;
}
export interface TreeQR {
  id: string;
  tree_id: number;
  audio_id: string;
  audio_url?: string;
}
