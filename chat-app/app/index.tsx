import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signup } from '@/api/auth';
import { useRouter, Link } from 'expo-router';

export default function SignUpScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSignUp = async () => {
      if(!email || !password){
        setError('Please enter all the fields');
        return;
      }
      try {
          const response = await signup(email, password);
          console.log(response);
          setError("");
          router.push('/chat/')
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
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              Already have an account?  
              <Button title="Login" onPress={() => router.push('/auth/login')}/>
            </Text>
        </View>
    )
}