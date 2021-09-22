export type Region =
  | 'NL'
  | 'PE'
  | 'NS'
  | 'QC'
  | 'ON'
  | 'MB'
  | 'SK'
  | 'AB'
  | 'BC'
  | 'YT'
  | 'NT'
  | 'NU'

export interface Offer {
  id: string
  name: string
  regions: Region[]
  priority: number
  baseEarnRate: string
  terms: string
  pageUrl: string
  logo: {
    source: string
    alt: string
  }
}

const API_ENDPOINT = 'http://localhost:5000/partners'

export const getOffers = (): Promise<Offer[]> => {
  return fetch(API_ENDPOINT).then(response => {
    return response.json()
  })
}
