import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios';

const Form = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('daily/generator/report/fuel-consumption'); 
                // const response = fetch('http://localhost:8000/api/daily/generator/report/fuel-consumption'); 
                console.log(response.data);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.status}</li>
                ))}
            </ul>
        </div>
    );
};

export default Form;
