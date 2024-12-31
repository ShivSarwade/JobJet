import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

function EditorElement({ value, setValue=()=>{}, darkMode = false }) {
  const editorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy(); // Cleanup the editor when the component is unmounted
      }
    };
  }, []);

  return (
    <div className="w-full">
      <Editor
        apiKey="heaais4dux07y43ufcby3kr5t9hcbl1wiwhdyd8go051damq" // Make sure this is a valid API key or your own.
        onInit={(_evt, editor) => {
          editorRef.current = editor; // Store the editor instance,
        }}
        value={value} // Set the value of the editor
        onEditorChange={(newValue) => setValue(newValue)} // Send back value on change
        init={{
          content_css: darkMode?"dark":null,
          height: 500,
          menubar: false, // Disable the menubar for simplicity
          statusbar: false, // Disable the statusbar for simplicity
          plugins: [
            "advlist",
            "lists",
            "searchreplace",
            "visualblocks",
            "fullscreen",
          ],
          toolbar:
            "undo redo | " +
            "bold italic | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

          skin: darkMode?"oxide-dark":null,
        }}
      />
    </div>
  );
}

export default EditorElement;
