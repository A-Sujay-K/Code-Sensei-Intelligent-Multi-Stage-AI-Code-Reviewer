import React from 'react';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
export default function App() { return <><Navbar/><div className='main'><div className='left'><Editor height='100%' theme='vs-dark' defaultLanguage='javascript'/></div><div className='right'>Analysis</div></div></>; }
// Added editor config options