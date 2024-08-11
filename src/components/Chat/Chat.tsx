import React, { useEffect, useRef } from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Message from './Message';

const Chat = ({
    messages,
    loading,
    chatLoading,
    WelcomeMessage,
    chatStreaming,
    chatConfig 
  } : any) => {

    const flatListRef = useRef<FlatList<any>>(null);
  

    useEffect(() => {
        if(flatListRef.current){
            flatListRef.current.scrollToEnd({ animated: true });
        }
      }, [messages, loading]);
  
    return (
      <View style={ChatStyle.chatContainer}>
        {messages?.length < 1 && (
            <View style={ChatStyle.noMessageContainer}>
                {chatLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={ChatStyle.row}>
                        <View style={ChatStyle.col}>
                            <Text style={ChatStyle.getStartedText}>{WelcomeMessage}</Text>
                        </View>
                    </View>
                )}
            </View>
        )}
        {messages?.length > 0 && 
            <FlatList
            style = {ChatStyle.messagesContainer}
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => 
                <Message
                    key={Math.random()*1000}
                    message={item}
                    loading={
                    index === item?.length - 1 &&
                    loading &&
                    item?.role !== "user"
                    }
                    chatStreaming={chatStreaming}
                    chatConfig = {chatConfig}
                />
            }
            keyExtractor={(item) => `${Math.random()}`}
            onContentSizeChange={() => {
                if(flatListRef.current){
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }}
            />
        }
      </View>
    );
  }

  const ChatStyle = StyleSheet.create({
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1,
    },
    noMessageContainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        top : 20
    },
    messagesContainer : {
        flex: 1,
        width: '100%',
    },
    row: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    col: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%', // Equivalent to `span={20}` in antd where 24 is the full width
    },
    getStartedText: {
        fontSize: 16,
        textAlign: 'center',
    },
  });
  
  export default Chat;
