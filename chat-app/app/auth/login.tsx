import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Platform } from 'react-native';
import { login } from '@/api/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onLogin = async () => {
        if(!email || !password){
            setError('Please enter all the fields');
            return;
        }
        try {
            const response = await login(email, password);
            if(response?.token){
                if (Platform.OS === 'web') {
                    localStorage.setItem('token', response?.token);
                    const token = localStorage.getItem('token');
                    console.log(token);
                } else {
                    await AsyncStorage.setItem('token', response?.token);
                }
            }
            console.log(response);
            router.replace(`/chat`)
        } catch(err) {
            setError(`Invalid Creds`);
        }
    }

    useEffect(() => {
        console.log('check for token running')
        const fetchToken = async () => {
            let storedToken: any = '';
            if (Platform.OS === 'web') {
                storedToken = localStorage.getItem('token');
            } else {
                storedToken = await AsyncStorage.getItem('token');
            }
            if(storedToken){
                router.replace('/chat/');
            }
            return;
        }

        fetchToken();
    },[])

    return (
        <View style={ styles.loginContainer}>
            <TextInput style={ styles.inputField} placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput style={ styles.inputField} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title="Log In" onPress={onLogin}/>
        </View>
    )
}

const styles = ({
    loginContainer: {
        padding: 10,
        margin: 10,
        gap: 15
    },
    inputField: {
        padding: 10
    }
})