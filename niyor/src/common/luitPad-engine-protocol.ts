export const AssamesePath = '/services/assamese';

export interface AssameseService {
    suggest(word: string): Promise<string[]>;
}
