import { IArticle } from "./article";
import { IAuthor } from "./author";

export interface IComment {
    content: string,
    createdAt: Date,
    author: IAuthor,
    article?: IArticle
}