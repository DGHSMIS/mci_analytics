"use client";

import { Editor } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";
import { useRef } from "react";

export interface TextEditorProps {
  plugins?: string;
  pluginsForMobile?: string;
  fonts?: string;
  toolbar?: string;
  toolbarMode?: "floating" | "scrolling" | "sliding" | "wrap";
  menuBar?: string;
  ref: string;
}

/**
 * Text Editor
 *
 * @description
 * Company - ARITS Ltd. 15th Jan 2023.
 * This component is used to Create the individual Texteditor.
 *
 * @param {string} plugins List of plugins to use for the Text Editor
 * @param {string} pluginsForMobile List of plugins to use for the Text Editor
 * @param {string} fonts Fonts to use for the Text Editor
 * @param {string} toolbar Toolbar items to use for the Text Editor
 * @param {toolbar} toolbarMode Toolbar mode to use for the Text Editor. There are certain toolbar features that will work only with a certain type of toolbar mode. Please visit the documentation of tinymce for more information  https://www.tiny.cloud/docs/advanced/available-toolbar-buttons
 * @param {string} menuBar Setting the active index of the accordion item
 * @param {string} ref Setting the active index of the accordion item
 */

const TextEditor = ({
  plugins = "formatselect lineheight file print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export",

  pluginsForMobile = "file print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable",

  fonts = "Arial=arial,Helvetica=helvetica",

  toolbar = "alignment headerselect formatselect file undo redo | bold italic underline strikethrough |  fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save lineheight | advlist print | image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment custom",

  toolbarMode = "floating",

  menuBar = "file edit view insert format tools table tc help",
}: TextEditorProps) => {
  const editorRef = useRef<Editor>(null);

  return (
    <div className="altd-text-editor">
      <Editor
        apiKey="kpilj26zz5mhztmv4qec03zyt8mrzasdwbpqwssirrtf7uil"
        ref={editorRef}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          plugins: plugins,
          font_formats: fonts,

          mobile: {
            plugins: pluginsForMobile,
          },

          file_picker_types: "file image media",

          file_picker_callback: function (callback, value, meta) {},
          setup: function (editor) {
            editor.ui.registry.addIcon(
              "bubbles",
              '<svg width="24" height="24"  viewBox="0 0 576 512"><path d="M240 64c-25.333 0-49.791 3.975-72.693 11.814-21.462 7.347-40.557 17.718-56.751 30.823-30.022 24.295-46.556 55.401-46.556 87.587 0 17.995 5.033 35.474 14.96 51.949 10.343 17.17 25.949 32.897 45.13 45.479 15.22 9.984 25.468 25.976 28.181 43.975 0.451 2.995 0.815 6.003 1.090 9.016 1.361-1.26 2.712-2.557 4.057-3.897 12.069-12.020 28.344-18.656 45.161-18.656 2.674 0 5.359 0.168 8.047 0.509 9.68 1.226 19.562 1.848 29.374 1.848 25.333 0 49.79-3.974 72.692-11.814 21.463-7.346 40.558-17.717 56.752-30.822 30.023-24.295 46.556-55.401 46.556-87.587s-16.533-63.291-46.556-87.587c-16.194-13.106-35.289-23.476-56.752-30.823-22.902-7.839-47.359-11.814-72.692-11.814zM240 0v0c132.548 0 240 86.957 240 194.224s-107.452 194.224-240 194.224c-12.729 0-25.223-0.81-37.417-2.355-51.553 51.347-111.086 60.554-170.583 61.907v-12.567c32.126-15.677 58-44.233 58-76.867 0-4.553-0.356-9.024-1.015-13.397-54.279-35.607-88.985-89.994-88.985-150.945 0-107.267 107.452-194.224 240-194.224zM498 435.343c0 27.971 18.157 52.449 46 65.886v10.771c-51.563-1.159-98.893-9.051-143.571-53.063-10.57 1.325-21.397 2.020-32.429 2.020-47.735 0-91.704-12.879-126.807-34.52 72.337-0.253 140.63-23.427 192.417-65.336 26.104-21.126 46.697-45.913 61.207-73.674 15.383-29.433 23.183-60.791 23.183-93.203 0-5.224-0.225-10.418-0.629-15.584 36.285 29.967 58.629 70.811 58.629 115.838 0 52.244-30.079 98.861-77.12 129.382-0.571 3.748-0.88 7.58-0.88 11.483z"></path></svg>'
            );
            /* example, adding a group toolbar button */
            editor.ui.registry.addGroupToolbarButton("alignment", {
              icon: "format",
              tooltip: "Headers",
              items: "h1 h2 h3 h4 h5 h6",
            });
          },

          // menu: {
          //   styles: { title: "Text Styles", items: "bold italic" },
          //   format: { title: "Format", items: "h1 h2 h3" },
          // },
          menubar: menuBar,
          toolbar_mode: toolbarMode,
          toolbar: toolbar,
          block_formats:
            "Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;;Header 5=h5;Header 6=h6",
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: false,
          autosave_retention: "2m",
          image_advtab: true,
          image_class_list: [
            { title: "None", value: "" },
            { title: "Some class", value: "some-class" },
          ],
          content_css: ["https://www.tiny.cloud/css/codepen.min.css"],
          importcss_append: true,
          height: 600,
          templates: [
            {
              title: "New Table",
              description: "creates a new table",
              content:
                '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th{% for i in range(1,6) %}<th scope="col">Column {{i}}</th>{% endfor %}</tr><tr><td>Item 1</td>{% for i in range(1,6) %}<td>Value {{i}}</td>{% endfor %}</tr><tr><td>Item 2</td>{% for i in range(1,6) %}<td>Value {{i}}</td>{% endfor %}</tr></table></div>',
            },
            {
              title: "Styled Table",
              description: "Simple Styled Table",
              content:
                '<div class="mceTmpl"><table class="table table-bordered"><tr><th>Title 1</th><th>Title 2</th><th>Title 3</th></tr><tr><td>Item 1</td><td>Value 1</td><td>Value 2</td></tr><tr><td>Item 2</td><td>Value 3</td><td>Value 4</td></tr></table></div>',
            },
            {
              title: "Custom List",
              description: "Unordered List",
              content:
                '<div class="mceTmpl"><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>',
            },
          ],
          image_caption: true,
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          noneditable_noneditable_class: "mceNonEditable",
          contextmenu: "link image imagetools table spellchecker",
          spellchecker_whitelist: ["Ephox", "Moxiecode"],
          tinycomments_mode: "embedded",
          content_style: ".mymention{ color: gray; }",
        }}
        // onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default TextEditor;
