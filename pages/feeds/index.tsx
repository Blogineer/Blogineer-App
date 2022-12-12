import { useState, useEffect } from "react";
import { Row, Col, Button, Affix, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { IArticle } from "../../models/article";
import {articleService} from "../api/articleService";
import PostCreationForm from "../../components/createPost";
import FeedSection from "./feedSection";

// @ts-ignore
export function MultiUseageSection({ callback }) {
    const [showForm, setShowForm] = useState(false);
    const onShowForm = () => {
        setShowForm(true);
    }

    const onHideForm = () => {
        setShowForm(false);
    }

    const onSubmit = () => {
        callback();         // ask feed page to fetch data again
        onHideForm();        
    }

    if (!showForm) {
        return <Button type='primary' onClick={onShowForm} style={{marginLeft: '10px', width: '100%', marginTop: '10px', height: 100}}>Create a Post</Button>
    }else {
        return (
            <>  
                <Button onClick={onHideForm} style={{marginLeft: '10px', marginTop: '10px', marginBottom: '20px'}}>Back</Button>
                <PostCreationForm onSubmitCallback={onSubmit}/>
            </>
        )
    }
}

export default function FeedPage() {
    const feedSectionSize = 20;
    const [articles, setArticles] = useState<IArticle[]>([]);
    const fetchArticles = () => {
        articleService.fetchArticles().then((fetchedArticles) => {
            console.log(fetchedArticles);
            setArticles(fetchedArticles);
        })
    }

    useEffect(() => fetchArticles, [])

    return (
        <Row>
            <Col span={ feedSectionSize }>
                <FeedSection articles={articles}/>
            </Col>
            <Col span={ 24 - feedSectionSize }>
                <Affix offsetTop={100}>
                    <MultiUseageSection callback={fetchArticles}/>
                </Affix>
            </Col>
        </Row>
    )
}