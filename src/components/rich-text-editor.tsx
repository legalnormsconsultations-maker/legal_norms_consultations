"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import suneditor from "suneditor";
// @ts-ignore
import allPlugins from "suneditor/plugins";
import "suneditor/css/editor"; // Import Sun Editor's CSS File

const safePlugins = typeof allPlugins === "object" && allPlugins !== null && !Array.isArray(allPlugins) 
  ? Object.values(allPlugins).filter(p => p && (p as any).name !== "math") 
  : allPlugins;

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export interface RichTextEditorRef {
  getContents: () => string;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({ value, onChange, placeholder }, ref) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const sunEditorInstance = useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    getContents: () => {
      return value;
    }
  }));

  useEffect(() => {
    let initTimer: NodeJS.Timeout;

    initTimer = setTimeout(() => {
      if (editorRef.current && !sunEditorInstance.current) {
        // Set initial content safely before instance creation
        if (value) {
          editorRef.current.value = value;
        }
        
        sunEditorInstance.current = suneditor.create(editorRef.current, {
          plugins: safePlugins as any,
          height: "300px",
          minHeight: "300px",
          iframe: false,
          placeholder: placeholder || "Type here...",
          imageUploadUrl: "/api/upload-media",
          videoUploadUrl: "/api/upload-media",
          audioUploadUrl: "/api/upload-media",
          buttonList: [
            ["undo", "redo"],
            ["formatBlock", "font", "fontSize"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
            ["fontColor", "backgroundColor", "textStyle"],
            ["removeFormat"],
            "/", // Line break
            ["outdent", "indent"],
            ["align", "hr", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio"],
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
          ],
          textStyles: [
            {
              name: "Uppercase",
              style: "text-transform: uppercase;",
              tag: "span",
            },
            {
              name: "Lowercase",
              style: "text-transform: lowercase;",
              tag: "span",
            },
            {
              name: "Capitalize",
              style: "text-transform: capitalize;",
              tag: "span",
            },
            {
              name: "Text Gradient",
              class: "text-gradient",
              tag: "span",
            },
            {
              name: "Text Shadow",
              class: "text-shadow",
              tag: "span",
            },
            {
              name: "Text Border",
              class: "text-border",
              tag: "span",
            },
          ],
          colorList: [
            [
              "#ff0000", "#ff5a00", "#ff9a00", "#ffce00", "#ffe800", "#36c700", "#00a3c2", "#0066cc", "#9900ff",
            ],
            [
              "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ead1dc", "#ea9999", "#f9cb9c",
            ],
            [
              "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd", "#e06666", "#f6b26b", "#ffd966",
            ],
            [
              "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0", "#cc0000", "#e69138", "#f1c232", "#6aa84f",
            ],
            [
              "#45818e", "#3d85c6", "#674ea7", "#a64d79", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c",
            ],
            [
              "#0b5394", "#351c75", "#741b47", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763",
            ],
            [
              "#20124d", "#4c1130", "#000000", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd",
            ],
          ],
        } as any);

        // Setup done before create

        // Handle onChange
        if (sunEditorInstance.current.events) {
          sunEditorInstance.current.events.onChange = (e: any) => {
            const content = typeof e === "string" ? e : (e?.data || "");
            onChange(content);
          };
        } else {
          // Fallback for older versions
          sunEditorInstance.current.onChange = (content: string) => {
            onChange(content);
          };
        }
      }
    }, 0);

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      const editor = sunEditorInstance.current;
      sunEditorInstance.current = null;
      if (editor) {
        // Delay destroy to allow pending DOM events (like blur or click) to finish bubbling
        // This prevents "Cannot read properties of null (reading '_preventBlur')" internal errors
        setTimeout(() => {
          try {
            editor.destroy();
          } catch (e) {
            console.warn("SunEditor cleanup warning:", e);
          }
        }, 100);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden w-full">
      <textarea ref={editorRef} />
    </div>
  );
});

export default RichTextEditor;
