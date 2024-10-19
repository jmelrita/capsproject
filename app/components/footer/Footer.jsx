'use client'
import { useState, useEffect } from 'react';

function Footer() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.pageYOffset;

            if (scrollTop > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`fixed bottom-0 left-0 w-full border-t border-gray-200 bg-gray-100 p-2 text-center transition-opacity ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
            <p className="py-2 text-sm">&copy; 2020 PA-HEALOT - No rights reserved, this is a demo app for studying purposes</p>
            <p className="text-xs">Privacy · Terms · Sitemap · Company Details</p>
        </div>
    );
}

export default Footer;
