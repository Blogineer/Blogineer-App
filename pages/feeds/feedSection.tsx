import FeedCard from "../../components/feedCard";
import client from "../api/apollo";
import { gql } from '@apollo/client';
import { IArticle } from "../../models/article";
import { useEffect, useState } from "react";


export default function FeedSection({ articles }: {articles: IArticle[]}) {
    
    return (
        <>
            { articles.map((article) => (<FeedCard article={article} key={article.id}/>)) }
        </>
    )
}