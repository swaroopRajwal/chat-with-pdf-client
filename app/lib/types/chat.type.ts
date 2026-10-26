import type { IFile } from "./files.type";

export interface IChat {
  id: string;
  file_id: string;
  client_id: string;
  created_at: Date;
  file: IFile;
}

export interface IChatWithMessage extends IChat {
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  chat_id: string;
  content: string;
  role: "USER" | "AI";
  order: number;
}
