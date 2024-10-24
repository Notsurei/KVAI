import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { IoMdSend } from "react-icons/io";

export default function Generate() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [input, setInput] = useState({ prompt: '' });
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);  

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const sendRequest = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/AI/generate', {
                prompt: input.prompt
            }, {
                withCredentials: true
            });
            return res.data.message; 
        } catch (error) {
            console.error('Error during API request:', error);
            setError('Failed to get a response from AI. Please try again later.');
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.prompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }

        setIsTyping(true);
        setError(null); 

        const response = await sendRequest();

        if (response) {
            setChats([...chats, { prompt: input.prompt, response }]);
        }

        setInput({ prompt: '' });
        setIsTyping(false);
    }

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-grow overflow-y-auto p-4 border-purple-500 bg-zinc-700 rounded shadow">
                {chats.map((chat, index) => (
                    <div key={index} className="mb-4">
                        <p className="text-blue-500 chat-bubble"><strong>You:</strong> {chat.prompt}</p>
                        <p className="text-green-500 chat-bubble"><strong>AI:</strong> {chat.response}</p>
                    </div>
                ))}
                {error && <p className="text-red-500">{error}</p>}
            </div>


            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    value={input.prompt}
                    onChange={(e) => setInput({ prompt: e.target.value })}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border border-gray-300 rounded"
                    disabled={isTyping} 
                />
                <button 
                    type="submit" 
                    disabled={isTyping} 
                    className="ml-2 p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    {isTyping ? (<span className="loading loading-dots loading-md"></span>) : (<IoMdSend/>)}
                </button>
            </form>
        </div>
    );
}
