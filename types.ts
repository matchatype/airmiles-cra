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

export interface State {
  status: 'idle' | 'pending' | 'error'
  offers: Offer[]
  error?: Error
}

interface ActionPending {
  type: 'PENDING'
}

interface ActionResolved {
  type: 'RESOLVED'
  payload: Offer[]
}

interface ActionRejected {
  type: 'REJECTED'
  payload: Error
}

export type Action = ActionPending | ActionResolved | ActionRejected

export type Reducer<S, A> = (state: S, action: A) => S
