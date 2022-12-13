import React, { Component, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Button } from 'antd';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs';

const initial = ()=>{
    const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState
    }
}
export const EditorConvertToHTML = ()=> {
    const [editorState, setEditorState] = useState(initial);

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };

    const onSubmit = ()=>{
       // console.log('html',draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }

        return (<>
        <div>
            <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
            />
            <textarea
            disabled
            value={editorState?draftToHtml(convertToRaw(editorState.getCurrentContent())):''}
            />
        </div>
        <Button onClick={onSubmit} >Gửi</Button>
        </>
        );
}