import React, {useEffect, useReducer} from 'react'
import type {Action, Reducer, State} from '../../../types'
import {getOffers} from '../../lib/services/offer-service'
import Item from './item'

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
    handleFetching()
      .then(data => {
        dispatch({type: 'RESOLVED', payload: data})
      })
      .catch(error => {
        dispatch({type: 'REJECTED', payload: error})
      })
  }, [])

  const handleFetching = async () => {
    return getOffers()
  }

  switch (state.status) {
    case 'pending': {
      return <div>Fetching...</div>
    }

    case 'error': {
      return (
        <div>
          <p>Oops... {state?.error?.message ?? 'Unknown error'}.</p>
          <button
            type="button"
            onClick={handleFetching}
            data-testid="fetch-button"
          >
            Retry Fetching
          </button>
        </div>
      )
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
      throw new Error(`Unexpected component state.`)
    }
  }
}

export default List
