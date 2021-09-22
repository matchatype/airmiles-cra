import React, {useEffect, useReducer} from 'react'
import type {Offer} from '../../lib/services/offer-service'
import {getOffers} from '../../lib/services/offer-service'
import Item from './item'

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

export const initialState: State = {
  status: 'idle',
  offers: [],
}

export const offersReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'PENDING': {
      return {...state, status: 'pending'}
    }

    case 'RESOLVED': {
      return {status: 'idle', offers: action.payload}
    }

    case 'REJECTED': {
      return {status: 'error', offers: [], error: action.payload}
    }

    default: {
      return {...state}
    }
  }
}

function List() {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    offersReducer,
    initialState,
  )

  useEffect(() => {
    dispatch({type: 'PENDING'})
    getOffers()
      .then(data => {
        dispatch({type: 'RESOLVED', payload: data})
      })
      .catch(error => {
        dispatch({type: 'REJECTED', payload: error})
      })
  }, [])

  switch (state.status) {
    case 'pending': {
      return <div>Fetching...</div>
    }

    case 'error': {
      return <div>Oops...</div>
    }

    case 'idle': {
      return (
        <div className="offers" data-testid="offers">
          {state.offers.map(offer => {
            return <Item key={offer.id} offer={offer} />
          })}
        </div>
      )
    }

    default: {
      return null
    }
  }
}

export default List
