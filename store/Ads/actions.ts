import { RootState } from "..";
import { ActionType } from "../actionTypes";
import { ThunkDispatchType, ThunkResult } from "../types";

export const showInter = (): ThunkResult<Promise<void>> =>
async (dispatch: ThunkDispatchType, getState: () => RootState): Promise<void> => {
    dispatch({type: ActionType.SHOW_INTER});
}

export const closeInter = (): ThunkResult<Promise<void>> =>
async (dispatch: ThunkDispatchType, getState: () => RootState): Promise<void> => {
    dispatch({type: ActionType.CLOSE_INTER});
}