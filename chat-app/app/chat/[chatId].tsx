import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const socket = io("http://192.168.1.7:3000");
const socket = io("http://localhost:3000");

export default function ChatScreen() {

    const { chatId, userId } = useLocalSearchParams();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello!', sender: 'me' },
        { id: '2', text: 'Hi there!', sender: 'other' },
    ]);
    const flatListRef: any = useRef(null);
    const [input, setInput] = useState('');
    const [currentUser, setCurrentUser]: any = useState("");

    useEffect(() => {
        socket.connect();
        socket.emit("fetchMessages", chatId);

        socket.on("loadMessage", (msgs) => {
            setMessages((msg) => [...msg,...msgs]);
        })
        socket.on("receiveMessage", (message) => {
            if(message.chatId == chatId){
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    const sendMessage = () => {

        const newMessage = {
            chatId,
            sender: currentUser._id,
            text: input
        }
        socket.emit("sendMessage", newMessage);
        console.log(newMessage);
        setInput('');
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        console.log("Chat ID:", chatId, "User ID:", userId);
        getCurrentUser();
    }, [chatId, userId]);

    const getCurrentUser = async () => {
        let currentUser: any = '';
        if (Platform.OS === 'web') {
            let parsedData = localStorage.getItem('userData') || "";
            console.log(parsedData);
            currentUser = JSON.parse(parsedData);
        } else {
            currentUser = await AsyncStorage.getItem('userData');
        }
        setCurrentUser(currentUser);
        console.log(currentUser);
        return;
    }

    return (
        <View style={{
            margin: 10,
            flex: 1
        }}>
            { messages.length}
            <FlatList
                data={messages}
                ref={flatListRef}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View
                        style={{
                            alignSelf: item.sender == currentUser._id ? 'flex-end' : 'flex-start',
                            backgroundColor: item.sender == currentUser._id ? '#007AFF' : '#E5E5EA',
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 5
                        }}>
                        <Text style={{ color: item.sender == currentUser._id ? 'white' : 'black' }}>{ item.text }</Text>
                    </View>
                )}>

            </FlatList>
            <View style={{ flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    style={{ flex: 1, borderWidth: 1,
                        padding: 10, borderRadius: 10,
                        marginRight: 10
                     }}
                    placeholder='Type a message..'>
                </TextInput>
                <TouchableOpacity onPress={sendMessage}
                    style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 10}}>
                    <Text style={{ color: '#fff' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}