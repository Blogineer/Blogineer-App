import { Input, Select, Form, Button } from 'antd';
import { useState, useEffect } from 'react';
import { IAuthor } from '../models/author';
import { gql } from '@apollo/client';
import gClient from '../pages/api/apollo';
import { articleService } from '../pages/api/articleService';

const { TextArea } = Input;

export async function fetchAuthors(): Promise<IAuthor[]>{
    const {data} = await gClient.query({
        query: gql`
            query {
                fetchAuthors {
                    id,
                    firstName,
                    lastName,
                    username,
                }
            }
        `
    });
    return data.fetchAuthors;
}

// @ts-ignore
export default function PostCreationForm({ onSubmitCallback }) {
    const [title, setTitle] = useState('')
    function onTitleChange(e: any) {
        setTitle(e.target.value);
    }
    
    const [content, setContent] = useState('');
    function onContentChange(e: any) {
        setContent(e.target.value);
    }

    const [selectedAuthor, setSelectedAuthor] = useState();
    function onAuthorChange(e: any){
        setSelectedAuthor(e);
    }

    const [authors, setAuthors] = useState<IAuthor[]>([]);

    useEffect(() => {
        fetchAuthors().then((fetchedAturhors: IAuthor[]) => {
            setAuthors(fetchedAturhors);
        })
    })

    function onFinish(payload: any) {
        articleService.postArticles({
            title: payload.title,
            body: payload.body,
            authorId: payload.authorId
        }).then(() => {
            onSubmitCallback()
        })
    }

    return (
    <>
        <Form
            name="basic"
            initialValues={{ remember: true }}
            style={{paddingLeft: '10px'}}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item rules={[{required:true, message: "This field is required"}]} name='title' style={{width:'100%'}}>
                <Input bordered={false} size='large' placeholder='New Post Title' style={{width:'100%'}}></Input>                
            </Form.Item>

            <Form.Item rules={[{required:true, message: "This field is required"}]} name='body' style={{width:'100%'}}>
                <TextArea size='large' placeholder='Content goes here...' style={{width:'100%'}} maxLength={200}/>
            </Form.Item>

            <Form.Item rules={[{required:true, message: "This field is required"}]} name='authorId'>
                <Select
                    onChange={onAuthorChange}
                    style={{width: 200}}
                    placeholder="Select an author"
                    options={authors.map((author: IAuthor) => {
                        return {
                            value: author.id,
                            label: `${author.id} - ${author.firstName} ${author.lastName}`
                        };
                    })}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </> 
   ) 
}