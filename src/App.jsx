import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
export default function App() { const [code, setCode] = useState(''); const reviewCode = () => {}; return <><Navbar/><div className='main'>Review logic skeleton</div></>; }