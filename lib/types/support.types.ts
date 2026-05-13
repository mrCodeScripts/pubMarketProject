export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  orderId: string | null;
  productId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SupportMessage = {
  id: string;
  ticketId: string;
  body: string;
  isStaff: boolean;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
};

export type SupportTicketWithMessages = SupportTicket & {
  messages: SupportMessage[];
};
