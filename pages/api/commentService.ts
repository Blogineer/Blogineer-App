import { gql } from '@apollo/client';
import { IComment } from '../../models/comment';
import gClient from "./apollo";

class CommentService {

    public async addComment(commentPayload: any): Promise<IComment> {
        const { data } = await gClient.mutate({
            mutation: gql`
            mutation {
                addComment(
                    input: { 
                        content: "${commentPayload.content}",
                        articleId: "${commentPayload.articleId}",
                        authorId: "${commentPayload.authorId}"
                    }
                ){
                    comment {
                        content
                    }
                }
            }
            `
        })

        return data;
    }

    public async fetchComments({articleId}: {articleId: string}): Promise<IComment[]> {
        const { data } = await gClient.query({
            query: gql`
            query{
                fetchArticle(id: "${articleId}") {
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
        const comments: IComment[] = data.fetchArticle.comments;
        return comments;
    }
}



export const commentService = new CommentService();