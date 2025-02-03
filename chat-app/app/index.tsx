import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signup } from '@/api/auth';
import { useRouter } from 'expo-router';

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
        <View style={{ flex: 1}}>
            <View style={ styles.signupContainer}>
              <TextInput style={ styles.inputField } placeholder='Email' value={email} onChangeText={setEmail} />
              <TextInput style={ styles.inputField } placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>
              {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
              <View>
                <Button title="Sign up" onPress={onSignUp}/>
              </View>
            </View>
            <View style={ styles.inputField }>
              <Text style={{ textAlign: 'center', margin: 10 }}>
                Already have an account?  
              </Text>
                <Button title="Login" onPress={() => router.push('/auth/login')}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    gap: 15
  },
  inputField: {
    padding: 10,
    borderColor: '#111',
    backgroundColor: '#fff'
  }
})