import { useChatStore } from '@/store/chatStore';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CloseIcon from '../Icons/CloseIcon';
import BackIcon from '../Icons/BackIcon';

const ChatHeader = ({chatConfig} : any) => {

    const {showChat, toggleChat} = useChatStore();

    

  return (
    <View style={headerStyle.container}>
        <TouchableOpacity onPress={toggleChat}>
           <BackIcon style={{width : 25,height : 25}}/>
        </TouchableOpacity>
        {/* <View> */}
            {/* <img
              src={`${CHATBOT_BASE_URL}/public/lawyeredIcon.gif`}
              width="24px"
              style={{ borderRadius: 4 }}
            /> */}
          <Text style={headerStyle.botname}> {chatConfig?.model ?? "Bot"} </Text>
        {/* </View> */}
        <TouchableOpacity onPress={toggleChat}>
           <CloseIcon style={{width : 25,height : 25}}/>
        </TouchableOpacity>
    </View>
  )
}

const headerStyle = StyleSheet.create({
    container: {
      margin: 0,
      width: '100%',
      display : 'flex',
      flexDirection : 'row',
      backgroundColor: '#3A1C86',
      color : '#fff',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      minHeight : 50,
      maxHeight : 50,
      borderTopLeftRadius : 12,
      borderTopRightRadius : 12,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
    },
    botname : {
        fontSize: 20,
        fontWeight: 700,
        lineHeight: 26,
        textAlign: 'center',
        color : '#ffffff'
    },
  });

export default ChatHeader
