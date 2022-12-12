import { IArticle } from './article';
import { IComment } from './comment';

export interface IAuthor {
    id?: string,
    firstName: string,
    lastName: string,
    username?: string,
    articles?: IArticle[],
    comments?: IComment[]
}