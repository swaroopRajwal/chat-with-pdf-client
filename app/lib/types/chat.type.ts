export interface IChat {
  id: string;
  file_id: string;
  file_name: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface IChatWithMessage extends IChat {
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  role: "USER" | "AI";
  content: string;
}
