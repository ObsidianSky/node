export default function buildPostUser({ addUser }) {
    return async function postUser(request) {
        try {
            const userInfo = request.body;
            await addUser(userInfo);

            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 204
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
