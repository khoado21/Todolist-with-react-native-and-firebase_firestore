import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore"
import {StyleSheet, Text, View, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import { Appbar, TextInput, Button} from 'react-native-paper';



const Todos = () => {
    //tạo trạng thái để add 1 todo
    const [todo, setTodo] = useState('');

    // set trạng thái khi đang load dữ liệu là true
    const [loading, setLoading] = useState(true);

    //list ra 1 danh sách todo
    const [todos, setTodos] = useState([]);

    //biến này trỏ tới collection todos trong firestore
    const ref = firestore().collection('todos');

    //useeffect nạp dữ liệu vào useState todos => dùng dữ liệu từ useState này để render ra ngoài màn hình
    useEffect(() => {
        const subscriber = firestore()
            .collection('todos')
            .onSnapshot(querySnapshot => { 
                const list = [];
                querySnapshot.forEach(documentSnapshot => {
                    list.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    });
                });
                setTodos(list);
                setLoading(false);
            });
            return () => subscriber();
        }, []);

    const addTodo = async() => {
        // add 1 document vào firestore
        await ref.add({
            title: todo,
            complete: false,
        })
        setTodo('');
    }

    //nếu đang load dữ liệu thì ta render ra màn hình <ActivityIndicator />
    if(loading){
        return <ActivityIndicator />;
    }
    return (
        <>
        <Appbar>
            <Appbar.Content title={'TODOs List'} />      
            </Appbar>      
            <FlatList style={{flex: 1}}
            data={todos}
            keyExtractor={item => item.key}
            renderItem = {({item}) => (
                <View>
                    <Text>ID: {item.key}</Text>
                    <Text>{item.title}</Text>
                </View>
            )}
            /> 
            <TextInput label={'New Todo'} onChangeText={(value) => {setTodo(value)}} />      
            <Button onPress={() => addTodo()}>Add TODO</Button>    
        </>
    );
};

const styles = StyleSheet.create({})
export default Todos;