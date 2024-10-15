"use client"
import { useState, useEffect } from 'react';
// import { useTable } from 'react-table';
import { CSVLink } from 'react-csv';

const Home = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newsletterResponse = await fetch('/api/newsletter/get', { cache: 'no-store', next: { revalidate: 10 } });
                const contactResponse = await fetch('/api/contact/get', { cache: 'no-store', next: { revalidate: 10 } });

                const newsletterData = await newsletterResponse.json();
                const contactData = await contactResponse.json();

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
                        {newsletters.map((newsletter, index) => (
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
                        {contacts.map((contact, index) => (
                            <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-2">{contact.fullName}</td>
                                <td className="px-4 py-2">{contact.email}</td>
                                <td className="px-4 py-2">{contact.contact}</td>
                                <td className="px-4 py-2">{contact.message}</td>
                                <td className="px-4 py-2">{contact.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-5 flex-wrap">
                <CSVLink data={contacts} filename={"contacts.csv"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Download Contacts as Excel
                </CSVLink>
                <CSVLink data={newsletters} filename={"newsletters.csv"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Download Newsletter as Excel
                </CSVLink>
            </div>
        </div>
    );
};

export default Home;
