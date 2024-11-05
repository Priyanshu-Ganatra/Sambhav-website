import { useState, useEffect } from 'react';
import Modal from './Modal';
import { toast } from 'react-toastify';

import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
});

const PressUpdate = ({ id, fetchPressData }) => {
    const [formData, setFormData] = useState({
        id: id,
        heading: '',
        content: '',
        redirection: ''
    });

    // useEffect(() => {
    //     console.log(formData)
    // }, [formData]);

    const [headingWordCount, setHeadingWordCount] = useState(0);
    const [headingSentenceCount, setHeadingSentenceCount] = useState(0);
    const [contentWordCount, setContentWordCount] = useState(0);
    const [contentSentenceCount, setContentSentenceCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchPressData = async () => {
            try {
                const response = await fetch(`/api/press/get?id=${id}`, { cache: 'no-store', next: { revalidate: 10 } });
                if (response.ok) {
                    let pressData = await response.json();
                    // console.log(pressData)
                    pressData = pressData.body
                    setFormData({
                        id: pressData.id,
                        heading: pressData.heading,
                        content: pressData.content,
                        redirection: pressData.redirection
                    });
                    countWordsAndSentences(pressData.heading, pressData.content);
                } else {
                    // console.error('Failed to fetch press data');
                }
            } catch (error) {
                // console.error('Error fetching press data:', error);
            }
        };

        if (id) {
            fetchPressData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
        if (name === 'heading') {
            countWordsAndSentences(value, formData.content);
        } else if (name === 'content') {
            countWordsAndSentences(formData.heading, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            const response = await fetch('/api/press/update', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                toast.success('Press page updated successfully');
                fetchPressData();
                closeModal();
            } else {
                const data = await response.json();
                toast.error('Error:', data.error);
            }
        } catch (error) {
            toast.error('Error:', error);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    // Function to count words and sentences
    const countWordsAndSentences = (heading, content) => {
        const headingWords = heading.trim().split(/\s+/).filter(Boolean).length;
        const contentWords = content.trim().split(/\s+/).filter(Boolean).length;
        const headingSentences = heading.split(/[.!?]+/).filter(Boolean).length;
        const contentSentences = content.split(/[.!?]+/).filter(Boolean).length;

        setHeadingWordCount(headingWords);
        setContentWordCount(contentWords);
        setHeadingSentenceCount(headingSentences);
        setContentSentenceCount(contentSentences);
    };

    return (
        <div className="container">
            <button onClick={openModal} className="text-xs text-blue-500 underline flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentcolor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                </svg>

                Edit
            </button>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="w-full">
                    <input type="hidden" name="id" value={formData.id} />
                    <div className="mb-4">
                        <label htmlFor="heading" className="block text-gray-700 font-bold mb-2">Heading</label>
                        <input type="text" id="heading" name="heading" value={formData.heading} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                        <p className="text-sm text-gray-500">Words: {headingWordCount}, Sentences: {headingSentenceCount}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                        {/* <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="3"
                            className="border-gray-300 h-[150px] resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required /> */}

                        <JoditEditor
                            value={formData.content}
                            tabIndex={1}
                            className='text-black'
                            onBlur={(description) => setFormData((prevData) => ({ ...prevData, content: description }))}
                        />
                        <p className="text-sm text-gray-500">Words: {contentWordCount}, Sentences: {contentSentenceCount} </p>
                        <p className="text-sm text-gray-500">{`(Recommend - Word: 50 - 60, Sentence - 2-5)`}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="redirection" className="block font-bold text-gray-700 mb-1">Redirection Link:</label>
                        <input
                            id="redirection"
                            name="redirection"
                            value={formData.redirection}
                            onChange={handleChange}
                            rows="3"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            required
                            placeholder="Redirection Link"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageData" className="block text-gray-700 font-bold mb-2">Image Data</label>
                        <input type="file" id="imageData" name="imageData" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    {/* <div className="mb-4">
                        <label htmlFor="smallIconFile" className="block text-gray-700 font-bold mb-2">Small Icon File</label>
                        <input type="file" id="smallIconFile" name="smallIconFile" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div> */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                </form>
            </Modal>
        </div>
    );
};

export default PressUpdate;
