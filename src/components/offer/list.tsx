import React, {useEffect, useReducer} from 'react'
import type {Offer} from '../../lib/services/offer-service'
import {getOffers} from '../../lib/services/offer-service'
import Item from './item'

interface State {
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

type Action = ActionPending | ActionResolved | ActionRejected
type Reducer<S, A> = (state: S, action: A) => S

const initialState: State = {
  status: 'idle',
  offers: [],
}

const offersReducer: Reducer<State, Action> = (
  state: State,
  action: Action,
) => {
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

  if (state.status === 'pending') {
    return <div>Fetching...</div>
  }

  if (state.status === 'error') {
    return <div>Oops...</div>
  }

  if (state.status === 'idle') {
    return (
      <div className="offers" data-testid="offers">
        {state.offers.map(offer => {
          return <Item key={offer.id} offer={offer} />
        })}
      </div>
    )
  }

  throw new Error('This should never happen')
}

export default List
