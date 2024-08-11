import { Tooltip } from '@ant-design/react-native';
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Clipboard, StyleSheet, Text, View } from 'react-native';
import MarkdownComponent from '../Markdown';

function Message({ message, loading, chatStreaming,chatConfig } : any) {
    const isBot = message?.role === "SimplAi";
  
    const [showCopied, setShowCopied] = useState(false);
  
    return (
      <View style={message?.role === 'user' ? messageStyle.UserMessageContainer : messageStyle.BotMessageContainer}>
        {!isBot ? (
          <View style={messageStyle.infoContainer}>
            <Text>
            you
              </Text> 
            {/* <IconContainer>{userCredentialsFromName()}</IconContainer> */}
          </View>
        ) : (
            <View style={messageStyle.infoContainer}>
            {/* <SimplaiIcon
            height={25}
            width={25}
            alt=""
            /> */}
            <Text
            style = {messageStyle.botName}
            >
              {chatConfig?.model ?? 'Bot'}
            </Text>
          </View>
        )}
        {loading ? (
          <View
            style={{
              display: 'flex',
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            {/* <ChatLoadingIcon /> */}
            <ActivityIndicator size="small" color="red" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 18,
                letterSpacing: 0,
                textAlign: "left",
              }}
            >
              Generating answers for you...
            </Text>
          </View>
        ) : (
          <View style = {message?.role === 'user' ? messageStyle.UserMessage : messageStyle.BotMessage} role={message?.role}>
            {message?.content ? (
              <>
                <MarkdownComponent markdown={message?.content} />
              </>
            ) : (
              ""
            )}
            {message?.role === "SimplAi" && !chatStreaming && (
              <View style={{ display : 'flex',justifyContent : 'flex-end',alignItems : 'center',width: "100%" }}>
                {showCopied ? (
                    <Text>
                        Copied
                    </Text>
                ) : (
                    <Text
                      onPress={() => {
                        const copyContent = message?.content?.replace(
                          /\\n/g,
                          "  \n",
                        );
                        Clipboard.setString(copyContent);
                        Alert.alert('Copied to clipboard', 'The text has been copied to your clipboard.');
                        setShowCopied(true);
                        setTimeout(() => {
                          setShowCopied(false);
                        }, 700);
                      }}
                    >
                        Copy
                    </Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
}

const messageStyle = StyleSheet.create({
    BotMessageContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems:  "flex-start",
        width: '100%',
        left:  10,
    },
    UserMessageContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems:  "flex-end",
        width: '100%',
        right:  10,
    },
    infoContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        marginTop : 10
    },
    botName : {
        color: "#000",
        opacity: 0.6,
        fontSize: 14,
        fontWeight: 700,
    },
    UserMessage : {
      display: 'flex',
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      flexDirection: 'column',
      borderRadius: 10,
      maxWidth: '90%',
      backgroundColor: "#F0F4F8",
      color: "var(--Text-Color-700, #444)",
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 300,
    },
    BotMessage : {
      display: 'flex',
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      flexDirection: 'column',
      borderRadius: 10,
      maxWidth: '90%',
      backgroundColor: "#FFF",
      color: "var(--Text-Color-700, #222)",
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 300,
      borderColor : "#D5D5D5",
      borderWidth : 0.5,
      borderStyle : 'solid'
    }
  });
  
export default Message;
