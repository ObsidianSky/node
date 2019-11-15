import { AsyncFunction } from '../types';

export function makeGenericController(useCase: AsyncFunction) {
    return async function genericController(request, data?) {
        try {
            const body = await useCase(data || request.body);

            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: body? 200 : 204,
                body: body || null
            }
        } catch (e) {
            console.log('GENERIC CONTROLLER ERROR');
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    errorMessage: e.message
                }
            }
        }
    }
}