import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
export default function App() { const [apiKey, setApiKey] = useState(''); return <><Navbar/><div className='main'>UI</div></>; }