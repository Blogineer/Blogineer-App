import { useState, useEffect } from "react";
import { IArticle } from "../models/article";
import { IAuthor } from "../models/author";
import { Card, Row, Col, Button, List, Form, Input, Select } from "antd";
import { HeartOutlined, HeartFilled, CommentOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import gClient from "../pages/api/apollo";
import {gql} from '@apollo/client';
import { IComment } from "../models/comment";
import { commentService } from "../pages/api/commentService";

const { Meta } = Card;

const onLike = () => {
    console.log("like clicked");
}



const getTimeDelta = (datetime: Date): string => {
    const timeDeltaMs: number = new Date(new Date().valueOf() - datetime.valueOf()).valueOf();
    const stopRequirement = [
        {unit: 'sec', divider: 1000, maxRange: 60},
        {unit: 'min', divider: 60, maxRange: 60},
        {unit: 'hr', divider: 60, maxRange: 24},
        {unit: 'day', divider: 24, maxRange: 30},
        {unit: 'mon', divider: 30, maxRange: 12},
        {unit: 'yr', divider: 12, maxRange: Number.MAX_VALUE}
    ]
    let timeDelta = timeDeltaMs;
    let i = 0;
    for (; i < stopRequirement.length; i++){
        const {unit, divider, maxRange} = stopRequirement[i];
        timeDelta = timeDelta / divider;
        if (timeDelta < maxRange){
            break;
        }
    }
    const unitSuffix: string = timeDelta > 1 ? "s." : ".";
    return `${timeDelta.toFixed(0)} ${stopRequirement[i].unit}${unitSuffix}`
}


function Description(article: IArticle) {
    return (
        <>
            <Row>
                <Col span={23}>
                    {`${article.author.firstName} ${article.author.lastName}`}
                </Col>
                <Col span={1}>
                    {getTimeDelta(article.createdAt)}
                </Col>
            </Row>
        </>
    )
}

function CommentPanel({ comments, showComment }: {comments: IComment[] | undefined, showComment: boolean}) {
    if ((comments == undefined || comments.length === 0) || !showComment) {
        return <></>
    } else {
        const commentsData = comments.map((comment) => {
            return {
                title: comment.content,
                description: `${comment.author.firstName} ${comment.author.lastName}`
            }
        })
        return (
            <>
            <h3>Comments</h3>
            <List
                style={{background: '#eee'}}
                dataSource={commentsData}
                renderItem={(item) => {
                    return (<List.Item>
                        <List.Item.Meta
                            title={item.title}
                            description={item.description}
                        />
                    </List.Item>
                    )
                }}
            />
            </>
        )
    }
    
}

function CommentInput({ articleId, showComment, callback }: {articleId: string, showComment: boolean, callback: any}) {
    if (!showComment) {
        return <></>
    }

    const [authors, setAuthors] = useState<IAuthor[]>([]);

    async function fetchAuthors(): Promise<IAuthor[]>{
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

    useEffect(() => {
        fetchAuthors().then((fetchedAturhors: IAuthor[]) => {
            setAuthors(fetchedAturhors);
        })
    })

    const onFinish = (payload: any) => {
        payload['articleId'] = articleId;
        console.log(payload)
        commentService.addComment(payload).then(() => callback());
    }
    return (
        <Form
            name="basic"
            initialValues={{ remember: true }}
            style={{paddingTop: '10px'}}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item rules={[{required:true, message: "This field is required"}]} name='content' style={{width:'100%'}}>
                <Input placeholder='Comment...' style={{width:'100%'}}></Input>                
            </Form.Item>
            <Form.Item rules={[{required:true, message: "This field is required"}]} name='authorId'>
                <Select
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
    )
}

/**
 * The component to display an article in the format of Card
 * 
 * @returns 
 */
export default function FeedCard({ article }: { article: IArticle }) {
    const collapsedContent = `${article.content.slice(0, 140)}${(article.content.length < 140 )? "" : "..."}`;
    const [collapsed, setCollapsed] = useState(true);
    const [displayedContent, setDisplayedContent] = useState(collapsedContent)

    /**
     * Callback function when the content panel is expanded
     */
    const onExpand = () => {
        setCollapsed(false);
        setDisplayedContent(article.content);
    }

    /**
     * Callback function when the content panel is collapsed
     */
    const onCollapse = () => {
        setDisplayedContent(collapsedContent);
        setCollapsed(true);
    }

    /**
     * State that decide wether to show the comments or not.
     */
    const [showComment, setShowComment] = useState(false);
    const onClickComment = () => {
        setShowComment(!showComment);
    }

    const [comments, setComments] = useState<IComment[]>([]);
    const fetchComments = () => {
        commentService.fetchComments({articleId: article.id}).then((fetchedComments: IComment[]) => {
            setComments(fetchedComments);    
        })
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const actions = [
        <HeartOutlined key="like" onClick={onLike}/>,
        <Row justify="center" onClick={onClickComment}><Col span={1}><CommentOutlined key="comment"/></Col><Col span={1}>{article.comments?.length}</Col></Row>,
        <ShareAltOutlined key="share"/>
    ]

    return (
        <>
            <Card 
                style={{ marginTop: 10 }}
                actions={actions}
            >
                <Meta title={article.title} 
                    description={Description(article)}
                />
                <Divider/>
                { displayedContent }
                { article.content.length > 140 && collapsed ?  
                    <Button type='link' onClick={onExpand}>more</Button>:
                    ""
                }
                { article.content.length > 140 && !collapsed ?
                    <Button type='link' onClick={onCollapse}>less</Button>:
                    ""
                }
                <Divider/>

                <CommentPanel comments={comments} showComment={showComment}></CommentPanel>
                <CommentInput articleId={article.id} showComment={showComment} callback={fetchComments}></CommentInput>
            </Card>
            
        </>
    )
}