import {usersAPI} from '../api/api';
import {Dispatch} from 'redux';

const initialState = {
    users: [] as Array<UserType>,
    pageSize: 6,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingInProgress: [1] as Array<number>
}

export const usersReducer = (state: initialStateType = initialState, action: ActionsTypes): initialStateType => {
    switch (action.type) {
        case 'users/FOLLOW':
            return {
                ...state,
                users: state.users.map(u => u.id === action.userId ? {...u, followed: true} : u)
            }
        case 'users/UNFOLLOW':
            return {
                ...state,
                users: state.users.map(u => u.id === action.userId ? {...u, followed: false} : u)
            }
        case 'users/SET_USERS':
            return {
                ...state,
                users: [...action.users]
            }
        case 'users/SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.currentPage
            }
        case 'users/SET_TOTAL_USERS_COUNT':
            return {
                ...state,
                totalUsersCount: action.totalCount
            }
        case 'users/TOGGLE_IS_FETCHING':
            return {
                ...state,
                isFetching: action.isFetching
            }
        case 'users/TOGGLE_IS_FOLLOWING_PROGRESS':
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(u => u !== action.userId)
            }
        default:
            return state
    }
}

//action creators
export const followSuccessAC = (userId: number) => ({type: 'users/FOLLOW', userId} as const)
export const unfollowSuccessAC = (userId: number) => ({type: 'users/UNFOLLOW', userId} as const)
export const setUsersAC = (users: Array<UserType>) => ({type: 'users/SET_USERS', users} as const)
export const setCurrentPageAC = (currentPage: number) => ({type: 'users/SET_CURRENT_PAGE', currentPage} as const)
export const setUsersTotalCountAC = (totalCount: number) => ({type: 'users/SET_TOTAL_USERS_COUNT', totalCount} as const)
export const toggleIsFetchingAC = (isFetching: boolean) => ({type: 'users/TOGGLE_IS_FETCHING', isFetching} as const)
export const toggleFollowingProgressAC = (isFetching: boolean, userId: number) => ({
    type: 'users/TOGGLE_IS_FOLLOWING_PROGRESS',
    isFetching,
    userId
} as const)

//thunk
export const getUsersTC = (currentPage: number, pageSize: number) => async (dispatch: Dispatch) => {
    dispatch(toggleIsFetchingAC(true))
    try {
        const res = await usersAPI.getUsers(currentPage, pageSize)

        dispatch(setUsersAC(res.items))
        dispatch(setUsersTotalCountAC(res.totalCount))
    } catch (err) {
        throw new Error(err as string)
    } finally {
        dispatch(toggleIsFetchingAC(false))
    }
}
export const followTC = (userId: number) => async (dispatch: Dispatch) => {
    dispatch(toggleFollowingProgressAC(true, userId))
    try {
        const res = await usersAPI.follow(userId)
        if (res.resultCode === 0) {
            dispatch(followSuccessAC(userId))
        }
    } catch (err) {
        throw new Error(err as string)
    } finally {
        dispatch(toggleFollowingProgressAC(false, userId))
    }
}
export const unfollowTC = (userId: number) => async (dispatch: Dispatch) => {
    dispatch(toggleFollowingProgressAC(true, userId))
    try {
        const res = await usersAPI.unFollow(userId)
        if (res.resultCode === 0) {
            dispatch(unfollowSuccessAC(userId))
        }
    } catch (err) {
        throw new Error(err as string)
    } finally {
        dispatch(toggleFollowingProgressAC(false, userId))
    }
}

//types
type ActionsTypes =
    | ReturnType<typeof followSuccessAC>
    | ReturnType<typeof unfollowSuccessAC>
    | ReturnType<typeof setUsersAC>
    | ReturnType<typeof setCurrentPageAC>
    | ReturnType<typeof setUsersTotalCountAC>
    | ReturnType<typeof toggleIsFetchingAC>
    | ReturnType<typeof toggleFollowingProgressAC>

type initialStateType = typeof initialState

export type UserType = {
    id: number
    photos: { small: string, large: string }
    followed: boolean
    name: string
    status: string
    location: { city: string, country: string }
}