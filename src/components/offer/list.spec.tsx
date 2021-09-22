import {build, fake} from '@jackfranklin/test-data-bot'
import {render, screen, waitFor} from '@testing-library/react'
import * as faker from 'faker'
import React from 'react'
import type {Offer, Region} from '../../lib/services/offer-service'
import {getOffers} from '../../lib/services/offer-service'
import List from './list'

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
})
