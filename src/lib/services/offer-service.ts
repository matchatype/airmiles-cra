import type {Offer} from '../../../types'

const API_ENDPOINT = 'http://localhost:5000/partners'

export const getOffers = (): Promise<Offer[]> => {
  return fetch(API_ENDPOINT).then(async response => {
    const data = await response.json()
    if (!response.ok) {
      return Promise.reject(data)
    }
    return data
  })
}
