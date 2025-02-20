import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchListScreen() {
    const [search, setSearch] = useState("");
    const [users, setUsers]: any = useState("");
    const [filteredUsers, setFilteredUsers] = useState("");
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
        getToken();
    },[])

    // To get token
    const getToken = async () => {
        if (!(Platform.OS === 'web')){
            let token = await AsyncStorage.getItem('token');
            setToken(token);
        }
    }

    // To fetch all users
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/users`);
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    // To filter users search
    const handleSearch = (text: any) => {
        setSearch(text);
        const filtered = users.filter((obj: any) => obj.email.toLowerCase().includes(text))
        setFilteredUsers(filtered);
    }

    // On start chat
    const startChat = async (user: any) => {
        try {
            const response = await axios.post("http://localhost:3000/chats",{
                userId: user._id,                
            },
            { headers: { Authorization: `Bearer ${token}`} });
            const chatId = response.data.chatId;
            router.push(`/chat/${chatId}?userId=${user._id}`);
        } catch (err){
            console.log('Failed to start chat');
        }
    }

    return(
        <View>
            <TextInput
                placeholder='Search users...'
                value={search}
                onChangeText={handleSearch}>
            </TextInput>
            { filteredUsers.length === 0 ? 
                <Text>No users found</Text> :
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity
                            onPress={() => startChat(item)}>
                                <Text>{item.email}</Text>
                        </TouchableOpacity>
                    )}>

                </FlatList> }
        </View>
    )
}