import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signup } from '@/api/auth';

export default function SignUpScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSignUp = async () => {
        try {
            const response = await signup(email, password);
            console.log(response);
        } catch(err) {
            setError(`Signup failed ${err}`);
        }
    }

    return(
        <View>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title="Sign up" onPress={onSignUp}/>
        </View>
    )
}