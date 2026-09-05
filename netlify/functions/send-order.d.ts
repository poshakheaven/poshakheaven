export function handler(event: any): Promise<{
    statusCode: any;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
    };
    body: string;
} | {
    statusCode: number;
    headers: {
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
    };
    body: string;
}>;
