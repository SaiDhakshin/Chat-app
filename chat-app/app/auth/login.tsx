import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { login } from '@/api/auth';

export default function LoginScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onLogin = async () => {
        try {
            const response = await login(email, password);
            console.log(response);
        } catch(err) {
            setError(`login failed ${err}`);
        }
    }

    return (
        <View>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title="Log In" onPress={onLogin}/>
        </View>
    )
}