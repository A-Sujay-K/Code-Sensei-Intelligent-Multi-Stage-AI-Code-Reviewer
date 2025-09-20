import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
export default function App() { const detectErrors = () => []; return <><Navbar/><div className='main'>Syntax detection</div></>; }
// Prompt logic preparation