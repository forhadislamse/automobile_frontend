"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Extend the Link extension to support our custom internal/external data attributes
const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-ref-type": {
        default: null,
      },
      "data-popup-title": {
        default: null,
      },
      "data-popup-excerpt": {
        default: null,
      },
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkTab, setLinkTab] = useState<"internal" | "external">("internal");
  
  // Link form state
  const [linkText, setLinkText] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupExcerpt, setPopupExcerpt] = useState("");
  const [url, setUrl] = useState("");

  if (!editor) {
    return null;
  }

  const openLinkDialog = () => {
    // Try to get selected text if any
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    
    // Check if we are currently on a link
    const attrs = editor.getAttributes("link");
    
    setLinkText(text || attrs.href ? text : "");
    if (attrs["data-ref-type"] === "internal") {
        setLinkTab("internal");
        setPopupTitle(attrs["data-popup-title"] || "");
        setPopupExcerpt(attrs["data-popup-excerpt"] || "");
        setUrl("");
    } else if (attrs.href) {
        setLinkTab("external");
        setUrl(attrs.href || "");
        setPopupTitle("");
        setPopupExcerpt("");
    } else {
        // Defaults
        setLinkTab("internal");
        setPopupTitle("");
        setPopupExcerpt("");
        setUrl("");
    }
    
    setIsLinkDialogOpen(true);
  };

  const saveLink = () => {
    if (!linkText) {
        return;
    }

    if (linkTab === "internal") {
      // Internal reference
      const href = `#internal-${Math.random().toString(36).substr(2, 9)}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ 
            href, 
            "data-ref-type": "internal",
            "data-popup-title": popupTitle,
            "data-popup-excerpt": popupExcerpt
        } as any)
        .insertContent(linkText)
        .run();
    } else {
      // External reference
      if (!url) return;
      
      // Auto-prefix with https:// if no protocol is given
      const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ 
            href: formattedUrl, 
            "data-ref-type": "external",
            "data-popup-title": null,
            "data-popup-excerpt": null
        } as any)
        .insertContent(linkText)
        .run();
    }
    
    setIsLinkDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 p-2 bg-gray-50/50 rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openLinkDialog}
          className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        {editor.isActive("link") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              title="Remove Link"
            >
              <X className="h-4 w-4" />
            </Button>
        )}
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="flex w-full bg-gray-50/50 p-2 gap-2">
            <Button
                variant={linkTab === "internal" ? "default" : "ghost"}
                className={`flex-1 rounded-full ${linkTab === "internal" ? "bg-[#006064] text-white hover:bg-[#00838F]" : "text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setLinkTab("internal")}
            >
                Internal Reference
            </Button>
            <Button
                variant={linkTab === "external" ? "default" : "ghost"}
                className={`flex-1 rounded-full ${linkTab === "external" ? "bg-[#006064] text-white hover:bg-[#00838F]" : "text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setLinkTab("external")}
            >
                External Reference
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold text-gray-900">Link Text</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Section 61.003 - Education Code"
                className="bg-white"
              />
            </div>

            {linkTab === "internal" ? (
              <>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900">Popup Title</Label>
                  <Input
                    value={popupTitle}
                    onChange={(e) => setPopupTitle(e.target.value)}
                    placeholder="e.g. Section 61.003 - Education Code"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-900">Popup Excerpt</Label>
                  <Input
                    value={popupExcerpt}
                    onChange={(e) => setPopupExcerpt(e.target.value)}
                    placeholder="e.g. Institution of higher education means..."
                    className="bg-white"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="font-semibold text-gray-900">URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-white"
                />
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={saveLink}
                className="bg-[#006064] hover:bg-[#00838F] text-white px-8 rounded-full"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#006064] underline cursor-pointer font-medium",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4",
      },
    },
  });

  if (editor && editor.getHTML() !== value) {
    if (value === "") { 
        setTimeout(() => editor.commands.setContent(value), 0);
    }
  }

  return (
    <div className={`border border-gray-200 rounded-md bg-white overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
