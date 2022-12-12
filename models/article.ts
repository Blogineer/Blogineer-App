import { IAuthor } from './author';
import { IComment } from './comment';

export interface IArticle {
    id: string,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    author: IAuthor,
    comments?: IComment[]
}