export interface Offer {
  id: string
  name: string
  regions: string[]
  priority: number
  baseEarnRate: string
  terms: string
  pageUrl: string
  logo: {
    source: string
    alt: string
  }
}

export const getOffers = (): Promise<Offer[]> => {
  return fetch('http://localhost:5000/partners').then(response => {
    return response.json()
  })
}
