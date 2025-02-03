import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, FlatList, } from 'react-native';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

// const socket = io("http://192.168.1.7:3000");
const socket = io("http://localhost:3000");

export default function ChatScreen() {

    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello!', sender: 'me' },
        { id: '2', text: 'Hi there!', sender: 'other' },
    ]);
    
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.connect();
        socket.on("receiveMessage", (message) => {
            setMessages((msg) => [...msg, message])
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    const sendMessage = () => {

        const newMessage = { id: String(Date.now()), text: input, sender: 'me' };
        socket.emit("sendMessage", newMessage);
        setInput('');
    }

    return (
        <View style={{
            margin: 10,
            flex: 1
        }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View
                        style={{
                            alignSelf: item.sender == 'me' ? 'flex-end' : 'flex-start',
                            backgroundColor: item.sender == 'me' ? '#007AFF' : '#E5E5EA',
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 5
                        }}>
                        <Text style={{ color: item.sender == 'me' ? 'white' : 'black' }}>{ item.text }</Text>
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