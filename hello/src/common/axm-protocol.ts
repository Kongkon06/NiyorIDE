export const AxmPath = '/services/axm-runner';

export interface AxmService {
    run(file: string): Promise<string>;
}
