import { View, Text, FlatList, Image, TouchableOpacity, Platform, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ChatListScreen() {
  const router = useRouter();
  const [user, setUser]: any = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const fetchUser = async() => {
    try {
      setLoading(true);
      const res: any = await axios.get(`http://localhost:3000/profile`,{
        headers: { Authorization: `Bearer ${token}`}
      })
      setUser(res.data.user);
      console.log(user);
      fetchChats(res.data.user._id);
    } catch (err) {
      setLoading(false);
      router.replace('/auth/login')
    }
    setLoading(false);
  }

  const fetchChats = async (userId: any) => {
    setLoading(true);
    try {
      const chats = await axios.get(`http://localhost:3000/chats/${userId}`,{
        headers: { Authorization: `Bearer ${token}`}
      })
      setChats(chats.data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    setLoading(false);
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
    { loading ? <Text>Loading...</Text> : chats.length == 0 ? 
    <View style={ styles.noChatContainer }>
      <View>No Chats yet..</View>
      <TouchableOpacity style={ styles.newChatBtn }>
        <Text style={{ color: '#fff'}}>Start a new chat</Text>
      </TouchableOpacity>
    </View>
    : 
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
      
    </FlatList>}
    </>
  );
}

const styles = StyleSheet.create({
  noChatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    gap: 15
  }, 
  newChatBtn: {
    borderRadius: 20,
    backgroundColor: '#007AFF',
    padding: 10
  }
})
