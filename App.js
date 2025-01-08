import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
    const [jobs, setJobs] = useState([]);
    const [form, setForm] = useState({ title: '', company: '', location: '', visaSponsorship: false, description: '' });
    const [user, setUser] = useState({ name: '', email: '', password: '', workAuthorization: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function fetchJobs() {
            const response = await axios.get('http://localhost:5000/api/jobs');
            setJobs(response.data);
        }
        fetchJobs();
    }, []);

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/jobs', form);
        setForm({ title: '', company: '', location: '', visaSponsorship: false, description: '' });
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', user);
            alert('Registration successful!');
            setUser({ name: '', email: '', password: '', workAuthorization: '' });
        } catch (error) {
            alert('Error: Email already exists');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: user.email,
                password: user.password,
            });
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="app-container">
            <Header />
            <div className="content">
                {isLoggedIn ? (
                    <div className="dashboard">
                        <JobForm form={form} setForm={setForm} handleSubmit={handleJobSubmit} />
                        <JobList jobs={jobs} />
                    </div>
                ) : (
                    <AuthForm 
                        handleRegister={handleRegister}
                        handleLogin={handleLogin}
                        user={user}
                        setUser={setUser}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
