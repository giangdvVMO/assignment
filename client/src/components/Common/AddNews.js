import { Button, Form, Image, Input, Select } from "antd"
import { useContext, useEffect, useRef, useState } from "react";
import { openNotificationWithIcon } from "../../common/service";
import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { checkArray, checkString } from "../../common/validation";
import { messageNewsError } from "../../common/error";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs';
import { Gallery } from "./Gallery";
import '../../styles/news.css'
const { Option } = Select;

const defaultTrueStatus = {
    status: "success",
    errorMsg: null,
  };
  const initial = ()=>{
    const html = '<p></p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState
    }
}
export const AddNews = ()=>{

    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [fields, setFields] = useState([]);
    const [listField, setListField] = useState([]);
    const [editorState, setEditorState] = useState(initial);
    const [thumnail, setThumnail] = useState('');
    
    const [validateTitle, setValidateTitle] = useState(defaultTrueStatus);
    const [validateFields, setValidateFields] = useState(defaultTrueStatus);
    const [validateContent, setValidateContent] = useState(defaultTrueStatus);
    const [validateThumnail, setValidateThumnail] = useState(defaultTrueStatus);

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
   
    //fetch user
    const fetchUser = async () => {
    //// console.log("fetch user account");
    if(!user){
        const tokenx = token ? token : window.localStorage.getItem("accessToken");
       // console.log("tokenx", tokenx);
        const id = decodeToken(tokenx).sub;
       // console.log("id", id);
        const url = serverURL + "account/" + id;
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (response.status !== 200) {
            // message.error("L???i h??? th???ng load user!");
        } else {
           // console.log("user fetch to set role", result);
            if (!result) {
            // message.warn("B???n ko c?? quy???n xem trang n??y");
            navigate("/");
            }
            changeUser({ ...result });
        }
        } catch (err) {
       // console.log(err);
        }
    }
  };

  //fetch Fields
  async function fetchField() {
    const url = serverURL + "field";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 200) {
        // message.error(result.message);
      } else {
        setListField(result.data);
      }
    } catch (err) {
     // console.log(err);
    //   message.error("???? c?? l???i x???y ra!");
    }
  }

  function checkTitleFunc(title) {
    if (!checkString(title)) {
      setValidateTitle({
        status: "error",
        errorMsg: messageNewsError.title,
      });
      return false;
    } else {
      setValidateTitle(defaultTrueStatus);
      return true;
    }
  }

  function checkContentFunc(content) {
    if (!editorState) {
      setValidateTitle({
        status: "error",
        errorMsg: messageNewsError.content,
      });
      return false;
    } else {
      setValidateTitle(defaultTrueStatus);
      return true;
    }
  }

  function checkThumnailFunc(thumnail) {
    if (!thumnail) {
      setValidateThumnail({
        status: "error",
        errorMsg: messageNewsError.thmnail,
      });
      return false;
    } else {
      setValidateThumnail(defaultTrueStatus);
      return true;
    }
  }

  function checkFieldFunc(fields) {
   // console.log("fields", fields);
    if (!checkArray(fields)) {
      setValidateFields({
        status: "error",
        errorMsg: messageNewsError.field,
      });
      return false;
    } else {
      setValidateFields(defaultTrueStatus);
      return true;
    }
  }

    function handleChangeTitle(e) {
        return setTitle( e.target.value );
    }

    function handleChangeThumnail(e) {
        return setThumnail( e.target.value );
    }

    function handleChangeFields(value) {
          return setFields(value);
      }

  async function createNews() {
    const url = serverURL + "news";
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const data = {title, fields, id_account: user._id, thumnail, status:user.role==='admin'?true:false, content: html}
    let formData = new FormData();
   // console.log('fields',fields)
   // console.log('title',title)
    formData.append('fields',fields);
    formData.append('title',title);
    formData.append('thumnail', thumnail)
    formData.append('status',user.role==='admin'?true:false);
    formData.append('content', html);
   // console.log('html',html)
   // console.log("request", formData);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
     // console.log(result);
      if (response.status !== 201) {
        openNotificationWithIcon('error','Th??ng b??o', 'L???i')
        // message.error(result.message);
      } else {
        openNotificationWithIcon(
          "success",
          "Th??ng b??o",
          "B???n ???? t???o  th??nh c??ng!"
        );
        navigate('../../my-news')
        // navigate('/list-news')
      }
    } catch (err) {
     // console.log(err);
    //   message.error("???? c?? l???i x???y ra!");
    }
  }

  async function handleSave(e) {
    ref.current.submit();
    let count = 0;
    count = checkTitleFunc(title) ? count : count + 1;
    count= checkThumnailFunc(thumnail)? count:count+1;
    // count = file? count: count+1;
    count = checkFieldFunc(fields) ? count : count + 1;
   // console.log("count", count);
    if (count === 0) {
      createNews();
    }else{
      openNotificationWithIcon('error', 'Sai th??ng tin', 'B???n nh???p th??ng tin ch??a ch??nh x??c!')
    }
    return;
  }

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchField();
  }, []);

  const ref = useRef();
    return (
        user?
        <div className="news-add-container">
            <div className="title-container-news">TH??M B??I ????NG TIN T???C</div>
            <Form
                ref={ref}
                className="form-news"
                name="basic"
                layout="vertical"
              >
                <Form.Item
                      label="Ti??u ????? b??i ????ng tin t???c:"
                      name="title"
                      validateStatus={validateTitle.status}
                      help={validateTitle.errorMsg}
                      className="label"
                      required
                    >
                        <Input
                          className="max-width"
                          placeholder="Nh???p ti??u ????? b??i ????ng tin t???c"
                          defaultValue={title}
                          value={title}
                          onChange={handleChangeTitle}
                        />
                </Form.Item>
                <Form.Item
                      label="L??nh v???c:"
                      name="fields"
                      validateStatus={validateFields.status}
                      help={validateFields.errorMsg}
                      className="label"
                      required
                    >
                        <Select
                          mode="multiple"
                          label="L??nh v???c"
                          style={{
                            width: "100%",
                          }}
                          value={fields}
                          placeholder="H??y ch???n ??t nh???t m???t l??nh v???c"
                          onChange={handleChangeFields}
                          optionLabelProp="label"
                        >
                          {listField.map((field) => {
                            return (
                              <Option value={field._id} label={field.nameField}>
                                <div className="demo-option-label-item">
                                  {field.nameField}
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                        </Form.Item>
                    <Form.Item
                      label="N???i dung:"
                      name="content"
                      validateStatus={validateContent.status}
                      help={validateContent.errorMsg}
                      className="label"
                      required
                    >
                        <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={onEditorStateChange}
                            >
                        </Editor>
                    </Form.Item>
                    <Form.Item
                      label="Thumnail (ch???n t??? gallery):"
                      name="thumnail"
                      validateStatus={validateThumnail.status}
                      help={validateThumnail.errorMsg}
                      className="label"
                      required
                    >
                        <Input
                          className="max-width"
                          placeholder="Nh???p link thumnail b??i ????ng"
                          defaultValue={thumnail}
                          value={thumnail}
                          onChange={handleChangeThumnail}
                        />
                    </Form.Item>
                    <Form.Item>
                        {thumnail?<Image width={150} height={150} src={thumnail}/>:''}
                    </Form.Item>
                    <Form.Item>
                        <div className="group-button">
                            <Button
                                type="submit"
                                className="button save-btn"
                                onClick={handleSave}
                            >
                                L??u
                            </Button>
                        </div>
                    </Form.Item>
              </Form>
            <Gallery user={user}/>
        </div>:
        ''
    )
}