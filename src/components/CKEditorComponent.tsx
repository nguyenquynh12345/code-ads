import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Italic,
  Essentials,
  Paragraph,
  Link,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  MediaEmbed,
  Heading,
  Undo,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  Base64UploadAdapter,
  Indent,
  Locale,
  ButtonView,
  Editor
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

/**
 * Custom plugin to add a "Media Library" button to the CKEditor toolbar.
 */
function MediaPickerPlugin(editor: Editor) {
  editor.ui.componentFactory.add('mediaPicker', (locale: Locale) => {
    const view = new ButtonView(locale);
    view.set({
      label: 'Thư viện ảnh',
      icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16 1.5H4c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-13c0-1.103-.897-2-2-2zM4 3h12c.552 0 1 .448 1 1v7.669l-3.5-3.5a1.5 1.5 0 0 0-2.122 0l-3.35 3.35-1.55-1.55a1.5 1.5 0 0 0-2.122 0l-2.35 2.35V4c0-.552.448-1 1-1zM4 17a1 1 0 0 1-1-1v-1.163l3.414-3.414 1.55 1.55a1.5 1.5 0 0 0 2.122 0l3.35-3.35L17 13.04V16a1 1 0 0 1-1 1H4z"/><circle cx="7.75" cy="7.25" r="1.25"/></svg>',
      tooltip: true
    });

    view.on('execute', () => {
      const onMediaPickerClick = editor.config.get('onMediaPickerClick') as (() => void) | undefined;
      if (onMediaPickerClick) {
        onMediaPickerClick();
      }
    });

    return view;
  });
}

interface CKEditorComponentProps {
    data: string;
    onChange: (event: unknown, editor: ClassicEditor) => void;
    onReady?: (editor: ClassicEditor) => void;
    onMediaPickerClick?: () => void;
    config?: Record<string, unknown>;
}

const CKEditorComponent = ({ data, onChange, onReady, onMediaPickerClick, config }: CKEditorComponentProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorConfig: any = {
        onMediaPickerClick,
        plugins: [
          MediaPickerPlugin,
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Link,
          List,
          BlockQuote,
          Table,
          TableToolbar,
          MediaEmbed,
          Heading,
          Undo,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          Base64UploadAdapter,
          Indent
        ],
        toolbar: [
            'undo', 'redo', '|',
            'heading', '|',
            'bold', 'italic', '|',
            'link', 'mediaPicker', '|',
            'bulletedList', 'numberedList', 'blockQuote', '|',
            'insertTable', 'mediaEmbed'
        ],
        ...config
    };
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={editorConfig}
            onReady={onReady}
            onChange={onChange}
        />
    );
};

export default CKEditorComponent;
