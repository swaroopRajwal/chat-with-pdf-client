import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@ui/input-group";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IChatComposerProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatComposer: React.FC<IChatComposerProps> = ({ onSend, isLoading }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const message = value.trim();
    if (!message || isLoading) return;

    onSend(message);
    setValue("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    submit();
  };

  return (
    <form className="px-6 pb-6" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Ask anything about this book..."
          className="min-h-0 max-h-48 p-3.5"
          rows={1}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="ml-auto rounded-full"
            disabled={isLoading || !value.trim()}
            aria-label="Send"
            type="submit"
            variant="default"
            size="icon-sm"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default ChatComposer;
