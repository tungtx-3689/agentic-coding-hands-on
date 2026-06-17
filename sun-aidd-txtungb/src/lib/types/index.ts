export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  department_id: string | null;
  role: "user" | "admin";
  kudos_received_count: number;
  kudos_sent_count: number;
  hearts_received_count: number;
  department_name?: string | null;
  title?: string | null;
}

export interface Department {
  id: string;
  name: string;
}

export interface Hashtag {
  id: string;
  name: string;
}

export interface KudoImage {
  id: string;
  kudo_id: string;
  url: string;
  order_index: number;
}

export interface Kudo {
  id: string;
  sender_id: string;
  receiver_id: string;
  title?: string | null;
  content: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
  hashtags?: Hashtag[];
  images?: KudoImage[];
  heart_count?: number;
  user_has_liked?: boolean;
}

export interface SecretBox {
  id: string;
  user_id: string;
  is_opened: boolean;
  opened_at: string | null;
  reward_description: string | null;
  created_at: string;
}

export interface Award {
  slug: string;
  title: string;
  description: string;
  count: number;
  value: string;
  image_url?: string;
}
