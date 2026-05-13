export type Conversation = {
  id: string;
  customerId: string;
  sellerId: string;
  productId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number; // resolved per current user's perspective
  createdAt: string;
  // nested
  participant: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    shopName?: string; // present if participant is seller
  };
  product: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
  } | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
};
