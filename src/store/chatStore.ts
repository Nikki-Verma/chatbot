import create from 'zustand';


export const INITIAL_USER_SESSION_STATE = {
  PIM_SID: undefined,
  A_ID: undefined,
  userId: undefined,
  TENANT_ID: undefined,
  chatConfig: undefined,
};

interface ChatState {
  showChat: boolean;
  toggleChat: () => void;
  userSessionConfig : any;
  updateUserSessionConfig : (values : any)=>void;
  resetUserSessionConfig : ()=>void;
}

export const useChatStore = create<ChatState>(set => ({
  showChat: false,
  toggleChat: () => set(state => ({...state,showChat: !state.showChat})),
  userSessionConfig : INITIAL_USER_SESSION_STATE,
  updateUserSessionConfig : (updateUserSessionConfigParams : any) => set(state => ({
      ...state,
      userSessionConfig: {
        PIM_SID: updateUserSessionConfigParams?.PIM_SID,
        A_ID: updateUserSessionConfigParams?.A_ID,
        TENANT_ID: updateUserSessionConfigParams?.TENANT_ID,
        userId: updateUserSessionConfigParams?.userId,
        chatConfig: updateUserSessionConfigParams?.chatConfig,
      },
    })
  ),
  resetUserSessionConfig :()=> set(state => ({...state, userSessionConfig: { ...INITIAL_USER_SESSION_STATE } }))
}));
