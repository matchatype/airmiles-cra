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
      <h3>{name}</h3>
      <p dangerouslySetInnerHTML={{__html: baseEarnRate}} />
      <div>
        <button type="button" onClick={handleFavorite}>
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
