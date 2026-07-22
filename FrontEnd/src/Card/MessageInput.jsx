import { useRef, useState } from "react";
import { useChatStore } from "../Store/UseChatStore.js";
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Send, X, Bold, Italic, Strikethrough, Underline } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { selectedUser, sendMessage, sendingMessage } = useChatStore();
  const inputRef=useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage(
        {
          text: text.trim(),
          image: imagePreview,
        },
        selectedUser._id
      );

      // Clear form
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

    const applyFormatting = (syntax) => {
    const textArea = inputRef.current;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (start !== end) {
      // 1. Detect if the browser grabbed any leading or trailing spaces
      const leadingSpace = selectedText.match(/^\s*/)[0];
      const trailingSpace = selectedText.match(/\s*$/)[0];
      // 2. Strip the spaces off the word
      const trimmedText = selectedText.trim();
      
      // 3. Put the spaces OUTSIDE the markdown syntax!
      const newText = 
        text.substring(0, start) + 
        leadingSpace + 
        syntax + trimmedText + syntax + 
        trailingSpace + 
        text.substring(end);
        
      setText(newText);
      
      setTimeout(() => {
        textArea.focus();
        // Keep the highlight perfectly over the trimmed word
        textArea.setSelectionRange(
          start + leadingSpace.length + syntax.length, 
          start + leadingSpace.length + syntax.length + trimmedText.length
        );
      }, 0);
    } 
    else {
      // (Typing Mode) - exactly the same as before
      const newText = 
        text.substring(0, start) + 
        syntax + syntax + 
        text.substring(end);
        
      setText(newText);
      
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + syntax.length, start + syntax.length);
      }, 0);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview Area */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-white/20"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center text-base-content/80 hover:text-white hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <div className="flex-1 flex flex-col gap-1">
          
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 px-2">
            <button 
              type="button" 
              onClick={() => applyFormatting('**')} 
              className="p-1.5 rounded-md hover:bg-base-200 text-base-content/70 hover:text-primary transition-colors tooltip tooltip-top" 
              data-tip="Bold"
            >
              <Bold size={16} />
            </button>
            <button 
              type="button" 
              onClick={() => applyFormatting('_')} 
              className="p-1.5 rounded-md hover:bg-base-200 text-base-content/70 hover:text-primary transition-colors tooltip tooltip-top" 
              data-tip="Italic"
            >
              <Italic size={16} />
            </button>
            <button 
              type="button" 
              onClick={() => applyFormatting('__')} 
              className="p-1.5 rounded-md hover:bg-base-200 text-base-content/70 hover:text-primary transition-colors tooltip tooltip-top" 
              data-tip="Underline"
            >
              <Underline size={16} />
            </button>
            <button 
              type="button" 
              onClick={() => applyFormatting('~~')} 
              className="p-1.5 rounded-md hover:bg-base-200 text-base-content/70 hover:text-primary transition-colors tooltip tooltip-top" 
              data-tip="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
          </div>

          <div className="flex gap-2 items-end">
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className="w-full textarea textarea-bordered rounded-lg bg-base-100 resize-none"
            placeholder="Type a message..."
            value={text}
            ref={inputRef}
            onChange={(e) => setText(e.target.value)}
            disabled={sendingMessage}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={sendingMessage}
          />
          <button
            type="button"
            className={`btn btn-circle btn-ghost btn-sm sm:btn-md mb-1 ${
              imagePreview ? "text-emerald-500" : "text-base-content/70"
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={sendingMessage}
          >
            <Image size={20} />
          </button>
        </div>
        </div>
        <button
          type="submit"
          className="btn btn-circle btn-sm sm:btn-md btn-primary mb-1"
          disabled={(!text.trim() && !imagePreview) || sendingMessage}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;