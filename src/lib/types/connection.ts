export interface ApiUser {
  _id: string;
  name: string;
  designation: string;
  email: string;
  profilePicture?: string;
}

export interface ConnectionData {
  connected: ApiUser[];
  blocked: ApiUser[];
  requestReceived: ApiUser[];
  requestSent: ApiUser[];
  ignored: ApiUser[];
}

export interface TabButtonInterface {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export interface Action {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface UserFeedItemProps {
  user: User;
  actions: Action[];
  showMoreOptions?: boolean;
}

export interface UserCardProps {
  user: User;
  onConnect: (id: string) => void;
  onNotInterested: (id: string) => void;
  onHandleBlock: (id: string) => void;
}
