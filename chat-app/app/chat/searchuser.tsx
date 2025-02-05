import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function SearchListScreen() {
    const [search, setSearch] = useState("");
    const [users, setUsers]: any = useState("");
    const [filteredUsers, setFilteredUsers] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    },[])

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
    const startChat = (user: any) => {
        router.push(`/chat/${user._id}`);
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