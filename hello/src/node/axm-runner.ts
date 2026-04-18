import { injectable } from '@theia/core/shared/inversify';
import { exec } from 'child_process';

@injectable()
export class AxmRunner {

    run(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(`tupal "${file}"`, (err, stdout, stderr) => {
                if (err) {
                    console.log("Rejected!");
                    reject(stderr || err.message);
                } else {
                    console.log("Script Ran!");
                    resolve(stdout);
                }
            });
        });
    }
}
