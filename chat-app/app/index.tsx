import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const chats = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey!', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', time: '10:30 AM' },
  { id: '2', name: 'Jane Smith', lastMessage: 'How are you?', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', time: '9:45 AM' },
];

export default function ChatListScreen() {
  const router = useRouter();

  return (
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
  );
}
