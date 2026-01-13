import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // Track by IP address
        return req.ips.length ? req.ips[0] : req.ip;
    }

    protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
        const { context } = requestProps;
        const req = context.switchToHttp().getRequest();
        const apiKey = req.headers['x-api-key'];
        const envKey = process.env.API_KEY;

        // Check if the API Key provided in headers matches the ENV variable
        const isAuth = apiKey && envKey && apiKey === envKey;

        // If Authenticated: 60 req/min. If Public: 30 req/min.
        const limit = isAuth ? 60 : 30;

        return super.handleRequest({
            ...requestProps,
            limit,
            ttl: 60000
        });
    }
}