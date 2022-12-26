//props for button component

import React from "react"

export const ListType = "LIST";
export const CardType = "CARD";

export type WorkSpaceContext = {
    workSpaceId: string,
    myRole: string,
}

export type ButtonProps = {
    name: string,
    color?: string,
    hoverColor?: string,
    isSubmitting?: boolean,
    classes ?: string,
    onClick ?: () => void,
}

export type InputProps = {
    typeName: string,
     placeholder: string,
     name: string,
     value: string,
     onChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
     width ?: string
     label: string
}

export type UserObj = {
    _id: string,
    username: string,
    email: string,
    avatar: string,
    emailVerified: boolean,
    isGoogleAuth: boolean
    
}

export interface WorkSpace {
    _id: string,
    name: string,
    description: string,
    picture: string,
    isFavourite: boolean,
    FavouriteId: string | null,
    myRole: string,

}

export interface WorkSpaceObj extends WorkSpace{
     boards: BoardObj[]
}


export interface FavoriteObj {
    _id: string,
    name: string,
    resourceId: string,
    workSpace?: {
       _id: string,
       name: string
    },
    type: string,
    workSpaceRole ?: string,
    boardVisibility?: string,
    icon ?: string,
    color?: string,

}

export interface BoardObj {
   _id: string,
   name: string,
   ismember: boolean,
   isFavourite: boolean,
   FavouriteId: string|null,
   color: string,
   bgImage?: string,
   visibility: string,
   role: string,
   workSpaceId: string,

}


export interface BoardMemberObj {
    _id: string,
    picture: string,
    username: string,
    role: string
}


export interface SettingsObj {
   name: string,
   icon: string,
   description: string,

}

export interface Board {
    _id: string,
    name: string,
    description: string,
    visibility: string,
    role: string,
    listId: string[],
    isFavorite: boolean,
    FavoriteId: string | undefined,
    color: string,
    bgImage: string | undefined,
    workspace: {
        _id: string,
        name: string,
    },
    members: BoardMemberObj[]
}

export interface SelectOption {
    id: string,
    name: string,
}


export interface ListObj {
  _id: string,
   name: string,
   pos: string
}

export interface CardObj {
  _id: string,
   listId: string,
   name: string,
   pos: string,
   coverImage?: string,
   color: string,
   description: string,
   dueDate?: string,
   members: BoardMemberObj[],
   labels ?: LabelObj[],
   comments: CommentObj[]

}

export interface LabelObj {
    _id: string;
    name: string;
    color: string;
}

export interface BoardLabel {
    _id: string,
    name: string,
    color: string,
    pos: number
}

export interface CommentObj {
     _id: string;
     comment: string,
     user: BoardMemberObj,
     createdAt: string,
     updatedAt: string,

}

