import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Socials from './socialLinks';

export default function Footer({ theme = 'light-theme' }) {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/newsletter/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            console.log(response);
            if (response.ok) {
                setSubscribed(true);
                setEmail('');
                alert("Thank you for subscribing to our newsletter!")
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to subscribe to newsletter');
            }
        } catch (error) {
            alert('Failed to subscribe to newsletter');
        }
    };

    return (
        <footer className={`p-5 ${theme} z-20 relative`}>
            <div className="flex justify-center relative">
                <div className="flex justify-between flex-col md:flex-row w-full max-page-width items-center gap-10">
                    <div className="flex flex-col items-center">
                        <Link href="/">
                            <Image
                                className=""
                                src={theme === 'light-theme' ? `/images/logo/logo_black.svg` : `/images/logo/logo_white.svg`}
                                width={200}
                                height={200}
                                quality={100}
                            />
                        </Link>
                        <div className="social-links gap-2 flex flex-wrap justify-center max-w-[200px] items-center">
                            <Socials iconsColor={theme === 'light-theme' ? 'black' : 'white'} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center h-full gap-2">
                        <Link href="/">Home</Link>
                        <Link href="/">About Us</Link>
                        <Link href="/">Portfolio</Link>
                        <Link href="/">Press Release</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div>Sign up for Newsletters</div>
                        <form onSubmit={handleNewsletterSubmit} className="flex">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-slate-950 border border-[currentcolor] w-full px-2"
                                placeholder="Enter your email"
                            />

                            <button
                                type='submit'
                                className={`flex items-center justify-center p-2 className= rounded-l-[0] ${theme === 'dark-theme' ? 'light-theme' : 'dark-theme'}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <Image
                                    src={theme === 'dark-theme' ? `/images/icons/arrow-circle-right_black.svg` : `/images/icons/arrow-circle-right_white.svg`}
                                    width={30}
                                    height={30}
                                    alt="newsletter arrow"
                                />
                            </button>
                        </form>
                        {error && <div className="text-red-500">{error}</div>}
                        {subscribed && <div className="text-green-500">Subscribed successfully!</div>}
                        <div>
                            <Link href="mailto:info@sambhavgroup.com">info@sambhavgroup.com</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mt-14 mb-10 text-2xl relative">
                <div className='absolute bottom-[-25px] right-0 text-xs'>
                    copyright @sambhavgroup
                </div>
                Homes for Tomorrow, Today
            </div>
            <div className="border-t-2 pt-5 px-10 text-xs text-center">
                By continuing to browse or by clicking “Accept” you agree to the storing of first- and third-party cookies on your system to enhance site navigation and analyse site usage. 
            </div>
        </footer>
    );
}
