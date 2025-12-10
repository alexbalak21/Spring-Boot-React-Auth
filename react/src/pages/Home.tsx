export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-6 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Home Page
          </h1>
          <p className="text-lg text-gray-600">
            This is the home page of our application. Get started by exploring the navigation menu above.
          </p>
          <div className="mt-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    This is a modern React application with Tailwind CSS. Start building your awesome project!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 sm:px-6">
          <div className="text-sm">
            <a href="/about" className="font-medium text-indigo-600 hover:text-indigo-500">
              Learn more about this project <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
