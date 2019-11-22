export default function buildGetUserController(getUser) {
    return async function getUserController(request) {
        try {
            const userId = request.params.userId;
            const user = await getUser({ userId });

            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: user
            }
        } catch (e) {
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
