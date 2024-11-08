"use client"
import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';

const Home = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [areMessagesLoading, setAreMessagesLoading] = useState(true);
    const [areNewslettersLoading, setAreNewslettersLoading] = useState(true);

    const limitWords = (str, limit) => {
        const words = str.split(' ');
        return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
    };

    function formatDateTime(postgresTimestamp) {
        const date = new Date(postgresTimestamp);

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        return date.toLocaleString('en-US', options);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newsletterResponse = await fetch('/api/newsletter/get', { cache: 'no-store', next: { revalidate: 10 } });
                const contactResponse = await fetch('/api/contact/get', { cache: 'no-store', next: { revalidate: 10 } });

                const newsletterData = await newsletterResponse.json();
                setAreNewslettersLoading(false);
                const contactData = await contactResponse.json();
                setAreMessagesLoading(false);

                newsletterData.data.forEach((newsletter) => {
                    newsletter.createdAt = formatDateTime(newsletter.createdAt);
                });

                contactData.data.forEach((contact) => {
                    contact.createdAt = formatDateTime(contact.createdAt);
                });

                setNewsletters(newsletterData.data);
                setContacts(contactData.data);
            } catch (error) {
                // console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to ensure fetchData only runs once

    return (
        <div className="container mx-auto p-4">
            <div>
                <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Subscribed at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areNewslettersLoading && (
                            <tr>
                                <td colSpan={2} className="text-center py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                                        <p>Fetching newsletter subs...</p>
                                    </div>
                                </td>
                            </tr>)
                        }
                        {
                            !areNewslettersLoading && !newsletters.length && (
                                <tr>
                                    <td colSpan={2} className="text-center py-4">No newsletter subs found</td>
                                </tr>
                            )
                        }
                        {newsletters?.map((newsletter, index) => (
                            <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-2">{newsletter.email}</td>
                                <td className="px-4 py-2">{newsletter.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h1 className="text-2xl font-bold mt-4">Contact Messages</h1>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-800">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Contact</th>
                                <th className="px-4 py-2">Message</th>
                                <th className="px-4 py-2">Received at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areMessagesLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                                            <p>Fetching messages...</p>
                                        </div>
                                    </td>
                                </tr>)
                            }
                            {
                                !areMessagesLoading && !contacts.length && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">No messages found</td>
                                    </tr>
                                )
                            }
                            {contacts?.map((contact, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="px-4 py-2">{contact.fullName}</td>
                                    <td className="px-4 py-2">{contact.email}</td>
                                    <td className="px-4 py-2">{contact.contact}</td>
                                    <td title={contact.message} className="px-4 py-2 cursor-help whitespace-pre-wrap">{limitWords(contact.message, 10)}</td>
                                    <td className="px-4 py-2">{contact.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                contacts.length || newsletters.length ? (
                    <div className="mt-4 flex gap-5 flex-wrap">
                        {
                            contacts.length ? (
                                <CSVLink data={contacts} filename={"contacts.csv"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Download Contacts as Excel
                                </CSVLink>
                            ) : <></>
                        }
                        {
                            newsletters.length ? (
                                <CSVLink data={newsletters} filename={"newsletters.csv"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Download Newsletter as Excel
                                </CSVLink>
                            ) : <></>
                        }
                    </div>
                ) : <></>
            }
        </div >
    );
};

export default Home;