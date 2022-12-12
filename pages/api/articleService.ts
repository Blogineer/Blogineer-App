import { gql } from '@apollo/client';
import { IArticle } from '../../models/article';
import gClient from "./apollo";

class ArticleService {

    public async postArticles(postContent: any): Promise<IArticle> {
        const { data } = await gClient.mutate({
            mutation: gql`
            mutation {
                addArticle(
                    input: { 
                        title: "${postContent.title}",
                        body: "${postContent.body}",
                        authorId: "${postContent.authorId}"
                    }
                ){
                    article {
                        title,
                        body,
                        author {
                            firstName,
                            lastName
                        }
                    }
                }
            }
            `
        })

        return data;
    }

    public async fetchArticles(): Promise<IArticle[]> {
        const { data } = await gClient.query({
            query: gql`
                query {
                    fetchArticles{
                        id,
                        title,
                        body,
                        author {
                            firstName,
                            lastName,
                            username
                        },
                        createdAt,
                        updatedAt,
                        comments {
                            content,
                            author {
                                firstName,
                                lastName
                            }
                        }
                    }
                }
            `
        })
        const articles: IArticle[] = [];
        data.fetchArticles.forEach((articleData: any) => {
            articles.push({
                id: articleData.id,
                title: articleData.title,
                content: articleData.body,
                createdAt: new Date(articleData.createdAt),
                updatedAt: new Date(articleData.updatedAt),
                author: {
                    firstName: articleData.author.firstName,
                    lastName: articleData.author.lastName,
                    username: articleData.author.username
                },
                comments: articleData.comments
            })
        });
        return articles;
    }
}



export const articleService = new ArticleService();