import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { login } from '@/api/auth';
import { useRouter } from 'expo-router';

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
            console.log(response);
            router.push(`/chat`)
        } catch(err) {
            setError(`Invalid Creds`);
        }
    }

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