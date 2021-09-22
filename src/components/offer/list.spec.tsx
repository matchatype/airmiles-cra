// noinspection JSUnusedLocalSymbols

import {build, fake} from '@jackfranklin/test-data-bot'
import {render, screen, waitFor} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import user from '@testing-library/user-event'
import * as faker from 'faker'
import React, {Dispatch, Reducer, useReducer} from 'react'
import {act} from 'react-dom/test-utils'
import type {Offer, Region} from '../../lib/services/offer-service'
import {getOffers} from '../../lib/services/offer-service'
import List, {initialState, offersReducer} from './list'
import {Action, State} from './list'

jest.mock('../../lib/services/offer-service')
const mockedGetOffers = getOffers as jest.MockedFunction<typeof getOffers>
const canadianProvinceList: Region[] = [
  'NL',
  'PE',
  'NS',
  'QC',
  'ON',
  'MB',
  'SK',
  'AB',
  'BC',
  'YT',
  'NT',
  'NU',
]

const offerBuilder = build<Offer>('Offer', {
  fields: {
    id: fake(f => f.random.uuid()),
    name: fake(f => f.random.words(3)),
    regions: [],
    priority: fake(f => f.random.number({min: 1, max: 1000})),
    baseEarnRate: fake(f => f.random.words(10)),
    terms: fake(f => f.random.words(10)),
    pageUrl: fake(f => f.internet.url()),
    logo: {
      source: fake(f => f.image.imageUrl()),
      alt: fake(f => f.random.words(3)),
    },
  },
  postBuild: offer => {
    offer.regions = faker.random.arrayElements(canadianProvinceList)
    return offer
  },
})

describe('List component', () => {
  afterEach(() => {
    mockedGetOffers.mockReset()
  })

  test('should fetch offers only once', () => {
    const offers: Offer[] = []
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    expect(mockedGetOffers).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/fetching.../i)).toBeInTheDocument()
  })

  test('should display an empty list of offers when status is pending', async () => {
    const offers: Offer[] = []
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook(() => useReducer(offersReducer, initialState))
    const [state, _dispatch] = result.current

    expect(state).toEqual({offers: [], status: 'idle'})

    await waitFor(() => {
      expect(screen.queryByText(/fetching/)).toBeDefined()
    })

    await waitFor(() => {
      const offersWrapperEl = screen.queryByTestId('offers')
      const offerListEl = screen.queryAllByTestId('offer')

      expect(offersWrapperEl).toBeInTheDocument()
      expect(offerListEl).toHaveLength(0)
    })
  })

  test('should display a list of offers when status is idle', async () => {
    const offers = Array.from({length: 3}, _ => offerBuilder())
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook(() => useReducer(offersReducer, initialState))
    const [_state, dispatch] = result.current
    dispatch({type: 'RESOLVED', payload: offers})

    const [state, _dispatch] = result.current
    expect(state).toEqual({offers, status: 'idle'})

    await waitFor(() => {
      const offersListEl = screen.getByTestId('offers')
      const offerListEl = screen.getAllByTestId('offer')

      expect(offersListEl).toBeInTheDocument()
      expect(offerListEl).toHaveLength(3)
    })
  })

  test('should display an error message when status is error', async () => {
    mockedGetOffers.mockRejectedValueOnce(new Error('Server error'))
    render(<List />)

    await waitFor(() => {
      const errorEl = screen.queryByText(/oops/i)

      expect(errorEl).toBeInTheDocument()
    })
  })

  test('should switch CSS class when user clicks on favorite button', async () => {
    const offers = Array.from({length: 3}, _ => offerBuilder())
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    await waitFor(() => {
      const offerListEl = screen.getAllByTestId('offer')
      offerListEl.map(offer => expect(offer).toHaveClass('card__item--blue'))

      const [firstOffer, ...otherOffers] = offerListEl
      const favoriteButton = firstOffer.querySelector('button')
      if (favoriteButton) {
        user.click(favoriteButton)
      }

      expect(firstOffer).toHaveClass('card__item--coral')
      otherOffers.map(offer => expect(offer).toHaveClass('card__item--blue'))
    })
  })

  test('component state should be set to `idle` on first load', async () => {
    const offers: Offer[] = []
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook<
      Reducer<State, Action>,
      [State, Dispatch<Action>]
    >(() => useReducer(offersReducer, initialState))
    const [state, _dispatch] = result.current

    expect(state).toEqual({offers: [], status: 'idle'})
  })

  test('component state should be set to `pending` when fetching data', async () => {
    const offers: Offer[] = []
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook<
      Reducer<State, Action>,
      [State, Dispatch<Action>]
    >(() => useReducer(offersReducer, initialState))
    const [state, dispatch] = result.current

    expect(state).toEqual({offers: [], status: 'idle'})

    act(() => {
      dispatch({type: 'PENDING'})
    })

    expect(result.current[0]).toEqual({offers: [], status: 'pending'})
  })

  test('component state should be set to `idle` after fetching a list of offers', async () => {
    const offers = Array.from({length: 3}, _ => offerBuilder())
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook<
      Reducer<State, Action>,
      [State, Dispatch<Action>]
    >(() => useReducer(offersReducer, initialState))
    const [state, dispatch] = result.current

    expect(state).toEqual({offers: [], status: 'idle'})

    act(() => {
      dispatch({type: 'RESOLVED', payload: offers})
    })

    expect(result.current[0]).toEqual({offers, status: 'idle'})
  })

  test('component state should be set to `error` after a fetching error occurs', async () => {
    const offers: Offer[] = []
    const error = new Error('Server error.')
    mockedGetOffers.mockRejectedValueOnce(error)
    render(<List />)

    const {result} = renderHook<
      Reducer<State, Action>,
      [State, Dispatch<Action>]
    >(() => useReducer(offersReducer, initialState))
    const [state, dispatch] = result.current

    expect(state).toEqual({offers: [], status: 'idle'})

    act(() => {
      dispatch({type: 'REJECTED', payload: error})
    })

    expect(result.current[0]).toEqual({offers, status: 'error', error})
  })

  test('component state should not change after an unrelated action is dispatched', () => {
    const offers: Offer[] = []
    mockedGetOffers.mockResolvedValueOnce(offers)
    render(<List />)

    const {result} = renderHook<
      Reducer<State, Action>,
      [State, Dispatch<Action>]
    >(() => useReducer(offersReducer, initialState))
    const [state, dispatch] = result.current

    expect(state).toEqual(initialState)

    act(() => {
      dispatch({type: '__ACTION_TEST__'} as unknown as Action)
    })

    expect(result.current[0]).toEqual(initialState)
  })
})
