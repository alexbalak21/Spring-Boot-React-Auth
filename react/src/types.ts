export interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  profileImage: string;
}

export interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}