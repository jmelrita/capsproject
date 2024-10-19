import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-6xl text-red-500 mb-4 animate-bounce">404</div>
            <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
        </div>
    )
}