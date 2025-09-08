import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
export default function App() { const [lang, setLang] = useState('javascript'); return <><Navbar/><div className='main'>Language selector</div></>; }