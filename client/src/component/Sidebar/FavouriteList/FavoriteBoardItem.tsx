

import React from 'react'
import { FavoriteObj } from '../../../types/component.types'

interface FavoriteBookItemType {
    id: string,
    fav: FavoriteObj
}


function FavoriteBoardItem({id, fav}: FavoriteBookItemType) {
  return (
    <div>FavoriteBoardItem</div>
  )
}

export default FavoriteBoardItem;