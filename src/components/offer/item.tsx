import React, {useState} from 'react'
import {Offer} from '../../lib/services/offer-service'

function Item({offer}: Props) {
  const [favorite, setFavorite] = useState<boolean>(false)

  const handleFavorite = () => {
    setFavorite(prevState => !prevState)
  }

  const {name, baseEarnRate} = offer
  return (
    <div
      data-testid="offer"
      className={`card__item ${
        favorite ? 'card__item--coral' : 'card__item--blue'
      }`}
    >
      <h3 className="offer__title">{name}</h3>
      <div
        dangerouslySetInnerHTML={{__html: baseEarnRate}}
        className="offer__description"
      />
      <div>
        <button
          type="button"
          onClick={handleFavorite}
          data-testid="favorite-button"
        >
          Favorite
        </button>
      </div>
    </div>
  )
}

export default Item

type Props = {
  offer: Offer
}
