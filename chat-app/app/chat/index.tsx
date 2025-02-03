import { View, Text, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useState, useEffect } from 'react'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const chats = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey!', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', time: '10:30 AM' },
  { id: '2', name: 'Jane Smith', lastMessage: 'How are you?', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', time: '9:45 AM' },
];

export default function ChatListScreen() {
  const router = useRouter();
  const pathName = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = async() => {
    try {
      const res = await axios.get(`http://localhost:3000/profile`,{
        headers: { Authorization: `Bearer ${token}`}
      })
      setUser(res.data);
    } catch (err) {
      router.replace('/auth/login')
    }
  }

  useEffect(() => {
    console.log(token);
    if(!token){
      setTimeout(() => {
        router.push('/auth/login')
      }, 100)
      return;
    }
    fetchUser();
  },[token])

  useEffect(() => {
    const fetchToken = async () => {
      try {
        let storedToken;
        
        if (Platform.OS === 'web') {
          storedToken = localStorage.getItem('token');
        } else {
          storedToken = await AsyncStorage.getItem('token');
        }

        console.log(storedToken);
        setToken(storedToken || '');
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <>
    <Text>{token}</Text>
    <FlatList
    data={chats}
    keyExtractor={(item) => item.id}
    renderItem={({item}) => (
      <TouchableOpacity onPress={() => router.push(`/chat/${item.id}`)}>
        <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center'}}>
          <Image source={{ uri: item.avatar}} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <View style={{ marginLeft: 10 }} >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{ item.name }</Text>
            <Text style={{ color: 'grey'}} >{ item.lastMessage }</Text>
          </View>
          <Text style={{ marginLeft: 'auto' }}>{ item.time }</Text>
        </View>
      </TouchableOpacity>
    )}
    >
      
    </FlatList>
    </>
  );
}
