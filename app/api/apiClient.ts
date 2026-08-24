import { up } from 'up-fetch'

const apiClient = up(fetch, () => ({
    baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
}))

export default apiClient