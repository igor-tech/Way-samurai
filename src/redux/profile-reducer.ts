import {Dispatch} from 'redux';
import {profileAPI} from '../api/api';


let initialState = {
    posts: [
        {id: 1, description: 'It is my first post', likesCount: 20},
        {id: 2, description: 'Hi, how are you?', likesCount: 12},
        {id: 3, description: 'Hey, i write this post', likesCount: 25},
        {id: 4, description: 'YOO, subscribers!', likesCount: 10},
    ],
    newPostText: '',
    profile: {
        aboutMe: '',
        contacts: {
            facebook: '',
            website: '',
            vk: '',
            twitter: '',
            instagram: '',
            youtube: '',
            github: '',
            mainLink: ''
        },
        lookingForAJob: false,
        lookingForAJobDescription: '',
        fullName: '',
        userId: 7,
        photos: {
            small: '',
            large: ''
        }
    },
    status: ''
}
export type ProfileReducerInitialStateType = {
    posts: Array<PostsType>,
    newPostText: string,
    profile: ProfileUserType,
    status: string
}


export const profileReducer = (state: ProfileReducerInitialStateType = initialState, action: ActionsTypes): ProfileReducerInitialStateType => {
    switch (action.type) {
        case 'profile/ADD_POST':
            return {
                ...state,
                posts: [{id: Math.random(), description: action.newMessageBody, likesCount: 0}, ...state.posts],
                newPostText: ''
            }
        case 'profile/SET_USER_PROFILE':
            return {
                ...state,
                profile: action.profile
            }
        case 'profile/SET_STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'profile/DELETE_POST':
            return {
                ...state,
                posts: [...state.posts].filter(p => p.id !== action.postId)
            }
        case 'profile/SET_PHOTOS':
            return {
                ...state,
                profile: {...state.profile, photos: action.photos}
            }
        default:
            return state
    }
}

//actions creators
export const addPostAC = (newMessageBody: string) => ({type: 'profile/ADD_POST', newMessageBody} as const)
export const deletePostAC = (postId: number) => ({type: 'profile/DELETE_POST', postId} as const)
export const setUserProfileAC = (profile: ProfileUserType) => ({type: 'profile/SET_USER_PROFILE', profile} as const)
export const setStatusAC = (status: string) => ({type: 'profile/SET_STATUS', status} as const)
export const savePhotosAC = (photos: any) => ({type: 'profile/SET_PHOTOS', photos} as const)

//thunk
export const getProfileTC = (userId: string) => async (dispatch: Dispatch) => {
    try {
        const res = await profileAPI.getProfile(userId)
        dispatch(setUserProfileAC(res))
    } catch (err) {
        console.warn(err as string)
    }

}
export const getStatusTC = (userId: string) => async (dispatch: Dispatch) => {
    try {
        const res = await profileAPI.getStatus(userId)
        dispatch(setStatusAC(res))
    } catch (err) {
        console.warn(err as string)
    }
}
export const updateStatusTC = (status: string) => async (dispatch: Dispatch) => {
    try {
        const res = await profileAPI.updateStatus(status)
        if (res.data.resultCode === 0) {
            dispatch(setStatusAC(status))
        }
    } catch (err) {
        console.warn(err as string)
    }
}

export const savePhotoTC = (file: File) => async (dispatch: Dispatch) => {
    try {
        const res = await profileAPI.uploadPhoto(file)
        if (res.data.resultCode === 0) {
            dispatch(savePhotosAC(res.data.data.photos))
        }
    }  catch (err) {
        console.warn(err as string)
    }

}


// types
type ActionsTypes =
    | ReturnType<typeof addPostAC>
    | ReturnType<typeof setStatusAC>
    | ReturnType<typeof setUserProfileAC>
    | ReturnType<typeof deletePostAC>
    | ReturnType<typeof savePhotosAC>

export type ProfileUserType = {
    aboutMe: string,
    contacts?: {
        facebook: string,
        website: string,
        vk: string,
        twitter: string,
        instagram: string,
        youtube: string,
        github: string,
        mainLink: string
    },
    lookingForAJob: boolean,
    lookingForAJobDescription?: string,
    fullName: string,
    userId: number,
    photos: {
        small: string,
        large: string
    }
}
type PostsType = {
    id: number,
    description: string,
    likesCount: number
}