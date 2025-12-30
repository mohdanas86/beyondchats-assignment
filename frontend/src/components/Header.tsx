import React from 'react';

const Header: React.FC = () => {
    return (
        <nav className="bg-slate-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">BC</span>
                    </div>
                    <span className="self-center text-xl text-white font-semibold whitespace-nowrap">BeyondChats</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded md:hidden hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-200 rounded bg-gray-100 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-slate-900">
                        <li>
                            <a href="/" className="block py-2 px-3 text-white bg-blue-600 rounded md:bg-transparent md:text-blue-600 md:p-0" aria-current="page">Articles</a>
                        </li>
                        <li>
                            <a href="#original" className="block py-2 px-3 text-white rounded hover:bg-gray-200 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 md:dark:hover:bg-transparent">Original</a>
                        </li>
                        <li>
                            <a href="#enhanced" className="block py-2 px-3 text-white rounded hover:bg-gray-200 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 md:dark:hover:bg-transparent">Enhanced</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;